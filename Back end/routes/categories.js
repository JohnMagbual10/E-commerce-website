const express = require('express');
const router = express.Router();
const { fetchCategories, createCategory } = require('../db');

router.get('/', async (req, res, next) => {
    try {
        res.send(await fetchCategories());
    } catch (ex) {
        next(ex);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newCategory = await createCategory({ name, description });
        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
