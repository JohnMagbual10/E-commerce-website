const { Client } = require('pg');
const bcrypt = require('bcrypt'); // Ensure bcrypt is required
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Connection error', err.message);
    process.exit(1);
  }
}

async function createTables() {
  const SQL = `
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
    await client.query(SQL);
    console.log('Tables created');
  } catch (err) {
    console.error('Error creating tables:', err.message);
    throw new Error('Failed to create tables');
  }
}

async function insertInitialUsers() {
  const users = [
    {
      username: 'admin1',
      password: await bcrypt.hash('adminpassword1', 10),
      email: 'admin1@example.com',
      first_name: 'Admin',
      last_name: 'One',
      is_admin: true,
    },
    {
      username: 'user1',
      password: await bcrypt.hash('userpassword1', 10),
      email: 'user1@example.com',
      first_name: 'User',
      last_name: 'One',
      is_admin: false,
    },
    {
      username: 'user2',
      password: await bcrypt.hash('password2', 10),
      email: 'user2@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      address: '456 Elm St',
      phone_number: '098-765-4321',
      is_admin: false
    }
  ];

  try {
    for (const user of users) {
      const { username, password, email, first_name, last_name, address, phone_number, is_admin } = user;
      await client.query(
        'INSERT INTO users (username, password, email, first_name, last_name, address, phone_number, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [username, password, email, first_name, last_name, address, phone_number, is_admin]
      );
    }
    console.log('Initial users inserted');
  } catch (err) {
    console.error('Error inserting initial users:', err.message);
    throw new Error('Failed to insert initial users');
  }
}

async function insertInitialProducts() {
  const products = [
    {
      name: 'Hiking Boots',
      description: 'High-quality leather hiking boots with waterproofing and ankle support.',
      category_id: await getCategoryId('Footwear'),
      price: 150.00,
      stock_quantity: 10,
      image_url: '/images/hiking-boots.jpg'
    },
    {
      name: 'Tent',
      description: 'Lightweight, waterproof tent for two people with easy setup features.',
      category_id: await getCategoryId('Camping Gear'),
      price: 200.00,
      stock_quantity: 5,
      image_url: '/images/tent.jpg'
    },
    {
      name: 'Sleeping Bag',
      description: 'Mummy-style sleeping bag rated for cold weather, lightweight and compressible.',
      category_id: await getCategoryId('Camping Gear'),
      price: 100.00,
      stock_quantity: 15,
      image_url: '/images/sleeping-bag.jpg'
    },
    {
      name: 'Backpack',
      description: 'Multi-day hiking backpack with adjustable straps, multiple compartments, and hydration bladder compatibility.',
      category_id: await getCategoryId('Backpacks'),
      price: 180.00,
      stock_quantity: 7,
      image_url: '/images/backpack.jpg'
    },
    {
      name: 'Portable Stove',
      description: 'Compact camping stove with foldable legs, suitable for various fuel types.',
      category_id: await getCategoryId('Camping Gear'),
      price: 50.00,
      stock_quantity: 20,
      image_url: '/images/portable-stove.jpg'
    },
    {
      name: 'Water Filter',
      description: 'Lightweight water filter pump with replaceable filters for safe drinking water on the go.',
      category_id: await getCategoryId('Camping Gear'),
      price: 75.00,
      stock_quantity: 8,
      image_url: '/images/water-filter.jpg'
    },
    {
      name: 'Headlamp',
      description: 'LED headlamp with adjustable brightness and long battery life, suitable for night hikes.',
      category_id: await getCategoryId('Camping Gear'),
      price: 30.00,
      stock_quantity: 25,
      image_url: '/images/headlamp.jpg'
    },
    {
      name: 'Camping Cookware Set',
      description: 'Nesting cookware set including pots, pans, and utensils, designed for outdoor cooking.',
      category_id: await getCategoryId('Cookware'),
      price: 80.00,
      stock_quantity: 12,
      image_url: '/images/camping-cookware.jpg'
    },
    {
      name: 'Trekking Poles',
      description: 'Collapsible trekking poles with ergonomic grips and shock absorption, ideal for steep terrain.',
      category_id: await getCategoryId('Outdoor Gear'),
      price: 60.00,
      stock_quantity: 18,
      image_url: '/images/trekking-poles.jpg'
    },
    {
      name: 'First Aid Kit',
      description: 'Comprehensive first aid kit with essentials for treating cuts, scrapes, and minor injuries.',
      category_id: await getCategoryId('Safety Gear'),
      price: 40.00,
      stock_quantity: 10,
      image_url: '/images/first-aid-kit.jpg'
    },
    {
      name: 'GPS Device',
      description: 'Handheld GPS device with topographic maps and waypoints for navigation in remote areas.',
      category_id: await getCategoryId('Electronics'),
      price: 120.00,
      stock_quantity: 4,
      image_url: '/images/gps-device.jpg'
    },
    {
      name: 'Solar Charger',
      description: 'Portable solar charger for charging electronic devices while camping or hiking.',
      category_id: await getCategoryId('Electronics'),
      price: 70.00,
      stock_quantity: 6,
      image_url: '/images/solar-charger.jpg'
    }
  ];

  try {
    for (const product of products) {
      const { name, description, category_id, price, stock_quantity, image_url } = product;
      await client.query(
        'INSERT INTO products (name, description, category_id, price, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, description, category_id, price, stock_quantity, image_url]
      );
    }
    console.log('Initial products inserted');
  } catch (err) {
    console.error('Error inserting initial products:', err.message);
    throw new Error('Failed to insert initial products');
  }
}

async function getCategoryId(categoryName) {
  try {
    const result = await client.query('SELECT id FROM categories WHERE name = $1', [categoryName]);
    if (result.rows.length === 0) {
      const insertResult = await client.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
        [categoryName, `${categoryName} description`]
      );
      return insertResult.rows[0].id;
    }
    return result.rows[0].id;
  } catch (err) {
    console.error(`Error fetching or inserting category "${categoryName}":`, err.message);
    throw new Error(`Failed to fetch or insert category "${categoryName}"`);
  }
}

module.exports = { client, connectDB, createTables, insertInitialUsers, insertInitialProducts };
