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