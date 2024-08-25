import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Update the title of the webpage
  React.useEffect(() => {
    document.title = "21BAI1617"; // Replace with your actual roll number
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle dropdown selection
  const handleDropdownChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(options);
  };

  // Submit the data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonData = JSON.parse(inputData);
      const result = await axios.post('http://127.0.0.1:5000/bfhl', jsonData);
      setResponse(result.data);
    } catch (error) {
      console.error('Error submitting data:', error);
      setResponse({ is_success: false, error: 'Invalid JSON input or server error.' });
    }
  };

  // Render filtered response based on selected options
  const renderFilteredResponse = () => {
    if (!response) return null;
    
    const { numbers, alphabets, highest_lowercase_alphabet } = response;

    // Create an object to hold the filtered data
    let filteredData = {};

    if (selectedOptions.includes('Numbers')) filteredData.numbers = numbers;
    if (selectedOptions.includes('Alphabets')) filteredData.alphabets = alphabets;
    if (selectedOptions.includes('Highest lowercase alphabet')) filteredData.highest_lowercase_alphabet = highest_lowercase_alphabet;

    return (
      <div>
        <h3>Filtered Response:</h3>
        <pre>{JSON.stringify(filteredData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Data Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputData}
          onChange={handleInputChange}
          rows="10"
          cols="50"
          placeholder='Enter JSON here (e.g., {"data": ["A", "C", "z"]})'
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <label>Select options to display:</label>
          <select multiple={true} onChange={handleDropdownChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}
      {renderFilteredResponse()}
    </div>
  );
}

export default App;
