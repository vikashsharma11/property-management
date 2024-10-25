import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Estate Platform. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
