// controllers/adminController.js
const { client } = require('../server/db');

const getAllUsers = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving product:', err.message);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, stock_quantity, image_url } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO products (name, description, price, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock_quantity, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity, image_url } = req.body;
  try {
    const result = await client.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, description, price, stock_quantity, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM products WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchProducts = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await client.query(
      'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $2',
      [`%${q}%`, `%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getAllUsers, getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, searchProducts };
