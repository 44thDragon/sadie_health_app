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
  const [recentFoodEntry, setRecentFoodEntry] = useState(null);
  const [recentGlucoseReadings, setRecentGlucoseReadings] = useState([]);
  const [mostRecentInsulin, setMostRecentInsulin] = useState(null); // Added state for most recent insulin entry
  const [insulinUnits, setInsulinUnits] = useState(''); // Added state for insulin units

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
          setRecentFoodEntry(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching recent food entry:', error);
      }
    }

    async function fetchMostRecentInsulin() {
      try {
        const response = await axios.get('/api/insulin/most-recent'); // Replace with your actual API endpoint
        if (response.data) {
          setMostRecentInsulin(response.data);
        }
      } catch (error) {
        console.error('Error fetching most recent insulin entry:', error);
      }
    }

    fetchRecentGlucoseReadings();
    fetchMostRecentGlucose();
    fetchRecentFoodEntry();
    fetchMostRecentInsulin(); // Fetch the most recent insulin entry
  }, []);

  const handleGlucoseChange = (event) => {
    setGlucoseReading(event.target.value);
  };

  const handleFoodOptionClick = (value) => {
    setFoodSameAsYesterday(value);
    setChangedField(null);

    if (value === 'no' && changedField === 'servingSize') {
      setFoodChangeDescription(recentFoodEntry.serving_size);
    } else {
      setFoodChangeDescription('');
    }
  };

  const handleChangedFieldClick = (field) => {
    setChangedField(field);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const currentDatetime = new Date();
      const petName = 'Sadie';
      const servedAt = currentDatetime;

      let requestData = {
        glucose_reading: glucoseReading,
        dt_stamp: currentDatetime,
        pet_name: petName,
        food: {
          served_at: servedAt,
        },
        insulin: {
          insulin_brand: mostRecentInsulin?.insulin_brand || '',
          units: insulinUnits,
          administered_on: currentDatetime,
        },
      };

      if (changedField === 'food') {
        requestData.food.brand = foodChangeDescription;
        requestData.food.serving_size = recentFoodEntry.serving_size;
      } else if (changedField === 'servingSize') {
        requestData.food.brand = recentFoodEntry.brand;
        requestData.food.serving_size = foodChangeDescription;
      } else if (foodSameAsYesterday === 'yes') {
        requestData.food.brand = recentFoodEntry.brand;
        requestData.food.serving_size = recentFoodEntry.serving_size;
      }

      const response = await axios.post('/api/glucose-readings/submit', requestData);

      if (response.status === 201) {
        alert('Glucose reading and food data stored successfully');
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

        const foodResponse = await axios.get('/api/food/most-recent');
        if (foodResponse.data) {
          setRecentFoodEntry(foodResponse.data);
        }

        setGlucoseReading('');
        setFoodChangeDescription('');
        setChangedField(null);
        setFoodSameAsYesterday(null);

        // Clear insulin input after submission
        setInsulinUnits('');
        setMostRecentInsulin(null);
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
              />{' '}
              mg/dl
            </div>

            <div className="question-container">
              {recentFoodEntry && (
                <p>The previous meal was {recentFoodEntry.serving_size}G of {recentFoodEntry.brand}, is this the same?</p>
              )}
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

            {mostRecentInsulin && foodSameAsYesterday === 'no' && (
              <div className="insulin-units">
                <label>Insulin units (U): </label>
                <input
                  type="number"
                  value={insulinUnits}
                  onChange={(event) => setInsulinUnits(event.target.value)}
                  min="0"
                  required
                />
              </div>
            )}

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
