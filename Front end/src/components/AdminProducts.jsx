import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-product-list-container">
      <h2>Admin Products</h2>
      <ul className="admin-product-list">
        {products.map(product => (
          <li key={product.id} className="admin-product">
            <Link to={`/admin/products/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <img src={product.image_url} alt={product.name} />
            <p>Stock Quantity: {product.stock_quantity}</p>
            <div className="admin-buttons">
              <button className="admin-edit-button">Edit</button>
              <button className="admin-remove-button">Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
