// File: src/components/Payments/PaymentForm.jsx
import React, { useState } from 'react';

const PaymentForm = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardHolderName: '',
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form fields
    if (validateForm()) {
      // Send formData to the payment gateway for processing
      console.log('Form submitted:', formData);
      // Clear form fields after submission
      clearForm();
    } else {
      console.error('Form validation failed.');
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to validate form fields
  const validateForm = () => {
    // Implement your form validation logic here
    return true; // For simplicity, always returning true
  };

  // Function to clear form fields after submission
  const clearForm = () => {
    setFormData({
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      cardHolderName: '',
    });
  };

  return (
    <div className="payment-form">
      <h2>Payment Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Number:</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Expiration Date:</label>
          <input
            type="text"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>CVV:</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Cardholder Name:</label>
          <input
            type="text"
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default PaymentForm;
