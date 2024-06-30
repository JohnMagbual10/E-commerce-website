const jwt = require('jsonwebtoken');
const { client } = require('../server/db');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

  req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = verifyToken;
