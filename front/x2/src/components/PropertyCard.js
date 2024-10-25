import React from 'react';
import PropTypes from 'prop-types';  // Import PropTypes for validation
import { Link } from 'react-router-dom';
import '../css/PropertyCard.css';

const PropertyCard = ({ property }) => {
  return (
    <li className="property-card">
      <Link to={`/property/${property._id}`}>
        <img src={`https://x3-sj4b.onrender.com/${property.img}`} alt={property.name} />
        <h2>{property.name}</h2>
        <p>Price: ${property.price}</p>
        <p>Location: {property.location}</p>
        <p>Amenities: {property.amenities.join(', ')}</p>
        <p>Status: {property.availability ? 'Available' : 'Booked'}</p>
      </Link>
    </li>
  );
};

// Define PropTypes for validation
PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    amenities: PropTypes.arrayOf(PropTypes.string).isRequired,
    availability: PropTypes.bool.isRequired,
  }).isRequired,
};

export default PropertyCard;
