const express = require('express');
const router = express.Router();
const { fetchFollows, createFollow } = require('../server/db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchFollows());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Implement logic to create a follow
    } catch (error) {
        next(error);
    }
});

module.exports = router;
