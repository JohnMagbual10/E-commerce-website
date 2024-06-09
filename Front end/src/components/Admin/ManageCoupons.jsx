// File: src/components/Admin/ManageCoupons.jsx
import React, { useState, useEffect } from 'react';

const ManageCoupons = () => {
  // State for coupon data
  const [coupons, setCoupons] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch coupon data
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        // Simulated API call to fetch coupon data
        const response = await fetch('/api/coupons'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        const data = await response.json();
        setCoupons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render coupon list
  return (
    <div className="manage-coupons">
      <h2>Manage Coupons</h2>
      <ul>
        {coupons.map((coupon) => (
          <li key={coupon.id}>
            <span>{coupon.code}</span>
            <span>{coupon.discount}</span>
            {/* Add more coupon properties to display */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCoupons;
