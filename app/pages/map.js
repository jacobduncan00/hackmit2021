import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = () => {
  const [markers, setMarkers] = useState([]);
  const [content, setContent] = useState("");

  // TODO: Need to change 
  const URL = "http://localhost:5000/get-hurricane-data";

  useEffect(async() => {
    const hurricanePoints = await fetch(URL).then((res) => res.json().then(data => {return data.data}))
    hurricanePoints.forEach((point) => {
          let { Name, Latitude, Longitude } = point
          const indvPoint = {
            name: "Kate",
            coordinates: [Longitude, Latitude],
            markerOffset: 25,
          }
          console.log("Point", indvPoint)
          const oldMarkers = markers;
          setMarkers(oldMarkers => [...oldMarkers, indvPoint])
    })
  }, [])


//   const fetchHurricanePoints = async () => {
//     const hurricanePoints = await fetch(URL).then((res) => res.json().then(data => {return data.data}))
//     hurricanePoints.forEach((point) => {
//           let { Name, Latitude, Longitude } = point
//           const indvPoint = {
//             name: "Kate",
//             coordinates: [Longitude, Latitude],
//             markerOffset: 25,
//           }
//           console.log("Point", indvPoint)
//           const oldMarkers = markers;
//           setMarkers(oldMarkers => [...oldMarkers, indvPoint])
//     })
// }

  return (
    <div style={{backgroundColor: "#006994"}}>
      <ComposableMap data-tip="" projection="geoMercator" >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const {NAME} = geo.properties;
                    setContent(NAME);
                  }}
                  onMouseLeave={() => {
                    setContent("");
                  }}
                  style={{
                    default: {
                      fill: "#567d46",
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset }) => (
            <Marker coordinates={coordinates}>
              <circle r={3} fill="#F00" stroke="#fff" strokeWidth={2} onMouseOver={() => setContent(coordinates)}/>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip textColor="white">{content}</ReactTooltip>
    </div>
  );
};

export default memo(MapChart);
