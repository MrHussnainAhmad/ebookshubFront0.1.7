import React, { useState, useEffect } from 'react';
import BookService from '../services/BookService';
import { Link } from 'react-router-dom';
import './styles/HomeComp.css';


const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await BookService.getRecommendedBooks(4);
        setBooks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommended books:', err);
        setError('Failed to load recommendations');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="recommended-container">
      <h2 className="section-title">Recommended For You</h2>
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
                  <p className="book-caption">{book.caption && book.caption.length > 60 ? 
                    `${book.caption.substring(0, 60)}...` : book.caption}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
};

export default RecommendedBooks;