const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// PostgreSQL pool initialization
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db',
});

const JWT_SECRET = process.env.JWT || 'shhh';

if (JWT_SECRET === 'shhh') {
  console.log('Warning: If deployed, set process.env.JWT to something other than "shhh"');
}

// Connect to PostgreSQL database
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  client.release(); // Release the client back to the pool
});

// Function to create database tables
async function createTables() {
  const createTablesQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS follows, wishlist_items, wishlists, reviews, payments, order_items, orders, product_images, coupons, products, categories, users CASCADE;

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(50),
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      address TEXT,
      phone_number VARCHAR(15),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_admin BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(50) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(50) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock_quantity INTEGER NOT NULL,
      category_id UUID REFERENCES categories(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id),
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(20),
      total_amount DECIMAL(10, 2),
      shipping_address TEXT,
      billing_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id UUID REFERENCES orders(id),
      product_id UUID REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id),
      product_id UUID REFERENCES products(id),
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id UUID REFERENCES orders(id),
      payment_method VARCHAR(50),
      amount DECIMAL(10, 2),
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      wishlist_id UUID REFERENCES wishlists(id),
      product_id UUID REFERENCES products(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code VARCHAR(20) UNIQUE NOT NULL,
      discount_percentage DECIMAL(5, 2),
      expiration_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id UUID REFERENCES products(id),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS follows (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      following_user_id UUID REFERENCES users(id),
      followed_user_id UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const client = await pool.connect();
  try {
    await client.query(createTablesQuery);
    console.log('Tables created');
  } catch (err) {
    console.error('Error creating tables:', err.message);
    throw new Error('Failed to create tables');
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to create a new user
async function createUser({ username, password, email, firstName, lastName, address, phoneNumber, isAdmin = false }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const insertUserQuery = `
    INSERT INTO users(id, username, password, email, first_name, last_name, address, phone_number, is_admin, created_at, updated_at)
    VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, username, email, first_name, last_name, address, phone_number, is_admin, created_at, updated_at
  `;
  const values = [username, hashedPassword, email, firstName, lastName, address, phoneNumber, isAdmin];

  const client = await pool.connect();
  try {
    const { rows } = await client.query(insertUserQuery, values);
    return rows[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to fetch a user by username
async function fetchUserByUsername(username) {
  const fetchUserQuery = `
    SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE username = $1
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(fetchUserQuery, [username]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch user by username: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to fetch a user by email
async function fetchUserByEmail(email) {
  const fetchUserQuery = `
    SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE email = $1
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(fetchUserQuery, [email]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch user by email: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to find a user by username or email
async function findUserByUsernameOrEmail(identifier) {
  const findUserQuery = `
    SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE username = $1 OR email = $1
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(findUserQuery, [identifier]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to find user by username or email: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to authenticate a user
async function authenticate({ username, password }) {
  const findUserQuery = `
    SELECT id, username, password
    FROM users
    WHERE username = $1
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(findUserQuery, [username]);
    if (!response.rows.length) {
      throw new Error('Invalid credentials');
    }
    const match = await bcrypt.compare(password, response.rows[0].password);
    if (!match) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: response.rows[0].id }, JWT_SECRET);
    return { token };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to find a user with a given token
async function findUserWithToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = payload.id;

    const findUserQuery = `
      SELECT id, username
      FROM users
      WHERE id = $1
    `;
    const client = await pool.connect();
    try {
      const response = await client.query(findUserQuery, [userId]);
      if (!response.rows.length) {
        throw new Error('User not found');
      }
      return response.rows[0];
    } catch (error) {
      throw new Error(`Failed to find user with token: ${error.message}`);
    } finally {
      client.release(); // Release the client back to the pool
    }
  } catch (error) {
    throw new Error(`Failed to verify token: ${error.message}`);
  }
}

// Function to create a new product
async function createProduct({ name, description, price, stockQuantity, categoryId }) {
  const insertProductQuery = `
    INSERT INTO products(id, name, description, price, stock_quantity, category_id, created_at, updated_at)
    VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const values = [uuidv4(), name, description, price, stockQuantity, categoryId];

  const client = await pool.connect();
  try {
    const result = await client.query(insertProductQuery, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to fetch all users
async function fetchUsers() {
  const fetchUsersQuery = `
    SELECT id, username, email, first_name, last_name, address, phone_number, is_admin
    FROM users
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(fetchUsersQuery);
    return response.rows;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to fetch user details by ID
async function fetchUserById(userId) {
  const fetchUserQuery = `
    SELECT id, username, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE id = $1
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(fetchUserQuery, [userId]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch user by ID: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to fetch all products
async function fetchProducts() {
  const fetchProductsQuery = `
    SELECT *
    FROM products
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(fetchProductsQuery);
    return response.rows;
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to create a favorite product for a user
async function createFavorite({ userId, productId }) {
  const createWishlistQuery = `
    INSERT INTO wishlists(id, user_id)
    VALUES($1, $2)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING id
  `;

  const wishlistClient = await pool.connect();
  try {
    const wishlistResponse = await wishlistClient.query(createWishlistQuery, [uuidv4(), userId]);
    let wishlistId = wishlistResponse.rows.length ? wishlistResponse.rows[0].id : (await wishlistClient.query('SELECT id FROM wishlists WHERE user_id=$1', [userId])).rows[0].id;

    const insertFavoriteQuery = `
      INSERT INTO wishlist_items(id, wishlist_id, product_id, created_at, updated_at)
      VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const favoriteResponse = await wishlistClient.query(insertFavoriteQuery, [uuidv4(), wishlistId, productId]);

    return favoriteResponse.rows[0];
  } catch (error) {
    throw new Error(`Failed to create favorite: ${error.message}`);
  } finally {
    wishlistClient.release(); // Release the client back to the pool
  }
}

// Function to delete a favorite product for a user
async function destroyFavorite({ userId, productId }) {
  const deleteFavoriteQuery = `
    DELETE FROM wishlist_items
    WHERE wishlist_id = (SELECT id FROM wishlists WHERE user_id = $1)
      AND product_id = $2
  `;

  const client = await pool.connect();
  try {
    await client.query(deleteFavoriteQuery, [userId, productId]);
  } catch (error) {
    throw new Error(`Failed to delete favorite: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to fetch all favorite products for a user
async function fetchFavorites(userId) {
  const fetchFavoritesQuery = `
    SELECT wi.*, p.name AS product_name, p.description AS product_description, p.price AS product_price
    FROM wishlist_items wi
    JOIN products p ON wi.product_id = p.id
    WHERE wi.wishlist_id = (SELECT id FROM wishlists WHERE user_id = $1)
  `;

  const client = await pool.connect();
  try {
    const response = await client.query(fetchFavoritesQuery, [userId]);
    return response.rows;
  } catch (error) {
    throw new Error(`Failed to fetch favorites: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

module.exports = {
  pool,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  destroyFavorite,
  authenticate,
  findUserWithToken,
  fetchUserByUsername,
  fetchUserById,
  findUserByUsernameOrEmail,
};
