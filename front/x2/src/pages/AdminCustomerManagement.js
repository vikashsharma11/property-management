import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminCustomerManagement.css';

const AdminCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', password: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedCustomer, setUpdatedCustomer] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch customers when component loads
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const response = await axios.get('https://x3-sj4b.onrender.com/api/admin/customer', {
          headers: { Authorization: `Bearer ${token}` },  // Pass token in the headers
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const addCustomer = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error before submission
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://x3-sj4b.onrender.com/api/admin/addcustomer', newCustomer, {
        headers: { Authorization: `Bearer ${token}` },  // Pass token in the headers
      });
      
      setCustomers([...customers, response.data]);  // Add response customer to the state
      alert('Customer added successfully!');
      setNewCustomer({ name: '', email: '', password: '' });
    } catch (error) {
      setErrorMessage('Error adding customer: ' + (error.response?.data.message || error.message));
      console.error('Error adding customer:', error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://x3-sj4b.onrender.com/api/admin/deletecustomer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },  // Pass token in the headers
      });
      setCustomers(customers.filter((customer) => customer._id !== id));
      alert('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const startEditCustomer = (customer) => {
    setEditingCustomer(customer._id);
    setUpdatedCustomer({ name: customer.name, email: customer.email, password: '' });  // Do not prefill password
  };

  const updateCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://x3-sj4b.onrender.com/api/admin/updatecustomer/${editingCustomer}`, updatedCustomer, {
        headers: { Authorization: `Bearer ${token}` },  // Pass token in the headers
      });
      setCustomers(
        customers.map((customer) =>
          customer._id === editingCustomer ? response.data : customer
        )
      );
      setEditingCustomer(null);
      alert('Customer updated successfully!');
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <div className="admin-customer-management">
      <h2>Manage Customers</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Add Customer */}
      <form onSubmit={addCustomer} className="customer-form">
        <input type="text" name="name" placeholder="Customer Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} required />
        <input type="email" name="email" placeholder="Customer Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} required />
        <input type="password" name="password" placeholder="Password" value={newCustomer.password} onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })} required />
        <button type="submit">Add Customer</button>
      </form>

      {/* Display and Manage Customers */}
      <ul>
        {customers.map((customer) => (
          <li key={customer._id}>
            {editingCustomer === customer._id ? (
              <form onSubmit={updateCustomer} className="customer-edit-form">
                <input type="text" name="name" value={updatedCustomer.name} onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, name: e.target.value })} required />
                <input type="email" name="email" value={updatedCustomer.email} onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, email: e.target.value })} required />
                <input type="password" name="password" placeholder="New Password" value={updatedCustomer.password} onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, password: e.target.value })} />
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingCustomer(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <p>{customer.name} - {customer.email}</p>
                <button onClick={() => startEditCustomer(customer)}>Edit</button>
                <button onClick={() => deleteCustomer(customer._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCustomerManagement;
