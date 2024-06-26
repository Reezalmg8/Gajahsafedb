import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Card, CardContent, Typography } from '@mui/material';

const SightingChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {};
        const querySnapshot = await getDocs(collection(firestore, 'reports'));

        querySnapshot.forEach((doc) => {
          const createdAtTimestamp = doc.data().createdAt; // Assuming 'createdAt' is the timestamp field
          
          if (createdAtTimestamp) {
            const createdAtMillis = createdAtTimestamp.toMillis(); // Safely access 'toMillis'
            const animal = doc.data().animalSpotted;

            if (animal in data) {
              data[animal] += 1;
            } else {
              data[animal] = 1;
            }
          } else {
            console.warn('createdAtTimestamp is null or undefined for document:', doc.id);
          }
        });

        setChartData({
          labels: Object.keys(data),
          datasets: [
            {
              label: 'Animal Sightings',
              data: Object.values(data),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Animal Sightings</Typography>
        <Bar data={chartData} />
      </CardContent>
    </Card>
  );
};

export default SightingChart;
