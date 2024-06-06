const express = require('express');
const router = express.Router();
const { fetchProducts, createProduct } = require('../db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchProducts());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { name, description, price, stock_quantity, category_id } = req.body;
        const newProduct = await createProduct({ name, description, price, stock_quantity, category_id });
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
