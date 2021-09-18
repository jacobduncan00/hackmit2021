import { Map, TileLayer, Marker, Popup } from "react-leaflet-universal"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Map2 = () => {
    <Map className="map" center={positionGreenIcon} zoom={this.state.zoom} style={{'fillColor': 'yellow'}}>
         <TileLayer
           url='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiamFjb2JkdW5jYW4wMCIsImEiOiJja3RxOWJjb2owYzA2MnVteGdmbGdyeGpkIn0.FL3xvV4o-Zp5NXHdSFZGdA'
        />
    </Map>
}