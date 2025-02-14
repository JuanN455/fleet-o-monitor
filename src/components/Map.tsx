
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  vehicles: Array<{
    id: string;
    latitude: number;
    longitude: number;
    isOn: boolean;
    plate: string;
  }>;
}

const Map = ({ vehicles }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Update markers
    vehicles.forEach((vehicle) => {
      if (!markers.current[vehicle.id]) {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center';
        el.innerHTML = `<div class="w-4 h-4 rounded-full ${
          vehicle.isOn ? 'bg-success' : 'bg-muted'
        }"></div>`;

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${vehicle.plate}</strong><br>
           Status: ${vehicle.isOn ? 'Active' : 'Inactive'}`
        );

        // Create and store marker
        markers.current[vehicle.id] = new mapboxgl.Marker(el)
          .setLngLat([vehicle.longitude, vehicle.latitude])
          .setPopup(popup)
          .addTo(map.current);
      } else {
        // Update existing marker
        markers.current[vehicle.id].setLngLat([vehicle.longitude, vehicle.latitude]);
      }
    });

    // Remove unused markers
    Object.keys(markers.current).forEach((id) => {
      if (!vehicles.find((v) => v.id === id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });
  }, [vehicles]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
