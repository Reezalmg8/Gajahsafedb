// MapPage.js

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { fetchReports } from './firebaseService'; // Ensure this path is correct
import { FormControl, InputLabel, Select, MenuItem, Container } from '@mui/material';

// Importing local icons
import crocsIcon from '../assets/crocs.png';
import elephantIcon from '../assets/elephant.png';
import monkeyIcon from '../assets/monkey.png';
import tigerIcon from '../assets/tiger.png';
import othersIcon from '../assets/others.png';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 4.2105, // Center of Malaysia
  lng: 101.9758
};

// Mapping animal types to their corresponding icons
const iconUrls = {
  Crocodile: crocsIcon,
  Elephant: elephantIcon,
  Monkey: monkeyIcon,
  Tiger: tigerIcon,
  // Use the "others.png" icon for all other animals
  Default: othersIcon,
};

const MapPage = () => {
  const [reports, setReports] = useState([]);
  const [animalFilter, setAnimalFilter] = useState('All');

  useEffect(() => {
    const getReports = async () => {
      try {
        const data = await fetchReports();
        console.log('Fetched Reports:', data); // Debugging: Check fetched data
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    getReports();
  }, []);

  const handleAnimalFilterChange = (event) => {
    setAnimalFilter(event.target.value);
  };

  const filteredReports = animalFilter === 'All' ? reports : reports.filter(report => report.animalSpotted === animalFilter);

  const animalTypes = ['All', ...new Set(reports.map(report => report.animalSpotted))];

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <h1>Map Page</h1>
      <Container style={{ marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel>Animal Type</InputLabel>
          <Select
            value={animalFilter}
            onChange={handleAnimalFilterChange}
            label="Animal Type"
          >
            {animalTypes.map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>
      <LoadScript googleMapsApiKey="AIzaSyBM9c47J86uYl4dYw0NdwWdmE7BrwQ4xIc">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
        >
          {filteredReports.map((report) => {
            // Use the corresponding icon, or fall back to the default icon
            const iconUrl = iconUrls[report.animalSpotted] || iconUrls.Default;
            return (
              <Marker
                key={report.id}
                position={{ lat: report.latitude, lng: report.longitude }}
                title={report.animalSpotted}
                icon={{
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapPage;
