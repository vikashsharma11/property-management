import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminPropertyManagement.css';

const AdminPropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ name: '', price: '', location: '', amenities: '', img: null });
  const [editingProperty, setEditingProperty] = useState(null);
  const [updatedProperty, setUpdatedProperty] = useState({ name: '', price: '', location: '', amenities: '', img: null });

  // Fetch properties when the component loads
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.get('https://x3-sj4b.onrender.com/api/properties', {
        headers: { Authorization: `Bearer ${token}` }, // Send token with the request
      });
      setProperties(response.data);
    };
    fetchProperties();
  }, []);

  // Add a new property
  const addProperty = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProperty.name);
    formData.append('price', newProperty.price);
    formData.append('location', newProperty.location);
    formData.append('amenities', newProperty.amenities);
    formData.append('img', newProperty.img);

    try {
      const token = localStorage.getItem('token');  // Retrieve token
      const response = await axios.post('https://x3-sj4b.onrender.com/api/properties', formData, {
        headers: { Authorization: `Bearer ${token}` },  // Send token with the request
      });
      setProperties([...properties, response.data.property]);
      alert('Property added successfully!');
      setNewProperty({ name: '', price: '', location: '', amenities: '', img: null });
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  // Delete a property
  const deleteProperty = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://x3-sj4b.onrender.com/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },  // Send token with the request
      });
      setProperties(properties.filter((property) => property._id !== id)); // Remove deleted property from the state
      alert('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  // Start editing a property
  const startEditProperty = (property) => {
    setEditingProperty(property._id);
    setUpdatedProperty({
      name: property.name,
      price: property.price,
      location: property.location,
      amenities: property.amenities.join(', '),  // Convert array back to string for input
      img: null,
    });
  };

  // Update a property
  const updateProperty = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', updatedProperty.name);
    formData.append('price', updatedProperty.price);
    formData.append('location', updatedProperty.location);
    formData.append('amenities', updatedProperty.amenities);
    if (updatedProperty.img) formData.append('img', updatedProperty.img);  // Only update the image if a new one is provided

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://x3-sj4b.onrender.com/api/properties/${editingProperty}`, formData, {
        headers: { Authorization: `Bearer ${token}` },  // Send token with the request
      });
      setProperties(
        properties.map((property) => (property._id === editingProperty ? response.data.property : property))
      );
      setEditingProperty(null);
      alert('Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({ ...newProperty, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewProperty({ ...newProperty, img: e.target.files[0] });
  };

  const handleUpdatedInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProperty({ ...updatedProperty, [name]: value });
  };

  const handleUpdatedFileChange = (e) => {
    setUpdatedProperty({ ...updatedProperty, img: e.target.files[0] });
  };

  return (
    <div className="admin-property-management">
      <h2>Manage Properties</h2>

      {/* Add Property Form */}
      <form onSubmit={addProperty} encType="multipart/form-data" className="property-form">
        <input type="text" name="name" placeholder="Property Name" value={newProperty.name} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="Price" value={newProperty.price} onChange={handleInputChange} required />
        <input type="text" name="location" placeholder="Location" value={newProperty.location} onChange={handleInputChange} required />
        <input type="text" name="amenities" placeholder="Amenities (comma-separated)" value={newProperty.amenities} onChange={handleInputChange} required />
        <input type="file" name="img" onChange={handleFileChange} required />
        <button type="submit">Add Property</button>
      </form>

      {/* Edit Property Form */}
      {editingProperty && (
        <form onSubmit={updateProperty} encType="multipart/form-data" className="property-form">
          <input type="text" name="name" placeholder="Property Name" value={updatedProperty.name} onChange={handleUpdatedInputChange} required />
          <input type="number" name="price" placeholder="Price" value={updatedProperty.price} onChange={handleUpdatedInputChange} required />
          <input type="text" name="location" placeholder="Location" value={updatedProperty.location} onChange={handleUpdatedInputChange} required />
          <input type="text" name="amenities" placeholder="Amenities (comma-separated)" value={updatedProperty.amenities} onChange={handleUpdatedInputChange} required />
          <input type="file" name="img" onChange={handleUpdatedFileChange} />
          <button type="submit">Update Property</button>
        </form>
      )}

      {/* Display Properties */}
      <ul>
        {properties.map((property) => (
          <li key={property._id}>
            <p>{property.name} - ${property.price} - {property.location}</p>
            <p>Amenities: {property.amenities.join(', ')}</p>
            <button onClick={() => startEditProperty(property)}>Edit</button>
            <button onClick={() => deleteProperty(property._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPropertyManagement;
