import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import L from 'leaflet';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const coffeeShopLocation = [41.981, 21.431]; // Coffee shop coordinates

// Function to detect operating system
const getOperatingSystem = () => {
  const { userAgent } = navigator;
  if (userAgent.indexOf('Windows NT 10.0') !== -1) return 'Windows 10';
  if (userAgent.indexOf('Windows NT 11.0') !== -1) return 'Windows 11';
  if (userAgent.indexOf('Mac OS X') !== -1) return 'Mac OS';
  if (userAgent.indexOf('Linux') !== -1) return 'Linux';
  if (userAgent.indexOf('Android') !== -1) return 'Android';
  if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) return 'iOS';
  return 'Unknown OS';
};

// Function to detect browser
const getBrowser = () => {
  const { userAgent } = navigator;
  if (userAgent.indexOf('Chrome') !== -1) return 'Chrome';
  if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) return 'Safari';
  if (userAgent.indexOf('Firefox') !== -1) return 'Firefox';
  if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1) return 'Internet Explorer';
  if (userAgent.indexOf('Edge') !== -1) return 'Edge';
  return 'Unknown Browser';
};

const Home = () => {
  const [userLocation, setUserLocation] = useState(null); // User's location initially null
  const [accuracy, setAccuracy] = useState(null);
  const [formData, setFormData] = useState({ name: '', orderType: '', location: {} });
  const mapRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirect if not authenticated
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit event triggered');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy: locationAccuracy } = position.coords;
          setUserLocation([latitude, longitude]); // Update user location
          setAccuracy(locationAccuracy);

          // Get detailed device info
          const screenSize = `${window.innerWidth}x${window.innerHeight}`; // Screen size
          const os = getOperatingSystem(); // Detect OS
          const browser = getBrowser(); // Detect Browser

          const dataToSend = {
            name: formData.name,
            orderTypeId: formData.orderType,
            location: { lat: latitude, lng: longitude },
            locationAccuracy,
            screenSize,
            os, // Include the detected OS
            browser, // Include the detected Browser
          };

          // Log the full form data without deviceType
          console.log('Form Data:', JSON.stringify(dataToSend));

          if (locationAccuracy > 20) {
            toast.warn('Turn on GPS please.'); // Notification for low accuracy
            return;
          }

          toast.success('Order submitted successfully!'); // Success notification
          setFormData({ name: '', orderType: '', location: {} }); // Clear form
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to retrieve your location.'); // Error notification
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="title">Coffee Shop Order Tracking</h1> 

      <div className="carousel-container">
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          interval={3000}
          stopOnHover={true}
        >
          <div>
            <img src="/coffee-stock-600x450.jpg" alt="Coffee" />
            <p className="legend">Coffee</p>
          </div>
          <div>
            <img src="/Orangejuice.jpg" alt="Orange Juice" />
            <p className="legend">Juice</p>
          </div>
          <div>
            <img src="/easy_chocolate_cake_slice-500x500.jpg" alt="Chocolate Cake" />
            <p className="legend">Cake</p>
          </div>
        </Carousel>
      </div>

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
          <option value="W">Call Waiter</option>
          <option value="P">Payment</option>
          <option value="C">Custom Order</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      <MapContainer
        center={userLocation || coffeeShopLocation} // Center on user or coffee shop
        zoom={15}
        ref={mapRef}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker for user's location if available */}
        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Marker for coffee shop location */}
        <Marker position={coffeeShopLocation} icon={customIcon}>
          <Popup>Coffee Shop Location</Popup>
        </Marker>

        {userLocation && (
          <Circle
            center={userLocation}
            radius={accuracy}
            pathOptions={{ fillColor: 'blue' }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Home;
