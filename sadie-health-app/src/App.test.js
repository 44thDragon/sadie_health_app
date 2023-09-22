
          {/* <div className="form-container">
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
              </button> */}