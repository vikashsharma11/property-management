/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
const Booking = require('../models/Booking');
const Property = require('../models/Property');


const createBooking = async (req, res) => {
  const { propertyId, bookingDate, bookingTime } = req.body;

  try {
    // Get the user ID from the token (req.user is populated by verifyToken middleware)
    const userId = req.user.userId;

    // Check if the property is already booked at the same date and time
    const existingBooking = await Booking.findOne({ property: propertyId, bookingDate, bookingTime });
    if (existingBooking) {
      return res.status(400).json({ message: 'Property is already booked at this time' });
    }

    // Create a new booking
    const newBooking = new Booking({
      user: userId,  // Use the user ID from the token
      property: propertyId,
      bookingDate,
      bookingTime,
      paymentStatus: false,  // Set paymentStatus to false by default
      isBooked: true,  // Set the booking status to true
    });

    await newBooking.save();
     
    // Mark the property as booked
    await Property.findByIdAndUpdate(propertyId, { availability: false });

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    console.error('Server error during booking creation:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user property');      // Populating related data for better details
      // Populating related data for better details
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a booking by ID
const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id).populate('user property');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a booking (e.g., payment status)
const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, { paymentStatus }, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Mark the property as available again
    await Property.findByIdAndUpdate(booking.property, { availability: true });

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */
