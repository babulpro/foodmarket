"use client";
import Details from '@/app/lib/component/utilityCom/Details';
import Pages from '@/app/lib/component/utilityCom/Pages';
import AllComments from '@/app/lib/component/utilityCom/user/Comments';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comment,setComment]=useState(null)
  let [type ,setType] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeData,setTypeData] = useState(null)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`/api/getData/product/productById?id=${id}`);
        // const Allcomments = await fetch(`/api/getData/newsAllComments?id=${id}`);
        // const newsData = await fetch(`/api/getData/news`,{cache:'force-cache'})
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        // const news = await newsData.json();
        // const comments = await Allcomments.json()

        setData(result.data[0]);
        // setType(result.data[0].type)
        // setComment(comments.data)
        // setTypeData(news.data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHeroData();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
    


  return (
    <div className="font-Geist my-5">
      
        <Details data={data}/>
         {/* <AllComments data={comment} id={id}/>          
        <Pages Data={data}/> */}

      
    </div>
  );
};

export default Page;
