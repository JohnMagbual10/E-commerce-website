const { Client } = require('pg');
const client = new Client();

const createUserTable = async () => {
  const query = `
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
  `;
  await client.query(query);
};

module.exports = { createUserTable };
