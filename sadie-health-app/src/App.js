import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faNotesMedical } from '@fortawesome/free-solid-svg-icons'; // Import faNotesMedical here

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CartesianGrid } from 'recharts';
import { format } from 'date-fns';




function App() {
  const [glucoseReading, setGlucoseReading] = useState('');
  const [foodSameAsYesterday, setFoodSameAsYesterday] = useState(null);
  const [changedField, setChangedField] = useState(null);
  const [mostRecentGlucose, setMostRecentGlucose] = useState(null);
  const [recentGlucoseVisible, setRecentGlucoseVisible] = useState(false);
  const toggleRecentGlucose = () => {
    setRecentGlucoseVisible(!recentGlucoseVisible);
  };
  const [foodChangeDescription, setFoodChangeDescription] = useState('');
  //const [glucoseData, setGlucoseData] = useState({
  //  food: {
  //    serving_size: '215', // Initial value for serving_size
  //    timestamp: new Date().toISOString(), // Current timestamp
  //  },
  //});
  const [recentFoodEntry, setRecentFoodEntry] = useState(null); // Added state for recent food entry
  const [insulinDose, setInsulinDose] = useState('');
  const [mostRecentInsulin, setMostRecentInsulin] = useState(null);
  const [insulinQuestion, setInsulinQuestion] = useState(''); // Define the insulinQuestion state
  const [insulinData, setInsulinData] = useState({
    insulin: {
      insulin_brand: 'Novolin', // Initial value for serving_size
      timestamp: new Date().toISOString(), // Current timestamp
    },
  });
  const [glucoseData, setGlucoseData] = useState([]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      const xValue = new Date(label);
      const yValue = payload[0].value; // Use payload to get the y-axis value

      // Format the date and time in a user-friendly way
    const formattedDate = xValue.toLocaleDateString();
    const formattedTime = xValue.toLocaleTimeString();
  
      return (
        <div className="custom-tooltip">
          <p>Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
          <p>Glucose Reading: {yValue}</p>
        </div>
      );
    }
  
    return null;
  };

  //Backdate
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
    setShowDateInput(false); // Reset the date input when unchecking the checkbox
  };
  const handleDateInputChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const handleTimeInputChange = (event) => {
    setSelectedTime(event.target.value);
  };
  const toggleCalendarPicker = () => {
    setShowDateInput(!showDateInput);
  };


  // Assuming served_at is a Unix timestamp

  async function fetchMostRecentInsulin() {
    try {
      const response = await axios.get('/api/insulin/most-recent');
      if (response.data) {
        setMostRecentInsulin(response.data);
  
        // Update the question text here as well
        const newInsulinQuestion = `If the insulin dose of ${response.data.units || ''} of ${response.data.insulin_brand || ''} was not administered, how much was?`;
        setInsulinQuestion(newInsulinQuestion); // Set the insulinQuestion state
      }
    } catch (error) {
      console.error('Error fetching most recent insulin entry:', error);
    }
  }

  

  useEffect(() => {
    document.title = 'Sadie Health';
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

    async function fetchGlucoseData() {
      try {
        const response = await axios.get('/api/glucose-readings/all'); // Replace with your actual API endpoint
        if (response.data) {
          // Update glucoseData state with the received data
          setGlucoseData(response.data);
        }
      } catch (error) {
        console.error('Error fetching glucose data:', error);
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
  
          // Update the question text here as well
          setInsulinQuestion(
            `If the insulin dose of ${response.data.units || ''} of ${response.data.insulin_brand || ''} was not administered, how much was?`
          );
        }
      } catch (error) {
        console.error('Error fetching most recent insulin entry:', error);
      }
    }


    fetchRecentGlucoseReadings();
    fetchMostRecentGlucose();
    fetchRecentFoodEntry(); // Fetch the most recent food entry
    fetchMostRecentInsulin();
    fetchGlucoseData();

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
  
  const handleBackdatedGlucoseSubmit = async (event) => {
    event.preventDefault();
  
    // Check if isCheckboxChecked is true and selectedDate and selectedTime are not empty
    if (isCheckboxChecked && selectedDate && selectedTime) {
      try {
        
        const petName = 'Sadie';
        // Create a new Date object by combining selectedDate and selectedTime
        const backdatedDatetime = new Date(`${selectedDate}T${selectedTime}:00Z`);
  
        // Prepare the data to be sent to the server
        let requestData = {
          glucose_reading: glucoseReading,
          dt_stamp: backdatedDatetime.toISOString(),
          pet_name: petName,
        };
        // Send a POST request to your server's endpoint for backdated glucose readings
        const response = await axios.post('/api/glucose-readings/backdated', requestData);
        if (response.status === 201) {
          alert('Backdated glucose reading and food data stored successfully');
  
          // Reset the form and state variables
          setGlucoseReading('');
        
           
            // Clear fields if needed
            setInsulinDose('');
            setGlucoseReading('');
            setFoodChangeDescription('');
            setChangedField(null);
            setFoodSameAsYesterday(null);
            setSelectedDate('');
            setSelectedTime('');
            setIsCheckboxChecked(false);
                
              
              } else {
                alert('An error occurred while storing backdated glucose reading');
              }


        } catch (error) {
          alert('An error occurred while storing glucose reading');
          console.error(error);
        }}
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const currentDatetime = new Date();
      const petName = 'Sadie';
      const servedAt = currentDatetime;
      const administeredOn = currentDatetime
      

      // Prepare the data to be sent to the server
      let requestData = {
        glucose_reading: glucoseReading,
        dt_stamp: currentDatetime,
        pet_name: petName,
        food: {
          served_at: servedAt,
        },
        insulin: {
          administered_on: administeredOn,
        }
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

      

      
     
      // Check if insulinDose is empty, and if so, use mostRecentInsulin.units
      if (insulinDose == "") {
        // Fetch the latest insulin entry
        
        const latestInsulinResponse = await axios.get('/api/insulin/most-recent');
        console.log(latestInsulinResponse.data)
        if (latestInsulinResponse.data) {
          requestData.insulin.units = latestInsulinResponse.data.units;
        }
      } else {
        requestData.insulin.units = insulinDose;
      }
      
      // Make an additional POST request to save insulin dose data
      const insulinResponse = await axios.post('/api/insulin/submit', {
        units: requestData.insulin.units,
        insulin_brand: "Novolin",
        administered_on: currentDatetime,
        needle: "U100"
        // Include any other relevant data for the insulin submission
      });

      // Handle the insulin dose response as needed
      if (insulinResponse.status === 201) {
        // The insulin dose data was successfully saved
        // You can update your UI or perform any other actions here
        alert('Insulin dose data saved successfully.');
        setInsulinDose('');
        // If needed, trigger additional actions or state updates
         // Call fetchMostRecentInsulin again to update insulinQuestion
         fetchMostRecentInsulin();
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
        // Update the question text
        setInsulinQuestion(
        `If the insulin dose of ${mostRecentInsulin.units} of ${mostRecentInsulin.insulin_brand} was not administered, how much was?`
        );
        // Clear fields if needed
        setInsulinDose('');
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
  console.log({glucoseData})

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">
          <span className="health-text">
          <FontAwesomeIcon icon={faNotesMedical} /> Welcome to Sadie Health </span>
        </h1>
      </header>
      <main className="App-main">
        <div className="form-container">
        <form onSubmit={isCheckboxChecked ? handleBackdatedGlucoseSubmit : handleSubmit}>
            <div className="label-container">
              <label>What was Sadie's glucose reading?</label>
              <input
                type="number"
                value={glucoseReading}
                onChange={handleGlucoseChange}
                min="0"
                max="600"
                required
                autoFocus
              /> mg/dl. </div>
              <div> <p>Backdating? 
              <input
              type="checkbox"
              checked={isCheckboxChecked}
              onChange={handleCheckboxChange}
              id="mg-dl-checkbox"
            />
            <label htmlFor="mg-dl-checkbox"> </label>
              </p>
            </div>
                {isCheckboxChecked && (
            <div className="date-time-inputs">
              <div className="date-input">
                <label>Date:</label>
                {showDateInput ? (
                  <>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateInputChange}
                      required
                    />
                    <button onClick={toggleCalendarPicker}>Clear Calendar</button>
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    onClick={toggleCalendarPicker}
                    readOnly
                  />
                )}
              </div>
              <div className="time-input">
                <label>Time:</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={handleTimeInputChange}
                  required
                />
              </div>
            </div>
          )}

            {!isCheckboxChecked && (
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
            )}
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
            {!isCheckboxChecked && mostRecentInsulin && (
              <div>
            <label>If the insulin dose of {mostRecentInsulin.units} units of {mostRecentInsulin.insulin_brand} was not administered, how much was?</label>
           
            <input
              type="number"
              value={insulinDose}
              onChange={(event) => setInsulinDose(event.target.value)}
              min="1"
              max="30"
              
            />
        </div>
            )}
            <button type="submit" className="paw-button">
              <FontAwesomeIcon icon={faPaw} className="paw-icon" /> Submit
            </button>
          </form>
        </div>
      
        <div className="recent-glucose-container">
        <button
        className="toggle-button"
        onClick={() => toggleRecentGlucose()}
        >
        Toggle Recent Glucose Readings
        </button>
        <div className={`recent-glucose ${recentGlucoseVisible ? 'open' : ''}`}>
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
      <div className="line-chart-container">
  <LineChart width={600} height={300} data={glucoseData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="dt_stamp" type="category" allowDuplicatedCategory={false} tickFormatter={(tick) => format(new Date(tick), 'MM/dd/yyyy')} />
  <YAxis label={{ value: 'Glucose Reading (mg/dl)', angle: -90, position: 'insideLeft' }}/>
  
    <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}

    <Legend />
    <Line type="monotone" dataKey="glucose_reading" name="Glucose Levels Over Time" stroke="#8884d8" />

  </LineChart>
</div>
    </main>
    </div>
  );
}

export default App;