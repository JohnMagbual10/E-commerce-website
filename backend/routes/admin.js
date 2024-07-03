// routes/admin.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const { getAllUsers, getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, searchProducts  } = require('../controllers/adminController');

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/users', getAllUsers);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);  // Ensure this line is here for single product fetching
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/search', searchProducts )
module.exports = router;
