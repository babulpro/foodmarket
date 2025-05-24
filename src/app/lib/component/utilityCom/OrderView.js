"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Timer = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const orderTime = new Date(createdAt);
      const expirationTime = new Date(orderTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours
      const difference = expirationTime - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <p className="text-sm text-green-600 font-semibold">
      Order Expires In: {timeLeft}
    </p>
  );
};

const OrderView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getData/product/addToOrder", {
        cache: "no-store",
      });
      const result = await response.json();

      if (result.status === "success") {
        setOrders(result.data || []);
      } else {
        setError(result.message || "Failed to fetch orders");
        toast.error(result.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (orderItemId, orderId) => {
    try {
      const response = await fetch("/api/getData/product/addToOrder", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderItemId }),
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Item removed successfully");
        setOrders((prevOrders) =>
          prevOrders
            .map((order) => {
              if (order._id === orderId) {
                const updatedItems = order.items.filter(
                  (item) => item._id !== orderItemId
                );
                const updatedTotal = updatedItems.reduce((acc, curr) => {
                  return acc + curr.quantity * (curr.foodItem?.price || 0);
                }, 0);
                return updatedItems.length > 0
                  ? { ...order, items: updatedItems, totalPrice: updatedTotal }
                  : null; // remove order entirely if no items left
              }
              return order;
            })
            .filter(Boolean)
        );
      } else {
        throw new Error(result.message || "Failed to remove item");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
        <span className="ml-4 text-lg">Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">No Orders Found</h1>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <Link href="/" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Orders</h1>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order._id} className="card bg-base-100 shadow-lg">
            <div className="card-body space-y-4">
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Order ID:</span> {order._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Status:</span> {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Payment:</span>{" "}
                    {order.paymentMethod.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Contact:</span>{" "}
                    {order.contactPhone}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Delivery:</span>{" "}
                    {`${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}, ${order.deliveryAddress.postalCode}`}
                  </p>
                </div>

                <div>
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="card p-4 shadow-sm mb-4"
                    >
                      <h3 className="font-bold text-lg">
                        {item.foodItem?.name || "Deleted Item"}
                      </h3>
                      <p className="text-sm">
                        Price: ${item.foodItem?.price?.toFixed(2) || "N/A"}
                      </p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold">
                        Subtotal: $
                        {(item.foodItem?.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item._id, order._id)}
                        className="btn btn-error btn-xs mt-2"
                      >
                        Remove Item
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-xl">
                  Total: ${order.totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Ordered on: {new Date(order.createdAt).toLocaleString()}
                </p>
                <Timer createdAt={order.createdAt} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderView;
