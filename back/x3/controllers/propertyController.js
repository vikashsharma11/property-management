const Property = require('../models/Property');

// Get all properties with filtering, search, and sorting
exports.getProperties = async (req, res) => {
  const { name, location, minPrice, maxPrice, available } = req.query;  // Add query parameters

  try {
    let filters = {};

    // Search by name if provided
    if (name) {
      filters.name = { $regex: name, $options: 'i' };
    }

    // Filter by location
    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }

    // Filter by price range
    if (minPrice && maxPrice) {
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Filter by availability
    if (available !== undefined) {
      filters.availability = available === 'true';
    }

    const properties = await Property.find(filters);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new property (Admin only)
exports.createProperty = async (req, res) => {
  const { name, price, location, amenities } = req.body;
  const img = req.file.path;
  try {
    const property = new Property({ name, price, location, img, amenities: amenities.split(',') });
    await property.save();
    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a property (Admin only)
exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// Update a property by ID
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, price, location, amenities } = req.body;
  const updates = {
    name,
    price,
    location,
    amenities: amenities.split(','),  // Ensure amenities are stored as an array
  };

  try {
    if (req.file) {
      updates.img = req.file.path;  // If a new image is uploaded, include it in the update
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


