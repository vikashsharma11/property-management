import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/Auth.css';

const CustomerAuth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);  // Only using 'login' here
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning('');
    setLoading(true);

    const apiUrl = isSignup ? 'https://x3-sj4b.onrender.com/api/auth/signup' : 'https://x3-sj4b.onrender.com/api/auth/login';

    try {
      const response = await axios.post(apiUrl, formData);
      if (response && response.data) {
        const { token, role } = response.data;

        if (role !== 'customer') {
          setWarning('You can login now');
          setLoading(false);
          return;
        }

        login(token);  // Call the 'login' function to set token and context
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setWarning('Incorrect email or password.');
      } else {
        setWarning('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
      {warning && <p className="warning">{warning}</p>}
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)} disabled={loading}>
        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};

export default CustomerAuth;
