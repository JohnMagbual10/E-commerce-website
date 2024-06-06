import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/Booklist';
import SingleBook from './components/SingleBook';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/user authentication/Account';
import Home from './components/Home';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token')); // Initialize token from localStorage

  const handleLogin = (newToken) => {
    setToken(newToken); // Update token in state
    localStorage.setItem('token', newToken); // Save token to localStorage
  };

  const handleLogout = () => {
    setToken(null); // Clear token in state
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
        <div>
        {/* Video Background */}
        <video className="video-background" autoPlay loop muted>
          <source src="https://v.ftcdn.net/07/72/64/15/240_F_772641572_PfThw26Al2RX8CGRpZv656aDjiyyZnVN_ST.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-content"></div>
        <Navigation token={token} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList token={token} />} />
          <Route path="/books/:id" element={<SingleBook token={token} />} />
          <Route path="/login" element={<Login setToken={handleLogin} />} />
          <Route path="/register" element={<Register setToken={handleLogin} />} />
          <Route path="/account" element={<Account token={token} />} />
        </Routes>      
         
      </div>
  );
}

export default App;