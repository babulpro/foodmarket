"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
 

const Courses = () => {
   
    const [Data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch("/api/getData/news", { cache: "force-cache" });

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
         
                <div className="container m-auto bg-slate-800 py-10 grid md:grid-cols-3 gap-3">
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

export default Courses;
