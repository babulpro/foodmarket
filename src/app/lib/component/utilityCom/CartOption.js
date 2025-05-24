"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const CartOption = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getData/product/addToOrder", {
          
        });
        const result = await response.json();

        if (result.status === "success") {
          setData(result.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Calculate total price whenever data changes
  useEffect(() => {
    if (data.length > 0) {
      const totalPrice = data.reduce((acc, item) => {
        return item.items ? acc + item.items[0].foodItem.price * item.items[0].quantity : acc;
      }, 0);
      setPrice((totalPrice.toFixed(2)));
    }
  }, [data]);

  if (loading) return ;
  
 

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="badge badge-sm indicator-item">{data.length}</span>
        </div>
      </div>
      <div
        tabIndex={0}
        className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
      >
        <div className="card-body">
          <span className="text-lg font-bold">{data.length} Items</span>
          <span className="text-info">Subtotal: {price}</span>
          <div className="card-actions">
             
            <Link href={"/dashboard/pages/orderItems"} className="btn btn-primary btn-block">
              View Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartOption;
