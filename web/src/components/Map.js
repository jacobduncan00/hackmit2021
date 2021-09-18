import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow, HeatMap} from "google-maps-react";
import CustomHeatMap from "./HeatMap"

const mapStyles = {
  width: "100%",
  height: "100%",
};

const gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ];

  const positions = [
    { lat: 37.782551, lng: -122.445368 },
    { lat: 37.782745, lng: -122.444586 },
    { lat: 37.782842, lng: -122.443688 },
    { lat: 37.782919, lng: -122.442815 },
    { lat: 37.782992, lng: -122.442112 },
    { lat: 37.7831, lng: -122.441461 },
    { lat: 37.783206, lng: -122.440829 },
    { lat: 37.783273, lng: -122.440324 },
    { lat: 37.783316, lng: -122.440023 },
    { lat: 37.783357, lng: -122.439794 },
    { lat: 37.783371, lng: -122.439687 },
    { lat: 37.783368, lng: -122.439666 },
    { lat: 37.783383, lng: -122.439594 },
    { lat: 37.783508, lng: -122.439525 },
    { lat: 37.783842, lng: -122.439591 },
    { lat: 37.784147, lng: -122.439668 }
  ];

export const MapContainer = (props) => {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({})

  const URL = "http://localhost:5000/get-hurricane-data";

  useEffect(async () => {
    const hurricanePoints = await fetch(URL).then((res) =>
      res.json().then((data) => {
        return data.data;
      })
    );
    hurricanePoints.forEach((point) => {
      let { Name, Latitude, Longitude } = point;
      const indvPoint = {
        name: Name,
        Longitude: Longitude,
        Latitude: Latitude,
        markerOffset: 25,
      };
      console.log("Point", indvPoint);
      const oldData = data;
      setData((oldData) => [...oldData, indvPoint]);
    });
  }, []);

  const onMarkerClick = (props, marker, e) => {
    setInfo({
      selectedPlaceName: props.name,
      selectedPlaceLatitude: props.position.lat,
      selectedPlaceLongitude: props.position.lng,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }


  return (
    <Map
      google={props.google}
      zoom={4}
      style={mapStyles}
      initialCenter={{
        lat: 37.0902,
        lng: -95.7129,
      }}
    >
      {data.map((marker) => (
        <Marker
          onClick={onMarkerClick}
          name={marker.name}
          position={{ lat: marker.Latitude, lng: marker.Longitude }}
        />
      ))}
      <InfoWindow
          marker={info.activeMarker}
          visible={info.showingInfoWindow}>
            <div>
              <h4>Hurricane {info.selectedPlaceName}</h4>
              <h4>Coordinates: {info.selectedPlaceLatitude}, {info.selectedPlaceLongitude}</h4>
            </div>
        </InfoWindow>
        <HeatMap
            gradient={gradient}
            opacity={0.3}
            positions={positions}
            radius={20}
        />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDRzd12gtQwB1IWVKCzOn6L1cCC2YpciTY",
  libraries: ['visualization']
})(MapContainer);
