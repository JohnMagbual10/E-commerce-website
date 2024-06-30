const { client } = require('../server/db');

async function getCart(req, res) {
  const userId = req.user.id;
  try {
    const result = await client.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const cartId = result.rows[0].id;
    const cartItems = await client.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
    res.status(200).json(cartItems.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addToCart(req, res) {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    let cart = await client.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
    if (!cart.rows[0]) {
      cart = await client.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId]);
    }
    const cartId = cart.rows[0].id;
    const result = await client.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [cartId, productId, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateCartItem(req, res) {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const result = await client.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteCartItem(req, res) {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getCart, addToCart, updateCartItem, deleteCartItem };
