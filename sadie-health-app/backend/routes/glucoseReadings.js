// routes/glucoseReadings.js
const express = require('express');
const router = express.Router();
const dbConnection = require('../dbConnection');

// Define the route for submitting a glucose reading
router.post('/submit', (req, res) => {
  const { glucose_reading, dt_stamp, pet_name } = req.body;

  const query = 'INSERT INTO glucose_readings (glucose_reading, dt_stamp, pet_name) VALUES (?, ?, ?)';
  const values = [glucose_reading, dt_stamp, pet_name];

  dbConnection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error storing glucose reading:', error);
      res.status(500).json({ error: 'An error occurred while storing glucose reading' });
    } else {
      console.log('Glucose reading stored successfully');
      res.status(201).json({ message: 'Glucose reading stored successfully' });
    }
  });
});

module.exports = router;
