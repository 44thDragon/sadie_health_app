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
    const { brand, serving_size, served_at } = req.body;
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
      }
    })
});

module.exports = router;