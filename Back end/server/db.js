const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// PostgreSQL client initialization
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db',
  ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : false, // Adjust SSL config as needed
});

client.connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.error('Error connecting to database:', err.message);
    process.exit(1); // Exit process on database connection error
  });

const JWT_SECRET = process.env.JWT || 'shhh';

if (JWT_SECRET === 'shhh') {
  console.log('Warning: If deployed, set process.env.JWT to something other than "shhh"');
}

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
      image_url TEXT,
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

  try {
    await client.query(createTablesQuery);
    console.log('Tables created');
  } catch (err) {
    console.error('Error creating tables:', err.message);
    throw new Error('Failed to create tables');
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

  try {
    const { rows } = await client.query(insertUserQuery, values);
    return rows[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

// Function to fetch a user by username
async function fetchUserByUsername(username) {
  const fetchUserQuery = `
    SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE username = $1
  `;

  try {
    const response = await client.query(fetchUserQuery, [username]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch user by username: ${error.message}`);
  }
}

// Function to fetch a user by email
async function fetchUserByEmail(email) {
  const fetchUserQuery = `
    SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE email = $1
  `;

  try {
    const response = await client.query(fetchUserQuery, [email]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch user by email: ${error.message}`);
  }
}

// Function to find a user by username or email
async function findUserByUsernameOrEmail(identifier) {
  const findUserQuery = `
    SELECT id, username, password, email, first_name, last_name, address, phone_number, is_admin
    FROM users
    WHERE username = $1 OR email = $1
  `;

  try {
    const response = await client.query(findUserQuery, [identifier]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to find user by username or email: ${error.message}`);
  }
}

// Function to authenticate a user
async function authenticate({ username, password }) {
  const findUserQuery = `
    SELECT id, username, password
    FROM users
    WHERE username = $1
  `;

  try {
    const response = await client.query(findUserQuery, [username]);
    if (!response.rows.length) {
      throw new Error('Invalid credentials');
    }
    const match = await bcrypt.compare(password, response.rows[0].password);
    if (!match) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: response.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
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
    const response = await client.query(findUserQuery, [userId]);
    if (!response.rows.length) {
      throw new Error('User not found');
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to find user with token: ${error.message}`);
  }
}

// Function to create a new product
async function createProduct({ name, description, price, stockQuantity, categoryId }) {
  const insertProductQuery = `
    INSERT INTO products(id, name, description, price, stock_quantity, category_id, created_at, updated_at)
    VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, name, description, price, stock_quantity, category_id, created_at, updated_at
  `;
  const values = [name, description, price, stockQuantity, categoryId];

  try {
    const { rows } = await client.query(insertProductQuery, values);
    return rows[0];
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

// Function to fetch all products
async function fetchProducts() {
  const fetchProductsQuery = `
    SELECT id, name, description, price, stock_quantity, category_id, created_at, updated_at
    FROM products
  `;

  try {
    const { rows } = await client.query(fetchProductsQuery);
    return rows;
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

// Function to fetch a product by ID
async function fetchProductById(productId) {
  const fetchProductQuery = `
    SELECT id, name, description, price, stock_quantity, category_id, created_at, updated_at
    FROM products
    WHERE id = $1
  `;

  try {
    const response = await client.query(fetchProductQuery, [productId]);
    if (!response.rows.length) {
      return null;
    }
    return response.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch product by ID: ${error.message}`);
  }
}

// Function to update a product
async function updateProduct({ id, name, description, price, stockQuantity, categoryId }) {
  const updateProductQuery = `
    UPDATE products
    SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING id, name, description, price, stock_quantity, category_id, created_at, updated_at
  `;
  const values = [name, description, price, stockQuantity, categoryId, id];

  try {
    const { rows } = await client.query(updateProductQuery, values);
    if (!rows.length) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

// Function to delete a product
async function deleteProduct(productId) {
  const deleteProductQuery = `
    DELETE FROM products
    WHERE id = $1
    RETURNING id, name
  `;

  try {
    const { rows } = await client.query(deleteProductQuery, [productId]);
    if (!rows.length) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

// Function to insert dummy products into the database
async function dummyProducts(count = 10) {
  const insertProductQuery = `
    INSERT INTO products(id, name, description, price, stock_quantity, category_id, created_at, updated_at)
    VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *;
  `;

  const categoryIds = await fetchCategoryIds(); // Fetch category IDs from the database

  // Generate dummy data
  const dummyData = Array.from({ length: count }).map(() => {
    return [
      uuidv4(),  // Product ID
      `Product ${Math.random().toString(36).substring(7)}`,  // Random name
      'This is a dummy product description',  // Description
      (Math.random() * 100).toFixed(2),  // Random price
      Math.floor(Math.random() * 1000),  // Random stock quantity
      categoryIds[Math.floor(Math.random() * categoryIds.length)]  // Random category ID
    ];
  });

  try {
    const result = [];
    for (const values of dummyData) {
      const { rows } = await client.query(insertProductQuery, values);
      result.push(rows[0]);
    }
    return result;
  } catch (error) {
    throw new Error(`Failed to insert dummy products: ${error.message}`);
  }
}

// Helper function to fetch category IDs
async function fetchCategoryIds() {
  const fetchCategoriesQuery = 'SELECT id FROM categories';
  try {
    const result = await client.query(fetchCategoriesQuery);
    return result.rows.map(row => row.id);
  } catch (error) {
    throw new Error(`Failed to fetch category IDs: ${error.message}`);
  }
}

module.exports = {
  createTables,
  createUser,
  fetchUserByUsername,
  fetchUserByEmail,
  findUserByUsernameOrEmail,
  authenticate,
  findUserWithToken,
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProduct,
  deleteProduct,
  dummyProducts,
  client,
};
