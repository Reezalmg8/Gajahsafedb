// src/components/TotalSightings.js

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Correct import path for Firestore
import { firestore } from '../firebase/firebase'; // Adjust import path based on your actual setup
import { Typography, Card, CardContent } from '@mui/material';

const TotalSightings = () => {
  const [totalSightings, setTotalSightings] = useState(0);

  useEffect(() => {
    const fetchTotalSightings = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'reports'));
        setTotalSightings(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching total sightings:', error);
      }
    };
    fetchTotalSightings();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Total Sightings</Typography>
        <Typography variant="h2">{totalSightings}</Typography>
      </CardContent>
    </Card>
  );
};

export default TotalSightings;
