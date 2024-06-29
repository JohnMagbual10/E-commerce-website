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
    console.log('Fetched products:', result.rows); // Log the fetched products
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Internal server error' });
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

module.exports = { getAllUsers, getAllProducts, addProduct, updateProduct, deleteProduct };
