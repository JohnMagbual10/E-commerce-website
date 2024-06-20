import React, { useState, useEffect } from 'react';

const Account = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError('No account found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No user data found');
        }
        setUserData(data[0]); // Assuming you expect a single user object based on the provided example
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Logout request failed');
      }

      // Clear user data and token from local storage or state
      setUserData(null); // Clear user data
      // Optionally clear token from local storage if storing it there
    } catch (error) {
      console.error('Logout Error:', error.message);
      // Handle logout error (optional)
    }
  };

  return (
    <div className="account-container">
      <h2 className="account-title">Account</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="account-error">{error}</p>}
      {userData && (
        <div>
          <p className="account-info">User ID: {userData.id}</p>
          <p className="account-info">Username: {userData.username}</p>
          <p className="account-info">Name: {userData.first_name} {userData.last_name}</p>
          <p className="account-info">Email: {userData.email}</p>
          <p className="account-info">Address: {userData.address}</p>
          <p className="account-info">Phone Number: {userData.phone_number}</p>
          <p className="account-info">Admin: {userData.is_admin ? 'Yes' : 'No'}</p>
          <p className="account-info">Camping and Hiking Products:</p>
          <ul>
            {userData.products && userData.products.length > 0 ? (
              userData.products.map(product => (
                <li key={product.id}>{product.name} - {product.category}</li>
              ))
            ) : (
              <li>No products found</li>
            )}
          </ul>
        </div>
      )}
      <button className="account-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Account;
