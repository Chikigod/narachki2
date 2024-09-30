import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import L from 'leaflet';
import { Carousel } from 'react-responsive-carousel';
import { toast, ToastContainer } from 'react-toastify'; // Importing toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for notifications

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const coffeeShopLocation = [41.981, 21.431];

const Home = () => {
  const [userLocation, setUserLocation] = useState(coffeeShopLocation); // Default to coffee shop
  const [accuracy, setAccuracy] = useState(null);
  const [formData, setFormData] = useState({ name: '', orderType: '', location: {} });
  const mapRef = useRef();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
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
    console.log('Submit event triggered'); // Debug log

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy: locationAccuracy } = position.coords;
          setUserLocation([latitude, longitude]); // Update user location
          setAccuracy(locationAccuracy);

          // Log all required information to console
          const deviceType = navigator.userAgent; // Get device type
          const screenSize = `${window.innerWidth}x${window.innerHeight}`; // Get screen size
          const os = navigator.platform; // Get operating system
          const browser = navigator.userAgent; // Get browser information

          const dataToSend = { 
            name: formData.name, 
            orderTypeId: formData.orderType, 
            location: { lat: latitude, lng: longitude },
            locationAccuracy,
            screenSize,
            deviceType,
            os,
            browser
          };

          // Log the full form data
          console.log('Form Data:', JSON.stringify(dataToSend));

          // Check location accuracy and handle accordingly
          if (locationAccuracy > 20) {
            console.log('Location accuracy is greater than 20 meters:', locationAccuracy); // Debug log
            toast.warn('Turn on GPS please.'); // Notification for low accuracy
            return; // Prevent further action
          }

          // Show success notification if accuracy is acceptable
          toast.success('Order submitted successfully!');

          // Clear form after submission
          setFormData({ name: '', orderType: '', location: {} });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to retrieve your location.');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div>
      <ToastContainer /> {/* Add ToastContainer here */}
      <h1 className="title">Coffee Shop Order Tracking</h1>

      {/* Smaller Carousel */}
      <div className="carousel-container">
        <Carousel showArrows={true} autoPlay={true} infiniteLoop={true}>
          <div>
            <img src="\coffee-stock-600x450.jpg" alt="Carousel 1" />
            <p className="legend">Coffee</p>
          </div>
          <div>
            <img src="\Orangejuice.jpg" alt="Carousel 2" />
            <p className="legend">Juice</p>
          </div>
          <div>
            <img src="\easy_chocolate_cake_slice-500x500.jpg" alt="Carousel 3" />
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

      {/* Display map */}
      <MapContainer
        center={userLocation || coffeeShopLocation}
        zoom={15}
        ref={mapRef}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userLocation || coffeeShopLocation} icon={customIcon}>
          <Popup>Your current location</Popup>
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
