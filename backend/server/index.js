require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, createTables, insertInitialProducts, insertInitialUsers } = require('./db');
const adminRoutes = require('../routes/admin');
const productRoutes = require('../routes/products');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const cartRoutes = require('../routes/cart');

const app = express();

console.log('Environment Variables:', process.env);

const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

console.log('JWT_SECRET:', JWT_SECRET);
console.log('DATABASE_URL:', DATABASE_URL);

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables');
  process.exit(1);
}

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Ensure this matches your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/admin', adminRoutes);
console.log('Admin routes loaded');

app.use('/api/auth', authRoutes);
console.log('Auth routes loaded');

app.use('/api/products', productRoutes);
console.log('Product routes loaded');

app.use('/api/users', userRoutes);
console.log('User routes loaded');

app.use('/api/cart', cartRoutes);
console.log('Cart routes loaded');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  await createTables();
  await insertInitialUsers();
  await insertInitialProducts();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
