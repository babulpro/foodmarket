import Navbar from '@/app/lib/component/utilityCom/Navbar';
import React from 'react';

const layout = ({children}) => {
    return (
        <div>
            <Navbar/>       
            <div className="min-h-screen">
                {children}
            </div>
        </div>
    );
};

export default layout;