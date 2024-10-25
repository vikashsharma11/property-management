import React from 'react';
import '../css/AdminDashboard.css';
import AdminCustomerManagement from './AdminCustomerManagement';
import AdminPropertyManagement from './AdminPropertyManagement';  // Assuming you have a property management component
import AdminBookingManagement from './AdminBookingManagement';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <AdminCustomerManagement />
      <AdminPropertyManagement />
      <AdminBookingManagement />
    </div>
  );
};

export default AdminDashboard;
