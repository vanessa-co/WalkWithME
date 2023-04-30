// src/utils/fetchWalkingTrails.js
const overpassApiUrl = 'https://overpass-api.de/api/interpreter';

export async function fetchWalkingTrails({ lat, lng }) {
  const query = `
    [out:json][timeout:60];
    (
      way["highway"="footway"](${lat - 0.01},${lng - 0.01},${lat + 0.01},${lng + 0.01});
      way["highway"="path"](${lat - 0.01},${lng - 0.01},${lat + 0.01},${lng + 0.01});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch(overpassApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    type: 'FeatureCollection',
    features: data.elements
      .filter((element) => element.type === 'way')
      .map((element) => ({
        type: 'Feature',
        id: element.id,
        geometry: {
          type: 'LineString',
          coordinates: element.nodes.map((nodeId) => {
            const node = data.elements.find((node) => node.id === nodeId);
            return [node.lon, node.lat];
          }),
        },
      })),
  };
}
