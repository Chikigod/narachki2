import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon for the marker
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const coffeeShopLocation = [41.981, 21.431]; // Coffee shop location

function WaiterView({ orders }) { // Accept orders as a prop
  const [waiterLocation, setWaiterLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  // Function to watch waiter's location in real-time
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy: locationAccuracy } = position.coords;
          setWaiterLocation([latitude, longitude]); // Update waiter's location
          setAccuracy(locationAccuracy); // Update accuracy radius
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      // Cleanup the watchPosition when component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div>
      <h1>Order Tracking</h1>

      {orders.length > 0 && (
        <div>
          <h2>Current Orders:</h2>
          <ul>
            {orders.map((order, index) => (
              <li key={index}>
                {order.name} - {order.orderTypeId} (Location: {order.location.lat.toFixed(4)}, {order.location.lng.toFixed(4)})
              </li>
            ))}
          </ul>
        </div>
      )}

      {waiterLocation ? (
        <MapContainer center={waiterLocation} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Waiter's location marker */}
          <Marker position={waiterLocation} icon={customIcon}>
            <Popup>Your current location (Waiter)</Popup>
          </Marker>
          
          {/* Accuracy circle around waiter's location */}
          <Circle center={waiterLocation} radius={accuracy} fillColor="blue" />
          
          {/* Coffee shop location marker */}
          <Marker position={coffeeShopLocation} icon={customIcon}>
            <Popup>Coffee Shop Location</Popup>
          </Marker>

          {/* Order location markers */}
          {orders.map((order, index) => (
            <Marker key={index} position={[order.location.lat, order.location.lng]} icon={customIcon}>
              <Popup>
                Order for {order.name}<br />Type: {order.orderTypeId}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Locating waiter...</p>
      )}
    </div>
  );
}

export default WaiterView;
