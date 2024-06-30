// routes/products.js
const express = require('express');
const router = express.Router();
const { client } = require('../server/db');
const { validateUUIDMiddleware } = require('../middlewares/uuidValidation');

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
router.get('/:id', validateUUIDMiddleware, async (req, res) => {
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

router.post('/products', async (req, res) => {
  const { name, description, price, stock_quantity, category_id, image_url } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock_quantity, category_id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
