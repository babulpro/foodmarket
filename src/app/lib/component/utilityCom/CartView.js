"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const CartView=()=>{
      const [data, setData] = useState([]);
        const [error, setError] = useState(null);
    
        useEffect(() => {
            const fetchHeroData = async () => {
                try {
                    const response = await fetch("/api/getData/product/getToCart", { cache: "no-store" });
                    const data = await response.json();
    
                    if (data.status == 'ok') {
                      setData(data.data);   
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
    
                } catch (err) {
                    setError(err.message);
                }
            };
    
            fetchHeroData();
        }, []);
    
        const totalPrice=data.reduce((pre,curr)=>{
          return pre+=(curr["product"].price*curr.quantity)
        },0)
        
      
        return (
           <div className="grid md:grid-cols-2 gap-5 ">
               {
                data.length>0 &&
                data.map((value)=>
                    <div key={value._id} className="card bg-base-100  shadow-sm">
                <figure>
                    <img
                    src={value.product.images[0]}
                    alt="Shoes" />
                </figure>
                <div className="card-body">
                    <Link href={`/dashboard/pages/details/${value.product._id}`}><h2 className="card-title underline">{value.product.name}</h2></Link>
                    <p>{value.product.description}</p>
                    <p>Total Price:{value.product.price *value.quantity}</p>
                    <p>Quantity: {value.quantity}</p>
                    <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                    </div>
                </div>
            </div>
                )
               }
           </div>
          );

}
export default CartView