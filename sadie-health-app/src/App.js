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

   

    fetchMostRecentGlucose();
    
  }, []);
  
  const handleGlucoseChange = (event) => {
    setGlucoseReading(event.target.value);
  };

  const handleFoodOptionClick = (value) => {
    setFoodSameAsYesterday(value);
    setChangedField(null); // Reset changedField when option changes
  };

  const handleChangedFieldClick = (field) => {
    setChangedField(field);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const currentDatetime = new Date();
      const petName = 'Sadie';

      const response = await axios.post('/api/glucose-readings/submit', {
        glucose_reading: glucoseReading,
        dt_stamp: currentDatetime,
        pet_name: petName,
      });

      if (response.status === 201) {
        alert('Glucose reading stored successfully');
        setMostRecentGlucose({
          glucose_reading: glucoseReading,
          dt_stamp: currentDatetime,
        });
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

          {/* Display most recent glucose reading */}
          {mostRecentGlucose && (
            <div className="most-recent">
              <p>Most Recent Glucose Reading:</p>
              <p>{mostRecentGlucose.glucose_reading} mg/dl</p>
              <p>Recorded on: {new Date(mostRecentGlucose.dt_stamp).toLocaleString()}</p>
                  {/* Add console logs here */}
                  {console.log('dt_stamp:', mostRecentGlucose.dt_stamp)}
                  {console.log('Converted date:', new Date(mostRecentGlucose.dt_stamp))}
            </div>
          )}

          {/* Food Options */}
          <div className="question-container">
            <p>Is the food brand and serving size the same as the previous meal?</p>
            <div className="options-container">
              <button
                type="button"
                className={`option-button ${
                  foodSameAsYesterday === 'yes' ? 'active' : ''
                }`}
                onClick={() => handleFoodOptionClick('yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`option-button ${
                  foodSameAsYesterday === 'no' ? 'active' : ''
                }`}
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
                  className={`option-button ${
                    changedField === 'food' ? 'active' : ''
                  }`}
                  onClick={() => handleChangedFieldClick('food')}
                >
                  Food
                </button>
                <button
                  type="button"
                  className={`option-button ${
                    changedField === 'servingSize' ? 'active' : ''
                  }`}
                  onClick={() => handleChangedFieldClick('servingSize')}
                >
                  Serving Size
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="paw-button">
            <FontAwesomeIcon icon={faPaw} className="paw-icon" />
          </button>
        </form>
       {/* Chart */}
       
                  

      </main>
    </div>
    
    
    
  );
  
}

export default App;
