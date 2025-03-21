 
 
import React from 'react';
import Image from 'next/image'; 

 

 
const Details = ({data}) => {    
    
    return (
        <div className="font-Geist">
            <div className="container m-auto bg-slate-800 py-10 ">
                <div className="">
                    <div className="w-full ">
                        <Image src={data?.img1} alt="image" width={500} height={500} />
                    </div>
                    <div className="w-full p-5">
                        <h1 className="text-3xl text-white font-bold">{data?.title}</h1>
                        <p className="text-white text-lg">{data?.long_des}</p>
                    </div>
                </div>
        </div>   
        </div>           
            
        
    
    );
};

export default Details;