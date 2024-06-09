// File: src/components/Admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';

const ManageUsers = () => {
  // State for user data
  const [users, setUsers] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulated API call to fetch user data
        const response = await fetch('/api/users'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Function to handle user deletion
  const deleteUser = async (userId) => {
    try {
      // Simulated API call to delete user
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      }); // Replace with your API endpoint
      // Remove the deleted user from the local state
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err.message);
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render user list
  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>{user.name}</span>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
