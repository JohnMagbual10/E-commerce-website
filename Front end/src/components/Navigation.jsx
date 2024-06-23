import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  // Console.log statement removed to avoid unnecessary console output in production
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/" className="navigation-link">Home</Link>
        </li>
        <li className="navigation-item">
          <Link to="/products" className="navigation-link">products</Link>
        </li>
        <li className="navigation-item">
          <Link to="/login" className="navigation-link">Login</Link>
        </li>
        <li className="navigation-item">
          <Link to="/register" className="navigation-link">Register</Link>
        </li>
        <li className="navigation-item">
          <Link to="/account" className="navigation-link">Account</Link>
        </li>
        <li className="navigation-item">
          <Link to="/cart" className="navigation-link">Cart</Link>
        </li>
        <li className="navigation-item">
          <Link to="/checkout" className="navigation-link">Checkout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;