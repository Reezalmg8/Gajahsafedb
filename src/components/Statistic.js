import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Charts from './Charts'; // Import Charts component
import { fetchReports } from './firebaseService'; // Adjust path as needed
import { format, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';

const Statistic = () => {
  const [reports, setReports] = useState([]);
  const [dataForPieChart, setDataForPieChart] = useState([]);
  const [dataForBarChart, setDataForBarChart] = useState([]);
  const [dataForLineChart, setDataForLineChart] = useState([]);
  const [animalFilter, setAnimalFilter] = useState('All');

  useEffect(() => {
    const getReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    getReports();
  }, []);

  useEffect(() => {
    const filterReports = () => {
      let filtered = reports;

      if (animalFilter && animalFilter !== 'All') {
        filtered = filtered.filter(report => report.animalSpotted === animalFilter);
      }

      const animalCounts = filtered.reduce((acc, report) => {
        acc[report.animalSpotted] = (acc[report.animalSpotted] || 0) + 1;
        return acc;
      }, {});

      const pieChartData = Object.entries(animalCounts).map(([animal, count]) => ({
        name: animal,
        value: count,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
      }));

      const barChartData = Object.entries(animalCounts).map(([animal, count]) => ({
        name: animal,
        count,
      }));

      // Prepare data for line chart by month
      const currentDate = new Date();
      const startOfThisYear = new Date(currentDate.getFullYear(), 0, 1);
      const months = eachMonthOfInterval({
        start: startOfThisYear,
        end: currentDate,
      });

      const monthlyReports = months.map(month => {
        const startOfMonthDate = startOfMonth(month);
        const endOfMonthDate = endOfMonth(month);
        const reportsInMonth = filtered.filter(report => {
          const reportDate = new Date(report.timestamp);
          return reportDate >= startOfMonthDate && reportDate <= endOfMonthDate;
        });
        return {
          month: format(month, 'yyyy-MM'),
          reportedValue: reportsInMonth.length,
        };
      });

      setDataForPieChart(pieChartData);
      setDataForBarChart(barChartData);
      setDataForLineChart(monthlyReports);
    };

    filterReports();
  }, [animalFilter, reports]);

  const animalTypes = ['All', ...new Set(reports.map(report => report.animalSpotted))];

  const handleAnimalTypeChange = (event) => {
    setAnimalFilter(event.target.value);
  };

  return (
    <Container style={{ padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <Toolbar>
        <Typography variant="h4" gutterBottom>
          Charts
        </Typography>
      </Toolbar>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Animal Type</InputLabel>
            <Select
              value={animalFilter}
              onChange={handleAnimalTypeChange}
              label="Animal Type"
            >
              {animalTypes.map((type, index) => (
                <MenuItem key={index} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Pie Chart of Animal Sightings
          </Typography>
          <Charts dataForPieChart={dataForPieChart} chartType="pie" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Bar Chart of Animal Sightings
          </Typography>
          <Charts dataForBarChart={dataForBarChart} chartType="bar" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Line Chart of Animal Sightings by Month
          </Typography>
          <Charts dataForLineChart={dataForLineChart} chartType="line" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistic;
