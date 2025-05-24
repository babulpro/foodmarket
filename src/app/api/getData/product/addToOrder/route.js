 import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper";
import dbConnect from "@/app/lib/db/db";
import { FoodItem, Order, User } from "@/app/lib/db/model/AllModel";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    // 1. Authentication Check
    if (!token) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token.value);
    const { id: userId } = decoded;

    // 2. User Check
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { status: "fail", message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Request Body Parse
    const { items, paymentMethod, deliveryNotes, contactPhone, deliveryAddress } = await req.json();

    // 4. Basic Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { status: "fail", message: "Empty cart" },
        { status: 400 }
      );
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      return NextResponse.json(
        { status: "fail", message: "Invalid payment method" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let totalPrice = 0;
      const updatedStockOps = [];
      const verifiedItems = [];

      for (const item of items) {
        const { foodItem, quantity } = item;

        const product = await FoodItem.findById(foodItem).session(session);

        if (!product) {
          throw new Error(`Product with ID ${foodItem} not found`);
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        // Prepare update and verified item
        totalPrice += product.price * quantity;

        updatedStockOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stock: -quantity } }
          }
        });

        verifiedItems.push({
          foodItem: product._id,
          quantity,
          unitPrice: product.price
        });
      }

      // 5. Update Stocks in Bulk
      if (updatedStockOps.length > 0) {
        await FoodItem.bulkWrite(updatedStockOps, { session });
      }

      // 6. Create Order
      const [order] = await Order.create([{
        user: userId,
        deliveryAddress,
        contactPhone,
        items: verifiedItems,
        status: "pending",
        paymentMethod,
        totalPrice,
        deliveryNotes
      }], { session });

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        status: "success",
        data: {
          orderId: order._id,
          totalPrice,
          estimatedDelivery: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
        }
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: error.message?.includes('stock') ? 400 : 500 }
    );
  }
}



 export async function GET() {
  try {
    await dbConnect();

    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token.value);
    const { id: userId } = decoded;

    // ✅ Populate name, price, imageUrl for each foodItem in the order
    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.foodItem",
        select: "name price imageUrl", // Must match the FoodItem schema
      })
      .sort({ createdAt: -1 });

    const totalAmount = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    return NextResponse.json({
      status: "success",
      count: orders.length,
      totalAmount,
      data: orders,
    });
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}













export async function DELETE(req) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token.value);
    const { id: userId } = decoded;

    const { orderId, orderItemId } = await req.json();

    if (!orderId || !orderItemId) {
      return NextResponse.json(
        { status: "fail", message: "Missing orderId or orderItemId" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order || order.user.toString() !== userId) {
        throw new Error("Order not found or access denied");
      }

      const itemToRemove = order.items.id(orderItemId);
      if (!itemToRemove) {
        throw new Error("Order item not found");
      }

      // Restore stock
      await FoodItem.findByIdAndUpdate(
        itemToRemove.foodItem,
        { $inc: { stock: itemToRemove.quantity } },
        { session }
      );

      // Update order total price
      const itemSubtotal = itemToRemove.unitPrice * itemToRemove.quantity;
      order.totalPrice -= itemSubtotal;

      // Remove the item
      order.items.pull({ _id: orderItemId });

      // If order has no items left, optionally delete it
      if (order.items.length === 0) {
        await Order.findByIdAndDelete(orderId).session(session);
      } else {
        await order.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        status: "success",
        message: "Item removed and stock restored",
        data: {
          updatedOrderId: orderId,
        },
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error("DELETE Order Item Error:", err);
    return NextResponse.json(
      {
        status: "error",
        message: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      },
      { status: err.message?.includes("not found") ? 404 : 500 }
    );
  }
}
