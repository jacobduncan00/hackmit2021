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
  const [info, setInfo] = useState({});
  const [name, setName] = useState("");
  const [radius, setRadius] = useState(0);
  const [year, setYear] = useState(0);

  const namePlaceholder = "Enter name of storm"
  const radiusPlaceholder = "Enter radius in KM"
  const yearPlaceholder = "Enter year of storm"

  function fetchHurricanePoints(hurricanePoints) {
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

  function fetchCountyPoints(countyPoints) {
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

  const onMarkerClick = (props, marker) => {
    setInfo({
      selectedPlaceName: props.name,
      selectedPlaceLatitude: props.position.lat,
      selectedPlaceLongitude: props.position.lng,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  const nameChanged = (e) => {
    setName(e.target.value)
    console.log(name)
  }
  
  const radiusChanged = (e) => {
    setRadius(e.target.value)
  }

  const yearChanged = (e) => {
    setYear(e.target.value)
  }

  const resetMarkerState = () => {
    setData([])
  }
  
  const resetCountyState = () => {
    setCounty([])
  }

  const onButtonClick = async () => {
    fetch(`http://localhost:5000/get-hurricane-data/${parseInt(radius)}/${name.toUpperCase()}/${parseInt(year)}`).then(response => response.json())
        .then(data => {
          console.log(data.data)
          resetMarkerState()
          resetCountyState()
          fetchHurricanePoints(data.data[0].data)
          fetchCountyPoints(data.data[1].data)
        })
        .catch(error => console.log('Failure', error))
  }

  return (
    <div>
      <div className="container h-fit mb-4 flex justify-left items-center px-4 sm:px-6 lg:px-8">
            <div className="relative"> <input type="text" className="ml-56 h-14 w-96 pr-8 pl-5 rounded z-0 shadow focus:outline-none" onChange={nameChanged} placeholder={namePlaceholder}/>
            </div>
            <div className="relative"> <input type="text" className="ml-4 h-14 w-30 pr-8 pl-5 rounded z-0 shadow focus:outline-none" onChange={radiusChanged} placeholder={radiusPlaceholder}/>
            </div>
            <div className="relative"> <input type="text" className="ml-4 h-14 w-30 pr-8 pl-5 rounded z-0 shadow focus:outline-none" onChange={yearChanged} placeholder={yearPlaceholder}/>
            </div>
            <div className="relative">
              <button className="bg-blue-500 hover:bg-blue-700 text-white ml-4 font-bold py-2 px-4 rounded" onClick={onButtonClick}>
                Search
              </button>
            </div>
      </div>
    <Map
      google={props.google}
      zoom={5}
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
              <h4>Coordinates: {info.selectedPlaceLatitude}, {info.selectedPlaceLongitude}</h4>
            </div>
        </InfoWindow>
    </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: key.google_key,
  libraries: ['visualization']
})(MapContainer);
