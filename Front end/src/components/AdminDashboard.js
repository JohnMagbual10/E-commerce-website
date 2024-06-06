import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <section className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button>Add Product</button>
    </section>
  );
};

export default AdminDashboard;
