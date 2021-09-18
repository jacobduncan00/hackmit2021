import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({ setTooltipContent }) => {
  const [markers, setMarkers] = useState([]);
  const markers = [
    {
      markerOffset: 25,
      name: "Buenos Aires",
      coordinates: [-58.3816, -34.6037],
    },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/get-hurricane-data").then((data) => {
      console.log(data);
      setMarkers(...markers, data.coordinate);
    });
  });

  return (
    <div style={{ backgroundColor: "#006994" }}>
      <ComposableMap data-tip="" projection="geoMercator">
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME } = geo.properties;
                    setTooltipContent(NAME);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
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
            <Marker key={name} coordinates={coordinates}>
              <circle r={5} fill="#F00" stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{
                  fontFamily: "system-ui",
                  fill: "#F00",
                  fontSize: "15px",
                }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);
