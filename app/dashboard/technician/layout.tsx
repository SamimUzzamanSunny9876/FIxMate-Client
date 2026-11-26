import { requiredRole } from '@/lib/core/server';
import React from 'react';

const TechnicianDashboardLayoutPage = async ( {children} : {children : React.ReactNode}) => {
     
    await requiredRole('technician')

    return children
};

export default TechnicianDashboardLayoutPage;