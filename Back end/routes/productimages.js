const express = require('express');
const router = express.Router();
const { fetchProductImages, createProductImage } = require('../server/db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchProductImages());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Implement logic to create a product image
    } catch (error) {
        next(error);
    }
});

module.exports = router;
