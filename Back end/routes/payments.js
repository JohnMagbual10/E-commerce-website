const express = require('express');
const router = express.Router();
const { fetchPayments, createPayment } = require('../server/db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchPayments());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Implement logic to create a payment
    } catch (error) {
        next(error);
    }
});

module.exports = router;
