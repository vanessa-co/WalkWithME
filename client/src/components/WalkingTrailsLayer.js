// src/components/WalkingTrailsLayer.js
import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { fetchWalkingTrails } from '../utils/fetchWalkingTrails';

function WalkingTrailsLayer({ location }) {
  const [walkingTrails, setWalkingTrails] = useState(null);

  useEffect(() => {
    if (location && location.lat && location.lng) {
      fetchWalkingTrails(location)
        .then((data) => setWalkingTrails(data))
        .catch((error) => console.error(error));
    }
  }, [location]);

  return walkingTrails ? <GeoJSON key="walking-trails" data={walkingTrails} /> : null;
}

export default WalkingTrailsLayer;