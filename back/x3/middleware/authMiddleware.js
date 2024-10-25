/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];  // Extract the token from the Authorization header

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    
    req.user = { userId: verified.userId };  // Attach the userId from the token payload to req.user
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);  // Find the user by ID from the token
    if (user && user.role === 'admin') {
      next();  // Proceed if the user is an admin
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });  // Forbidden access for non-admins
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while checking admin privileges.' });
  }
};

module.exports = { verifyToken, isAdmin };
/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */
