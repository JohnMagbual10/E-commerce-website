const express = require('express');
const router = express.Router();
const {
  fetchProducts,
  createProduct,
  fetchProductById,
  updateProduct,
  deleteProduct,
} = require('../server/db'); // Replace with actual database functions
const verifyTokenMiddleware = require('../middlewares/verifyToken');

// GET route to fetch all products
router.get('/products', async (req, res) => {
  try {
    const products = await fetchProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Fetch products error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET route to fetch a product by ID
router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await fetchProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Fetch product by ID error:', error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// POST route to create a new product
router.post('/products', verifyTokenMiddleware, async (req, res) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT route to update a product
router.put('/products/:id', verifyTokenMiddleware, async (req, res) => {
  const productId = req.params.id;
  try {
    const updatedProduct = await updateProduct(productId, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE route to delete a product
router.delete('/products/:id', verifyTokenMiddleware, async (req, res) => {
  const productId = req.params.id;
  try {
    await deleteProduct(productId);
    res.sendStatus(204); // No content response
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET route to fetch dummy products (for testing purposes)
router.get('/dummyproducts', async (req, res) => {
  try {
    const dummyProducts = [
      {
        name: 'Hiking Boots',
        description: 'High-quality leather hiking boots with waterproofing and ankle support.',
        category: 'Footwear',
        price: 150.00,
        imageUrl: '/images/hiking-boots.jpg',
      },
      {
        name: 'Tent',
        description: 'Lightweight, waterproof tent for two people with easy setup features.',
        category: 'Camping Gear',
        price: 200.00,
        imageUrl: '/images/tent.jpg',
      },
      {
        name: 'Sleeping Bag',
        description: 'Mummy-style sleeping bag rated for cold weather, lightweight and compressible.',
        category: 'Camping Gear',
        price: 100.00,
        imageUrl: '/images/sleeping-bag.jpg',
      },
      {
        name: 'Backpack',
        description: 'Multi-day hiking backpack with adjustable straps, multiple compartments, and hydration bladder compatibility.',
        category: 'Backpacks',
        price: 180.00,
        imageUrl: '/images/backpack.jpg',
      },
      {
        name: 'Portable Stove',
        description: 'Compact camping stove with foldable legs, suitable for various fuel types.',
        category: 'Camping Gear',
        price: 50.00,
        imageUrl: '/images/portable-stove.jpg',
      },
      {
        name: 'Water Filter',
        description: 'Lightweight water filter pump with replaceable filters for safe drinking water on the go.',
        category: 'Camping Gear',
        price: 75.00,
        imageUrl: '/images/water-filter.jpg',
      },
      {
        name: 'Headlamp',
        description: 'LED headlamp with adjustable brightness and long battery life, suitable for night hikes.',
        category: 'Camping Gear',
        price: 30.00,
        imageUrl: '/images/headlamp.jpg',
      },
      {
        name: 'Camping Cookware Set',
        description: 'Nesting cookware set including pots, pans, and utensils, designed for outdoor cooking.',
        category: 'Cookware',
        price: 80.00,
        imageUrl: '/images/camping-cookware.jpg',
      },
      {
        name: 'Trekking Poles',
        description: 'Collapsible trekking poles with ergonomic grips and shock absorption, ideal for steep terrain.',
        category: 'Outdoor Gear',
        price: 60.00,
        imageUrl: '/images/trekking-poles.jpg',
      },
      {
        name: 'First Aid Kit',
        description: 'Comprehensive first aid kit with essentials for treating cuts, scrapes, and minor injuries.',
        category: 'Safety Gear',
        price: 40.00,
        imageUrl: '/images/first-aid-kit.jpg',
      },
      {
        name: 'GPS Device',
        description: 'Handheld GPS device with topographic maps and waypoints for navigation in remote areas.',
        category: 'Electronics',
        price: 120.00,
        imageUrl: '/images/gps-device.jpg',
      },
      {
        name: 'Solar Charger',
        description: 'Portable solar charger for charging electronic devices while camping or hiking.',
        category: 'Electronics',
        price: 70.00,
        imageUrl: '/images/solar-charger.jpg',
      },
    ];
    res.status(200).json(dummyProducts);
  } catch (error) {
    console.error('Retrieve dummy products error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve dummy products' });
  }
});

module.exports = router;
