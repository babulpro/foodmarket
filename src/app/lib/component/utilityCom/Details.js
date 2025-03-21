 
 
 
"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Details = ({data}) => {

  const router = useRouter()
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(data.images[0]);
  const [quantity,setQuantity] =useState(1)

  const handleAddToCart = async() => {
    try{
      const res = await fetch("/api/getData/product/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: data._id,quantity:quantity }),
      });
      if(res.ok){
        setAdded(true);
        router.push("/")
      }

    }
    catch(e){
      console.log(e);
    }
  
  };

  const btnIncrement = () => {
    
    quantity<9 &&
    setQuantity(quantity+1);
  }
  const btnDecrement = () => {
     
    quantity>1 && 
    setQuantity(quantity-1);
  }

  return (
    <div className="bg-slate-900 shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
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
          <p className="text-xl font-semibold text-red-500 mt-4">৳ {data.price*quantity}</p>
          <div className="flex text-slate-600 mt-5 items-center">
           Quantity:<button onClick={btnIncrement} className="mx-4 p-3 border">+</button><button className="mr-4 p-3 border">{quantity}</button><button onClick={btnDecrement} className="p-3 border">-</button>
          </div>
          <button
            onClick={handleAddToCart}
            className={`mt-4 w-full py-3 text-white font-bold rounded-lg ${added ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default Details;
