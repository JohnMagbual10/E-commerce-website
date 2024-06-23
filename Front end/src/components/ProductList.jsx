import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/dummyproducts'); // Update with your backend API endpoint for products
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Product List Fetch Error:', error);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <ul className="product-list">
        {products.map(product => (
          <li key={product.id} className="product">
            <Link to={`/products/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.image_url} alt={product.name} />
            <p>Stock Quantity: {product.stock_quantity}</p>
            <button 
              onClick={() => addToCart(product)} 
              className="add-to-cart-button"
              disabled={product.stock_quantity === 0}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;