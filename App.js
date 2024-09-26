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

const coffeeShopLocation = [41.799, 20.909];

const jsonData = {
  callTypeId: "W",
  localization: [
    { language: "en", description: "Call Waiter" },
    { language: "mk", description: "Повикај келнер" },
    { language: "en", description: "Payment" },
    { language: "mk", description: "Плаќање" },
    { language: "en", description: "Custom Order" },
    { language: "mk", description: "Прилагодена нарачка" }
  ]
};

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [showAccuracyAlert, setShowAccuracyAlert] = useState(false);
  const [formData, setFormData] = useState({ name: '', orderType: '', location: {} });
  const mapRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy: locationAccuracy } = position.coords;
          setUserLocation([latitude, longitude]);
          setAccuracy(locationAccuracy);

          if (locationAccuracy < 20) {
            const location = { lat: latitude, lng: longitude, accuracy: locationAccuracy };
            const dataToSend = { ...formData, location };
            console.log('Form Data:', JSON.stringify(dataToSend));
          } else {
            setShowAccuracyAlert(true);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCloseAccuracyAlert = () => {
    setShowAccuracyAlert(false);
  };

  return (
    <div className="App">
      <h1 className="title">Coffee Shop Order Tracking</h1>
      <form onSubmit={handleSubmit} className="order-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <select
          name="orderType"
          value={formData.orderType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Order Type</option>
          {jsonData.localization
            .filter(item => item.language === "en")
            .map((item, index) => (
              <option key={index} value={item.description}>
                {item.description}
              </option>
            ))}
        </select>
        <button type="submit">Submit Order</button>
      </form>

      <div className="map-wrapper">
        <MapContainer
          center={coffeeShopLocation}
          zoom={18}
          className="map-container"
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coffeeShopLocation} icon={customIcon}>
            <Popup>Coffee Shop.</Popup>
          </Marker>
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

      {showAccuracyAlert && (
        <div className="accuracy-alert">
          <p>Please turn on your GPS.</p>
          <button onClick={handleCloseAccuracyAlert}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
