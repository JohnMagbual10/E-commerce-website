const express = require('express');
const router = express.Router();

// Import database functions and middleware
const { authenticate, findUserWithToken, fetchUserById, createUser } = require('../server/db');
const verifyTokenMiddleware = require('../middlewares/verifyToken');

// Route to handle user registration
router.post('/register', async (req, res, next) => {
  const { username, password, email, firstName, lastName, address, phoneNumber, isAdmin } = req.body;

  try {
    console.log('Attempting to register user:', username);

    const newUser = await createUser({ username, password, email, firstName, lastName, address, phoneNumber, isAdmin });
    console.log('User registered successfully:', newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error.message);
    next(new Error('Failed to register user')); // Pass the error to the error handler middleware
  }
});

// Route to handle user login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    console.log('Attempting to log in user with credentials:', username);

    // Authenticate user
    const result = await authenticate(username, password);

    if (result) {
      console.log('Login successful:', result);
      res.status(200).json(result);
    } else {
      console.error('Login failed: Invalid credentials');
      res.status(401).json({ message: 'Login failed. Invalid credentials.' });
    }
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Login failed. Invalid credentials.' });
  }
});

// Route to handle user logout
router.post('/logout', (req, res) => {
  try {
    console.log('Logging out user');

    // Assuming token management or cleanup logic is implemented
    res.clearCookie('token'); // Clear token cookie if token-based authentication is used

    // Send response indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Route to fetch user details by ID
router.get('/users/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching user details for userId:', userId);

    const user = await fetchUserById(userId);
    if (!user) {
      console.log('User not found with userId:', userId);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('User details retrieved successfully:', user);
    res.status(200).json(user);
  } catch (err) {
    console.error('Failed to fetch user details:', err.message);
    next(new Error('Failed to fetch user details')); // Pass a descriptive error to the error handler middleware
  }
});

// Route to get user information based on token
router.get('/me', verifyTokenMiddleware, async (req, res, next) => {
  try {
    // Assuming the authorization header contains the token
    const token = req.headers.authorization.split(' ')[1]; // Remove 'Bearer ' prefix if present
    console.log('Fetching user information for token:', token);

    const result = await findUserWithToken(token);
    console.log('User information retrieved successfully:', result);

    res.status(200).json(result);
  } catch (err) {
    console.error('Failed to retrieve user information:', err.message);
    next(new Error('Failed to retrieve user information')); // Pass a descriptive error to the error handler middleware
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Error encountered:', err.stack); // Log the full error stack trace for debugging

  // Handle specific types of errors with appropriate HTTP status codes and messages
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
