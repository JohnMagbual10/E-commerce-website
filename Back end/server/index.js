const express = require('express');
const { Client } = require('pg'); // Import Client from pg
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const categoryRoutes = require('../routes/categories');
const productRoutes = require('../routes/products');
const orderRoutes = require('../routes/orders');
const orderItemRoutes = require('../routes/orderItems');
const reviewRoutes = require('../routes/reviews');
const paymentRoutes = require('../routes/payments');
const wishlistRoutes = require('../routes/wishlists');
const wishlistItemRoutes = require('../routes/wishlistItems');
const couponRoutes = require('../routes/coupons');
const productImageRoutes = require('../routes/productImages');
const followRoutes = require('../routes/follows');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// PostgreSQL Client initialization
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db',
  ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : false, // Adjust SSL config as needed
});

// Connect to PostgreSQL database
client.connect()
  .then(() => {
    console.log('Connected to database');
    startServer(); // Start server after successful database connection
  })
  .catch(err => {
    console.error('Error connecting to database:', err.message);
    process.exit(1); // Exit process on database connection error
  });

// Registering routes and starting server
function startServer() {
  // Register routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/order-items', orderItemRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/wishlists', wishlistRoutes);
  app.use('/api/wishlist-items', wishlistItemRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/product-images', productImageRoutes);
  app.use('/api/follows', followRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack trace
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  // Start the Express server
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  // Graceful shutdown: Close database connection and server on process termination
  process.on('SIGINT', async () => {
    console.log('\nSIGINT received: Closing server and database connection...');
    try {
      await server.close(); // Close the Express server
      await client.end(); // Close the PostgreSQL client
      console.log('Server and database connection closed');
      process.exit(0); // Exit process gracefully
    } catch (err) {
      console.error('Error closing server or database connection:', err.message);
      process.exit(1); // Exit process with error on shutdown failure
    }
  });
}
