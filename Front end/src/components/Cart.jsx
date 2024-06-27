import React from 'react';
import { Link } from 'react-router-dom';

<<<<<<< HEAD
const Cart = ({ cartItems, handleRemove }) => {
  // Ensure cartItems is an array
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  // Function to handle checkout button click
  const handleCheckoutClick = () => {
    // You can perform any necessary actions here before navigating to checkout
    console.log('Proceeding to checkout...');
  };

  return (
    <div className="book-list-container">
      <h2>Shopping Cart</h2>
      <ul className="book-list">
        {cartItems.map(item => (
          <li key={item.id} className="book">
            <Link to={`/books/${item.id}`}>
              <h3>{item.title}</h3>
            </Link>
            <p>Author: {item.author}</p>
            <p>Description: {item.description}</p>
            <img src={item.coverimage} alt={item.title} />
            <p>Price: ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
            <button className="add-to-cart-button" onClick={() => handleRemove(item.id)}>
              Remove from Cart
            </button>
=======
const Cart = ({ token, cartItems, handleRemove, handleUpdateQuantity }) => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shipping_address: 'Your Address', billing_address: 'Your Billing Address' }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Checkout successful');
      } else {
        console.error('Checkout failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <ul className="cart-items">
        {cartItems.map(item => (
          <li key={item.id} className="cart-item">
            <Link to={`/products/${item.id}`}>
              <h3>{item.name}</h3>
            </Link>
            <p>Price: ${Number(item.price).toFixed(2)}</p>
            <p>
              Quantity: 
              <input 
                type="number" 
                value={item.quantity} 
                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                min="1"
              />
            </p>
            <p>Total: ${(Number(item.price) * item.quantity).toFixed(2)}</p>
            <button onClick={() => handleRemove(item.id)}>Remove</button>
>>>>>>> 008859a (update account component)
          </li>
        ))}
      </ul>
      <div className="cart-summary">
<<<<<<< HEAD
        <h3 className="cart-summary-title">Cart Summary</h3>
        <p className="cart-total">Total: ${calculateTotal()}</p>
        {/* Link to checkout page */}
        <Link to="/checkout">
          <button className="cart-checkout-button" onClick={handleCheckoutClick}>
            Proceed to Checkout
          </button>
=======
        <h3>Cart Summary</h3>
        <p>Total: ${calculateTotal()}</p>
        <Link to="/checkout">
          <button>Proceed to Checkout</button>
>>>>>>> 008859a (update account component)
        </Link>
      </div>
    </div>
  );
};

export default Cart;
