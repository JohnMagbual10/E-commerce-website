import React, { useState, useEffect } from 'react';

const AdminProducts = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [token]);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({ name: '', description: '', price: '', stock_quantity: '', image_url: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await response.json();
      setProducts(products.map(product => (product.id === id ? data : product)));
      setNewProduct({ name: '', description: '', price: '', stock_quantity: '', image_url: '' });
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleRemoveProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <div>
      <h2>Admin Products</h2>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stock_quantity"
          placeholder="Stock Quantity"
          value={newProduct.stock_quantity}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={newProduct.image_url}
          onChange={handleInputChange}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
            <img src={product.image_url} alt={product.name} />
            <button onClick={() => handleEditProduct(product.id)}>Edit</button>
            <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
