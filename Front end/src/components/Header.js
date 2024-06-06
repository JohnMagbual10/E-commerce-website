import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <Link to="/">MyShop</Link>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search products..." />
        <button>Search</button>
      </div>
      <div className="user-cart">
        <Link to="/profile" className="user-icon">User</Link>
        <Link to="/cart" className="cart-icon">Cart (0)</Link>
      </div>
    </header>
  );
};

export default Header;
