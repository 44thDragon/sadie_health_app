import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [glucoseReading, setGlucoseReading] = useState('');
  const [foodSameAsYesterday, setFoodSameAsYesterday] = useState(null);
  const [changedField, setChangedField] = useState(null);
  const [mostRecentGlucose, setMostRecentGlucose] = useState(null);
  const [foodChangeDescription, setFoodChangeDescription] = useState('');
  const [glucoseData, setGlucoseData] = useState({
    food: {
      serving_size: '215', // Initial value for serving_size
      timestamp: new Date().toISOString(), // Current timestamp
    },
  });
  const [recentFoodEntry, setRecentFoodEntry] = useState(null); // Added state for recent food entry
  const [insulinDose, setInsulinDose] = useState('');
  const [mostRecentInsulin, setMostRecentInsulin] = useState(null);
  // Assuming served_at is a Unix timestamp

  useEffect(() => {
    async function fetchMostRecentGlucose() {
      try {
        const response = await axios.get('/api/glucose-readings/most-recent');
        if (response.data) {
          setMostRecentGlucose(response.data);
        }
      } catch (error) {
        console.error('Error fetching most recent glucose reading:', error);
      }
    }

    async function fetchRecentGlucoseReadings() {
      try {
        const response = await axios.get('/api/glucose-readings/all');
        if (response.data) {
          setRecentGlucoseReadings(response.data.reverse());
        }
      } catch (error) {
        console.error('Error fetching recent glucose readings:', error);
      }
    }

    async function fetchRecentFoodEntry() {
      try {
        const response = await axios.get('/api/food/all');
        if (response.data && response.data.length > 0) {
          setRecentFoodEntry(response.data[0]); // Get the most recent food entry
        }
      } catch (error) {
        console.error('Error fetching recent food entry:', error);
      }
    }

    async function fetchMostRecentInsulin() {
      try {
        const response = await axios.get('/api/insulin/most-recent');
        if (response.data) {
          setMostRecentInsulin(response.data);
        }
      } catch (error) {
        console.error('Error fetching most recent insulin entry:', error);
      }
    }


    fetchRecentGlucoseReadings();
    fetchMostRecentGlucose();
    fetchRecentFoodEntry(); // Fetch the most recent food entry
    fetchMostRecentInsulin() 

  }, []);

  const handleGlucoseChange = (event) => {
    setGlucoseReading(event.target.value);
  };

  const handleFoodOptionClick = (value) => {
    if (foodSameAsYesterday === value) {
      setFoodSameAsYesterday(null); // Toggle off if already active
    } else {
      setFoodSameAsYesterday(value); // Toggle on if not active
    }
  
    setChangedField(null);
    if (value === 'no' && changedField === 'servingSize') {
      setFoodChangeDescription(recentFoodEntry.brand);
    } else {
      setFoodChangeDescription('');
    }
  };
  

  const handleChangedFieldClick = (field) => {
    setChangedField(field);
  };

  const [recentGlucoseReadings, setRecentGlucoseReadings] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const currentDatetime = new Date();
      const petName = 'Sadie';
      const servedAt = currentDatetime;

      // Prepare the data to be sent to the server
      let requestData = {
        glucose_reading: glucoseReading,
        dt_stamp: currentDatetime,
        pet_name: petName,
        food: {
          served_at: servedAt,
        },
        units: {},
      };

      if (changedField === 'food') {
        // User selected "Food"
        requestData.food.brand = foodChangeDescription;
        requestData.food.serving_size = recentFoodEntry.serving_size;
      } else if (changedField === 'servingSize') {
        // User selected "Serving Size"
        requestData.food.brand = recentFoodEntry.brand;
        requestData.food.serving_size = foodChangeDescription;
      } else if (foodSameAsYesterday === 'yes') {
        // Include recentFoodEntry.brand and serving_size if they select "Yes"
        requestData.food.brand = recentFoodEntry.brand;
        requestData.food.serving_size = recentFoodEntry.serving_size;
      }

      const response = await axios.post('/api/glucose-readings/submit', requestData);

      setInsulinDose('');

      // Make an additional POST request to save insulin dose data
      const insulinResponse = await axios.post('/api/insulin/submit', {
        units: insulinDose,
        insulin_brand: "Novolin",
        administered_on: currentDatetime,
        needle: "U100"
        // Include any other relevant data for the insulin submission
      });
      requestData.units.insulin_dose = insulinDose;
      // Handle the insulin dose response as needed
      if (insulinResponse.status === 201) {
        // The insulin dose data was successfully saved
        // You can update your UI or perform any other actions here
        alert('Insulin dose data saved successfully.');
        setInsulinDose('');
        // If needed, trigger additional actions or state updates
      } else {
        // Handle any errors or show an error message
        alert('Error saving insulin dose data.');
        console.error('Error response:', insulinResponse);
        // You can decide how to handle errors based on your app's requirements
      }
      if (response.status === 201) {
        alert('Glucose reading and food data stored successfully');
        // Update the recentGlucoseReadings state with the new reading
        setRecentGlucoseReadings([
          {
            glucose_reading: glucoseReading,
            dt_stamp: currentDatetime.toISOString(),
          },
          ...recentGlucoseReadings,
        ]);
        setMostRecentGlucose({
          glucose_reading: glucoseReading,
          dt_stamp: currentDatetime,
        });

        // Fetch the latest serving_size and brand
        const foodResponse = await axios.get('/api/food/most-recent'); // Replace with your actual API endpoint

        if (foodResponse.data) {
          // Update recentFoodEntry with the latest data
          setRecentFoodEntry(foodResponse.data);
        }

        // Clear fields if needed
        setGlucoseReading('');
        setFoodChangeDescription('');
        setChangedField(null);
        setFoodSameAsYesterday(null);

      } else {
        alert('An error occurred while storing glucose reading');
      }
    } catch (error) {
      alert('An error occurred while storing glucose reading');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">
          <span className="health-text">Welcome to Sadie Health</span>
        </h1>
      </header>
      <main className="App-main">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="label-container">
              <label>What was Sadie's glucose reading?</label>
              <input
                type="number"
                value={glucoseReading}
                onChange={handleGlucoseChange}
                min="0"
                max="600"
                required
              /> mg/dl
            </div>

            <div className="question-container">
              {recentFoodEntry && (
                <p>The previous meal was {recentFoodEntry.serving_size}G of {recentFoodEntry.brand}, is this the same?</p>)}
              <div className="options-container">
              <button
                id="yes-button"
                type="button"
                className={`option-button ${foodSameAsYesterday === 'yes' ? 'active-button' : ''}`}
                onClick={() => handleFoodOptionClick('yes')}
              >
                Yes
              </button>
              <button
                id="no-button"
                type="button"
                className={`option-button ${foodSameAsYesterday === 'no' ? 'active-button' : ''}`}
                onClick={() => handleFoodOptionClick('no')}
              >
                No
              </button>

              </div>
            </div>

            {foodSameAsYesterday === 'no' && (
              <div className="additional-fields">
                <p>What changed?</p>
                <div className="options-container">
                  <button
                    type="button"
                    className={`option-button ${changedField === 'food' ? 'active-button' : ''}`}
                    onClick={() => handleChangedFieldClick('food')}
                  >
                    Food
                  </button>
                  <button
                    type="button"
                    className={`option-button ${changedField === 'servingSize' ? 'active-button' : ''}`}
                    onClick={() => handleChangedFieldClick('servingSize')}
                  >
                    Serving Size
                  </button>
                </div>
              </div>
            )}

            {changedField === 'food' && (
              <div className="food-change-description">
                <label>Describe the food change: </label>
                <textarea
                  className="food-change-description-input"
                  value={foodChangeDescription}
                  onChange={(event) => {
                    const input = event.target.value.slice(0, 20);
                    setFoodChangeDescription(
                      input
                        .toLowerCase()
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    );
                  }}
                  rows="1"
                  cols="22"
                  required
                />
              </div>
            )}

            {changedField === 'servingSize' && (
              <div className="food-serving-size-change-description">
                <label>Update serving size (grams): </label>
                <textarea
                  className="food-serving-size-description-input"
                  value={foodChangeDescription}
                  onChange={(event) => {
                    const input = event.target.value.slice(0, 20);
                    setFoodChangeDescription(
                      input
                        .toLowerCase()
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    );
                  }}
                  rows="1"
                  cols="8"
                  required
                />
              </div>
            )}
            {mostRecentInsulin && (
            <label>If the insulin dose of {mostRecentInsulin.units} of {mostRecentInsulin.insulin_brand} was not administered, how much was?</label>
            )}
            <input
              type="number"
              value={insulinDose}
              onChange={(event) => setInsulinDose(event.target.value)}
              min="1"
              max="30"
            />

            <button type="submit" className="paw-button">
              <FontAwesomeIcon icon={faPaw} className="paw-icon" /> Submit
            </button>
          </form>
        </div>

        <div className="recent-glucose-container">
          <div className="recent-glucose">
            <div className="glucose-header">
              <p>Recent Glucose Readings:</p>
            </div>
            <ul>
              {recentGlucoseReadings.map((reading, index) => (
                <li key={index} className="glucose-item">
                  <FontAwesomeIcon icon={faPaw} className="paw-list-icon" />
                  {reading.glucose_reading} mg/dl
                  {' '}
                  (Recorded on: {new Date(reading.dt_stamp).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
