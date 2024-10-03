import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import Login from './Login'; 
import Register from './Register'; 
import Home from './Home';  
import WaiterView from './WaiterView'; // Import WaiterView
import 'leaflet/dist/leaflet.css'; 
import './index.css';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token'); 
    return token !== null; 
  };

  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  const [orders, setOrders] = useState([]); // State to hold orders

  const updateOrders = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]); // Update orders with the new order
  };

  return (
    <Router>
      <div className="App">
        {/* Define routes for registration, login, home, and waiter view */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/home" element={<PrivateRoute element={<Home updateOrders={updateOrders} />} />} />
          <Route path="/waiter" element={<PrivateRoute element={<WaiterView orders={orders} />} />} /> {/* Pass orders to WaiterView */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
