import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import L from 'leaflet';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Login from './Login'; 
import Register from './Register'; 
import Home from './Home';  


const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const coffeeShopLocation = [41.981, 21.431];

function App() {
  const [userLocation, setUserLocation] = useState(coffeeShopLocation); 
  const [accuracy, setAccuracy] = useState(null);
  const [formData, setFormData] = useState({ name: '', orderType: '', location: {} });
  const mapRef = useRef();

  const isAuthenticated = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData && userData.token; 
  };

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
            const dataToSend = { 
              name: formData.name, 
              orderTypeId: formData.orderType, 
              location 
            };
            console.log('Form Data:', JSON.stringify(dataToSend));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location.');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <Router>
      <div className="App">
        {/* Define routes for registration, login, and home */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
