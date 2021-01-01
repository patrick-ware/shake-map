import React, { Component, useState, useEffect, useRef } from 'react';
import useSwr from 'swr';
import useSupercluster from 'use-supercluster';
import GoogleMapReact from 'google-map-react'
import './Map.css';
import { Icon, InlineIcon } from '@iconify/react';
import circleSlice8 from '@iconify-icons/mdi/circle-slice-8';

//const LocationPin = ({ text }) => (
//  <div className="pin">
//    <Icon icon={mapMarkerAlt} className="pin-icon" style={{fontSize:"32pt"}}/>
//    <p className="pin-text">{text}</p>
//  </div>
//)

const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({children}) => children;

function Map(props) {
  // 1) Map setup
  const mapRef = useRef();
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState(null);
  
  // 2) load and format data
//  const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-05-07&minmagnitude=5&minlatitude=24.396308&minlongitude=-124.848974&maxlatitude=49.384358&maxlongitude=-66.885444"
//  const {data, error} = useSwr(url, fetcher)
//  const earthquakes = data && !error ? data.slice(0,200) :[];

  const points = props.apiData.map(quake => ({
    type: "Feature",
    properties: {
      cluster: false,
      quakeID: null,
      magnitude: null,
      location: null,
    },
    geometry: { type: "Point", coordinates:[]
    }
  }))
      

  // 3) get clusters
//  const { clusters } = useSupercluster({
//    points,
//    bounds,
//    zoom,
//    options: {radius: 75, maxZoom: 20}
//  })

  // 4) render map

  return (
    <div className="map">
      <h2 className="map-h2" style={{color: "white"}}> TESTING</h2>

      <div className="google-map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
          defaultCenter={{ lat:38.1637, lng:-118.0837}}
          defaultZoom={6}
        >
          {
            Object.entries(props.apiData).slice(0,200)
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
          }
        </GoogleMapReact>
      </div>
    </div>
  )
}
export default Map;
