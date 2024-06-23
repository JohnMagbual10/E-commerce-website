import React from 'react';
import { Link } from 'react-router-dom';

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
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h3 className="cart-summary-title">Cart Summary</h3>
        <p className="cart-total">Total: ${calculateTotal()}</p>
        {/* Link to checkout page */}
        <Link to="/checkout">
          <button className="cart-checkout-button" onClick={handleCheckoutClick}>
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;