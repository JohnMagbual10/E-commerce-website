import React, { useState } from 'react';

const Login = ({ setToken }) => {
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
=======
  const [formData, setFormData] = useState({ username: '', password: '' });
>>>>>>> 008859a (update account component)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
<<<<<<< HEAD
    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      const { token } = data;
      setToken(token);
      setError(null);
      console.log('Login successful');
      console.log('Token:', token);
      setFormData({ // Reset form fields after successful login
        username: '',
        password: ''
      });
=======

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { token, user } = data;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setError(null);
      console.log('Login successful');
>>>>>>> 008859a (update account component)
    } catch (error) {
      setError('Login failed. Please check your credentials.');
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
<<<<<<< HEAD
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Login'
          )}
=======
          {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Login'}
>>>>>>> 008859a (update account component)
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
