import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';


const AnalyticsTable = ({ analytics }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Score</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Rated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analytics.map((rating, index) => (
            <TableRow key={index}>
              <TableCell>{rating.score}</TableCell>
              <TableCell>{rating.rater.gender}</TableCell>
              <TableCell>{rating.rater.age}</TableCell>
              <TableCell>{rating.rater.city}</TableCell>
              <TableCell>{new Date(rating.ratedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnalyticsTable;
