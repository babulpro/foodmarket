import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper"
import dbConnect from "@/app/lib/db/db"
import { CartItem, Order, OrderItem } from "@/app/lib/db/model/AllModel"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req, res) {
    try {
        await dbConnect()
        const cookieStore = cookies()
        const token = cookieStore.get('token')
        
        if (!token) {
            return NextResponse.json({ status: "fail", message: "Unauthorized" }, { status: 401 })
        }
        
        const decoded = await DecodedJwtToken(token.value)
        const { id } = decoded        
        const data = await req.json()
        const { product, quantity, price } = data

        // Validate input data
        if (!product || !quantity || !price) {
            return NextResponse.json(
                { status: "fail", message: "Missing required fields" },
                { status: 400 }
            )
        }

        // Find or create order for the user
        let order = await Order.findOne({ user: id })
        if (!order) {
            order = await Order.create({
                user: id,
                items: [],
                totalAmount: 0
            })
        }

        // Calculate item total
        const itemTotal = price * quantity

        // Create order item
        const orderItem = await OrderItem.create({
            order: order._id,
            product,
            quantity,
            price: itemTotal
        })

        // Add the order item to the order
        order.items.push(orderItem._id)
        
        // Recalculate totalAmount by summing all order items
        const allOrderItems = await OrderItem.find({ order: order._id })
        order.totalAmount = allOrderItems.reduce((total, item) => total + item.price, 0)
        
        await order.save()

        // Remove from cart - ensure we're removing the correct user's cart item
        const removedCartItem = await CartItem.findOneAndDelete({ 
            product: product,
            // user: id // Important to include user filter
        })

        if (!removedCartItem) {
            console.log("No cart item found to remove for product:", product)
        }

        return NextResponse.json({
            status: "success",
            data: {
                orderId: order._id,
                orderItem: orderItem,
                totalAmount: order.totalAmount,
                removedCartItem: removedCartItem
            },
            message: "Order created successfully"
        })

    } catch (error) {
        console.error("Order creation error:", error)
        return NextResponse.json(
            { 
                status: "error", 
                message: error.message || "Failed to create order",
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            },
            { status: 500 }
        )
    }
}



 

export async function DELETE(req) {
    try {
        await dbConnect()
        const cookieStore = cookies()
        const token = cookieStore.get('token')
        
        if (!token) {
            return NextResponse.json(
                { status: "fail", message: "Unauthorized" }, 
                { status: 401 }
            )
        }
        
        const decoded = await DecodedJwtToken(token.value)
        const userId = decoded.id
        
        const { orderId, orderItemId } = await req.json()
        
        if (!orderId || !orderItemId) {
            return NextResponse.json(
                { status: "fail", message: "Missing order ID or item ID" },
                { status: 400 }
            )
        }

        // Verify the order belongs to the user
        const order = await Order.findOne({ 
            _id: orderId, 
            user: userId 
        })
        
        if (!order) {
            return NextResponse.json(
                { status: "fail", message: "Order not found or access denied" },
                { status: 404 }
            )
        }

        // Remove the order item
        const deletedItem = await OrderItem.findOneAndDelete({
            _id: orderItemId,
            order: orderId
        })
        
        if (!deletedItem) {
            return NextResponse.json(
                { status: "fail", message: "Order item not found" },
                { status: 404 }
            )
        }

        // Update the order
        order.items = order.items.filter(item => item.toString() !== orderItemId)
        order.totalAmount = Math.max(0, order.totalAmount - deletedItem.price)
        
        // Delete the order if it's empty
        if (order.items.length === 0) {
            await Order.findByIdAndDelete(orderId)
            return NextResponse.json({
                status: "success",
                message: "Order deleted successfully as it became empty",
                data: { deletedOrder: orderId }
            })
        }
        
        await order.save()
        
        return NextResponse.json({
            status: "success",
            message: "Order item removed successfully",
            data: {
                deletedItem,
                updatedOrder: {
                    id: order._id,
                    totalAmount: order.totalAmount,
                    remainingItems: order.items.length
                }
            }
        })

    } catch (error) {
        console.error("Order removal error:", error)
        return NextResponse.json(
            { 
                status: "error", 
                message: error.message || "Failed to remove order item",
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            },
            { status: 500 }
        )
    }
}