import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import SingleProduct from './components/SingleProduct';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import Home from './components/Home';
import Checkout from './components/Checkout';
import AdminProducts from './components/AdminProducts';
import AdminUsers from './components/AdminUsers';
import SingleAdminProduct from './components/SingleAdminProduct';
import OrderConfirmation from './components/OrderConfirmation'; // Import OrderConfirmation
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
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
    fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(error => console.error('Error fetching user data:', error));
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      if (itemInCart) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemove = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleCheckout = async (billingInfo) => {
    console.log('Handling checkout with:', billingInfo);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: JSON.parse(localStorage.getItem('user')).id,
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          })),
          totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
          billingInfo,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Checkout failed');
      }
  
      const data = await response.json();
      console.log('Checkout successful!', data.orderId);
      setCartItems([]);
      window.location.href = `/order-confirmation/${data.orderId}`;
    } catch (error) {
      console.error('Checkout Error:', error);
    }
  };
  
  
  return (
      <div>
        <video className="video-background" autoPlay loop muted>
          <source src="https://cdn.pixabay.com/video/2022/03/23/111763-692666925_tiny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-content"></div>
        <Navigation token={token} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList products={products} addToCart={addToCart} />} />
          <Route path="/products/:id" element={<SingleProduct token={token} addToCart={addToCart}/>} />
          <Route path="/login" element={<Login setToken={handleLogin} />} />
          <Route path="/register" element={<Register setToken={handleLogin} />} />
          <Route path="/account" element={<ProtectedRoute token={token}><Account token={token} /></ProtectedRoute>} />
          <Route path="/cart" element={<Cart cartItems={cartItems} handleRemove={handleRemove} handleUpdateQuantity={handleUpdateQuantity} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} handleCheckout={handleCheckout} />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/admin/products" element={<ProtectedRoute token={token} isAdmin><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/products/:id" element={<ProtectedRoute token={token} isAdmin><SingleAdminProduct /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute token={token} isAdmin><AdminUsers /></ProtectedRoute>} />
        </Routes>
      </div>
  );
}

export default App;
