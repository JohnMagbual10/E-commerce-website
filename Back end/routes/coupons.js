const express = require('express');
const router = express.Router();
const { fetchCoupons, createCoupon } = require('../server/db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchCoupons());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Implement logic to create a coupon
    } catch (error) {
        next(error);
    }
});

module.exports = router;
