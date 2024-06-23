const express = require('express');
const cors = require('cors');
const { client, createTables } = require('../server/db'); // Adjust path based on your project structure
const authRoutes = require('../routes/auth'); // Adjust path based on your project structure
const userRoutes = require('../routes/users'); // Adjust path based on your project structure
const categoryRoutes = require('../routes/categories'); // Adjust path based on your project structure
const productRoutes = require('../routes/products'); // Adjust path based on your project structure
const orderRoutes = require('../routes/orders'); // Adjust path based on your project structure
const orderItemRoutes = require('../routes/orderItems'); // Adjust path based on your project structure
const reviewRoutes = require('../routes/reviews'); // Adjust path based on your project structure
const paymentRoutes = require('../routes/payments'); // Adjust path based on your project structure
const wishlistRoutes = require('../routes/wishlists'); // Adjust path based on your project structure
const wishlistItemRoutes = require('../routes/wishlistItems'); // Adjust path based on your project structure
const couponRoutes = require('../routes/coupons'); // Adjust path based on your project structure
const productImageRoutes = require('../routes/productImages'); // Adjust path based on your project structure
const followRoutes = require('../routes/follows'); // Adjust path based on your project structure

const app = express();
const port = process.env.PORT || 3000;
// Middleware and routes setup
app.use(cors());
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
        process.exit(1); // Exit process on error
    }
};

init(); // Call the initialization function to start the server
