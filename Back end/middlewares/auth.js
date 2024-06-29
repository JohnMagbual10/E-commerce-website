// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Assuming you have a User model

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = await User.findById(user.id); // Assuming you store user id in the token
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { authenticateToken, isAdmin };
