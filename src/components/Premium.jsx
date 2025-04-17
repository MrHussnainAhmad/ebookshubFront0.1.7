import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';
import { useAuth } from '../context/AuthContext';
import './styles/Premium.css';

const Premium = () => {
  const [premiumBooks, setPremiumBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPremiumBooks = async () => {
      try {
        setLoading(true);
        // For non-logged in users, we'll use a public endpoint or handle it differently
        // since we want to show premium books to everyone
        const books = await BookService.getPremiumBooks(4); // Get 4 premium books
        setPremiumBooks(books);
      } catch (err) {
        console.error('Error fetching premium books:', err);
        setError('Failed to load premium books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch premium books regardless of authentication status
    fetchPremiumBooks();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="page-title">Premium Books</h2>
        <p className="loading-message">Loading premium content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2 className="page-title">Premium Books</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (premiumBooks.length === 0) {
    return (
      <div className="empty-container">
        <h2 className="page-title">Premium Books</h2>
        <p className="empty-message">Require Login!</p>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h2 className="page-title">Premium Books</h2>
        <div className="premium-badge">
          Premium Content
        </div>
        {!isAuthenticated && (
          <div className="login-notice">
            <p>Log in to read, rate, and comment on premium books.</p>
            <Link to="/login" className="login-button">
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="books-grid">
        {premiumBooks.map((book) => (
          <div key={book._id} className="book-card">
            <div className="book-image-container">
              <img 
                src={book.image} 
                alt={book.title} 
                className="book-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-book.png';
                }}
              />
              <div className="book-premium-badge">
                PREMIUM
              </div>
            </div>

            <div className="book-details">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              
              <div className="book-rating">
                <div className="star-container">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`star-icon ${i < Math.round(book.Rating || 0) ? 'star-filled' : 'star-empty'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="review-count">
                  ({book.ratingCount || 0} {book.ratingCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              
              <p className="book-caption">{book.caption}</p>
              
              <div className="book-action">
                <Link
                  to={`/book/${book._id}`}
                  className="read-button"
                >
                  View Details
                </Link>
                {!isAuthenticated && (
                  <div className="premium-access-info">
                    <Link to="/login" className="premium-login-link">
                      Login to read
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;