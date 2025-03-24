"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
 

const OrderView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getData/product/getToOrder", {
        cache: "no-store"
      });
      const result = await response.json();

      if (result.status === "success") {
        setOrders(result.data.items || []);
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

  const handleRemoveItem = async (orderItemId,orderId) => {
    try {
      const response = await fetch("/api/getData/product/addToOrder", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId,orderItemId }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Item removed successfully");
        setOrders(prev => prev.filter(item => item._id !== orderItemId));
      } else {
        throw new Error(result.message || "Failed to remove item");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Remove error:", err);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
      <span className="ml-4 text-lg">Loading your orders...</span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error max-w-2xl mx-auto mt-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error: {error}</span>
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold mb-4">No Orders Found</h1>
      <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
      <Link href="/dashboard/pages/products" className="btn btn-primary">
        Browse Products
      </Link>
    </div>
  );

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
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Image */}
                <div className="flex justify-center">
                  {order.product ? (
                    <figure className="w-48 h-48">
                      <img
                        src={order.product.images?.[0] || "/placeholder.png"}
                        alt={order.product.name || "No Image"}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </figure>
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Image not available</p>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="md:col-span-2">
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      {order.product ? (
                        <>
                          <Link href={`/dashboard/pages/details/${order.product._id}`}>
                            <h2 className="card-title text-xl hover:text-primary transition-colors">
                              {order.product.name}
                            </h2>
                          </Link>
                          <p className="text-gray-600 mt-2 line-clamp-2">
                            {order.product.description}
                          </p>
                          <div className="mt-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-semibold">Price:</span> ${order.product.price}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Quantity:</span> {order.quantity}
                            </p>
                            <p className="text-lg font-bold">
                              <span className="font-semibold">Total:</span> ${order.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div>
                          <h2 className="text-xl font-bold">Deleted Product</h2>
                          <p className="text-gray-500 mt-2">This product is no longer available</p>
                          <div className="mt-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-semibold">Quantity:</span> {order.quantity}
                            </p>
                            <p className="text-lg font-bold">
                              <span className="font-semibold">Total:</span> ${order.price}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={() => handleRemoveItem(order._id,order.order)}
                        className="btn btn-error btn-sm"
                      >
                        Remove
                      </button>
                      {order.product && (
                        <Link 
                          href={`/dashboard/pages/details/${order.product._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Product
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderView;