"use client"
import Pages from '@/app/lib/component/utilityCom/Pages';
import React, { useEffect, useState } from 'react';

const page = () => {
    
        const [Data, setData] = useState([]);
        const [error, setError] = useState(null);
    
        useEffect(() => {
            const fetchHeroData = async () => {
                try {
                    const response = await fetch("/api/getData/product/getProduct", { cache: "no-store" });
    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
    
                    const data = await response.json();
                    setData(data.data);
                } catch (err) {
                    setError(err.message);
                }
            };
    
            fetchHeroData();
        }, []);

 if(Data.length>0){
        let data = Data.filter((value)=>value.keyword === "gadget");
        
    return (
        <div>
            <Pages Data={data}/>
        </div>
    );
};}

export default page;