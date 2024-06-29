## E-Commerce Application

This is a full-stack e-commerce application built with React on the frontend and Node.js/Express with PostgreSQL on the backend. The application allows users to browse products, add them to a cart, and proceed to checkout. Administrators can add/remove products and see a list of users.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)

## Features

For Users (Not Logged In)
Access the website to browse and purchase products.
View all available products.
View the details of individual products, including descriptions, photos, and prices.
Create an account if they do not have one.
Log into their account if they already have one.

For Users (Logged In)
Have a persistent cart to revisit and pick up where they left off.
Add a product to the cart.
Edit the cart by changing the quantity of a product or removing a product from the cart.
Proceed to checkout and purchase the products.

For Administrators
View a list of all products.
Add, edit, and remove products.
View a list of all users, including relevant user information.

For Engineers
Have a well-seeded database for simulating different user scenarios.
Secure user data to prevent unauthorized manipulation.

## Requirements

- Node.js (v18.19.0 or later)
- PostgreSQL
- A web browser

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/e_commerce_project.git
   cd e_commerce_project
   ```
2. Install Dependencies
      ```sh
      npm install
      ```
3. Set Up the PostgreSQL Database
```sh
  Create a .env file in the root directory with the following content:
  DATABASE_URL=your_database_url
  JWT_SECRET=your_jwt_secret
  PORT=your_port
```
## Run the Application

Start the Backend Server
node server/index.js

Start the Frontend Development Server

npm run dev

## Usage

Navigate to the Application

Open your web browser and go to http://localhost:3000.

Browse Products

View all available products and their details.

User Authentication

Register a new account.
Log into your existing account.
Cart Management
Add products to your cart.
Edit the quantity of products in your cart.
Remove products from your cart.
Checkout
Proceed to checkout and complete your purchase.

## API Endpoints

Authentication
POST /api/auth/register: Register a new user.
POST /api/auth/login: Log in an existing user.

Products
GET /api/products: Get all products.
GET /api/products/:id: Get details of a specific product.
POST /api/products: Add a new product (Admin only).
PUT /api/products/:id: Edit a product (Admin only).
DELETE /api/products/:id: Delete a product (Admin only).

Cart
GET /api/cart: Get the current user's cart.
POST /api/cart/add: Add an item to the cart.
PUT /api/cart/update: Update the quantity of an item in the cart.
DELETE /api/cart/remove: Remove an item from the cart.

Checkout
POST /api/checkout: Complete the purchase of items in the cart.
Users
GET /api/users: Get all users (Admin only).

database schema

