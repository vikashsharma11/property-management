import React, { useState } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes for validation
import { useParams, useLocation } from 'react-router-dom';  
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../css/PaymentForm.css';

const stripePromise = loadStripe('pk_test_51QCnomBpuOPbcUID6pniFUBCSJFCt1svvXBEZYEq9HGVioIDf99TeF9CqbfbEi86IW6JChEE8ntWxMLkQLEdHEDH00LSGkW5Ud');

const PaymentForm = ({ propertyId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');  // Ensure the user is logged in

    if (!token) {
      setErrorMessage('You must be logged in to make a payment.');
      setLoading(false);
      return;
    }

    try {
      const { data: { clientSecret } } = await axios.post(
        'https://x3-sj4b.onrender.com/api/payment/create-payment-intent',
        { propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      } else if (paymentIntent.status === 'succeeded') {
        await axios.post(
          'https://x3-sj4b.onrender.com/api/payment/capture-payment',
          { paymentIntentId: paymentIntent.id, propertyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMessage('Payment successful!');
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage('Payment failed, please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Pay Now'}</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
};

// PropTypes for PaymentForm component
PaymentForm.propTypes = {
  propertyId: PropTypes.string.isRequired,
};

const PaymentPage = () => {
  const { id } = useParams();  // Extract property ID from URL
  const location = useLocation();  // Extract state passed from the BookingForm

  return (
    <div className="payment-page">
      <h2>Payment for Property {id}</h2>
      {/* Display the message passed from the BookingForm */}
      {location.state && location.state.message && <p style={{ color: 'green' }}>{location.state.message}</p>}

      {/* Payment form */}
      <Elements stripe={stripePromise}>
        <PaymentForm propertyId={id} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
