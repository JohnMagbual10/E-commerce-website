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
        const response = await fetch(`/api/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
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
      const response = await fetch(`/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Logout request failed');
      }

      setUserData(null);
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout Error:', error.message);
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
        </div>
      )}
      <button className="account-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Account;
