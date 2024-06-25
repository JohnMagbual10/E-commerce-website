const express = require('express');
const router = express.Router();
const { client } = require('../server/db');

// Example route to get all products
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
