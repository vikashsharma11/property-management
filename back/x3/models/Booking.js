const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },  // Reference to Property
  bookingDate: { type: Date, required: true },  // Booking date
  bookingTime: { type: String, required: true },  // Time of booking (optional improvement)
  paymentStatus: { type: Boolean, default: false },  // True if payment is completed
  isBooked: { type: Boolean, default: true },  // Explicit flag to mark booking status
});

module.exports = mongoose.model('Booking', bookingSchema);

