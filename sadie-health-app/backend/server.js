// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const glucoseReadingsRoutes = require('./routes/glucoseReadings');
const dbConnection = require('./dbConnection');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/glucose-readings', glucoseReadingsRoutes);

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
