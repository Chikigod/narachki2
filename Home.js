import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import './index.css'; 
import axios from 'axios'; // Add this import to use Axios for API requests

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

function Home({ updateOrders }) {
  const [userLocations, setUserLocations] = useState([]);
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

  const haversineDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const checkRadiusMeeting = (location) => {
    const coffeeShopRadius = 50; // Radius for coffee shop in kilometers
    const userRadius = accuracy / 1000; // Convert accuracy to kilometers
    
    const distance = haversineDistance(
      { lat: coffeeShopLocation[0], lng: coffeeShopLocation[1] },
      location
    );

    if (distance <= (userRadius + coffeeShopRadius)) {
      alert('The radius meet.');
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
        async (position) => {
          const { latitude, longitude, accuracy: locationAccuracy } = position.coords;
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
            location: { lat: latitude, lng: longitude }, // User's location
            browser: browserName,
            os: osName,
            appVersion,
            windowSize,
            deviceSize,
            timeZone
          };
          console.log('Form Data:', JSON.stringify(dataToSend));

          // Update locations state to include the new location
          setUserLocations((prevLocations) => {
            const newLocations = [...prevLocations, { lat: latitude, lng: longitude }];
            // Check for radius meeting after updating locations
            newLocations.forEach(checkRadiusMeeting);
            return newLocations;
          });

          // Send the data to your backend API using Axios
          try {
            const response = await axios.post(
              'https://localhost:7159/api/KipreHome', // Change this to your actual API endpoint
              dataToSend
            );
            console.log('Order successfully submitted:', response.data);

            // Pass the order data up to update parent component state
            updateOrders(response.data); 

            // Show the notification
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
          } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit your order. Please try again.');
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
      <div className="map-wrapper">
        <div className="map-container">
          <MapContainer center={coffeeShopLocation} zoom={13} ref={mapRef} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Render User Location Markers */}
            {userLocations.map((location, index) => (
              <Marker key={index} position={location} icon={customIcon}>
                <Popup>Your order location</Popup>
              </Marker>
            ))}
            
            {/* Coffee Shop Location Marker */}
            <Marker position={coffeeShopLocation} icon={customIcon}>
              <Popup>Coffee Shop Location</Popup>
            </Marker>

            {/* Circles for Accuracy */}
            {userLocations.map((location, index) => (
              <Circle key={index} center={location} radius={accuracy} fillColor="blue" fillOpacity={0.2} />
            ))}
            <Circle center={coffeeShopLocation} radius={50} fillColor="green" fillOpacity={0.2} /> {/* Example radius for coffee shop */}
          </MapContainer>
        </div>
      </div>

      {/* Carousel Component */}
      <div className="carousel-container">
        <Carousel>
          <div>
            <img src="\coffee-stock-600x450.jpg" alt="Coffee" />
            <p className="legend">Coffee Image 1</p>
          </div>
          <div>
            <img src="\easy_chocolate_cake_slice-500x500.jpg" alt="Coffee" />
            <p className="legend">Coffee Image 2</p>
          </div>
          <div>
            <img src="\Orangejuice.jpg" alt="Coffee" />
            <p className="legend">Coffee Image 3</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
