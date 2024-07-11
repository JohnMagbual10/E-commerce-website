import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Order Fetch Error:', error);
        setError('Failed to fetch order. Please try again later.');
      }
    };

    fetchOrder();
  }, [orderId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Order Confirmation</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Total Amount: ${order.total_amount}</p>
      <h2>Order Items</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            <p>Product ID: {item.product_id}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Unit Price: ${item.unit_price}</p>
            <p>Total Price: ${item.total_price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderConfirmation;
