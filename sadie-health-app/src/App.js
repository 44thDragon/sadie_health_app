import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate and process the input value (e.g., check if it's between 1 and 900)
    if (inputValue >= 1 && inputValue <= 900) {
      alert(`You entered: ${inputValue}`);
    } else {
      alert('Please enter a number between 1 and 900.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, World!</h1>
        <p>Welcome to my React.js app on sadie.io</p>
        <form onSubmit={handleSubmit}>
          <label>
            Enter a number between 1 and 900:
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              min={1}
              max={900}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
