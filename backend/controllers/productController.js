// controllers/productController.js
const { client } = require('../server/db');

const getAllProducts = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
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

module.exports = { getAllProducts, getProductById, searchProducts };
