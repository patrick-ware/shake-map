import React, { Component, useState, useEffect, useRef } from 'react';
import useSwr from 'swr';
import useSupercluster from 'use-supercluster';
import GoogleMapReact from 'google-map-react'
import './Map.css';
import { Icon, InlineIcon } from '@iconify/react';
import mapMarkerAlt from '@iconify/icons-fa-solid/map-marker-alt';

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={mapMarkerAlt} className="pin-icon" style={{fontSize:"32pt"}}/>
    <p className="pin-text">{text}</p>
  </div>
)

function Map(props) {

  const mapRef = useRef();
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] =useState(null);

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
            Object.entries(props.apiData).slice(props.page*20-20, props.page*20-1)
              .map(([key, value]) => (
                <LocationPin
                  lat={value.geometry.coordinates[1]}
                  lng={value.geometry.coordinates[0]}
                  text={value.properties.place}
                />
            ))
          }
        </GoogleMapReact>
      </div>
    </div>
  )
}
export default Map;
