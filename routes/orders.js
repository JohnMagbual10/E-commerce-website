const express = require('express');
const router = express.Router();
const { fetchOrders, createOrder } = require('../db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchOrders());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Implement logic to create an order
    } catch (error) {
        next(error);
    }
});

module.exports = router;
