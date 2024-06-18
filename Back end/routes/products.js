const express = require('express');
const router = express.Router();
const { fetchProducts, createProduct } = require('../server/db');

// Define dummy product data for outdoor and hiking categories
const dummyProducts = [
  {
    name: 'Outdoor Tent',
    description: 'Spacious tent for outdoor adventures',
    price: 149.99,
    stock_quantity: 50,
    category_id: 'dummy-outdoor-category-id', // Replace with actual category ID for outdoor products
  },
  {
    name: 'Hiking Backpack',
    description: 'Lightweight backpack for hiking trips',
    price: 79.99,
    stock_quantity: 100,
    category_id: 'dummy-hiking-category-id', // Replace with actual category ID for hiking products
  }
];

// Route to fetch all products
router.get('/', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.json(products);
  } catch (ex) {
    next(ex);
  }
});

// Route to create a new product
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;
    const newProduct = await createProduct({ name, description, price, stock_quantity, category_id });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// Endpoint to insert dummy products (for testing purposes)
router.post('/insert-dummy', async (req, res, next) => {
  try {
    const insertDummyProducts = req.query.insertDummy === 'true'; // Check query parameter to insert dummy products
    if (insertDummyProducts) {
      const insertedProducts = [];
      for (let product of dummyProducts) {
        const newProduct = await createProduct(product);
        insertedProducts.push(newProduct);
      }
      res.status(201).json(insertedProducts);
    } else {
      res.status(400).json({ message: 'Dummy products insertion not requested.' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
