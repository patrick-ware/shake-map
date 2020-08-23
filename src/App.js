import React, { useState, useEffect } from 'react';
import './App.css';
// Import components
import BarChart from './components/BarChart/BarChart.js';
import MagInput from './components/MagInput/MagInput.js';
import WarningMsg from './components/WarningMsg/WarningMsg.js';
import DatePicker from 'react-date-picker';


function App() {
  const [apiData, setApiData] = useState([]);
  const [minMag, setMinMag] = useState(5.0);
  const [maxMag, setMaxMag] = useState(8.0);
  const [startDate, setStartDate] = useState(new Date("January 1, 2020 00:00:00"));
  const [endDate, setEndDate] = useState(new Date());
  const [firstRecordDate, setFirstRecordDate] = useState("");
  const [lastRecordDate, setLastRecordDate] = useState("");
  const [page, setPage] = useState(1);

  // Modify minimum magnitude
  function minimumMagnitude(ev) {
    let value = ev.target.value;
    console.log('Minimum magnitude:', value);
    setMinMag(value);
    setPage(1);
  }

  // Modify maximum magnitude
  function maximumMagnitude(ev) {
    let value = ev.target.value;
    console.log('Maximum magnitude:', value);
    setMaxMag(value);
    setPage(1);
  }

  // Check date inputs
  function checkDates(){
    console.log('Start date is:', startDate)
    console.log('End date is:', endDate)  
  }


  // Get dates of first and last records displaying on page
  function getDisplayDates(){
    // Get date of first record displaying
    let visibleRecords = apiData.slice(page*20-20, page*20-1)
    setFirstRecordDate(new Date(visibleRecords[visibleRecords.length-1].properties.time).toUTCString())
    console.log("first record on page is", firstRecordDate)

    // Get date of last record displaying
    setLastRecordDate(new Date(visibleRecords[1].properties.time).toUTCString())
    console.log("last record on page is", lastRecordDate)
  }

//  // Get date of first record displaying
//  function getFirstDate(){
//    let visibleRecords = apiData.slice(page*20-20, page*20-1)
//    setFirstRecordDate(new Date(visibleRecords[0].properties.time).toUTCString())
//    console.log("first record on page is", firstRecordDate)
//  }
//    
//  // Get date of last record displaying
//  function getLastDate(){
//    let visibleRecords = apiData.slice(page*20-20, page*20-1)
//    setLastRecordDate(new Date(visibleRecords[-1].properties.time).toUTCString())
//    console.log("last record on page is", lastRecordDate)
//  }

  // Go to next page
  function goToNextPage() {
    const newPageValue = Math.min(page + 1, Math.ceil(apiData.length/20))
    setPage(newPageValue)
  }
  // Go to previous page
  function goToPreviousPage() {
    const newPageValue = Math.max(page - 1, 1)
    setPage(newPageValue)
  }

  // Format start date
  function formatStartDate(){
    let startMonth = startDate.getUTCMonth() + 1; //months from 1-12
    let startDay = startDate.getUTCDate();
    let startYear = startDate.getUTCFullYear();

    let startTime = startYear + "-" + startMonth + "-" + startDay;
    console.log("api start date is", startTime)
    return startTime
  }

  // Format end date
  function formatEndDate(){
    let endMonth = endDate.getUTCMonth() + 1; //months from 1-12
    let endDay = endDate.getUTCDate();
    let endYear = endDate.getUTCFullYear();

    let endTime = endYear + "-" + endMonth + "-" + endDay;
    console.log("api end date is", endTime)
    return endTime
  }

  // Fetch data from API
  function doFetch(){
  console.log("fetching data from API...");

    const api = 
      "https://earthquake.usgs.gov/fdsnws/event/1/"+
      "query?format=geojson&starttime=2020-01-01&"+
      "starttime="+ formatStartDate() +
      "&endtime=" + formatEndDate() + 
      "&minmagnitude=" + minMag + 
      "&maxmagnitude=" + maxMag + 
      "&minlatitude=24.396308"+
      "&minlongitude=-124.848974"+
      "&maxlatitude=49.384358"+
      "&maxlongitude=-66.885444";
    
    console.log(api)
    
    fetch(api)
      .then(response => response.json())
      .then(data => {
        console.log("this is data", data)
          setApiData(data.features)
      });
    }

  useEffect(doFetch, [minMag, maxMag, startDate, endDate])

  return (
    <div>
      <div className="title"> Shake Shack </div>
      <h2 className="subtitle"> Significant Earthquakes in North America in 2020</h2>    
      <div className="DataModifier">
        <form>
          <MagInput 
            label="Minimum Magnitude"
            mag={minMag}
            changeMag={minimumMagnitude}
          />
          <MagInput 
            label="Maximum Magnitude"
            mag={maxMag}
            changeMag={maximumMagnitude}
          />
          <div className="DateInputContainer">
            <div className="DateInput">
              Start Date:
              <DatePicker
                value={startDate}
                onChange={setStartDate}
              />
            </div>
            <div className="DateInput">
              End Date:
              <DatePicker
                value={endDate}
                onChange={setEndDate}
              />
            </div>
          </div>
        </form>
      </div>
      <BarChart 
        apiData={apiData}
        page={page}
      />
        <div className="DateInfo" onClick={getDisplayDates}> {"<"}{"<"} Newer Now viewing records from {firstRecordDate} through {lastRecordDate} Older {">"}{">"}</div>
      <div className="PageNav">
        <button className="PageNav-control" onClick={goToPreviousPage}>⬅ Previous Page </button>
        <div className="PageNav-position"> Page {page} of {Math.ceil(apiData.length/20)} </div>
        <button className="PageNav-control" onClick={goToNextPage}>Next Page ➡</button>
      </div>
    </div>
  );
}

export default App;
