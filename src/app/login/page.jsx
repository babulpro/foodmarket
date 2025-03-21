"use client"

import {  useState } from "react"
// import {useRouter} from 'next/navigation'
import Link from 'next/link'
import { useRouter } from "next/navigation"
 

export default function Page(){
    const router = useRouter()
    
    const [data,setData]=useState({email:"",password:""})
    // const router= useRouter()
    

    const InputChange =(name,value)=>{
        setData(pre=>({
            ...pre,
            [name]:value
        }))
    }

    
    const FormSubmitHandler = async (e) => {
        e.preventDefault();
    
        if (data.email.trim() === "") {
            alert("Please enter a valid email.");
        } else if (data.password.trim() === "") {
            alert("Please enter a valid password.");
        } else {
            try {
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                };
    
                const response = await fetch("/api/user/login", config, { cache: "no-cache" });
    
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
    
                const json = await response.json();
    
                if (json.status === "success") {
                    
                    alert('Wellcome To Home of Knowledge')
                    
                    // window.location.replace("/")
                     router.push("/")
                } else {
                    toast.error("Please provide valid email and password");
                }
            } catch (error) {
                alert("Please provide valid email and password");

            }
        }
    };
    
 
    return(
        <div className="container m-auto bg-slate-700 min-h-1/2 items">
            <div className="flex justify-center lg:py-10 py-4">
                <div className=" auto p-8 m-auto shadow-2xl">
                        <form onSubmit={FormSubmitHandler}>
                            <label htmlFor="email">Enter Your Email</label><br/>
                            <input type='email' placeholder='email' value={data.email} onChange={(e)=>InputChange("email",e.target.value)} className="inputClass text-left" id="email"/> <br/><br/>
                            <label htmlFor="password">Enter Your Password</label><br/>
                            <input type="password" placeholder="********" value={data.password} onChange={(e)=>InputChange("password",e.target.value)} className="inputClass" id="password"/> <br/>
                            <div className="mt-8 ">
                            <input type='submit' value='login' className="p-1 hover:text-slate-500 "/><br/>
                            <Link href="/login/registration" className="text-xs p-1 hover:text-slate-500 shadow-2xl">Don't have account?</Link>
                            <Link href="/login/forgetpassword" className="text-xs p-1 hover:text-slate-500 shadow-2xl">Forget password?</Link>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    )
}