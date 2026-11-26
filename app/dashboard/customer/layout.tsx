import { requiredRole } from '@/lib/core/server';
import React from 'react';

const CustomerDashboardLayoutPage = async ( {children} : {children : React.ReactNode}) => {
     
    await requiredRole('customer')

    return children
};

export default CustomerDashboardLayoutPage