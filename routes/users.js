const express = require('express');
const router = express.Router();
const { client } = require('../server/db');
const verifyToken = require('../middlewares/verifyToken');

// Example route to get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
