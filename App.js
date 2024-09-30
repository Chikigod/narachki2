import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import Login from './Login'; 
import Register from './Register'; 
import Home from './Home';  

function App() {
  const isAuthenticated = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData && userData.token; 
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
