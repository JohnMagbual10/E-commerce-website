import React, { useState, useEffect } from 'react';

const Account = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching user data...');
    const fetchUserData = async () => {
      if (!token) {
        setError('No account found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        console.log('API Response:', response); // Log API response

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('Response Data:', data); // Log user data
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error); // Log error
        setError('Failed to fetch user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Function to clear user data and redirect to home page when logging out
  const handleLogout = () => {
    setUserData(null); // Clear user data
    setLoading(true); // Set loading state to true
    localStorage.removeItem('token'); // Remove token from localStorage
    setError(null); // Clear any error messages
    window.location.href = '/'; // Redirect to home page
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
