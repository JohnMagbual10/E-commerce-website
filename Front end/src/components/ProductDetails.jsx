import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = ({ token, addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Product Fetch Error:', error);
        setError('Failed to fetch product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: id, quantity: 1 }),
      });
      const data = await response.json();
      if (data) {
        console.log('Product added to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="product-details-container">
      {product && (
        <>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <img src={product.image_url} alt={product.name} />
          <p>Stock Quantity: {product.stock_quantity}</p>
          <button onClick={handleAddToCart}>Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
