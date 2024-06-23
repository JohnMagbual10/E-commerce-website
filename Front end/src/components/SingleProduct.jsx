import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SingleBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch book');
        }
        const data = await response.json();
        setBook(data.book);
        setLoading(false);
      } catch (error) {
        console.error('Book Fetch Error:', error);
        setError('Failed to fetch book. Please try again.');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!book) {
    return <p>No book found.</p>;
  }

  return (
    <div className="single-book-container">
      <h2 className="single-book-title">{book.title}</h2>
      <div className="single-book-info">
        <p>Author: {book.author}</p>
        <p>Description: {book.description}</p>
      </div>
      <img className="single-book-image" src={book.coverimage} alt={book.title} />
      <p>Available: {book.available ? 'Yes' : 'No'}</p>
      <Link to="/books" className="single-book-link">Back to Books</Link>
    </div>
  );
};

export default SingleBook;