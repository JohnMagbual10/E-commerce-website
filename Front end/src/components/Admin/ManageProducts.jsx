// File: src/components/Admin/ManageProducts.jsx
import React, { useState, useEffect } from 'react';

const ManageProducts = () => {
  // State for product data
  const [products, setProducts] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulated API call to fetch product data
        const response = await fetch('/api/products'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Function to handle product deletion
  const deleteProduct = async (productId) => {
    try {
      // Simulated API call to delete product
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      }); // Replace with your API endpoint
      // Remove the deleted product from the local state
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err.message);
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

  // Render product list
  return (
    <div className="manage-products">
      <h2>Manage Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
