"use client";
import React from 'react';
import Link from 'next/link';
 

const Pages = ({Data}) => {
    
    
console.log(Data)
    return (
         
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Data.map((product) => (
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

export default Pages;
