import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
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

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = {
      name,
      description,
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity),
      category_id: category, // Make sure category_id corresponds to an existing category
      image_url: imageUrl
    };

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      handleProductAdded(data);
      setName('');
      setDescription('');
      setPrice('');
      setStockQuantity('');
      setCategory('');
      setImageUrl('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="admin-product-list-container">
      <h2>Admin Products</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <h2>Add Product</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="number" placeholder="Stock Quantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
        <input type="text" placeholder="Category ID" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>
      <ul className="admin-product-list">
        {products.map(product => (
          <li key={product.id} className="admin-product">
            <Link to={`/admin/products/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>
            <p>Description: {product.description}</p>
            <p>Price: ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</p>
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
