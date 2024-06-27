import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ token }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.is_admin;

  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/" className="navigation-link">Home</Link>
        </li>
        <li className="navigation-item">
          <Link to="/products" className="navigation-link">Products</Link>
        </li>
        <li className="navigation-item">
          <Link to="/cart" className="navigation-link">Cart</Link>
        </li>
        {token ? (
          <>
            <li className="navigation-item">
              <Link to="/account" className="navigation-link">Account</Link>
            </li>
            <li className="navigation-item">
              <Link to="/checkout" className="navigation-link">Checkout</Link>
            </li>
            {isAdmin && (
              <>
                <li className="navigation-item">
                  <Link to="/admin/products" className="navigation-link">Admin Products</Link>
                </li>
                <li className="navigation-item">
                  <Link to="/admin/users" className="navigation-link">Admin Users</Link>
                </li>
              </>
            )}
          </>
        ) : (
          <>
            <li className="navigation-item">
              <Link to="/login" className="navigation-link">Login</Link>
            </li>
            <li className="navigation-item">
              <Link to="/register" className="navigation-link">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
