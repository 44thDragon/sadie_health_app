// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const glucoseReadingsRoutes = require('./routes/glucoseReadings');
const insulinRoutes = require('./routes/insulin');
const dbConnection = require('./dbConnection');
const FoodRoutes = require('./routes/food');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/glucose-readings', glucoseReadingsRoutes);
app.use('/api/insulin', insulinRoutes); // Use insulin routes
app.use('/api/food', FoodRoutes); // Use food routes


// New route for most recent insulin reading
app.get('/api/insulin/most-recent', (req, res) => {
  const query = `
    SELECT units, insulin_brand
    FROM insulin
    ORDER BY administered_on DESC
    LIMIT 1
  `;


  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching most recent glucose reading:', error);
      res.status(500).json({ message: 'An error occurred' });
    } else {
      if (results.length > 0) {
        const mostRecentReading = results[0];
        res.status(200).json(mostRecentReading);
      } else {
        res.status(404).json({ message: 'No glucose readings found' });
      }
    }
  });
});


// New route for most recent glucose reading
app.get('/api/glucose-readings/most-recent', (req, res) => {
  const query = `
    SELECT glucose_reading, dt_stamp
    FROM glucose_readings
    ORDER BY dt_stamp DESC
    LIMIT 1
  `;


  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching most recent glucose reading:', error);
      res.status(500).json({ message: 'An error occurred' });
    } else {
      if (results.length > 0) {
        const mostRecentReading = results[0];
        res.status(200).json(mostRecentReading);
      } else {
        res.status(404).json({ message: 'No glucose readings found' });
      }
    }
  });
});


app.get('/api/glucose-readings/all', (req, res) => {
  const query = `
    SELECT glucose_reading, dt_stamp
    FROM glucose_readings
    ORDER BY dt_stamp ASC
  `;
  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching all glucose readings:', error);
      res.status(500).json({ message: 'An error occurred' });
    } else {
      res.status(200).json(results); // Return the array of glucose readings
    }
  });
});

app.get('/api/food/all', (req, res) => {
  const query = `
    SELECT id,brand, serving_size, served_at
    FROM pet_food
    ORDER BY served_at DESC
    LIMIT 25
  `;

  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching all food entries:', error);
      res.status(500).json({ message: 'An error occurred' });
    } else {
      res.status(200).json(results);
    }
  });
});

// New route for most recent food brand and serving size
app.get('/api/food/most-recent', (req, res) => {
  const query = `
    SELECT brand, serving_size
    FROM pet_food
    ORDER BY created_at DESC
    LIMIT 1
  `;


  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching most recent glucose reading:', error);
      res.status(500).json({ message: 'An error occurred' });
    } else {
      if (results.length > 0) {
        const mostRecentReading = results[0];
        res.status(200).json(mostRecentReading);
      } else {
        res.status(404).json({ message: 'No glucose readings found' });
      }
    }
  });
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
