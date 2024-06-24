import React, { useState } from 'react';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      setToken(token); // Set the token received from the server
      console.log('Login Successful:', data);
      // Redirect or navigate to another page after successful login
      // Example: history.push('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Logout request failed');
      }
  
      // Clear token from client-side storage
      localStorage.removeItem('token');
      setToken(null); // Update state to reflect logout
  
      // Redirect or update UI as needed after successful logout
      history.push('/login'); // Example: Redirect to login page
    } catch (error) {
      console.error('Logout Error:', error.message);
      // Handle error state or display error message to the user
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
