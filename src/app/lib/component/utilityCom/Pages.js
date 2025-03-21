"use client";
import React from 'react';
import Link from 'next/link';
 

const Pages = ({Data}) => {
    
    

    return (
         
                <div className="container m-auto bg-slate-800 py-10 grid lg:grid-cols-3 gap-3">
                     {
                        Data.length>0 &&
                        Data.map((value,index)=>{
                            return(
                        <div key={value._id} className="card card-compact bg-base-100 w-96 shadow-xl">
                                        <figure>
                                            <img
                                            src={value.img1} />
                                        </figure>
                                        <div className="card-body">
                                            <h2 className="card-title">{value.title}</h2>
                                            <p>{value.short_des}</p>
                                            <div className="card-actions justify-end">
                                            <Link href={`/dashboard/pages/details/${value._id}`} className="btn btn-primary">Details</Link>
                                            </div>
                                        </div>
                                        </div>
                            )
                        })
                     }
                </div>
      
    );
};

export default Pages;
