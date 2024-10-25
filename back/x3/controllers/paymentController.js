/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Create a Payment Intent
exports.createPaymentIntent = async (req, res) => {
  const { propertyId, userId } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const amount = property.price * 100;  // Price in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'INR',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Capture payment and create booking
exports.capturePayment = async (req, res) => {
  const { paymentIntentId, userId, propertyId, bookingDate } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const newBooking = new Booking({
      user: userId,
      property: propertyId,
      bookingDate,
      paymentStatus: true,
    });

    await newBooking.save();
    res.status(200).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */