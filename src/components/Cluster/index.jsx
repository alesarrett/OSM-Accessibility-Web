import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useMap } from 'react-leaflet';
import { customMarker } from '../../constants';

const mcg = L.markerClusterGroup();

const MarkerCluster = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    mcg.clearLayers();
    markers.forEach(({ position, text }) =>
      L.marker(new L.LatLng(position[1], position[0]), {
        icon: customMarker
      })
        .addTo(mcg)
        .bindPopup(text)
    );

    // optionally center the map around the markers
    // map.fitBounds(mcg.getBounds());
    // // add the marker cluster group to the map
    map.addLayer(mcg);
  }, [markers, map]);

  return null;
};

export default MarkerCluster;