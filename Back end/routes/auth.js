const express = require('express');
const router = express.Router();
const { authenticate, findUserWithToken } = require('../server/db');
const verifyTokenMiddleware = require('../middlewares/verifyToken');

// Route to handle user login
router.post('/login', async (req, res, next) => {
    try {
        const result = await authenticate(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Route to get user information based on token
router.get('/me', verifyTokenMiddleware, async (req, res, next) => {
    try {
        const result = await findUserWithToken(req.headers.authorization);
        res.status(200).json(result);
    } catch (err) {
        next(err); // Pass the error to the error handler middleware
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging

    // Handle specific types of errors with appropriate HTTP status codes and messages
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
