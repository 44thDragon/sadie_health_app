// routes/glucoseReadings.js
const express = require('express');
const router = express.Router();
const dbConnection = require('../dbConnection');

// Define the route for submitting a glucose reading
router.post('/submit', (req, res) => {
  const { glucose_reading, dt_stamp, pet_name } = req.body;

  // Check if food brand data is provided
  if (req.body.food) {
    const { brand, serving_size, served_at } = req.body.food;
    const foodQuery = 'INSERT INTO pet_food (brand, serving_size, served_at) VALUES (?, ?, ?)';
    const foodValues = [brand, serving_size, served_at];

    // Insert food data into the pet_food table
    dbConnection.query(foodQuery, foodValues, (foodError, foodResults) => {
      if (foodError) {
        console.error('Error storing food data:', foodError);
        // Handle the error as needed
        res.status(500).json({ error: 'An error occurred while storing food data' });
      } else {
        console.log('Food data stored successfully');
        // Continue with inserting glucose reading data
        const glucoseQuery = 'INSERT INTO glucose_readings (glucose_reading, dt_stamp, pet_name) VALUES (?, ?, ?)';
        const glucoseValues = [glucose_reading, dt_stamp, pet_name];

        // Insert glucose reading data into the glucose_readings table
        dbConnection.query(glucoseQuery, glucoseValues, (glucoseError, glucoseResults) => {
          if (glucoseError) {
            console.error('Error storing glucose reading:', glucoseError);
            // Handle the error as needed
            res.status(500).json({ error: 'An error occurred while storing glucose reading' });
          } else {
            console.log('Glucose reading stored successfully');
            res.status(201).json({ message: 'Glucose reading and food data stored successfully' });
          }
        });
      }
    });
  } else {
    // If no food data is provided, only insert glucose reading data
    const glucoseQuery = 'INSERT INTO glucose_readings (glucose_reading, dt_stamp, pet_name) VALUES (?, ?, ?)';
    const glucoseValues = [glucose_reading, dt_stamp, pet_name];

    dbConnection.query(glucoseQuery, glucoseValues, (glucoseError, glucoseResults) => {
      if (glucoseError) {
        console.error('Error storing glucose reading:', glucoseError);
        // Handle the error as needed
        res.status(500).json({ error: 'An error occurred while storing glucose reading' });
      } else {
        console.log('Glucose reading stored successfully');
        res.status(201).json({ message: 'Glucose reading stored successfully' });
      }
    });
  }

  





});

module.exports = router;
