// File: src/components/Products/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  // State for product details
  const [product, setProduct] = useState(null);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch product data based on ID from URL params
  const { id } = useParams();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulated API call to fetch product details
        const response = await fetch(`/api/products/${id}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render product details
  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      {/* Add more product details here */}
    </div>
  );
};

export default ProductDetails;
