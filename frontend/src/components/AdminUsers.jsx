import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-users-container">
      <h2 className="admin-title">Admin Users</h2>
      <ul className="admin-users-list">
        {users.map(user => (
          <li key={user.id} className="admin-users-item">
            <p>{user.username} - {user.email}</p>
            <button className="admin-remove-button">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
