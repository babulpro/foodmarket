"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MainNavbar = () => {
    const router = useRouter();
    const [activePath, setActivePath] = useState(""); 
    const [Data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch("/api/getData/navbar", { cache: "no-store" });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setData(data.data); 
            } catch (err) {
                console.error("Error fetching navbar data:", err);
                setError(err.message);
            }
        };

        fetchHeroData();
    }, []);

    useEffect(() => {
        setActivePath(window.location.pathname);
    }, []);

 
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
                            {Data.map((value) => (
                                <li key={value._id}>
                                    <Link href={value.link} className="justify-between">
                                        {value.name}
                                    </Link>
                                </li>
                            ))}
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
                        {Data.map((value) => (
                             
                               <li key={value._id}>
                                    <Link href={value.link} className="justify-between">
                                        {value.name}
                                    </Link>
                                </li>
                             
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default MainNavbar;
