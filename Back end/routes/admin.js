const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const { getAllUsers, getAllProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/adminController');

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/users', getAllUsers);
router.get('/products', getAllProducts);  // This line should already be there
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
