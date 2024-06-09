// File: ./components/UI/Input.jsx
import React from 'react';

const Input = ({ type, placeholder, value, onChange }) => {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} />;
};

export default Input;
