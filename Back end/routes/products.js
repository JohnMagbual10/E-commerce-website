const express = require('express');
const router = express.Router();
const { client } = require('../server/db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving products:', err.message);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
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
});

module.exports = router;
