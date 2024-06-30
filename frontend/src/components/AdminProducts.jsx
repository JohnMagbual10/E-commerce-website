import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://dancing-bublanina-89ab7a.netlify.app/.netlify/functions';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formState, setFormState] = useState({ name: '', description: '', price: '', stock_quantity: '', image_url: '' });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock_quantity: '', image_url: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`, {
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

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url
    });
  };

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formState)
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const updatedProduct = await response.json();
      setProducts(products.map(product => product.id === updatedProduct.id ? updatedProduct : product));
      setEditingProduct(null);
      setFormState({ name: '', description: '', price: '', stock_quantity: '', image_url: '' });
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newProduct)
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      const addedProduct = await response.json();
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', description: '', price: '', stock_quantity: '', image_url: '' });
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to remove product');
      }
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
      setError('Failed to remove product. Please try again.');
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
      <h2 className="admin-title">Admin Products</h2>

      <form className="add-product-form" onSubmit={handleAddProduct}>
        <h2>Add New Product</h2>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={(e) => handleInputChange(e, setNewProduct)}
          placeholder="Product Name"
          required
        />
        <textarea
          name="description"
          value={newProduct.description}
          onChange={(e) => handleInputChange(e, setNewProduct)}
          placeholder="Product Description"
          required
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={(e) => handleInputChange(e, setNewProduct)}
          placeholder="Product Price"
          required
        />
        <input
          type="number"
          name="stock_quantity"
          value={newProduct.stock_quantity}
          onChange={(e) => handleInputChange(e, setNewProduct)}
          placeholder="Stock Quantity"
          required
        />
        <input
          type="text"
          name="image_url"
          value={newProduct.image_url}
          onChange={(e) => handleInputChange(e, setNewProduct)}
          placeholder="Image URL"
          required
        />
        <button type="submit">Add Product</button>
      </form>

      {editingProduct && (
        <form className="add-product-form" onSubmit={handleFormSubmit}>
          <h2>Edit Product</h2>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={(e) => handleInputChange(e, setFormState)}
            placeholder="Product Name"
            required
          />
          <textarea
            name="description"
            value={formState.description}
            onChange={(e) => handleInputChange(e, setFormState)}
            placeholder="Product Description"
            required
          />
          <input
            type="number"
            name="price"
            value={formState.price}
            onChange={(e) => handleInputChange(e, setFormState)}
            placeholder="Product Price"
            required
          />
          <input
            type="number"
            name="stock_quantity"
            value={formState.stock_quantity}
            onChange={(e) => handleInputChange(e, setFormState)}
            placeholder="Stock Quantity"
            required
          />
          <input
            type="text"
            name="image_url"
            value={formState.image_url}
            onChange={(e) => handleInputChange(e, setFormState)}
            placeholder="Image URL"
            required
          />
          <button type="submit">Update Product</button>
        </form>
      )}

      <ul className="admin-product-list">
        {products.map(product => (
          <li key={product.id} className="admin-product">
            <Link to={`/products/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock Quantity: {product.stock_quantity}</p>
            <img src={product.image_url} alt={product.name} />
            <div className="admin-buttons">
              <button className="admin-edit-button" onClick={() => editProduct(product)}>Edit</button>
              <button className="admin-remove-button" onClick={() => handleRemoveProduct(product.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
