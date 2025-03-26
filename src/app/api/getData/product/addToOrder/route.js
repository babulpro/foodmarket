import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper"
import dbConnect from "@/app/lib/db/db"
import { Cart, CartItem, Order, OrderItem, Product } from "@/app/lib/db/model/AllModel"
import mongoose from "mongoose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export async function POST(req,res) {
    try {
      await dbConnect();
      const cookieStore = cookies();
      const token = cookieStore.get('token');
  
      if (!token) {
        return NextResponse.json(
          { status: "fail", message: "Unauthorized" }, 
          { status: 401 }
        );
      }
  
      const decoded = await DecodedJwtToken(token.value);
      const { id: userId } = decoded;
      const { product: productId, quantity, price } = await req.json();
  
      // Validate input data
      if (!productId || !quantity || !price || quantity <= 0) {
        return NextResponse.json(
          { status: "fail", message: "Invalid product data" },
          { status: 400 }
        );
      }
  
      // Start a transaction to ensure data consistency
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        // Check product availability
        const product = await Product.findById(productId).session(session);
        if (!product) {
          throw new Error("Product not found");
        }
  
        if (product.stock < quantity) {
          throw new Error(`Insufficient stock. Only ${product.stock} available`);
        }
  
        // Find or create user's order
        let order = await Order.findOne({ user: userId }).session(session);
        if (!order) {
          order = await Order.create([{
            user: userId,
            items: [],
            totalAmount: 0,
            status: 'PENDING'
          }], { session });
          order = order[0];
        }
  
        // Create order item
        const itemTotal = price * quantity;
        const [orderItem] = await OrderItem.create([{
          order: order._id,
          product: productId,
          quantity,
          price: itemTotal
        }], { session });
  
        // Update order
        order.items.push(orderItem._id);
        order.totalAmount += itemTotal;
        await order.save({ session });
  
        // Update product stock
        product.stock -= quantity;
        await product.save({ session });
  
        // Remove from cart (with user validation)
        const cart = await Cart.findOne({ user: userId }).session(session);
        if (cart) {
          const cartItem = await CartItem.findOneAndDelete({
            cart: cart._id,
            product: productId
          }).session(session);
  
          if (cartItem) {
            // Remove reference from cart
            cart.items.pull(cartItem._id);
            await cart.save({ session });
          }
        }
  
        await session.commitTransaction();
        session.endSession();
  
        return NextResponse.json({
          status: "success",
          data: {
            orderId: order._id,
            orderItem,
            totalAmount: order.totalAmount,
            remainingStock: product.stock
          },
          message: "Order created successfully"
        });
  
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
  
    } catch (error) {
      console.error("Order creation error:", error);
      return NextResponse.json(
        { 
          status: "error", 
          message: error.message || "Failed to create order",
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        },
        { status: error.message.includes('stock') ? 400 : 500 }
      );
    }
  }

 

  export async function DELETE(req,res) {
    try {
      await dbConnect();
      const cookieStore = cookies();
      const token = cookieStore.get('token');
  
      if (!token) {
        return NextResponse.json(
          { status: "fail", message: "Unauthorized" }, 
          { status: 401 }
        );
      }
  
      const decoded = await DecodedJwtToken(token.value);
      const userId = decoded.id;
      const { orderId, orderItemId } = await req.json();
  
      if (!orderId || !orderItemId) {
        return NextResponse.json(
          { status: "fail", message: "Missing order ID or item ID" },
          { status: 400 }
        );
      }
  
      // Start transaction
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        // Verify the order belongs to the user
        const order = await Order.findOne({ 
          _id: orderId, 
          user: userId 
        }).session(session);
  
        if (!order) {
          throw new Error("Order not found or access denied");
        }
  
        // Find and remove the order item (with product reference)
        const deletedItem = await OrderItem.findOneAndDelete({
          _id: orderItemId,
          order: orderId
        }).session(session);
  
        if (!deletedItem) {
          throw new Error("Order item not found");
        }
  
        // Update product stock
        const product = await Product.findByIdAndUpdate(
          deletedItem.product,
          { $inc: { stock: deletedItem.quantity } },
          { new: true, session }
        );
  
        // Update the order
        order.items = order.items.filter(item => item.toString() !== orderItemId);
        order.totalAmount = Math.max(0, order.totalAmount - deletedItem.price);
        
        // Delete the order if it's empty
        if (order.items.length === 0) {
          await Order.findByIdAndDelete(orderId).session(session);
          await session.commitTransaction();
          
          return NextResponse.json({
            status: "success",
            message: "Order deleted successfully as it became empty",
            data: { 
              deletedOrder: orderId,
              restoredStock: {
                productId: deletedItem.product,
                quantity: deletedItem.quantity,
                newStock: product.stock
              }
            }
          });
        }
        
        await order.save({ session });
        await session.commitTransaction();
  
        return NextResponse.json({
          status: "success",
          message: "Order item removed successfully",
          data: {
            deletedItem,
            restoredStock: {
              productId: deletedItem.product,
              quantity: deletedItem.quantity,
              newStock: product.stock
            },
            updatedOrder: {
              id: order._id,
              totalAmount: order.totalAmount,
              remainingItems: order.items.length
            }
          }
        });
  
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
  
    } catch (error) {
      console.error("Order removal error:", error);
      return NextResponse.json(
        { 
          status: "error", 
          message: error.message || "Failed to remove order item",
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        },
        { status: error.message.includes('not found') ? 404 : 500 }
      );
    }
  }