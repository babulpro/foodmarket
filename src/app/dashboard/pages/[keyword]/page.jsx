 
 "use client";
 
// import FoodCard from "@/app/lib/component/utilityCom/FoodCard";
// import Link from "next/link";
 

 
const getData =async(keyword)=>{
    const config = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(postData)
            };
    let data =  await fetch(`http://localhost:3000/api/getData/product/allProduct/${keyword}`,{config})
    const res = await data.json();
    return res.data;
}




const Page=async({params})=>{
    const {keyword} =await params;
    const data = await getData(keyword)
    
    return(
        <div className="mt-16">
            this is the card
           
            {/* <FoodCard items={data} /> */}
        </div>
    )
}

export default Page;