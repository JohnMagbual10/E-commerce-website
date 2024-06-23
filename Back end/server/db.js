const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// PostgreSQL client initialization with SSL support for production
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Use SSL in production
});

// JWT secret setup
const JWT_SECRET = process.env.JWT || 'shhh';

if (JWT_SECRET === 'shhh') {
  console.log('Warning: If deployed, set process.env.JWT to something other than "shhh"');
}

// Connect to PostgreSQL database
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    throw new Error('Failed to connect to database');
  }
}

// Function to create database tables
async function createTables() {
  const createTablesQuery = `
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

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `;

  try {
    await client.query(createTablesQuery);
    console.log('Tables created');
  } catch (err) {
    console.error('Error creating tables:', err.message);
    throw new Error('Failed to create tables');
  }
}

// Function to create a new user
async function createUser({ username, password, email, firstName, lastName, address, phoneNumber, isAdmin }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const insertUserQuery = `
    INSERT INTO users(id, username, password, email, first_name, last_name, address, phone_number, is_admin, created_at, updated_at)
    VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, username, email, first_name, last_name, address, phone_number, is_admin, created_at, updated_at
  `;
  const values = [
    username,
    hashedPassword,
    email,
    firstName,
    lastName,
    address,
    phoneNumber,
    isAdmin || false,
  ];

  try { 
    const { rows } = await client.query(insertUserQuery, values);
    return rows[0];
  } catch (error) {
    console.error('Create user error:', error.message);
    throw new Error('Failed to create user');
  }
}

// Function to fetch a user by username
async function fetchUserByUsername(username) {
  try {
    const fetchUserQuery = `
      SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
      FROM users
      WHERE username = $1
    `;
    const response = await client.query(fetchUserQuery, [username]);

    if (!response.rows.length) {
      return null; // User not found
    }

    return response.rows[0]; // Return the first row (assuming username is unique)
  } catch (err) {
    console.error('Fetch user by username error:', err.message);
    throw new Error('Failed to fetch user by username');
  }
}

// Function to fetch a user by email
async function fetchUserByEmail(email) {
  try {
    const fetchUserQuery = `
      SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
      FROM users
      WHERE email = $1
    `;
    const response = await client.query(fetchUserQuery, [email]);

    if (!response.rows.length) {
      return null; // User not found
    }

    return response.rows[0]; // Return the first row (assuming email is unique)
  } catch (err) {
    console.error('Fetch user by email error:', err.message);
    throw new Error('Failed to fetch user by email');
  }
}

// Function to find a user by username or email
async function findUserByUsernameOrEmail(identifier) {
  try {
    const findUserQuery = `
      SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
      FROM users
      WHERE username = $1 OR email = $1
    `;
    const response = await client.query(findUserQuery, [identifier]);

    if (!response.rows.length) {
      return null; // User not found
    }

    return response.rows[0]; // Return the first row (assuming username or email is unique)
  } catch (err) {
    console.error('Find user by username or email error:', err.message);
    throw new Error('Failed to find user by username or email');
  }
}

// Authentication function
async function authenticate(username, password) {
  const user = await User.findOne({ username });

  if (!user || !user.comparePassword(password)) { // comparePassword should handle password hashing comparison
    throw new Error('Invalid credentials');
  }

  return user; // Return user object if authentication is successful
}

// Function to find a user with token
async function findUserWithToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = payload.id;

    const findUserQuery = 'SELECT id, username FROM users WHERE id=$1';
    const response = await client.query(findUserQuery, [userId]);

    if (!response.rows.length) {
      throw new Error('User not found'); // Token is valid, but no user found
    }

    return response.rows[0]; // Return the first row (assuming user ID is unique)
  } catch (err) {
    console.error('Find user with token error:', err.message);
    throw new Error('Failed to find user with token');
  }
}

// Function to fetch user by ID
async function fetchUserById(userId) {
  const query = `
    SELECT id, username, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE id = $1;
  `;

  try {
    const { rows } = await client.query(query, [userId]);
    const user = rows[0];
    return user;
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    throw new Error('Failed to fetch user by ID');
  }
}

module.exports = {
  client,
  authenticate,
  connectDB,
  createTables,
  createUser,
  fetchUserByUsername,
  fetchUserByEmail,
  findUserByUsernameOrEmail,
  authenticate,
  findUserWithToken,
  fetchUserById,
};
