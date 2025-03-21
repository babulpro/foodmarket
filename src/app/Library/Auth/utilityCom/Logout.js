
"use client"
import React from "react";

const handleClick = async () => {
    try {
        const res = await fetch("/api/login", { method: "GET" });
        const data = await res.json();
        if(data.status === "ok"){
            window.location.replace("/")
        }
        
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};

const Logout = () => {
     

    return (
         <div>
            <button onClick={handleClick}>LogOut</button>
         </div>
    );
};

export default Logout;
