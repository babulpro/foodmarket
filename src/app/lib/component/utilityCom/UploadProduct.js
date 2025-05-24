"use client"
 
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
 

const Upload = ({id}) => {
    const router = useRouter()
    const [data,setData]=useState({
       street:"",
       city:"",
       state:"",
       postalCode:"",
       contactPhone:"",
       quantity:"",
       paymentMethod:""})
     
    useEffect(()=>{
        const fetchAddress = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getData/product/addToOrder`);
                const data = await response.json();
                if (data.status === "success") {
                    const myaddress=data.data[0].deliveryAddress 
                    if(data.data[0].deliveryAddress){
                        const myaddress=data.data[0].deliveryAddress
                        setData((prev)=>({...prev,street:myaddress.street,city:myaddress.city,state:myaddress.state,postalCode:myaddress.postalCode,contactPhone:data.data[0].contactPhone}))
                    }
                } else {
                    toast.error("Failed to fetch address");
                }
            } catch (error) {
                console.error("Error fetching address:", error);
            }
        };
        fetchAddress();
    },[1])
    
    
    
    const HandleChange=(name,value)=>{setData((prev)=>({...prev,[name]:value}))}


    const HandleRegistrationSubmit = async (e) => {
        e.preventDefault();
       
        const MyData={
            deliveryAddress:{
                street:data.street,
                city:data.city,
                state:data.state,
                postalCode:data.postalCode
            },
            contactPhone:data.contactPhone,
            items:[
                {
                    foodItem:id,
                    quantity:data.quantity
                }
            ],
            paymentMethod:data.paymentMethod

        }
        
        try {
            const config = { method:"POST",headers:{ "Content-Type": "application/json" },body: JSON.stringify(MyData),};
            let response = await fetch("http://localhost:3000/api/getData/product/addToOrder", config);
            let json = await response.json();
            if (json.status === "success") {
                toast.success('You Have order Successfully !')
                router.push("/")
                
            } else {
                toast.error("Already Used The Email")
            }
        }
        catch(e){
            console.log(e)
        }
    };
 
  

    return (
        <div className="  flex items-centere    justify-center bg-slate-600  w-full ">
        <div className=" w-1/2 m-auto h-full p-4 bg-slate-800 rounded-lg border">
            <form onSubmit={HandleRegistrationSubmit}>
                <h1 className="font-bold capitalize underline text-xl">Register</h1><br/>
                                            
                              <label htmlFor="street" className="text-slate-400">What is your Street?</label><br/>         
                            <input type='text' name="street" placeholder='street' value={data.street} onChange={(e)=>HandleChange("street",e.target.value)} className="inputClass w-full text-left" id="street" required/> <br/><br/>
                          
                            <label htmlFor="state" className="text-slate-400">What is your State?</label><br/>
                            <input type='text' name="state" placeholder='state' value={data.state} onChange={(e)=>HandleChange("state",e.target.value)} className="inputClass text-left w-full" id="state" required/> <br/><br/>

                            <label htmlFor="postalCode" className="text-slate-400">What is your PostalCode?</label><br/>

                            <input type='text' name="postalCode" placeholder='PostalCode' value={data.postalCode} onChange={(e)=>HandleChange("postalCode",e.target.value)} className="inputClass text-left w-full" id="postalCode" required/> <br/><br/>

                            <label htmlFor="city" className="text-slate-400">What is your City?</label><br/>

                            <input type='text' placeholder='city' name="city" value={data.city} onChange={(e)=>HandleChange("city",e.target.value)} className="inputClass text-left w-full" id="city"/> <br/><br/>


                            <label htmlFor="contactPhone" className="text-slate-400">What is your Phone Number?</label><br/>


                            <input type='text' name="contactPhone" placeholder='contactPhone' value={data.contactPhone} onChange={(e)=>HandleChange("contactPhone",e.target.value)} className="inputClass text-left w-full" id="contactPhone" required/> <br/>


                            <label htmlFor="quantity" className="text-slate-400">What is your quantity?</label><br/>

                            <input type='text' name="quantity" placeholder='quantity' value={data.quantity} onChange={(e)=>HandleChange("quantity",e.target.value)} className="inputClass text-left w-full" id="quantity" required/> <br/><br/>


                            <label htmlFor="paymentMethod" className="text-slate-400">What is your Payment method?</label><br/>

                            <select
                                name="paymentMethod"
                                id="paymentMethod"
                                value={data.paymentMethod}
                                onChange={(e) => HandleChange("paymentMethod", e.target.value)}
                                className="inputClass text-left w-full"
                                required
                                >
                                <option className="bg-slate-500 text-slate-900" value="" disabled>Select payment method</option>
                                <option className="bg-slate-500 text-slate-900" value="cod">Cash on Delivery</option>
                                <option className="bg-slate-500 text-slate-900" value="online">Online</option>
                                </select> 
                                                     

 
           

            <div className="inline-block px-2 mt-1 text-center text-slate-400 bg-slate-800 rounded-full lg:mt-3 hover:bg-slate-700 hover:text-slate-300">
            <input  type="submit" value="Register"/>
                </div>
            </form>

        </div>
        </div>
    );
};

export default Upload;