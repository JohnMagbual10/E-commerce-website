import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Admin Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email} - {user.is_admin ? 'Admin' : 'User'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
