import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow, Circle} from "google-maps-react";
import key from "../key.json"
import circle from "../assets/circle.svg"

const mapStyles = {
  width: "100%",
  height: "100%",
};

export const MapContainer = (props) => {
  const [data, setData] = useState([]);
  const [county, setCounty] = useState([]);
  const [info, setInfo] = useState({})

  const markerURL = "http://localhost:5000/get-live-hurricanes";
  const countyURL = "http://localhost:5000/get-live-hurricanes"

  useEffect(() => {
    async function fetchHurricanePoints() {
      const hurricanePoints = await fetch(markerURL).then((res) => 
        res.json().then((data) => {
          console.log(data)
          return data.data;
        })
      );
      hurricanePoints.forEach((point) => {
        let { name, latitudeNumeric, longitudeNumeric, movementSpeed, pressure, classification } = point;
        const indvPoint = {
          Name: name,
          Longitude: longitudeNumeric,
          Latitude: latitudeNumeric,
          Speed: movementSpeed,
          Pressure: pressure,
          Classification: classification,
          markerOffset: 25,
        };
        setData((oldData) => [...oldData, indvPoint]);
      });
    }

    async function fetchCountyPoints() {
      const countyPoints = await fetch(countyURL).then((res) => 
        res.json().then((data) => {
          return data.data
        })
      );
      countyPoints.forEach((countyIT) => {
        let { lat, lon, min_distance } = countyIT;
        const singleCounty = {
          Latitude: lat,
          Longitude: lon,
          DamageScalar: min_distance,
        }
        setCounty((oldCounty) => [...oldCounty, singleCounty])
      });
    }
    fetchHurricanePoints();
    fetchCountyPoints();
  }, []);

  const onMarkerClick = (props, marker) => {
    setInfo({
      selectedPlaceName: props.name,
      selectedPlacePressure: props.pressure,
      selectedPlaceSpeed: props.speed,
      selectedPlaceClassification: props.clsf,
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
          name={marker.Name}
          pressure={marker.Pressure}
          speed={marker.Speed}
          clsf={marker.Classification}
          position={{ lat: marker.Latitude, lng: marker.Longitude }}
          icon={{url: "https://www.svgrepo.com/show/137222/black-circle.svg",
          scaledSize: new props.google.maps.Size(10, 10)}}
        />
      ))}
      {county.map((indvCounty) => {
        const coords = { lat: indvCounty.Latitude, lng: indvCounty.Longitude}
        const colorInt = parseInt(indvCounty.DamageScalar)
        let colorCode = ""
        let colorOpacity = 0;
        if (colorInt <= 30) {
          colorCode = "#FF0000"
          colorOpacity = 0.25;
        } else if (colorInt > 30 && colorInt < 60) {
          colorCode = "#FFA500"
          colorOpacity = 0.2;
        } else if (colorInt >= 60) {
          colorCode = "#EFCC00"
          colorOpacity = 0.05;
        }
        return(
          <Circle
            radius={parseInt(indvCounty.DamageScalar) * 1000}
            center={coords}
            strokeColor='transparent'
            strokeOpacity={0}
            strokeWeight={5}
            fillColor={colorCode}
            fillOpacity={colorOpacity}
          />
      )})}
      <InfoWindow
          marker={info.activeMarker}
          visible={info.showingInfoWindow}>
            <div>
              <h4>Hurricane {info.selectedPlaceName}</h4>
              <h4>Classification: {info.selectedPlaceClassification}</h4>
              <h4>Coordinates: {info.selectedPlaceLatitude}, {info.selectedPlaceLongitude}</h4>
              <h4>Pressure: {info.selectedPlacePressure}</h4>
              <h4>Speed: {info.selectedPlaceSpeed}K</h4>
            </div>
        </InfoWindow>
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: key.google_key,
  libraries: ['visualization']
})(MapContainer);
