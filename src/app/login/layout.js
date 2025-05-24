 
import React from 'react';
import { cookies } from 'next/headers'
import MainNavbar from '../lib/component/utilityCom/MainNavbar';
import Navbar from '../lib/component/utilityCom/Navbar';


const layout = async({children}) => {
    const cookieStore =await cookies();
    const myCookie = cookieStore.get('token')

    return (
        <div>
            {myCookie ?<Navbar/>:<MainNavbar/>}

       
            {children}
        </div>
    );
};

export default layout;