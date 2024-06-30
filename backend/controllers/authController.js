const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../server/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
  const { username, password, email, firstName, lastName, address, phoneNumber, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await client.query(
      'INSERT INTO users (username, password, email, first_name, last_name, address, phone_number, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [username, hashedPassword, email, firstName, lastName, address, phoneNumber, isAdmin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login };
