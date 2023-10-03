// routes/food.js
const express = require('express');
const router = express.Router();
const dbConnection = require('../dbConnection');


// Define the route for submitting a glucose reading
router.post('/submit', (req, res) => {
    if (!req.body) {
        console.log("here")
        console.log(req.body)
        // If the 'food' object is missing, return an error response
        return res.status(400).json({ error: 'Food data is missing from the request body' });
      }
    const { brand, serving_size, served_at, remaining } = req.body;
    const foodQuery = 'INSERT INTO pet_food (brand, serving_size, served_at, remaining) VALUES (?, ?, ?, ?)';
    const foodValues = [brand, serving_size, served_at, remaining];

    // Insert food data into the pet_food table
    dbConnection.query(foodQuery, foodValues, (foodError, foodResults) => {
      if (foodError) {
        console.error('Error storing food data:', foodError);
        // Handle the error as needed
        res.status(500).json({ error: 'An error occurred while storing food data' });
      } else {
        console.log('Food data stored successfully');
      }
    })
});



router.put('/update-remaining', (req, res) => {
    const { remaining } = req.body;
    petFood.remaining = remaining;
    res.sendStatus(204); // Success, no content
  });


// Define the route for retrieving the most recent insulin entry
router.get('/remaining-most-recent', (req, res) => {
    const query = `
      SELECT remaining, serving_size
      FROM pet_food
      ORDER BY served_at DESC
      LIMIT 1
    `;
  
    dbConnection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching most recent insulin entry:', error);
        res.status(500).json({ message: 'An error occurred' });
      } else {
        if (results.length > 0) {
          const mostRecentInsulinEntry = results[0];
          res.status(200).json(mostRecentInsulinEntry);
        } else {
          res.status(404).json({ message: 'No insulin entries found' });
        }
      }
    });
  });



module.exports = router;