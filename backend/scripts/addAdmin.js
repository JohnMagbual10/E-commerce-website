const bcrypt = require('bcrypt');
const { client } = require('../server/db');

const addAdmin = async () => {
  const adminUsers = [
    {
      username: 'admin2',
      password: 'adminpassword2',
      email: 'admin2@example.com',
      first_name: 'Admin',
      last_name: 'Two',
      is_admin: true,
    },
    {
      username: 'admin3',
      password: 'adminpassword3',
      email: 'admin3@example.com',
      first_name: 'Admin',
      last_name: 'Three',
      is_admin: true,
    },
  ];

  try {
    for (const user of adminUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await client.query(
        'INSERT INTO users (username, password, email, first_name, last_name, is_admin) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.username, hashedPassword, user.email, user.first_name, user.last_name, user.is_admin]
      );
    }
    console.log('Admin users added successfully');
  } catch (err) {
    console.error('Error adding admin users:', err.message);
  } finally {
    await client.end();
  }
};

addAdmin();
