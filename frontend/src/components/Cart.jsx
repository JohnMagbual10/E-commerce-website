import React from 'react';
import { Link } from 'react-router-dom';

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
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <p>Total: ${calculateTotal()}</p>
        <Link to="/checkout">
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
