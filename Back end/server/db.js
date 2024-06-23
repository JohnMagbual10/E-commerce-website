const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// PostgreSQL pool initialization
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db',
});

// Test database connection
async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
}

testConnection(); // Call the testConnection function to verify

const JWT_SECRET = process.env.JWT || 'shhh';

if (JWT_SECRET === 'shhh') {
  console.log('Warning: If deployed, set process.env.JWT to something other than "shhh"');
}

// Define dummy product data
const dummyProducts = [
  // ... Define dummy product objects as before
];

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

    // ... Other table definitions as before
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

// Function to fetch all users
async function fetchUsers() {
  const fetchUsersQuery = 'SELECT id, username, email, first_name, last_name FROM users';

  const client = await pool.connect();
  try {
    const result = await client.query(fetchUsersQuery);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
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

// Function to find a user by token
async function findUserFromToken(token) {
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const findUserQuery = `
      SELECT id, username, email, first_name, last_name, address, phone_number, is_admin
      FROM users
      WHERE id = $1
    `;

    const client = await pool.connect();
    try {
      const response = await client.query(findUserQuery, [id]);
      if (!response.rows.length) {
        throw new Error('User not found');
      }
      return response.rows[0];
    } catch (error) {
      throw new Error(`Failed to find user from token: ${error.message}`);
    } finally {
      client.release(); // Release the client back to the pool
    }
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Function to fetch all products
async function fetchProducts() {
  const fetchProductsQuery = 'SELECT * FROM products';

  const client = await pool.connect();
  try {
    const result = await client.query(fetchProductsQuery);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to fetch a product by its ID
async function fetchProductById(id) {
  const fetchProductQuery = 'SELECT * FROM products WHERE id = $1';

  const client = await pool.connect();
  try {
    const result = await client.query(fetchProductQuery, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch product by ID: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
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

// Function to update an existing product
async function updateProduct(id, { name, description, price, stockQuantity, categoryId }) {
  const updateProductQuery = `
    UPDATE products
    SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const values = [name, description, price, stockQuantity, categoryId, id];

  const client = await pool.connect();
  try {
    const result = await client.query(updateProductQuery, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Function to delete a product
async function deleteProduct(id) {
  const deleteProductQuery = 'DELETE FROM products WHERE id = $1';

  const client = await pool.connect();
  try {
    await client.query(deleteProductQuery, [id]);
    return { message: 'Product deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Exporting all the functions to be used in other parts of the application
module.exports = {
  Pool,
  createTables,
  createUser,
  dummyProducts,
  fetchUsers,
  fetchUserByUsername,
  fetchUserByEmail,
  findUserByUsernameOrEmail,
  authenticate,
  findUserFromToken,
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
