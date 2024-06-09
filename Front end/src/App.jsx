import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-dom/client';
import Navigation from './components/Navigation';
import Login from './components/UserAuthentication/Login';
import Register from './components/UserAuthentication/Registration';
import ForgotPassword from './components/UserAuthentication/ForgotPassword';
import Profile from './components/UserAuthentication/Profile';
import ProductList from './components/Products/ProductList';
import ProductDetails from './components/Products/ProductDetails';
import OrderHistory from './components/Orders/OrderHistory';
import OrderDetail from './components/Orders/OrderDetail';
import Checkout from './components/Orders/Checkout';
import ProductReviewForm from './components/Reviews/ProductReviewForm';
import ReviewList from './components/Reviews/ReviewList';
import Wishlist from './components/Wishlist/Wishlist';
import Cart from './components/Cart/CartItem';
import PaymentForm from './components/Payments/PaymentForm';
import PaymentHistory from './components/Payments/PaymentHistory';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageProducts from './components/Admin/ManageProducts';
import ManageCategories from './components/Admin/ManageCategories';
import ManageUsers from './components/Admin/ManageUsers';
import ManageOrders from './components/Admin/ManageOrders';
import ManageCoupons from './components/Admin/ManageCoupons';
import Footer from './components/Common/Footer';
import Button from './components/UI/Button';
import Input from './components/UI/Input';
import Form from './components/UI/Form';
import Modal from './components/UI/Modal';
import Toast from './components/UI/Toast';
import './index.css';

function App() {
  return (
    <Router>
      <div>
        {/* Video Background */}
        <video className="video-background" autoPlay loop muted>
          <source src="https://v.ftcdn.net/07/72/64/15/240_F_772641572_PfThw26Al2RX8CGRpZv656aDjiyyZnVN_ST.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-content"></div>
        <Navigation />
        <Routes>
          {/* User Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />

          {/* Products */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          
          {/* Orders */}
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Reviews */}
          <Route path="/review-form" element={<ProductReviewForm />} />
          <Route path="/reviews" element={<ReviewList />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Payments */}
          <Route path="/payment-form" element={<PaymentForm />} />
          <Route path="/payment-history" element={<PaymentHistory />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-products" element={<ManageProducts />} />
          <Route path="/admin/manage-categories" element={<ManageCategories />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-orders" element={<ManageOrders />} />
          <Route path="/admin/manage-coupons" element={<ManageCoupons />} />
        </Routes>
      </div>
      <Footer />
      <Button />
      <Input />
      <Form />
      <Modal />
      <Toast />
    </Router>
  );
}

export default App;
