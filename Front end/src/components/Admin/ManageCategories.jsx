// File: src/components/Admin/ManageCategories.jsx
import React, { useState, useEffect } from 'react';

const ManageCategories = () => {
  // State for category data
  const [categories, setCategories] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch category data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Simulated API call to fetch category data
        const response = await fetch('/api/categories'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Function to handle category deletion
  const deleteCategory = async (categoryId) => {
    try {
      // Simulated API call to delete category
      await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      }); // Replace with your API endpoint
      // Remove the deleted category from the local state
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (err) {
      console.error('Failed to delete category:', err.message);
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

  // Render category list
  return (
    <div className="manage-categories">
      <h2>Manage Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <span>{category.name}</span>
            <button onClick={() => deleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;
