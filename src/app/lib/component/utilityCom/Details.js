 
 
// import React from 'react';
// import Image from 'next/image'; 

 

 
// const Details = ({data}) => {  
//     console.log(data)  
    
//     return (
//         <div className="font-Geist">
//             <div className="container m-auto bg-slate-800 py-10 ">
//                 <div className="">
//                     <div className="w-full ">
//                         <Image src={data?.img1} alt="image" width={500} height={500} />
//                     </div>
//                     <div className="w-full p-5">
//                         <h1 className="text-3xl text-white font-bold">{data?.title}</h1>
//                         <p className="text-white text-lg">{data?.long_des}</p>
//                     </div>
//                 </div>
//         </div>   
//         </div>           
            
        
    
//     );
// };

// export default Details;

import Link from "next/link";
import { useState } from "react";

const Details = ({data}) => {
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(data.images[0]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-slate-200 shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img
            src={selectedImage}
            alt={data.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="flex gap-2 mt-3">
            {data.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Thumbnail"
                className="w-16 h-16 object-cover cursor-pointer border rounded-lg hover:border-blue-500"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
          <p className="text-gray-600 mt-2">{data.description}</p>
          <p className="text-xl font-semibold text-red-500 mt-4">৳ {data.price}</p>
          <button
            onClick={handleAddToCart}
            className={`mt-4 w-full py-3 text-white font-bold rounded-lg ${added ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
          <Link href="/cart" className="block text-center text-blue-500 mt-4 hover:underline">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Details;
