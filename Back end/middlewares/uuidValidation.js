const { v4: isUUID } = require('uuid');

const validateUUID = (req, res, next) => {
  const { id } = req.params;
  if (!isUUID(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};

// Then use it in your route
router.get('/:id', validateUUID, async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving product:', err.message);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});
