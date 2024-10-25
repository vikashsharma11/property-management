import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import '../css/PropertyList.css';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '', availability: '' });

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await axios.get('https://x3-sj4b.onrender.com/api/properties');
      setProperties(response.data);
    };
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredProperties = properties.filter(property => {
    const matchName = property.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = filters.location === '' || property.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchPrice = (filters.minPrice === '' || property.price >= filters.minPrice) &&
                       (filters.maxPrice === '' || property.price <= filters.maxPrice);
    const matchAvailability = filters.availability === '' || property.availability === (filters.availability === 'available');
    
    return matchName && matchLocation && matchPrice && matchAvailability;
  });

  return (
    <div className="property-list">
      <h1>Available Properties</h1>
      <input type="text" placeholder="Search by name" value={searchTerm} onChange={handleSearch} />
      
      {/* Filters */}
      <div className="filters">
        <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} />
        <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} />
        <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />
        <select name="availability" value={filters.availability} onChange={handleFilterChange}>
          <option value="">Availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <ul>
        {filteredProperties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
