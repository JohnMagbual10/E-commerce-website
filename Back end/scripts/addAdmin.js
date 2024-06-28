require('dotenv').config();
const bcrypt = require('bcrypt');
const { client } = require('../server/db');

const addAdminUser = async () => {
  await client.connect();

  const admin = {
    username: 'admin',
    password: await bcrypt.hash('adminpassword', 10),
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    is_admin: true,
  };

  try {
    await client.query(
      'INSERT INTO users (username, password, email, first_name, last_name, is_admin) VALUES ($1, $2, $3, $4, $5, $6)',
      [admin.username, admin.password, admin.email, admin.first_name, admin.last_name, admin.is_admin]
    );
    console.log('Admin user added');
  } catch (error) {
    console.error('Error adding admin user:', error);
  } finally {
    client.end();
  }
};

addAdminUser();
