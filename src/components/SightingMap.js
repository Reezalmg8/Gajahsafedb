// src/components/SightingMap.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Card, CardContent, Typography } from '@mui/material';

const SightingMap = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'reports'));
      const reportsData = querySnapshot.docs.map((doc) => doc.data());
      setReports(reportsData);
    };

    fetchReports();
  }, []);

  const containerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 0, // default center, update accordingly
    lng: 0
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Reported Locations</Typography>
        <LoadScript googleMapsApiKey="AIzaSyBM9c47J86uYl4dYw0NdwWdmE7BrwQ4xIc">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
          >
            {reports.map((report, index) => (
              <Marker
                key={index}
                position={{
                  lat: report.location.latitude,
                  lng: report.location.longitude
                }}
                title={`Reported Sighting - ${report.animalSpotted}`}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </CardContent>
    </Card>
  );
};

export default SightingMap;
