// File: src/components/Admin/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-tasks">
        <div className="task">
          <h3>Manage Products</h3>
          <p>Add, edit, or delete products</p>
          {/* Add a link or button to navigate to the product management page */}
        </div>
        <div className="task">
          <h3>Manage Categories</h3>
          <p>Add, edit, or delete product categories</p>
          {/* Add a link or button to navigate to the category management page */}
        </div>
        {/* Add more admin tasks as needed */}
      </div>
    </div>
  );
};

export default AdminDashboard;
