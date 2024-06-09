// File: src/components/Orders/OrderDetail.jsx
import React, { useEffect, useState } from 'react';

const OrderDetail = ({ orderId }) => {
  // State to store order details
  const [order, setOrder] = useState(null);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch order details based on orderId
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // Simulated API call to fetch order detail
        const response = await fetch(`/api/orders/${orderId}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render order details
  return (
    <div className="order-detail">
      <h2>Order Detail</h2>
      {order && (
        <div>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          {/* Add more order details here */}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
