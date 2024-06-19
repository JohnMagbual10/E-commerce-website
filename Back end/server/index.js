const express = require('express');
const { client, createTables } = require('./db'); // Ensure these functions are correctly defined in db.js
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const categoryRoutes = require('../routes/categories');
const productRoutes = require('../routes/products'); // Adjust paths as needed
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

app.use(express.json());

// Registering routes
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

// Initialize server and database connection
const init = async () => {
    try {
        await client.connect(); // Connect to the database
        console.log('Connected to database');
        await createTables(); // Ensure tables are created or migrated
        console.log('Tables created');

        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });

        // Graceful shutdown: Close database connection on process termination
        process.on('SIGINT', async () => {
            console.log('\nSIGINT received: Closing database connection...');
            await client.end(); // Close the database connection
            console.log('Database connection closed');
            process.exit(0); // Exit process gracefully
        });
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1); // Exit process on database connection error
    }
};

init(); // Call the initialization function to start the server
