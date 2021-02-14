import React, { useState, useRef } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import "./App.css";

// Defining variables outside of App()
const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({ children }) => children;

export default function App() {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);

  const url =
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-05-07&minmagnitude=3&minlatitude=24.396308&minlongitude=-124.848974&maxlatitude=49.384358&maxlongitude=-66.885444";
  const { data, error } = useSwr(url, { fetcher });
  const earthquakes = data && !error ? data.features :[];
  console.log("HERE IS NEW DATA", earthquakes)
  const points = earthquakes.map(earthquake => ({
    type: "Feature",
    properties: { cluster: false, earthquakeId: earthquake.id, magnitude: earthquake.properties.mag, place: earthquake.properties.place },
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

  // START MAP COMPONENT CODE


//    // 1) Map setup
//    const mapRef = useRef();
//    const [bounds, setBounds] = useState(null);
//    const [zoom, setZoom] = useState(10);
    
    // 2) load and format data
    /* ORIG EARTHQUAKE CODE
    const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-05-07&minmagnitude=3&minlatitude=24.396308&minlongitude=-124.848974&maxlatitude=49.384358&maxlongitude=-66.885444"
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
      options: { radius: 75, maxZoom: 20 },
    }); */

  console.log("this is clusters", clusters);
    // 4) render map
 
    // END MAP COMPONENT CODE

 return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
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
                    color:"red",
                    backgroundColor:"black",
                    padding:"5px",
                    borderRadius:"50%",
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
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
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={`crime-${cluster.properties.crimeId}`}
              lat={latitude}
              lng={longitude}
            >
              <div
                  className=""
                  style={{
                    color:"red",
                    backgroundColor:"black",
                    padding:"5px",
                    borderRadius:"50%",
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
                  }}
              />
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
}
