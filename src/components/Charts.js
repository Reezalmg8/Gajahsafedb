import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts';

const Charts = ({ dataForPieChart, dataForBarChart, dataForLineChart, chartType }) => {
  const getAnimalColor = (animal) => {
    switch (animal) {
      case 'Elephant':
        return 'gray';
      case 'Monkey':
        return 'brown';
      case 'Tiger':
        return 'orange';
      case 'Crocodile':
        return 'green';
      default:
        return '#8884d8'; // Default color for other animals
    }
  };

  if (chartType === 'bar' || !chartType) {
    return (
      <BarChart width={600} height={300} data={dataForBarChart}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="count">
          {dataForBarChart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getAnimalColor(entry.name)} />
          ))}
        </Bar>
      </BarChart>
    );
  }

  if (chartType === 'pie') {
    return (
      <PieChart width={400} height={400} margin={{ left: 80 }}>
        <Pie
          data={dataForPieChart}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {dataForPieChart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getAnimalColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  if (chartType === 'line') {
    return (
      <LineChart width={600} height={300} data={dataForLineChart}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="reportedValue" stroke="#8884d8" />
      </LineChart>
    );
  }

  return null;
};

export default Charts;
