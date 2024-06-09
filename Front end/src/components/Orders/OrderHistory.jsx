// File: src/components/Orders/OrderHistory.jsx
import React, { useEffect, useState } from 'react';

const OrderHistory = () => {
  // State to store orders
  const [orders, setOrders] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch order data
  useEffect(() => {
    // Simulated API call to fetch orders
    const fetchOrders = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch('/api/orders'); 
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <p>Status: {order.status}</p>
            <button onClick={() => viewOrderDetail(order.id)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Function to navigate to order detail
const viewOrderDetail = (orderId) => {
  // Navigate to order detail page, you might use react-router's useNavigate here
  console.log(`View details for order ${orderId}`);
};

export default OrderHistory;
