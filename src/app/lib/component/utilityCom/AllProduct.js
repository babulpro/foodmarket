"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
 
const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/getData/product/getProduct", { 
                    cache: "no-store",
                    next: { tags: ['products'] } // For revalidation
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`);
                }

                const result = await response.json();
                if (result.data) {
                    setProducts(result.data);
                } else {
                    throw new Error("Invalid data structure received");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, []);

    // Loading skeleton
    if (loading) {
        return (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <p>loading............</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 text-center">
                <div className="alert alert-error max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-sm ml-4"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (products.length === 0) {
        return (
            <div className="p-4 text-center">
                <div className="max-w-md mx-auto py-12">
                    <div className="text-5xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                    <p className="text-gray-500 mb-4">We couldn't find any products at the moment.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-primary"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product._id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <Link href={`/dashboard/pages/details/${product._id}`} className="block group">
                        <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                                src={product.images?.[0] || '/placeholder-product.png'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = '/placeholder-product.png';
                                }}
                            />
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="mt-1 text-gray-600 font-medium">
                            ৳ {product.price?.toLocaleString()}
                        </p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default AllProduct;