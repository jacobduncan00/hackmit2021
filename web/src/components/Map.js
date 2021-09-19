import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow, Circle} from "google-maps-react";
import key from "../key.json"

const mapStyles = {
  width: "100%",
  height: "100%",
};

console.log(process.env.GOOGLE_KEY)

export const MapContainer = (props) => {
  const [data, setData] = useState([]);
  const [county, setCounty] = useState([]);
  const [info, setInfo] = useState({})

  const markerURL = "http://localhost:5000/get-hurricane-data/sandy";
  const countyURL = "http://localhost:5000/get-hurricane-counties/sandy"

  useEffect(() => {
    async function fetchHurricanePoints() {
      const hurricanePoints = await fetch(markerURL).then((res) =>
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
              <h4>Coordinates: {info.selectedPlaceLatitude}, {info.selectedPlaceLongitude}</h4>
            </div>
        </InfoWindow>
        {/* <HeatMap
            gradient={gradient}
            opacity={0.3}
            positions={positions}
            radius={20}
        /> */}
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: key.google_key,
  libraries: ['visualization']
})(MapContainer);
