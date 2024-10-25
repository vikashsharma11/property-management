import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize user state from token
  const initializeUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser({
        ...decodedUser,
        token,
      });
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    initializeUser();  // Update user immediately after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
