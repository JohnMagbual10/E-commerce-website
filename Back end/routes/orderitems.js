const express = require('express');
const router = express.Router();
const { fetchOrderItems, createOrderItem } = require('../server/db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchOrderItems());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Implement logic to create an order item
    } catch (error) {
        next(error);
    }
});

module.exports = router;
