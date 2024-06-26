// Dashboard.js

import React, { useState, useEffect } from 'react';
import { Container, Drawer, List, ListItem, ListItemText, Divider, Toolbar, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Switch, FormControlLabel, Paper } from '@mui/material';
import '../css/fonts.css'; // Adjust the path as per your project structure
import GajahsafeImg from '../assets/GajahSafeLogo1.png'; // Adjust path and filename as needed
import Charts from './Charts';
import ReportsTable from './ReportsTable';
import Statistic from './Statistic'; // Import Statistic component
import MapPage from './MapPage'; // Import MapPage component
import { fetchReports } from './firebaseService'; // Adjust path as needed
import DashboardIcon from '../assets/dashboard.png';
import ReportsIcon from '../assets/report2.png';
import StatisticIcon from '../assets/charts.png';
import SettingsIcon from '../assets/settings.png';
import MapIcon from '../assets/markermap.png'; // Add map icon import

const drawerWidth = 250; // Width of the sidebar drawer

const Dashboard = ({ darkMode, setDarkMode }) => {
  const [reports, setReports] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard'); // State to track selected menu item

  useEffect(() => {
    // Fetch reports data on component mount
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

  // Function to calculate animal counts
  const calculateAnimalCounts = () => {
    return reports.reduce((acc, report) => {
      acc[report.animalSpotted] = (acc[report.animalSpotted] || 0) + 1;
      return acc;
    }, {});
  };

  // Calculate total sightings
  const getTotalSightings = () => {
    const animalCounts = calculateAnimalCounts();
    return Object.values(animalCounts).reduce((acc, count) => acc + count, 0);
  };

  // Calculate top sightings
  const calculateTopSightings = () => {
    const animalCounts = calculateAnimalCounts();
    return Object.entries(animalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([animal, count]) => ({ animal, count }));
  };

  // Prepare data for bar chart
  const prepareDataForBarChart = () => {
    const animalCounts = calculateAnimalCounts();
    return Object.entries(animalCounts).map(([name, count]) => ({
      name,
      count,
    }));
  };

  // Function to handle menu item clicks
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    // Additional logic based on selected menu item (if needed)
  };

  // Function to get recent reports sorted by date (most recent first)
  const getRecentReports = () => {
    // Sort reports by timestamp in descending order (most recent first)
    const sortedReports = reports.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sortedReports.slice(0, 3); // Adjust the number as needed
  };

  return (
    <Container style={{ display: 'flex', maxWidth: '100%', padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          {/* Logo */}
          <img src={GajahsafeImg} alt="Gajahsafe Logo" style={{ width: '100%', padding: '10px' }} />
        </Toolbar>
        <Divider />
        {/* Menu Items */}
        <List>
          {[
            { label: 'Dashboard', icon: DashboardIcon },
            { label: 'Map', icon: MapIcon }, // Moved Map to be second in the menu
            { label: 'Reports', icon: ReportsIcon },
            { label: 'Statistic', icon: StatisticIcon },
            { label: 'Settings', icon: SettingsIcon },
          ].map((menuItem) => (
            <ListItem
              button
              key={menuItem.label}
              selected={selectedMenuItem === menuItem.label}
              onClick={() => handleMenuItemClick(menuItem.label)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'lightcoral', // Light red color when active
                  fontStyle: 'italic',
                  fontWeight: 'bold', // Adjusted to make it bolder
                },
                fontWeight: 'bold', // Added to make all items bolder
              }}
            >
              <img src={menuItem.icon} alt={menuItem.label} style={{ width: 24, marginRight: 10 }} />
              <ListItemText primary={menuItem.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowX: 'auto', padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
        {/* Toolbar */}
        <Toolbar>
          <Typography variant="h4" gutterBottom>
            {selectedMenuItem}
          </Typography>
        </Toolbar>

        {/* Content based on selected menu item */}
        {selectedMenuItem === 'Dashboard' && (
          <Grid container spacing={3} style={{ marginBottom: 20 }}>
            <Grid item xs={12}>
              <Typography variant="h6" align="left">
                Overview
              </Typography>
            </Grid>
            <Grid container spacing={2} style={{ padding: '10px' }}>
              {/* Card for total sightings */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ border: '1px solid red' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom align="center">
                      Total Sightings
                    </Typography>
                    <Typography variant="body1" align="center">
                      {getTotalSightings()} {/* Display total sightings */}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Cards for individual animal sightings */}
              {Object.entries(calculateAnimalCounts()).map(([animal, count]) => (
                <Grid item key={animal} xs={12} sm={6} md={4}>
                  <Card sx={{ border: '1px solid red' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom align="center">
                        {animal}
                      </Typography>
                      <Typography variant="body1" align="center">
                        Total Sightings: {count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* Bar Chart */}
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                Bar Chart of Animal Sightings
              </Typography>
              <Charts dataForBarChart={prepareDataForBarChart()} chartType="bar" />
            </Grid>
            {/* Top Sightings */}
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                Top Sightings
              </Typography>
              <Table component={Paper} sx={{ marginBottom: '20px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Animal</strong></TableCell>
                    <TableCell align="right"><strong>Count</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calculateTopSightings().map((sighting) => (
                    <TableRow key={sighting.animal}>
                      <TableCell component="th" scope="row">
                        {sighting.animal}
                      </TableCell>
                      <TableCell align="right">{sighting.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            {/* Recently Reported */}
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                Recently Reported
              </Typography>
              <Table component={Paper} sx={{ marginBottom: '20px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>User Name</strong></TableCell>
                    <TableCell><strong>Latitude</strong></TableCell>
                    <TableCell><strong>Longitude</strong></TableCell>
                    <TableCell><strong>Image</strong></TableCell>
                    <TableCell><strong>Animal Spotted</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getRecentReports().map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.userName}</TableCell>
                      <TableCell>{report.latitude}</TableCell>
                      <TableCell>{report.longitude}</TableCell>
                      <TableCell>
                        <img src={report.image} alt="Report" style={{ maxWidth: '100px' }} />
                      </TableCell>
                      <TableCell>{report.animalSpotted}</TableCell>
                      <TableCell>{new Date(report.timestamp).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        )}

        {/* Table for Reports */}
        {selectedMenuItem === 'Reports' && <ReportsTable />}

        {/*/* Statistics Charts */}
        {selectedMenuItem === 'Statistic' && <Statistic />}

        {/* Map Page */}
        {selectedMenuItem === 'Map' && <MapPage />}

        {/* Placeholder for Settings */}
        {selectedMenuItem === 'Settings' && (
          <div>
            <Typography variant="body1" align="left">
              Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(event) => setDarkMode(event.target.checked)}
                  name="darkMode"
                  color="primary"
                />
              }
              label="Dark Mode"
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
