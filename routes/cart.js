const express = require('express');
const router = express.Router();
const { client } = require('../server/db');
const authenticateToken = require('../middlewares/authenticate');

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM cart WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, product_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/update', authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const result = await client.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, req.user.id, product_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/remove', authenticateToken, async (req, res) => {
  const { product_id } = req.body;
  try {
    await client.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [req.user.id, product_id]);
    res.json({ success: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

module.exports = router;