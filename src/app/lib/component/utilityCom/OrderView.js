"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; 

const OrderView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch("/api/getData/product/getToCart", {cache:"force-cache"
          
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

    fetchCartData();
  }, []);

  if (loading) return <h1>Loading Cart...</h1>;
  if (data.length === 0) return <h1>No Items in Cart</h1>;
  const buttonHandleClick=(id,quantity,price)=>{
                fetch("/api/getData/product/addToOrder",{
                method:"POST",
                body:JSON.stringify({product:id,quantity:quantity,price:price}),
                headers:{
                    "Content-Type":"application/json"
                }
                }).then(res=>res.json()).then(data=>{
                if(data.status==="success"){
                    alert("Order Success")
                    
                }
                })
                
                 
  }

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
                    <button onClick={()=>{buttonHandleClick(value.product._id,value.quantity,value.product.price)}} className="btn btn-primary">Buy Now</button>
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

export default OrderView;
