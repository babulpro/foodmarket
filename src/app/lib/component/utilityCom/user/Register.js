"use client"
 
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation'

const Register = () => {
    const router = useRouter()
    
    const initData={
        name:"",
        email:"",
        password:""
    }
    const [data,setData]=useState({...initData})

    const HandleChange=(name,value)=>{setData((prev)=>({...prev,[name]:value}))}


    const HandleRegistrationSubmit = async (e) => {
        e.preventDefault();
        
        
        try {
            const config = { method:"POST",headers:{ "Content-Type": "application/json" },body: JSON.stringify(data),};
            let response = await fetch("/api/User/registration", config);
            let json = await response.json();
            if (json.status === "ok") {
                setData({...initData})
                toast.success('You Have Register Successfully !')
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
        <div className="items-center rounded-full justify bg-slate-600  w-1/2">
                                        <form onSubmit={HandleRegistrationSubmit}>
                                            <h1 className="font-bold capitalize underline text-xl">Register</h1><br/>
                                            
                                          
                            <input type='text' name="name" placeholder='your name' value={data.name} onChange={(e)=>HandleChange("name",e.target.value)} className="inputClass text-left" id="name" required/> <br/><br/>

                                            <input className="inputForm" type="email" name="email" value={data.email} placeholder="Email" onChange={(e)=>HandleChange(e.target.name,e.target.value)} required/><br/><br/>
                                            
                                            <input className="inputForm" type="password" value={data.password} placeholder="Password " name="password" onChange={(e)=>HandleChange(e.target.name,e.target.value)} required/><br/><br/>

                                            <div className="inline-block px-2 mt-1 text-center text-slate-400 bg-slate-800 rounded-full lg:mt-3 hover:bg-slate-700 hover:text-slate-300">
                                            <input  type="submit" value="Register"/>
                                            </div>
                                        </form>
        </div>
    );
};

export default Register;