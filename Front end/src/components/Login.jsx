import React, { useState } from 'react';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text(); // Get the response text
        console.error('Login Error:', text); // Log the response text for debugging

        if (response.status === 401) {
          throw new Error('Invalid username or password');
        } else {
          throw new Error('Login failed'); // Throw a generic error message
        }
      }

      const data = await response.json();
      const { token } = data;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      setToken(token); // Set the token received from the server
      console.log('Login Successful:', data);
      // Example: Fetch user profile after successful login
      fetchUserProfile(token);
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input"
        />
        <button type="submit" disabled={loading} className="login-button">
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Login'
          )}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
