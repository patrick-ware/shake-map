import React, { Component, useState, useRef } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import "./App.css";
import Popup from './components/Popup/Popup.js';
import DataModifier from './components/DataModifier/DataModifier.js';
// Icon imports
import { Icon, InlineIcon } from '@iconify/react';
import circleSlice8 from '@iconify-icons/mdi/circle-slice-8';

// Defining variables outside of App()
const fetcher = (...args) => fetch(...args).then(response => response.json());
const Marker = ({ children }) => children;

export default function App() {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [popupInfo, setPopupInfo] = useState([]);
  //State for API fetch
  const [minMag, setMinMag] = useState(5.0);
  const [maxMag, setMaxMag] = useState(8.0);
  const [startDate, setStartDate] = useState(new Date("January 1, 2020 00:00:00"));
  const [endDate, setEndDate] = useState(new Date());

  // Modify minimum magnitude
  function minimumMagnitude(ev) {
    let value = ev.target.value;
    console.log('Minimum magnitude:', value);
    if (value > maxMag) {
      alert("Minimum value must be greater than or equal to maximum value")
    } else {
      setMinMag(value);
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
    }
  }
  //  MAP CODE
  const url =
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-05-07&minmagnitude=3&minlatitude=24.396308&minlongitude=-124.848974&maxlatitude=49.384358&maxlongitude=-66.885444";
  const { data, error } = useSwr(url, { fetcher });
  const earthquakes = data && !error ? data.features :[];
  const points = earthquakes.map(earthquake => ({
    type: "Feature",
    properties: { 
      cluster: false, 
      earthquakeId: earthquake.id, 
      magnitude: earthquake.properties.mag, 
      place: earthquake.properties.place,
      time: earthquake.properties.time 
    },
    geometry: {
      type: "Point",
      coordinates: [
        earthquake.geometry.coordinates[0],
        earthquake.geometry.coordinates[1]
      ]
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });
  console.log("here is popup", popupInfo)
    console.log("this is clusters", clusters);

 return (
    <div>
      <div className="title"> Shake Shack </div>
      <h2 className="subtitle"> Significant Earthquakes in North America</h2>    
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
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
          defaultCenter={{ lat:38.1637, lng:-118.0837}}
          defaultZoom={6}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => {
            mapRef.current = map;
          }}
          onChange={({ zoom, bounds }) => {
            setZoom(zoom);
            setBounds([
              bounds.nw.lng,
              bounds.se.lat,
              bounds.se.lng,
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
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  lat={latitude}
                  lng={longitude}
                >
                  <div
                    className=""
                    style={{
                      color:"#d1d1d1",
                      backgroundColor:"#222831",
                      padding:"5px",
                      borderRadius:"50%",
                      width: `${20 + (pointCount / points.length) * 10}px`,
                      height: `${20 + (pointCount / points.length) * 10}px`
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20
                      );
                      mapRef.current.setZoom(expansionZoom);
                      mapRef.current.panTo({ lat: latitude, lng: longitude });
                    }}
                  >
                    <div style={{
                          margin:"auto",
                          textAlign:"center",
                          fontSize:"12pt"
                        }}
                     >
                    {pointCount}
                    </div>
                  </div>
                </Marker>
              );
            }

            return (
              <Marker
                key={`earthquake-${cluster.properties.earthquakeId}`}
                lat={latitude}
                lng={longitude}
                onClick={()=>setPopupInfo(cluster)}
              >
                <div
                  className=""
                  style={{
                    color:"black",
                    backgroundColor:`rgb(255,${255-(25.5 * (cluster.properties.magnitude))},0)`,
                    padding:"5px",
                    borderRadius:"50%",
                    border:"1px solid black",
                    width:"11px",
                    height:"11px"
                  }}
                >
                  <div style={{
                        margin:"auto",
                        textAlign:"center",
                        fontSize:"7pt"
                      }}
                   >
                    {cluster.properties.magnitude.toFixed(1)}</div>
                   </div>
                </Marker>
              );
          })}
        </GoogleMapReact>
      </div>
    </div>
  );
}
