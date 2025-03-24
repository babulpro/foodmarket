import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper"
import dbConnect from "@/app/lib/db/db"
import { Cart, CartItem } from "@/app/lib/db/model/AllModel"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        await dbConnect()
        
        // Authentication and authorization
        const cookieStore = cookies()
        const token = cookieStore.get('token')
        
        if (!token) {
            return NextResponse.json(
                { status: "fail", message: "Unauthorized - No token provided" },
                { status: 401 }
            )
        }

        const decoded = await DecodedJwtToken(token.value)
        const userId = decoded.id
        
        // Input validation
        const data = await req.json()
        if (!data.product || !data.quantity) {
            return NextResponse.json(
                { status: "fail", message: "Missing required fields (product or quantity)" },
                { status: 400 }
            )
        }

        // Find or create cart using atomic operation
        let cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $setOnInsert: { user: userId, items: [] } },
            { 
                new: true,
                upsert: true,
                runValidators: true
            }
        )

        // Update or create cart item in single operation
        const cartItem = await CartItem.findOneAndUpdate(
            { 
                product: data.product,
                cart: cart._id
            },
            {
                $set: {
                    quantity: data.quantity,
                    ...(data.price && { price: data.price }),
                    updatedAt: new Date()
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        )

        // Update cart's items array if new item was created
        if (!cart.items.includes(cartItem._id)) {
            await Cart.findByIdAndUpdate(
                cart._id,
                { $addToSet: { items: cartItem._id } }
            )
        }

        return NextResponse.json({
            status: "success",
            data: {
                cartId: cart._id,
                cartItem: cartItem,
                message: "Cart updated successfully"
            }
        })

    } catch (error) {
        console.error("Cart operation error:", error)
        return NextResponse.json(
            { 
                status: "error",
                message: error.message || "Failed to update cart",
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            },
            { status: error.statusCode || 500 }
        )
    }
}



 

 
export async function DELETE(req) {
    try {
        await dbConnect()
        
        // Authentication
        const cookieStore = cookies()
        const token = cookieStore.get('token')
        
        if (!token) {
            return NextResponse.json(
                { status: "fail", message: "Unauthorized - No token provided" },
                { status: 401 }
            )
        }

        // Authorization
        const decoded = await DecodedJwtToken(token.value)
        const userId = decoded.id
        
        // Get product ID to remove from request body
        const { productId } = await req.json()
        
        if (!productId) {
            return NextResponse.json(
                { status: "fail", message: "Product ID is required" },
                { status: 400 }
            )
        }

        // Start transaction for atomic operations
        const session = await Cart.startSession()
        session.startTransaction()
        
        try {
            // Find user's cart
            const cart = await Cart.findOne({ user: userId }).session(session)
            
            if (!cart) {
                return NextResponse.json(
                    { status: "fail", message: "Cart not found" },
                    { status: 404 }
                )
            }

            // Remove cart item
            const result = await CartItem.findOneAndDelete({
                product: productId,
                cart: cart._id
            }).session(session)

            if (!result) {
                return NextResponse.json(
                    { status: "fail", message: "Item not found in cart" },
                    { status: 404 }
                )
            }

            // Update cart's items array
            await Cart.findByIdAndUpdate(
                cart._id,
                { $pull: { items: result._id } },
                { session }
            )

            await session.commitTransaction()
            
            return NextResponse.json({
                status: "success",
                data: {
                    removedItem: result,
                    cartId: cart._id,
                    remainingItems: cart.items.length - 1
                },
                message: "Item removed from cart successfully"
            })

        } catch (transactionError) {
            await session.abortTransaction()
            throw transactionError
        } finally {
            session.endSession()
        }

    } catch (error) {
        console.error("Remove from cart error:", error)
        return NextResponse.json(
            { 
                status: "error",
                message: error.message || "Failed to remove item from cart",
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            },
            { status: 500 }
        )
    }
}