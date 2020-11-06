import React from 'react';
import GoogleMapReact from 'google-map-react'
import './Map.css';
import { Icon, InlineIcon } from '@iconify/react';
import mapMarkerAlt from '@iconify/icons-fa-solid/map-marker-alt';

const MAP_API = process.env.MAP_API;

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={mapMarkerAlt} className="pin-icon" style={{fontSize:"32pt"}}/>
    <p className="pin-text">{text}</p>
  </div>
)

const Map = (props) => (
  <div className="map">
    <h2 className="map-h2" style={{color: "white"}}> TESTING</h2>

    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: MAP_API }}
        defaultCenter={props.location}
        defaultZoom={props.zoomLevel}
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
export default Map;
