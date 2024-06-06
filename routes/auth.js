const express = require('express');
const router = express.Router();
const { authenticate, findUserWithToken } = require('../db');
const verifyTokenMiddleware = require('../middlewares/verifyToken');

router.post('/login', async (req, res, next) => {
    try {
        res.send(await authenticate(req.body));
    } catch (ex) {
        next(ex);
    }
});

router.get('/me', verifyTokenMiddleware, async (req, res, next) => {
    try {
        res.send(await findUserWithToken(req.headers.authorization));
    } catch (ex) {
        next(ex);
    }
});

module.exports = router;
