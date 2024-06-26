const { client } = require('../server/db');

async function getAllProducts(req, res) {
  try {
    const result = await client.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createProduct(req, res) {
  const { name, description, price, stock_quantity, category_id } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock_quantity, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, stock_quantity, category_id } = req.body;
  try {
    const result = await client.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, price, stock_quantity, category_id, id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
