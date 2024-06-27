require('dotenv').config({ path: '../.env' });
const express = require('express');
const { connectDB, createTables, insertInitialProducts, insertInitialUsers } = require('./db');
const adminRoutes = require('../routes/admin');
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

app.use('/api/admin', adminRoutes);
console.log('Admin routes loaded');
app.use('/api/auth', require('../routes/auth'));
console.log('Auth routes loaded');
app.use('/api/products', require('../routes/products'));
console.log('Product routes loaded');
app.use('/api/users', require('../routes/users'));
console.log('User routes loaded');
app.use('/api/cart', require('../routes/cart'));
console.log('Cart routes loaded');

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  await createTables();
  await insertInitialUsers();
  await insertInitialProducts();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
