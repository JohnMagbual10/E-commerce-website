import axios from 'axios';

const API_URL = 'http://your-api-url.com';

export const getProducts = async () => {
  return await axios.get(`${API_URL}/products`);
};

export const getProductById = async (id) => {
  return await axios.get(`${API_URL}/products/${id}`);
};

export const getCart = async () => {
  return await axios.get(`${API_URL}/cart`);
};

export const updateCartItem = async (id, data) => {
  return await axios.put(`${API_URL}/cart/${id}`, data);
};

export const removeCartItem = async (id) => {
  return await axios.delete(`${API_URL}/cart/${id}`);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/products/${id}`);
};
