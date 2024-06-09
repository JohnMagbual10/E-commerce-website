// File: src/components/Payments/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';

const PaymentHistory = () => {
  // State for payment history
  const [payments, setPayments] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch payment history data
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        // Simulated API call to fetch payment history
        const response = await fetch('/api/payments'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch payment history');
        }
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentHistory();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render payment history
  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      {payments.length === 0 ? (
        <p>No payment history available.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id}>
              <p>Date: {payment.date}</p>
              <p>Total: {payment.total}</p>
              <p>Status: {payment.status}</p>
              {/* Add more payment details here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
