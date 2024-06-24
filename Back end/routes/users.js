const express = require('express');
const router = express.Router();
const { createUser, fetchUsers, fetchFavorites, createFavorite, destroyFavorite, fetchUserByUsername } = require('../server/db'); // Include fetchUserByUsername
const verifyTokenMiddleware = require('../middlewares/verifyToken');

router.post('/', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingUser = await fetchUserByUsername(username); // Use fetchUserByUsername from db
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const newUser = await createUser({ username, password }); // Use createUser from db
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
        res.status(201).send(await createFavorite({ userId: req.params.id, productId: req.body.product_id })); // Adjust the object property names to userId and productId
    } catch (ex) {
        next(ex);
    }
});

router.delete('/:user_id/favorites/:id', async (req, res, next) => {
    try {
        await destroyFavorite({ userId: req.params.user_id, productId: req.params.id }); // Adjust the object property names to userId and productId
        res.sendStatus(204);
    } catch (ex) {
        next(ex);
    }
});

module.exports = router;
