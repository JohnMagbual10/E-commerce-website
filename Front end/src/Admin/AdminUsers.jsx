import React, { useState, useEffect } from 'react';

const AdminUsers = ({ token }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div>
      <h2>Admin Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>ID: {user.id}</p>
            <p>Name: {user.first_name} {user.last_name}</p>
            <p>Email: {user.email}</p>
            <p>Address: {user.address}</p>
            <p>Phone: {user.phone_number}</p>
            <p>Billing Info: {user.billing_info}</p>
            <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
