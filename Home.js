import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import './index.css'; 


const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});


const coffeeShopLocation = [41.981, 21.431];


const appVersion = "1.0.0"; 

function Home() {
  const [userLocation, setUserLocation] = useState(coffeeShopLocation); 
  const [accuracy, setAccuracy] = useState(null);
  const [formData, setFormData] = useState({ name: '', orderType: '' });
  const [notificationVisible, setNotificationVisible] = useState(false);
  const mapRef = useRef();

  
  const getBrowserName = (userAgent) => {
    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
      return "Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
      return "Internet Explorer";
    } else {
      return "Unknown Browser";
    }
  };

 
  const getOSName = (userAgent) => {
    if (userAgent.indexOf("Win") > -1) {
      return "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
      return "MacOS";
    } else if (userAgent.indexOf("X11") > -1 || userAgent.indexOf("Linux") > -1) {
      return "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
      return "Android";
    } else if (userAgent.indexOf("like Mac") > -1) {
      return "iOS";
    } else {
      return "Unknown OS";
    }
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

          
          if (locationAccuracy > 20) {
            alert("Please turn on your GPS"); 
            return; 
          }

          
          const userAgent = navigator.userAgent;
          const browserName = getBrowserName(userAgent); 
          const osName = getOSName(userAgent); 
          const windowSize = { width: window.innerWidth, height: window.innerHeight };
          const deviceSize = { width: window.screen.width, height: window.screen.height };
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 

         
          const dataToSend = { 
            name: formData.name, 
            orderTypeId: formData.orderType, 
            location: { lat: latitude, lng: longitude, accuracy: locationAccuracy },
            browser: browserName, 
            os: osName, 
            appVersion, 
            windowSize, 
            deviceSize, 
            timeZone 
          };
          console.log('Form Data:', JSON.stringify(dataToSend));

          
          setNotificationVisible(true);

          
          if (Notification.permission === "granted") {
            new Notification("Waiter is coming!");
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Waiter is coming!");
              }
            });
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

  
  const dismissNotification = () => {
    setNotificationVisible(false);
  };

  return (
    <div>
      <h1>Welcome to the Coffee Shop</h1>
      <form onSubmit={handleSubmit}>
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
          <option value="">Select Order Type</option>
          <option value="callWaiter">Call Waiter</option>
          <option value="payment">Payment</option>
          <option value="customOrder">Custom Order</option>
        </select>
        <button type="submit">Submit Order</button>
      </form>

      {/* Notification for Order Submission */}
      {notificationVisible && (
        <div className="notification">
          <p>Your order has been submitted successfully!</p>
          <button onClick={dismissNotification}>Dismiss</button>
        </div>
      )}

      {/* Map Display */}
      <MapContainer center={userLocation} zoom={13} ref={mapRef} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* User Location Marker */}
        <Marker position={userLocation} icon={customIcon}>
          <Popup>Your current location</Popup>
        </Marker>
        <Circle center={userLocation} radius={accuracy} fillColor="blue" />
        
        {/* Coffee Shop Location Marker */}
        <Marker position={coffeeShopLocation} icon={customIcon}>
          <Popup>Coffee Shop Location</Popup>
        </Marker>
      </MapContainer>

      {/* Carousel Component */}
      <div className="carousel-container">
        <Carousel showThumbs={true} thumbWidth={40}>
          <div>
            <img src="\coffee-stock-600x450.jpg" alt="Coffee" className="carousel-image" />
            <p className="legend">Slide 1</p>
          </div>
          <div>
            <img src="\Orangejuice.jpg" alt="Juice" className="carousel-image" />
            <p className="legend">Slide 2</p>
          </div>
          <div>
            <img src="\easy_chocolate_cake_slice-500x500.jpg" alt="Cake" className="carousel-image" />
            <p className="legend">Slide 3</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
