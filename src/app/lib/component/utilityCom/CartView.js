"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CartView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchCartData = async () => {
    try {
      const response = await fetch("/api/getData/product/getToCart", {
        cache: "no-store"
      });
      const result = await response.json();

      if (result.status === "ok") {
        setData(result.data);
      } else {
        setError("Failed to fetch cart items.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const buttonHandleClick = async (id, quantity, price) => {
    try {
      const response = await fetch("/api/getData/product/addToOrder", {
        method: "POST",
        body: JSON.stringify({ product: id, quantity, price }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        // Optimistically update the UI by removing the ordered item
        setData(prevData => prevData.filter(item => item.product._id !== id));
        
        // Show success message
        alert("Order Success");
        
        // Refresh the cart data to ensure consistency
        await fetchCartData();
        
        // Optionally redirect (commented out as you might not need it)
        // router.push("/dashboard/pages/cartItems");
      } else {
        throw new Error(result.message || "Failed to process order");
      }
    } catch (err) {
      alert(`Order Failed: ${err.message}`);
      console.error("Order error:", err);
    }
  };

  if (loading) return <h1>Loading Cart...</h1>;
  if (error) return <h1 className="text-red-500">Error: {error}</h1>;
  if (data.length === 0) return <h1>No Items in Cart</h1>;

  return (
    <div className="grid gap-5">
      {data.map((value) => (
        <div key={value._id} className="card bg-base-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Image Section */}
            {value.product ? (
              <div className="w-full md:w-2/3 m-auto p-5 rounded-2xl">
                <figure>
                  <img
                    src={value.product.images?.[0] || "/placeholder.png"}
                    alt={value.product.name || "No Image"}
                    className="w-full h-auto rounded-lg"
                  />
                </figure>
              </div>
            ) : (
              <div className="w-full md:w-2/3 m-auto p-5 rounded-2xl">
                <p className="text-red-500">Product not available</p>
              </div>
            )}

            {/* Product Details */}
            <div className="card-body">
              {value.product ? (
                <>
                  <Link href={`/dashboard/pages/details/${value.product._id}`}>
                    <h2 className="card-title underline">{value.product.name}</h2>
                  </Link>
                  <p>{value.product.description}</p>
                  <p>Total Price: {value.product.price * value.quantity}</p>
                  <p>Quantity: {value.quantity}</p>
                  <div className="card-actions justify-end">
                    <button 
                      onClick={() => buttonHandleClick(
                        value.product._id, 
                        value.quantity, 
                        value.product.price
                      )} 
                      className="btn btn-primary"
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">This product is no longer available.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartView;