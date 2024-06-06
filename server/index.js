const express = require('express');
const app = express();
const { client, createTables } = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderItems');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payments');
const wishlistRoutes = require('./routes/wishlists');
const wishlistItemRoutes = require('./routes/wishlistItems');
const couponRoutes = require('./routes/coupons');
const productImageRoutes = require('./routes/productImages');
const followRoutes = require('./routes/follows');

app.use(express.json());

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

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async () => {
    const port = process.env.PORT || 3000;
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
