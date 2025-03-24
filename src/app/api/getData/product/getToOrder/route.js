import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper"
import dbConnect from "@/app/lib/db/db"
import { Order, OrderItem } from "@/app/lib/db/model/AllModel"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        await dbConnect()
        
        // Authentication check
        const cookieStore = cookies()
        const token = cookieStore.get('token')
        
        if (!token) {
            return NextResponse.json(
                { status: "fail", message: "Authorization token missing" },
                { status: 401 }
            )
        }

        // Token verification
        const decoded = await DecodedJwtToken(token.value)
        if (!decoded?.id) {
            return NextResponse.json(
                { status: "fail", message: "Invalid token" },
                { status: 401 }
            )
        }
        
        const userId = decoded.id

        // Find or create order
        let order = await Order.findOne({ user: userId })
        if (!order) {
            order = await Order.create({
                user: userId,
                items: [],
                totalAmount: 0
            })
        }

        // Fetch order items with populated product details
        const orderItems = await OrderItem.find({ order: order._id })
            .populate({
                path: 'product',
                select: 'name price images description' // Specify only needed fields
            })
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean() // Convert to plain JS object for better performance

        return NextResponse.json({
            status: "success",
            data: {
                orderId: order._id,
                totalAmount: order.totalAmount,
                items: orderItems,
                itemCount: orderItems.length
            },
            message: "Order items retrieved successfully"
        })

    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json(
            { 
                status: "error", 
                message: error.message || "Failed to fetch order items",
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        )
    }
}