import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookList = ({ addToCart }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error('Book List Fetch Error:', error);
      }
    };

    fetchBooks();
  }, []);
  

  return (
    <div className="book-list-container">
      <h2>Book List</h2>
      <ul className="book-list">
        {books.map(book => (
          <li key={book.id} className="book">
            <Link to={`/books/${book.id}`}>
              <h3>{book.title}</h3>
            </Link>
            <p>Author: {book.author}</p>
            <p>Description: {book.description}</p>
            <img src={book.coverimage} alt={book.title} />
            <p>Available: {book.available ? 'Yes' : 'No'}</p>
            <button 
              onClick={() => addToCart(book)} 
              className="add-to-cart-button"
              disabled={!book.available}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
