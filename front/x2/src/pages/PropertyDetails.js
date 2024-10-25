import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/PropertyDetails.css';
import PanoramaViewer from '../components/PanoramaViewer';  // Import the PanoramaViewer component

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [showVR, setShowVR] = useState(false);  // State to toggle VR mode

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://x3-sj4b.onrender.com/api/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };
    fetchProperty();
  }, [id]);

  if (!property) return <div>Loading...</div>;

  const imageUrl = `https://x3-sj4b.onrender.com/${property.img}`;  // Use the image URL from the property data

  return (
    <div className="property-details">
      <img
        src={imageUrl}
        alt={property.name}
        className="property-details-image"
      />
      <h1>{property.name}</h1>
      <p>{property.location}</p>
      <p>Price: ₹{property.price}</p>
      <p>{property.description}</p>
      <p>Amenities: {property.amenities.join(', ')}</p>

      <Link to={`/booking/${property._id}`} className="book-now">Book Now</Link>

      {/* VR Mode */}
      <div className="vr-mode">
        <button onClick={() => setShowVR(!showVR)}>
          {showVR ? 'Exit VR Mode' : 'View in VR'}
        </button>
        {showVR && (
          <div className="panorama-container">
            {/* Pass the same image URL for VR mode */}
            <PanoramaViewer imageUrl={imageUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
