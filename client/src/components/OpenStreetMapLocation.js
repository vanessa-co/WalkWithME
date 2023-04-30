
// src/components/OpenStreetMapLocation.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import WalkingTrailsLayer from './WalkingTrailsLayer';

const containerStyle = {
  width: '100%',
  height: '400px',
};


function OpenStreetMapLocation({ location }) {
  return (
    <MapContainer style={containerStyle} center={location} zoom={15}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <WalkingTrailsLayer location={location} />
      <Marker position={location}>
        <Popup>Review Location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default React.memo(OpenStreetMapLocation);

