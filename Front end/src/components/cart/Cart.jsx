// Cart.jsx
import React from 'react';

const Cart = ({ cartItems }) => {
    return (
        <div>
            <h2>Shopping Cart</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        <p>{item.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price}</p>
                    </li>
                ))}
            </ul>
            <button>Checkout</button>
        </div>
    );
};

export default Cart;
