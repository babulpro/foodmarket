"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import CartOption from "./CartOption";
 

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    

     useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/User/get", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();
        

        if (data.status === "success") {
          setUser(data.data[0]?.role || ""); 
          // safely get role
            setLoading(false);
        } else {
          setUser("");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser("");
      }
    };

    fetchUser();
  }, []);
   

    const logOut = async () => {
        const config = { method: "DELETE" };
        let response = await fetch("/api/login", config, { cache: "force-cache" });
        let json = await response.json();

        if (json.status === "ok") {
            toast.success("Log Out Success");
            router.replace("/");
        }
    };

    const logIn = async () => {
        router.replace("/login");
    };
   if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-2xl text-gray-500">Loading...</div>
            </div>
        );
    }
    return (
        <div>
            <div className="navbar bg-base-100 fixed top-0 z-50">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                                            <Link href={"/"} className="justify-between">
                                                                      home
                                                                    </Link>
                                                        </li>
                           
                                <li >
                            <Link href={"/dashboard/pages/mutton"} className="justify-between">
                                       Mutton
                                    </Link>
                                    
                        </li>
                        <li>
                            <Link href={"/dashboard/pages/beef"} className="justify-between">
                                       beef
                                    </Link>
                        </li>
                        <li>
                                    <Link href={"/dashboard/pages/chicken"} className="justify-between">
                                       chicken
                                    </Link>
                        </li>
                        <li>
                                    <Link href={"/dashboard/pages/fish"} className="justify-between">
                                       fish
                                    </Link>
                        </li>
                        <li>

                            {
                                user==="admin"?
                                <Link href={"/dashboard/pages/admin"} className="justify-between">
                                       admin
                                    </Link>:user==="cook"? <Link href={"/dashboard/pages/cook"} className="justify-between">
                                       cook
                                    </Link>:user==="delivery"? <Link href={"/dashboard/pages/delivery"} className="justify-between">
                                       delivery
                                    </Link>:""}
                        </li>
                           
                        </ul>
                    </div>

                    <div className="w-16">
                        <Link href="/">
                            <Image src="/logo.jpg" alt="logo" width={500} height={300} />
                        </Link>
                    </div>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                                                        <Link href={"/"} className="justify-between">
                                                                  home
                                                                </Link>
                                                    </li>
                        <li >
                            <Link href={"/dashboard/pages/mutton"} className="justify-between">
                                       Mutton
                                    </Link>
                                    
                        </li>
                        <li>
                            <Link href={"/dashboard/pages/beef"} className="justify-between">
                                       beef
                                    </Link>
                        </li>
                        <li>
                                    <Link href={"/dashboard/pages/chicken"} className="justify-between">
                                       chicken
                                    </Link>
                        </li>
                        <li>
                                    <Link href={"/dashboard/pages/fish"} className="justify-between">
                                       fish
                                    </Link>
                        </li>
                        <li>

                            {
                                user==="admin"?
                                <Link href={"/dashboard/pages/admin"} className="justify-between">
                                       admin
                                    </Link>:user==="cook"? <Link href={"/dashboard/pages/cook"} className="justify-between">
                                       cook
                                    </Link>:user==="delivery"? <Link href={"/dashboard/pages/delivery"} className="justify-between">
                                       delivery
                                    </Link>:""}
                        </li>
                    </ul>
                </div>
{/*----------------------------- searchitms-------------------------------------- */}
                <div className=" flex justify-between gap-2">
                    <div className="form-control">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-24 md:w-auto"
                        />
                    </div>

 {/* -----------------------------cart item----------------- */}
                        <div className="flex-none">
                            <CartOption/>
                        </div>
                         
       {/* --------------------------lonInOption---------------------------              */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <Image src="/file.jpg" alt="Logo Image" width={300} height={200} />
                            </div>
                        </div>
                        <ul
                            tabIndex="0"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                {/* <Link href="/dashboard/pages/Admin" className="justify-between">
                                    {user==="ADMIN"? "Admin":"User"}
                                </Link> */}
                                 <Link href={"/dashboard/pages/user"}>Update</Link>
                            </li>
                            <li>
                                <button onClick={logIn}>Log In</button>
                            </li>
                            <li>
                                <button onClick={logOut}>Log Out</button>
                            </li>
                            <li>
                                <Link href="/">Settings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
