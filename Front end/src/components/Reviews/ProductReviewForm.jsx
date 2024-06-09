// File: src/components/Reviews/ProductReviewForm.jsx
import React, { useState } from 'react';

const ProductReviewForm = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    comment: '',
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to the backend for processing
    console.log('Form submitted:', formData);
    // Reset form fields after submission
    setFormData({
      name: '',
      email: '',
      rating: '',
      comment: '',
    });
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="product-review-form">
      <h2>Write a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Comment:</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ProductReviewForm;
