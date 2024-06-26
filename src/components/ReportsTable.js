import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { fetchReports } from './firebaseService'; // Adjust path as needed
import { subDays } from 'date-fns';

const ReportsTable = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [animalFilter, setAnimalFilter] = useState(''); // Default is empty (All)
  const [dateFilter, setDateFilter] = useState('7'); // Default is past 7 days

  useEffect(() => {
    const getReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
        setFilteredReports(data); // Initialize with unfiltered data
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    getReports();
  }, []);

  const animalTypes = ['All', ...new Set(reports.map(report => report.animalSpotted))];

  const filterReports = useCallback(() => {
    let filtered = reports;

    if (animalFilter && animalFilter !== 'All') {
      filtered = filtered.filter(report => report.animalSpotted === animalFilter);
    }

    const now = new Date();
    if (dateFilter === '7') {
      filtered = filtered.filter(report => new Date(report.timestamp) >= subDays(now, 7));
    } else if (dateFilter === '30') {
      filtered = filtered.filter(report => new Date(report.timestamp) >= subDays(now, 30));
    }
    // Add additional date filter options as needed

    setFilteredReports(filtered);
  }, [animalFilter, dateFilter, reports]);

  useEffect(() => {
    filterReports();
  }, [animalFilter, dateFilter, reports, filterReports]);

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Reports
      </Typography>
      <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 20 }}>
        <InputLabel>Animal</InputLabel>
        <Select
          value={animalFilter}
          onChange={(e) => setAnimalFilter(e.target.value)}
          label="Animal"
        >
          {animalTypes.map((type, index) => (
            <MenuItem key={index} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel>Date</InputLabel>
        <Select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          label="Date"
        >
          <MenuItem value="7">Past 7 Days</MenuItem>
          <MenuItem value="30">Past 30 Days</MenuItem>
          <MenuItem value="anytime">Anytime</MenuItem>
          {/* Add more options as needed */}
        </Select>
      </FormControl>
      <TableContainer style={{ maxHeight: 400, overflowY: 'auto', marginTop: 20 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Animal Spotted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.userName}</TableCell>
                <TableCell>{report.latitude}</TableCell>
                <TableCell>{report.longitude}</TableCell>
                <TableCell>
                  <img src={report.image} alt="Report" style={{ maxWidth: '100px' }} />
                </TableCell>
                <TableCell>{report.animalSpotted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReportsTable;
