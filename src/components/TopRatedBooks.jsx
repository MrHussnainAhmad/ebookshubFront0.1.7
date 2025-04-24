import React, { useState, useEffect } from 'react';
import BookService from '../services/BookService';
import { Link } from 'react-router-dom';
import './styles/HomeComp.css';

const TopRatedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await BookService.getTrendingBooks(4);
        setBooks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top rated books:', err);
        setError('Failed to load top rated books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading top rated books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="top-rated-container">
      <h2 className="section-title">Top Rated Books</h2>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="book-card">
              <Link to={`/books/${book._id}`}>
                <img 
                  src={book.image || "/default-book-cover.png"} 
                  alt={book.title} 
                  className="book-cover"
                />
                <div className="book-info">
                  <h3 className="cardbook-title">{book.title}</h3>
                  <p className="book-author">By {book.author}</p>
                  <div className="book-rating">
                    Rating: {book.Rating ? book.Rating.toFixed(1) : 'No ratings'} 
                    {book.ratingCount ? ` (${book.ratingCount})` : ''}
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No top rated books available</p>
        )}
      </div>
    </div>
  );
};

export default TopRatedBooks;