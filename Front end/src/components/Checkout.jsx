import React, { useState } from 'react';

const Checkout = ({ cartItems, handleCheckout }) => {
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Here you would perform any necessary validations and then call handleCheckout
      // For the sake of example, let's assume direct call to handleCheckout
      await handleCheckout(billingInfo);
      console.log('Checkout successful!'); // Log success message
    } catch (error) {
      setError(error.message || 'Checkout failed. Please try again.');
      console.error('Checkout Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={billingInfo.fullName}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={billingInfo.email}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={billingInfo.address}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={billingInfo.city}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={billingInfo.state}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          value={billingInfo.zip}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={billingInfo.country}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={billingInfo.cardNumber}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="expiryDate"
          placeholder="Expiry Date"
          value={billingInfo.expiryDate}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={billingInfo.cvv}
          onChange={handleChange}
          required
          className="checkout-input"
        />
        <button type="submit" disabled={loading} className="checkout-button">
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>
        {error && <p className="checkout-error">{error}</p>}
      </form>
    </div>
  );
};

export default Checkout;
