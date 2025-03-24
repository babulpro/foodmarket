"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
 

const CartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getData/product/getToCart", {
        cache: "no-store",
        next: { tags: ['cart'] }
      });
      
      if (!response.ok) throw new Error("Failed to fetch cart items");
      
      const result = await response.json();
      setCartItems(result.status === "ok" ? result.data : []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCheckout = useCallback(async (productId, quantity, price) => {
    try {
      const response = await fetch("/api/getData/product/addToOrder", {
        method: "POST",
        body: JSON.stringify({ product: productId, quantity, price }),
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) throw new Error("Order request failed");
      
      const result = await response.json();
      
      if (result.status === "success") {
        // Optimistic UI update
        setCartItems(prev => prev.filter(item => item.product._id !== productId));
        toast.success("Order placed successfully!");
      } else {
        throw new Error(result.message || "Order processing failed");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Checkout error:", err);
      // Re-fetch to ensure UI matches server state
      fetchCartData();
    }
  }, [fetchCartData]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const handleRemoveItem = useCallback(async (productId) => {
    try {
      const response = await fetch("/api/getData/product/addToCart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId })
      });
  
      if (!response.ok) throw new Error("Failed to remove item");
  
      const result = await response.json();
      
      if (result.status === "success") {
        // Optimistic UI update - filter by productId
        setCartItems(prev => prev.filter(item => item.product._id !== productId));
        toast.success("Item removed from cart");
      } else {
        throw new Error(result.message || "Failed to remove item");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Remove item error:", err);
      fetchCartData(); // Refresh cart data to sync with server
    }
  }, [fetchCartData]);
  // Loading state with skeleton loader
  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-sm animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="w-full md:w-2/3 m-auto p-5 rounded-2xl bg-gray-200 h-48"></div>
            <div className="card-body space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error) return (
    <div className="alert alert-error max-w-2xl mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
      <button onClick={fetchCartData} className="btn btn-sm ml-4">Retry</button>
    </div>
  );

  // Empty state
  if (cartItems.length === 0) return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🛒</div>
      <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
      <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
      <Link href="/" className="btn btn-primary">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <div className="badge badge-primary">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </div>
      </div>

      {cartItems.map((item) => (
        <div key={item._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Image Section */}
            <div className="w-full md:w-2/3 m-auto p-5 rounded-2xl">
              {item.product ? (
                <figure className="aspect-square">
                  <img
                    src={item.product.images?.[0] || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </figure>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Product unavailable</p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="card-body">
              {item.product ? (
                <>
                  <Link 
                    href={`/dashboard/pages/details/${item.product._id}`}
                    className="hover:text-primary transition-colors"
                  >
                    <h2 className="card-title">{item.product.name}</h2>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.product.description}
                    </p>
                  </Link>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-lg font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                      <span className="text-sm text-gray-500 ml-2">
                        (${item.product.price} × {item.quantity})
                      </span>
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Qty:</span>
                      <span className="font-medium">{item.quantity}</span>
                    </div>
                  </div>

                  <div className="card-actions flex justify-end mt-4">
                    <button
                      onClick={() => handleCheckout(
                        item.product._id,
                        item.quantity,
                        item.product.price
                      )}
                      className="btn btn-primary"
                    >
                      Checkout
                    </button>

                    <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="btn btn-error"
                        >
                        Remove
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="card-title text-gray-500">Deleted Product</h2>
                  <p className="text-sm text-gray-400">This item is no longer available</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => setCartItems(prev => prev.filter(i => i._id !== item._id))}
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {cartItems.length > 0 && (
        <div className="card bg-base-100 shadow-sm sticky bottom-0">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg">
                  Total: <span className="font-bold">
                    ${cartItems.reduce((total, item) => 
                      total + (item.product?.price || 0) * item.quantity, 0
                    ).toFixed(2)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={() => {
                  // Handle bulk checkout
                  Promise.all(
                    cartItems.map(item => 
                      item.product && handleCheckout(
                        item.product._id,
                        item.quantity,
                        item.product.price
                      )
                    )
                  );
                }}
                className="btn btn-primary"
                disabled={!cartItems.some(item => item.product)}
              >
                Checkout All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;