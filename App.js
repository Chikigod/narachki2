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

const coffeeShopLocation = [41.981, 21.431];

const jsonData = {
  localization: [
    { callTypeId: "W", language: "en", description: "Call Waiter" },
    { callTypeId: "W", language: "mk", description: "Повикај келнер" },
    { callTypeId: "P", language: "en", description: "Payment" },
    { callTypeId: "P", language: "mk", description: "Плаќање" },
    { callTypeId: "C", language: "en", description: "Custom Order" },
    { callTypeId: "C", language: "mk", description: "Прилагодена нарачка" }
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

  const showNotification = (message) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        const notification = new Notification(message, {
          body: 'Click to view more details', 
          icon: 'https://example.com/icon.png'
        });

        notification.onclick = () => {
        };

        const audio = new Audio('/sound.wav');
        audio.play();

      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const notification = new Notification(message, {
              body: 'Click to view more details', 
              icon: 'https://example.com/icon.png' 
            });

            notification.onclick = () => {
          
            };

            const audio = new Audio('/sound.wav');
            audio.play();
          }
        });
      } else {
        alert("Notifications are disabled. Please enable them in your browser settings.");
      }
    } else {
      alert("This browser does not support notifications.");
    }
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

            const userAgent = navigator.userAgent;
            let os = "Unknown OS";
            let deviceType = "Unknown Device";
            let browser = "Unknown Browser";
            let browserVersion = "Unknown Version";
            let appVersion = "1.0.0"; // Replace this with actual app version logic if needed
            let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let language = navigator.language || navigator.userLanguage; 
            let browserSize = { width: window.innerWidth, height: window.innerHeight }; 
            let deviceScreenSize = { width: window.screen.width, height: window.screen.height };

            if (userAgent.includes("Windows NT 10.0")) {
              os = "Windows 11"; 
              deviceType = "Desktop";
            } else if (userAgent.includes("Mac OS X")) {
              os = "Mac OS";
              deviceType = "Desktop";
            } else if (userAgent.includes("Linux")) {
              os = "Linux";
              deviceType = "Desktop";
            } else if (userAgent.includes("Android")) {
              os = "Android";
              deviceType = "Mobile";
            } else if (userAgent.includes("iPhone")) {
              os = "iOS";
              deviceType = "Mobile";
            } else if (userAgent.includes("iPad")) {
              os = "iOS";
              deviceType = "Tablet";
            } else if (userAgent.includes("Windows Phone")) {
              os = "Windows Phone";
              deviceType = "Mobile";
            }

            if (userAgent.includes("Chrome")) {
              browser = "Chrome";
              browserVersion = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || "Unknown Version";
            } else if (userAgent.includes("Firefox")) {
              browser = "Firefox";
              browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "Unknown Version";
            } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
              browser = "Safari";
              browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "Unknown Version";
            } else if (userAgent.includes("Edge")) {
              browser = "Edge";
              browserVersion = userAgent.match(/Edg\/(\d+\.\d+\.\d+\.\d+)/)?.[1] || "Unknown Version";
            }

            const { orderType, ...restFormData } = formData;
            const dataToSend = { 
              name: restFormData.name, 
              orderTypeId: orderType, 
              location, 
              deviceType, 
              os, 
              browser, 
              browserVersion, 
              appVersion, 
              timeZone, 
              language, 
              browserSize, 
              deviceScreenSize 
            };

            console.log('Form Data:', JSON.stringify(dataToSend));

            if (orderType === "W") {
              showNotification("Your waiter has arrived!");
            } else if (orderType === "P") {
              showNotification("Your waiter has arrived!");
            } else if (orderType === "C") {
              showNotification("Your waiter has arrived!");
            }

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
              <option key={index} value={item.callTypeId}>
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
          <p>Turn on your GPS.</p>
          <button onClick={handleCloseAccuracyAlert}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
