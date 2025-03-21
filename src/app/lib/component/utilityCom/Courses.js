"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
 

const Courses = () => {
   
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch("/api/getData/product/getProduct", { cache: "no-store" });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setData(data.data); // Ensure data has correct structure
            } catch (err) {
                setError(err.message);
            }
        };

        fetchHeroData();
    }, []);

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((product) => (
            <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
              <Link href={`/dashboard/pages/details/${product._id}`} className="block">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="mt-2 text-lg font-semibold text-gray-800 hover:text-blue-600">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 font-medium">৳ {product.price}</p>
            </div>
          ))}
        </div>
      );
};

export default Courses;
