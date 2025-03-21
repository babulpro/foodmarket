import Navbar from '@/app/lib/component/utilityCom/Navbar';
import React from 'react';

const layout = ({children}) => {
    return (
        <div>
            <Navbar/>
       
            {children}
        </div>
    );
};

export default layout;