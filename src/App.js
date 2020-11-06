import React, { Component, useState, useEffect, useRef } from 'react';
import './App.css';
// Import components
import BarChart from './components/BarChart/BarChart.js';
import MagInput from './components/MagInput/MagInput.js';
import DatePicker from 'react-date-picker';
import DataModifier from './components/DataModifier/DataModifier.js';
import MapSection from './components/Map/Map.js' // import the map here

function App() {
  const [apiData, setApiData] = useState([]);
  const [minMag, setMinMag] = useState(5.0);
  const [maxMag, setMaxMag] = useState(8.0);
  const [startDate, setStartDate] = useState(new Date("January 1, 2020 00:00:00"));
  const [endDate, setEndDate] = useState(new Date());
  const [firstRecordDate, setFirstRecordDate] = useState("");
  const [lastRecordDate, setLastRecordDate] = useState("");
  const [page, setPage] = useState(1);
  const [coordinates, setCoordinates] = useState([0,0]);

  const isCurrent = useRef(false);

  // Get the coordinates of point
  function getCoordinates() {
    // setCoordinates(quake)
  }

  // Modify minimum magnitude
  function minimumMagnitude(ev) {
    let value = ev.target.value;
    console.log('Minimum magnitude:', value);
    if (value > maxMag) {
      alert("Minimum value must be greater than or equal to maximum value")
    } else {
      setMinMag(value);
      setPage(1);
    }
  }

  // Modify maximum magnitude
  function maximumMagnitude(ev) {
    let value = ev.target.value;
    console.log('Maximum magnitude:', value);
    if (value < minMag) {
      alert("Maximum value must be greater than or equal to minimum value")
    } else {
      setMaxMag(value);
      setPage(1);
    }
  }

  // Check date inputs
  function checkDates(){
    console.log('Start date is:', startDate)
    console.log('End date is:', endDate)  
  }


  // Get dates of first and last records displaying on page
  function getDisplayDates(){
    //if (isCurrent.current) {
    if (apiData.length >0) {
      // Get date of first record displaying
      let visibleRecords = apiData.slice(page*20-20, page*20-1)
      let fullFirstStringDate = new Date(visibleRecords[0].properties.time).toUTCString()
      setFirstRecordDate(fullFirstStringDate.slice(4,16))
      console.log("first record on page is", firstRecordDate)

      // Get date of last record displaying
      let fullLastStringDate = new Date(visibleRecords[visibleRecords.length-1].properties.time).toUTCString()
      setLastRecordDate(fullLastStringDate.slice(4,16))
      console.log("last record on page is", lastRecordDate)
    }
  }

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
          isCurrent.current = true;
      });
    }

  useEffect(() => {
    getDisplayDates();
  }, [apiData, page]);

  useEffect(doFetch, [minMag, maxMag, startDate, endDate])

  const location = {
    address: '1600 Amphitheatre Parkway, Mountain View, california.',
    lat: 37.42216,
    lng: -122.08427,
  } // our location object from earlier

  return (
    <div>
      <div className="title"> Shake Shack </div>
      <h2 className="subtitle"> Significant Earthquakes in North America in 2020</h2>    
      <DataModifier
        minMag={minMag}
        changeMinMag={minimumMagnitude}
        maxMag={maxMag}
        changeMaxMag={maximumMagnitude}
        startDate={startDate}
        onStartChange={setStartDate}
        endDate={endDate}
        onEndChange={setEndDate}
      />
      <MapSection
        apiData={apiData}
        page={page}
        coordinates={coordinates}
        location={location}
        zoomLevel={0} 
      />
      <BarChart 
        apiData={apiData}
        page={page}
        lastRecordDate={lastRecordDate}
        firstRecordDate={firstRecordDate}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        setCoordinates={setCoordinates}
      />
    </div>
  );
}

export default App;
