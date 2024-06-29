import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SingleAdminProduct = ({ token }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Product Fetch Error:', error);
        setError('Failed to fetch product. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>No product found.</p>;
  }

  return (
    <div className="single-product-container">
      <h2 className="single-product-title">{product.name}</h2>
      <div className="single-product-info">
        <p>Description: {product.description}</p>
        <p>Price: ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</p>
        <p>Stock: {product.stock_quantity}</p>
      </div>
      <img className="single-product-image" src={product.image_url} alt={product.name} />
      <Link to="/admin/products" className="single-product-link">Back to Admin Products</Link>
    </div>
  );
};

export default SingleAdminProduct;
