import React from 'react';
import GoogleMapReact from 'google-map-react'
import './Map.css';
import { Icon, InlineIcon } from '@iconify/react';
import mapMarkerAlt from '@iconify/icons-fa-solid/map-marker-alt';

const testlocation = {
  address: '1600 Amphitheatre Parkway, Mountain View, california.',
  lat: 37.42216,
  lng: -122.08427,
  }

const MAP_API = process.env.MAP_API;

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={mapMarkerAlt} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
)

const Map = ({ location, zoomLevel }) => (
  <div className="map">
    <h2 className="map-h2">Come Visit Us At Our Campus</h2>

    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: MAP_API }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        <LocationPin
          lat={testlocation.lat}
          lng={testlocation.lng}
          text={testlocation.address}
        />
      </GoogleMapReact>
    </div>
  </div>
)
export default Map;
