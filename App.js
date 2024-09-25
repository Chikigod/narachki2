import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const requestedIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const defaultCenter = [41.998, 21.428];

const orderLocation = {
  lat: 41.998, 
  lng: 21.428,
};

const tables = [
  { id: 1, position: [41.9980, 21.4280], status: 'available' }, 
  { id: 2, position: [41.9980, 21.4281], status: 'available' },
  { id: 3, position: [41.9980, 21.4282], status: 'available' },
  { id: 4, position: [41.9981, 21.4280], status: 'available' },
];

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [tablesState, setTablesState] = useState(tables); 
  const mapRef = useRef(); 

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          if (mapRef.current) {
            // Fit the map to include both user and order locations
            const bounds = L.latLngBounds([location, orderLocation]);
            mapRef.current.fitBounds(bounds);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const requestTable = (tableId) => {
    setTablesState((prevState) =>
      prevState.map((table) =>
        table.id === tableId ? { ...table, status: 'requested' } : table
      )
    );
  };

  return (
    <div className="App">
      <h1 className="title">Coffee Shop Order Tracking</h1>
      
      <div className="map-wrapper">
        <MapContainer
          center={defaultCenter} 
          zoom={20} 
          className="map-container"
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }} 
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={customIcon}>
              <Popup>You are here!</Popup>
            </Marker>
          )}

          {/* Order Location Marker */}
          <Marker position={[orderLocation.lat, orderLocation.lng]} icon={customIcon}>
            <Popup>Order Location: Coffee Shop in Skopje</Popup>
          </Marker>

          {/* Table Markers */}
          {tablesState.map((table) => (
            <Marker
              key={table.id}
              position={table.position}
              icon={table.status === 'requested' ? requestedIcon : customIcon}
              eventHandlers={{
                click: () => requestTable(table.id),
              }}
            >
              <Popup>
                Table {table.id} is {table.status}.
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;