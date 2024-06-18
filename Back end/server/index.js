const express = require('express');
const { client, createTables } = require('./db');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const categoryRoutes = require('../routes/categories');
const productRoutes = require('../routes/products'); // Make sure this path is correct
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
app.use('/api/products', productRoutes);// Ensure this matches the export in products.js
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
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const init = async () => {
    try {
        await client.connect();
        console.log('Connected to database');
        await createTables();
        console.log('Tables created');
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1); // Exit process on database connection error
    }
};

init();
