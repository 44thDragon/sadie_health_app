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

    fetchRecentGlucoseReadings();
    fetchMostRecentGlucose();
    fetchRecentFoodEntry(); // Fetch the most recent food entry
  }, []);

  const handleGlucoseChange = (event) => {
    setGlucoseReading(event.target.value);
  };

  const handleFoodOptionClick = (value) => {
    setFoodSameAsYesterday(value);
    setChangedField(null); // Reset changedField when the option changes
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
      const servingSize = 215;
      const servedAt = currentDatetime;
      // Prepare the data to be sent to the server
      const requestData = {
        glucose_reading: glucoseReading,
        dt_stamp: currentDatetime,
        pet_name: petName,
        food: {
          brand: foodChangeDescription, // Assuming the brand is entered in the description field
          serving_size: servingSize, // Add serving size if needed
          served_at: servedAt
        },
      };

      const response = await axios.post('/api/glucose-readings/submit', requestData);

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
        setGlucoseReading('');
        // Clear foodChangeDescription if needed
        setFoodChangeDescription('');
      } else {
        alert('An error occurred while storing glucose reading');
      }

      // If foodSameAsYesterday is "no" and a description is provided, submit the food change description too
      if (foodSameAsYesterday === 'no' && foodChangeDescription.trim() !== '') {
        // Submit the food change description to the server or perform any required action.
        console.log('Food Change Description:', foodChangeDescription);
        glucoseData.food = {
          serving_size: servingSize, // Assuming servingSize is a state variable
          description: foodChangeDescription,
        };
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
          <span role="img" aria-label="dog-emoji">
            🐾 Woof! Woof!
          </span>
          {' '}
          Welcome to
          {' '}
          <span className="health-text">Sadie Health</span>
        </h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit}>
          {/* Glucose Reading */}
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

          {/* Food Options */}
          <div className="question-container">
            <p>Is the food brand and serving size the same as the previous meal?</p>
            <div className="options-container">
              <button
                type="button"
                className={`option-button ${foodSameAsYesterday === 'yes' ? 'active' : ''}`}
                onClick={() => handleFoodOptionClick('yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`option-button ${foodSameAsYesterday === 'no' ? 'active' : ''}`}
                onClick={() => handleFoodOptionClick('no')}
              >
                No
              </button>
            </div>
          </div>

          {/* Additional Fields */}
          {foodSameAsYesterday === 'no' && (
            <div className="additional-fields">
              <p>What changed?</p>
              <div className="options-container">
                <button
                  type="button"
                  className={`option-button ${changedField === 'food' ? 'active' : ''}`}
                  onClick={() => handleChangedFieldClick('food')}
                >
                  Food
                </button>
                <button
                  type="button"
                  className={`option-button ${changedField === 'servingSize' ? 'active' : ''}`}
                  onClick={() => handleChangedFieldClick('servingSize')}
                >
                  Serving Size
                </button>
              </div>
            </div>
          )}

          {/* Display the text box for food change description */}
          {foodSameAsYesterday === 'no' && (
            <div className="food-change-description">
              <label>Describe the food change:</label>
              <textarea
                value={foodChangeDescription}
                onChange={(event) => setFoodChangeDescription(event.target.value)}
                rows="4"
                cols="50"
                required
              />
            </div>
          )}

          {/* Display the most recent food entry */}
          {recentFoodEntry && (
            <p>Last Food Entry: {recentFoodEntry.serving_size}G of {recentFoodEntry.brand} - {new Date(recentFoodEntry.served_at).toLocaleString()} </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="paw-button">
            <FontAwesomeIcon icon={faPaw} className="paw-icon" /> Submit
          </button>
        </form>

        {/* Recent Glucose Reading */}
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
      </main>
    </div>
  );
}

export default App;
