// Navigation.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  console.log("Rendering Navigation component");
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/" className="navigation-link">Home</Link>
        </li>
        <li className="navigation-item">
          <Link to="/books" className="navigation-link">Books</Link>
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
      </ul>
    </nav>
  );
};

export default Navigation;
