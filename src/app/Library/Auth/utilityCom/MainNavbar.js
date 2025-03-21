 
import Link from "next/link";
import React from "react";
 

const getData = async()=>{
    try{
        let res= await fetch(`http://localhost:3000/api/getData/navbar`, { method: "GET" } ,{cache: 'no-store' })
        const data = await res.json()
        return data.data

    }
    catch(e){
        return []
    }
}
 
 

const MainNavbar =async () => {
    let data = await getData()
    
 
    return (
        <div>
            <div className="navbar bg-base-100 fixed top-0 z-50">
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                         {
                            data.length>0 &&
                            data.map((value)=>
                            <li key={value.id}>
                                <Link href={`${value.link}`}>{value.name}</Link>
                            </li>)
                         }
                         
                    </ul>
                </div>
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
       

      {
                            data.length>0 &&
                            data.map((value,index)=><li key={value.id}>
                                <Link href={`${value.link}`} key={value.id}>{value.name}</Link>
                            </li>)
                         }
    </ul>
  </div>
  <div className="navbar-end">
    
  <div>
    {/* //button */}
  </div>

        </div>
        </div>

                 
            </div>
        </div>
    );
};

export default MainNavbar;
