import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/Auth.css';

const AdminAuth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [warning, setWarning] = useState('');

  const navigate = useNavigate();
  const location = useLocation();  // Move useLocation to the top level
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = isSignup ? 'https://x3-sj4b.onrender.com/api/admin/create' : 'https://x3-sj4b.onrender.com/api/admin/login';

    try {
      const response = await axios.post(apiUrl, formData);
      if (response && response.data) {
        const {role, token } = response.data;

        if (role !== 'admin') {
          setWarning('Now you can login as admin.');
          return;
        }

        login(token);  // Use login function to set token in context and localStorage

        const from = location.state?.from?.pathname || '/admin';  // Use location from the top-level variable
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setWarning('Incorrect email or password.');
      } else {
        setWarning('Something went wrong.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Admin Sign Up' : 'Admin Log In'}</h2>
      {warning && <p className="warning">{warning}</p>}
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};

export default AdminAuth;
