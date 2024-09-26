import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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

const coffeeShopLocation = [41.799, 20.908];

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null); 
  const [isWaiterCalled, setIsWaiterCalled] = useState(false); 
  const mapRef = useRef(); 

  const handleCallWaiter = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy: locationAccuracy } = position.coords;

          console.log(`Location accuracy: ${locationAccuracy} meters`);

          setUserLocation([latitude, longitude]);
          setAccuracy(locationAccuracy); 
          setIsWaiterCalled(true); 
          if (mapRef.current) {
            const bounds = L.latLngBounds([[latitude, longitude], coffeeShopLocation]);
            mapRef.current.fitBounds(bounds);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location.');
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="App">
      <h1 className="title">Coffee Shop Order Tracking</h1>
      
      <div className="controls">
        <button onClick={handleCallWaiter}>Call Waiter</button>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={coffeeShopLocation} 
          zoom={20}
          className="map-container"
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Coffee Shop Location Marker */}
          <Marker position={coffeeShopLocation} icon={customIcon}>
            <Popup>Coffee Shop: You are here in Skopje!</Popup>
          </Marker>

          {/* User Location Marker and Accuracy Circle (when they call the waiter) */}
          {userLocation && (
            <>
              <Marker position={userLocation} icon={customIcon}>
                <Popup>You are here!</Popup>
              </Marker>
              {accuracy && (
                <Circle
                  center={userLocation}
                  radius={accuracy}
                  color="blue"
                  fillOpacity={0.2}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>
      
      {isWaiterCalled && (
        <div className="notification">
          <p>Waiter has been called! Your location is visible on the map.</p>
        </div>
      )}
    </div>
  );
}

export default App;