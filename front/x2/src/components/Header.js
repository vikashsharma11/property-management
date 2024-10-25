import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/';  // Redirect to home or login page after logout
  };

  return (
    <header>
      <div className="logo">
        <h1><Link to="/">Real Estate</Link></h1>
      </div>
      <nav>
        <ul>
          {/* Only show the Home link if the user is not an admin */}
          {!user || user.role !== 'admin' ? (
            <li><Link to="/">Home</Link></li>
          ) : null}
          {user ? (
            <>
              {user.role === 'admin' && (
                <>
                  <li><Link to="/admin">Admin Dashboard</Link></li>
                </>
              )}
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/auth/admin">Admin Login</Link></li>
              <li><Link to="/auth">Customer Login</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
