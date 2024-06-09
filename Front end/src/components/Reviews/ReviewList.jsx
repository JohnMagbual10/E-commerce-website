// File: src/components/Reviews/ReviewList.jsx
import React, { useEffect, useState } from 'react';

const ReviewList = () => {
  // State to store reviews data
  const [reviews, setReviews] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error state
  const [error, setError] = useState(null);

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Simulated API call to fetch reviews
        const response = await fetch('/api/reviews'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render reviews
  return (
    <div className="review-list">
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <h3>{review.title}</h3>
              <p>{review.content}</p>
              <p>Rating: {review.rating}</p>
              {/* Add more review details here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
