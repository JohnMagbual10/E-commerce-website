import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList'; // Rename BookList to ProductList if needed
import Cart from './components/Cart';
import SingleProduct from './components/SingleProduct'; // Rename SingleBook to SingleProduct if needed
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import Home from './components/Home';
import Checkout from './components/Checkout';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cartItems, setCartItems] = useState([]);

  // Fetch products from backend
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Update with your backend API URL
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Product Fetch Error:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const handleRemove = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  const handleCheckout = (billingInfo) => {
    console.log('Handling checkout with:', billingInfo);
    setCartItems([]); // Placeholder logic to clear cart after checkout
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
        <Route path="/products" element={<ProductList products={products} addToCart={addToCart} />} />
        <Route path="/products/:id" element={<SingleProduct token={token} />} />
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
