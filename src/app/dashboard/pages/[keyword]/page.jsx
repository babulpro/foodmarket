"use client"
import { useEffect, useState } from 'react';
import FoodCard from '@/app/lib/component/utilityCom/FoodCard';

const Page = ({ params }) => {
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { keyword } =await params;
            try {
                const config = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                const response = await fetch(`http://localhost:3000/api/getData/product/allProduct/${keyword}`, config);
                const { data } = await response.json();
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [1]);

    if (loading) {
        return <div className="mt-16">Loading...</div>;
    }

    return (
        <div className="mt-16">
            <FoodCard items={data} />
        </div>
    );
};

export default Page;
