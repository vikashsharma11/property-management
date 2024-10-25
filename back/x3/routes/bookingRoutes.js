
const express = require('express');
const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createBooking);  // Create a booking
router.get('/', verifyToken, getBookings);  // Get all bookings
router.get('/:id', verifyToken, getBookingById);  // Get a booking by ID
router.put('/:id', verifyToken, updateBooking);  // Update a booking (e.g., payment status)
router.delete('/:id', verifyToken, deleteBooking);  // Delete a booking

module.exports = router;
