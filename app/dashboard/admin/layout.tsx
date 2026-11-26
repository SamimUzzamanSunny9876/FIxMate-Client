import { requiredRole } from '@/lib/core/server';
import React from 'react';

const AdminDashboardLayoutPage = async ( {children} : {children : React.ReactNode}) => {
     
    await requiredRole('admin')

    return children
};

export default AdminDashboardLayoutPage;