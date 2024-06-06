const express = require('express');
const router = express.Router();
const { createUser, fetchUsers, fetchFavorites, createFavorite, destroyFavorite } = require('../db');
const verifyTokenMiddleware = require('../middlewares/verifyToken'); // Add this line

router.post('/', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingUser = await fetchUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const newUser = await createUser({ username, password });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (ex) {
        next(ex);
    }
});

router.get('/:id/favorites', async (req, res, next) => {
    try {
        res.send(await fetchFavorites(req.params.id));
    } catch (ex) {
        next(ex);
    }
});

router.post('/:id/favorites', verifyTokenMiddleware, async (req, res, next) => {
    try {
        res.status(201).send(await createFavorite({ user_id: req.params.id, product_id: req.body.product_id }));
    } catch (ex) {
        next(ex);
    }
});

router.delete('/:user_id/favorites/:id', async (req, res, next) => {
    try {
        await destroyFavorite({ user_id: req.params.user_id, id: req.params.id });
        res.sendStatus(204);
    } catch (ex) {
        next(ex);
    }
});

module.exports = router;
