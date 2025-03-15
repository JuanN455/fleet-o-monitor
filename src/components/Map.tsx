import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { io, Socket } from "socket.io-client";

interface Vehicle {
  id: string;
  latitude: number;   // Aquí se almacenará la latitud real
  longitude: number;  // y la longitud real
  isOn: boolean;  
  plate: string;
}

const Map = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Conectar a WebSocket
    socket.current = io('https://8b6b-190-122-96-74.ngrok-free.app', {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log('Conectado al WebSocket con ID', socket.current?.id);
    });

    socket.current.on("connect_error", (err) => {
      console.error('Error en la conexión WebSocket:', err);
    });

    socket.current.on("location", (data) => {
      console.log('Datos recibidos:', data);

      // Si data no es un array, convertirlo en uno
      const newVehicles = Array.isArray(data) ? data : [data];

      setVehicles((prevVehicles) => {
        return newVehicles.map((vehicle: any) => {
          // Usar vehicle.vehicleId si existe, sino vehicle.id
          const vid = vehicle.vehicleId ? String(vehicle.vehicleId) : vehicle.id;
          // Como los datos están invertidos, intercambiamos los valores:
          const actualLatitude = parseFloat(vehicle.latitude); // Lo que viene como "longitude" es la latitud real
          const actualLongitude = parseFloat(vehicle.longitude);   // Lo que viene como "latitude" es la longitud real

          if (isNaN(actualLatitude) || isNaN(actualLongitude)) {
            console.error("Coordenadas inválidas recibidas:", vehicle);
            return null;
          }

          const existingVehicle = prevVehicles.find((v) => v.id === vid);
          return existingVehicle
            ? { ...existingVehicle, latitude: actualLatitude, longitude: actualLongitude }
            : { id: vid, latitude: actualLatitude, longitude: actualLongitude, isOn: true, plate: vehicle.id || 'Unknown' };
        }).filter(Boolean); // Filtrar null
      });
    });

    socket.current.on("disconnect", () => {
      console.log("Desconectado del servidor de WebSockets");
    });

    // Configurar Mapbox
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtdWVsZXBsIiwiYSI6ImNtN2g2aXA3ajAxd3Mya29uN2hvZ3hhMGkifQ._7s-W5FFZ0ouX20vHZ-zHQ';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-69.9312, 18.4861], // [lng, lat]
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    vehicles.forEach((vehicle) => {
      if (!markers.current[vehicle.id]) {
        if (isNaN(vehicle.latitude) || isNaN(vehicle.longitude)) {
          console.error("Coordenadas inválidas en el vehículo:", vehicle);
          return;
        }

        // Crear el marcador
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center';
        el.innerHTML = `<div class="w-4 h-4 rounded-full bg-success"></div>`;

        // Crear popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${vehicle.plate}</strong><br>Status: ${vehicle.isOn ? 'Active' : 'Inactive'}`
        );

        markers.current[vehicle.id] = new mapboxgl.Marker(el)
          .setLngLat([vehicle.longitude, vehicle.latitude]) // [lng, lat] usando los valores ya corregidos
          .setPopup(popup)
          .addTo(map.current);
      } else {
        markers.current[vehicle.id].setLngLat([vehicle.longitude, vehicle.latitude]);
      }
    });

    // Eliminar marcadores que ya no están en el estado
    Object.keys(markers.current).forEach((id) => {
      if (!vehicles.some((v) => v.id === id)) {
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
