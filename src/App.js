import React, { Component, useState, useEffect, useRef } from 'react';
import useSupercluster from 'use-supercluster';
import useSwr from 'swr';
import './App.css';
import GoogleMapReact from 'google-map-react'
// Import components
import BarChart from './components/BarChart/BarChart.js';
import MagInput from './components/MagInput/MagInput.js';
import DatePicker from 'react-date-picker';
import DataModifier from './components/DataModifier/DataModifier.js';
//import MapSection from './components/Map/Map.js' // import the map here
import './components/Map/Map.css';
import { Icon, InlineIcon } from '@iconify/react';
import circleSlice8 from '@iconify-icons/mdi/circle-slice-8';

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

  // START MAP COMPONENT CODE

  const fetcher = (...args) => fetch(...args).then(response => response.json());

  const Marker = ({children}) => children;

    // 1) Map setup
    const mapRef = useRef();
    const [zoom, setZoom] = useState(10);
    const [bounds, setBounds] = useState(null);
    
    // 2) load and format data
    const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-05-07&minmagnitude=4&minlatitude=24.396308&minlongitude=-124.848974&maxlatitude=49.384358&maxlongitude=-66.885444"
    const {data, error} = useSwr(url, fetcher)
    const earthquakes = data && !error ? data.features :[];
    console.log("HERE IS NEW DATA", earthquakes)

    const points = earthquakes.map(quake => ({
      "type": "Feature",
      "properties": {
        "cluster": false,
        "quakeID": quake.id,
        "magnitude": quake.properties.mag,
        "place": quake.properties.place,
      },
      "geometry": { type: "Point", coordinates:[quake.geometry.coordinates[0], quake.geometry.coordinates[1]]
      }
    }))
    console.log("and here are the points", points)    

    // 3) get clusters
    const { clusters, supercluster } = useSupercluster({
      points,
      bounds,
      zoom,
      options: { radius: 75, maxZoom: 20 }
    });

    console.log("this is clusters", supercluster);
    // 4) render map
 
    // END MAP COMPONENT CODE

  useEffect(() => {
    getDisplayDates();
  }, [apiData, page]);

  useEffect(doFetch, [minMag, maxMag, startDate, endDate])

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
      <div className="map">
        <h2 className="map-h2" style={{color: "white"}}> TESTING</h2>
        <div className="google-map">
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
            defaultCenter={{ lat:38.1637, lng:-118.0837}}
            defaultZoom={6}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => {
              mapRef.current = map;
            }}
            onChange={({zoom, bounds}) => {
              setZoom(zoom);
              setBounds([
                bounds.nw.lng,
                bounds.se.lat,
                bounds.se.lnt,
                bounds.nw.lat
              ]);
            }}
          >
          {clusters.map(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
              cluster: isCluster,
              point_count: pointCount
            } = cluster.properties;
            
            if (isCluster) {
            }
            return (
              <Marker
                key={cluster.proerties.quakeID}
                lat={latitude}
                lng={longitude}
              >
                <div className="pin">
                  <Icon icon={circleSlice8} className="pin-icon" style={{fontSize:"32pt"}}/>
                </div>
              </Marker>
            )
          })  }

            {/*{
              Object.entries(apiData).slice(0,200)
                .map(([key, value]) => (
                  <Marker
                    key={value.id}
                    lat={value.geometry.coordinates[1]}
                    lng={value.geometry.coordinates[0]}
                  >
                    <div className="pin">
                      <Icon icon={circleSlice8} className="pin-icon" style={{fontSize:"32pt"}}/>
                      <p className="pin-text">{value.properties.place}</p>
                    </div>
                  </Marker>
              ))
            }*/}
          </GoogleMapReact>
        </div>
      </div>
      {/*<BarChart 
        apiData={apiData}
        page={page}
        lastRecordDate={lastRecordDate}
        firstRecordDate={firstRecordDate}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        setCoordinates={setCoordinates}
      />*/}
    </div>
  );
}

export default App;
