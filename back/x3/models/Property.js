const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  img: { type: String, required: true },  // Image file path
  amenities: { type: [String], default: [] },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('Property', propertySchema);
