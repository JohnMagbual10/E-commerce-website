const express = require('express');
const router = express.Router();
const { createUser, fetchUsers, fetchFavorites, createFavorite, destroyFavorite } = require('../server/db');
const verifyTokenMiddleware = require('../middlewares/verifyToken');

// POST route to create a new user
router.post('/', async (req, res, next) => {
    const { username, password, email, firstName, lastName, address, phoneNumber, isAdmin } = req.body;
    console.log(req.body); // Log the request body to check received data

    try {
        const newUser = await createUser({ username, password, email, firstName, lastName, address, phoneNumber, isAdmin });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// GET route to fetch all users
router.get('/', async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).json(users);
  } catch (ex) {
    next(ex); // Pass error to Express error handler
  }
});

// GET route to fetch user favorites by user id
router.get('/:id/favorites', async (req, res, next) => {
  try {
    const favorites = await fetchFavorites(req.params.id);
    res.status(200).json(favorites);
  } catch (ex) {
    next(ex); // Pass error to Express error handler
  }
});

// POST route to create a favorite product for a user
router.post('/:id/favorites', verifyTokenMiddleware, async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const favorite = await createFavorite({ userId: req.params.id, productId: product_id });
    res.status(201).json(favorite);
  } catch (ex) {
    next(ex); // Pass error to Express error handler
  }
});

// DELETE route to remove a favorite product for a user
router.delete('/:user_id/favorites/:id', async (req, res, next) => {
  try {
    await destroyFavorite({ userId: req.params.user_id, productId: req.params.id });
    res.sendStatus(204);
  } catch (ex) {
    next(ex); // Pass error to Express error handler
  }
});

module.exports = router;
