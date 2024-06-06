import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="product-grid">
        {products.map(product => (
          <div className="product" key={product.id}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <Link to={`/product/${product.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
