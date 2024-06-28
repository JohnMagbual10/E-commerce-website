const jwt = require('jsonwebtoken');
const { client } = require('../server/db');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token is missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await client.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) throw new Error('User not found');
    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
