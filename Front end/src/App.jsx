import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import Cart from './components/Cart'; // Import Cart component
import SingleBook from './components/SingleBook';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import Home from './components/Home';
import Checkout from './components/Checkout'; // Import Checkout component
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cartItems, setCartItems] = useState([]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const addToCart = (book) => {
    setCartItems((prevItems) => [...prevItems, book]);
  };

  const handleRemove = (bookId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== bookId));
  };

  const handleCheckout = (billingInfo) => {
    // Handle checkout logic here, e.g., process payment, clear cart, etc.
    console.log('Handling checkout with:', billingInfo);
    // Example: Clear cart after successful checkout
    setCartItems([]);
  };
  

  return (
    <div>
      <video className="video-background" autoPlay loop muted>
        <source src="https://v.ftcdn.net/07/72/64/15/240_F_772641572_PfThw26Al2RX8CGRpZv656aDjiyyZnVN_ST.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-content"></div>
      <Navigation token={token} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList addToCart={addToCart} />} />
        <Route path="/books/:id" element={<SingleBook token={token} />} />
        <Route path="/login" element={<Login setToken={handleLogin} />} />
        <Route path="/register" element={<Register setToken={handleLogin} />} />
        <Route path="/account" element={<Account token={token} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} handleRemove={handleRemove} />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} handleCheckout={handleCheckout} />} />
      </Routes>      
    </div>
  );
}

export default App;
