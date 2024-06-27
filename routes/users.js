const express = require('express');
const router = express.Router();
const { client } = require('../server/db');
const verifyToken = require('../middlewares/verifyToken');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await client.query('SELECT id, username, email, first_name, last_name, address, phone_number, is_admin FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
