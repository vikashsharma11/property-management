import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/BookingForm.css';

const BookingForm = () => {
  const { id } = useParams();  // Property ID from URL
  const navigate = useNavigate();  // Initialize useNavigate for redirection
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying if token is present
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("User is not logged in. Redirecting to login.");  // Debugging log
      setErrorMessage('You must be logged in to book a property.');
      navigate('/auth', { replace: true });
    }
  }, [navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');  // Ensure the user is logged in

    if (!token) {
      setErrorMessage('You must be logged in to book a property.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        'https://x3-sj4b.onrender.com/api/booking',
        { propertyId: id, bookingDate, bookingTime },
        { headers: { Authorization: `Bearer ${token}` } }  // Send token for authentication
      );

      // Redirect to payment page with confirmation message
      navigate(`/payment/${id}`, { state: { message: 'Booking confirmed! Please proceed to payment.' } });
    } catch (error) {
      setErrorMessage('Booking failed, please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h2>Book Property</h2>
      <form onSubmit={handleBooking}>
        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
        <input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Booking...' : 'Book Now'}</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default BookingForm;
