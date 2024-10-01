import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import Login from './Login'; 
import Register from './Register'; 
import Home from './Home';  
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
  return (
    <Router>
      <div className="App">
        {/* Define routes for registration, login, and home */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
