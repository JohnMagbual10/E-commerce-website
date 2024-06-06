import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../api';

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await getCart();
      setCart(response.data);
    };
    fetchCart();
  }, []);

  const handleQuantityChange = (id, quantity) => {
    updateCartItem(id, { quantity });
    setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (id) => {
    removeCartItem(id);
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <section className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map(item => (
            <li key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button>Checkout</button>
    </section>
  );
};

export default Cart;
