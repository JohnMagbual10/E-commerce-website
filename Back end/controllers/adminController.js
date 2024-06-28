const { client } = require('../server/db');

const getAllUsers = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, stock_quantity } = req.body;
  try {
    await client.query(
      'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4)',
      [name, description, price, stock_quantity]
    );
    res.status(201).json({ message: 'Product added' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity } = req.body;
  try {
    await client.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4 WHERE id = $5',
      [name, description, price, stock_quantity, id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
