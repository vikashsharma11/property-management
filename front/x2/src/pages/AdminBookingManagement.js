import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminBookingManagement.css';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({ propertyId: '', userId: '', bookingDate: '', bookingTime: '' });
  const [editingBooking, setEditingBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState({ propertyId: '', userId: '', bookingDate: '', bookingTime: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.get('https://x3-sj4b.onrender.com/api/booking', {
        headers: { Authorization: `Bearer ${token}` }, // Send token with the request
      });
      setBookings(response.data);
    };
    fetchBookings();
  }, []);

  const addBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://x3-sj4b.onrender.com/api/booking', newBooking, {
        headers: { Authorization: `Bearer ${token}` },  // Send token with the request
      });
      setBookings([...bookings, response.data.booking]);
      alert('Booking added successfully!');
      setNewBooking({ propertyId: '', userId: '', bookingDate: '', bookingTime: '' });
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://x3-sj4b.onrender.com/api/booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },  // Send token with the request
      });
      setBookings(bookings.filter((booking) => booking._id !== id)); // Remove deleted booking from the state
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const startEditBooking = (booking) => {
    setEditingBooking(booking._id);
    setUpdatedBooking({
      propertyId: booking.propertyId,
      userId: booking.userId,
      bookingDate: booking.bookingDate.split('T')[0],  // Format for input
      bookingTime: booking.bookingTime,
    });
  };

  const updateBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://x3-sj4b.onrender.com/${editingBooking}`, updatedBooking, {
        headers: { Authorization: `Bearer ${token}` },  // Send token with the request
      });
      setBookings(
        bookings.map((booking) => (booking._id === editingBooking ? response.data.booking : booking))
      );
      setEditingBooking(null);
      alert('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleUpdatedInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBooking({ ...updatedBooking, [name]: value });
  };

  return (
    <div className="admin-booking-management">
      <h2>Manage Bookings</h2>

      {/* Add Booking Form */}
      <form onSubmit={addBooking} className="booking-form">
        <input type="text" name="propertyId" placeholder="Property ID" value={newBooking.propertyId} onChange={handleInputChange} required />
        <input type="text" name="userId" placeholder="User ID" value={newBooking.userId} onChange={handleInputChange} required />
        <input type="date" name="bookingDate" value={newBooking.bookingDate} onChange={handleInputChange} required />
        <input type="time" name="bookingTime" value={newBooking.bookingTime} onChange={handleInputChange} required />
        <button type="submit">Add Booking</button>
      </form>

      {/* Edit Booking Form */}
      {editingBooking && (
        <form onSubmit={updateBooking} className="booking-form">
          <input type="text" name="propertyId" placeholder="Property ID" value={updatedBooking.propertyId} onChange={handleUpdatedInputChange} required />
          <input type="text" name="userId" placeholder="User ID" value={updatedBooking.userId} onChange={handleUpdatedInputChange} required />
          <input type="date" name="bookingDate" value={updatedBooking.bookingDate} onChange={handleUpdatedInputChange} required />
          <input type="time" name="bookingTime" value={updatedBooking.bookingTime} onChange={handleUpdatedInputChange} required />
          <button type="submit">Update Booking</button>
        </form>
      )}

      {/* Display Bookings */}
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            <p>Property ID: {booking.propertyId} - User ID: {booking.userId}</p>
            <p>Date: {new Date(booking.bookingDate).toLocaleDateString()} - Time: {booking.bookingTime}</p>
            <button onClick={() => startEditBooking(booking)}>Edit</button>
            <button onClick={() => deleteBooking(booking._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBookingManagement;
