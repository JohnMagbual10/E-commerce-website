const express = require('express');
const router = express.Router();
const { fetchReviews, createReview } = require('../server/db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchReviews());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Implement logic to create a review
    } catch (error) {
        next(error);
    }
});

module.exports = router;
