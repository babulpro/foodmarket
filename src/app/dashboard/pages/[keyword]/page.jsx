"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
  const { keyword } = useParams(); // ✅ Correct way to access dynamic params on the client
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return; // wait until keyword is available

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/getData/product/allProduct/${keyword}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error('Fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  if (loading) {
    return <div className="mt-16 text-center text-gray-500">Loading...</div>;
  }

  if (!data.length) {
    return <div className="mt-16 text-center text-gray-500">No items found.</div>;
  }

  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-7xl mx-auto">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <div className="h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-gray-800">${item.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Stock: {item.stock}</span>
              </div>
              <div className="mt-4">
                <Link
                  href={`/dashboard/pages/product/${item._id}`}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
