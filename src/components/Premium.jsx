import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';
import './styles/Premium.css';

const Premium = () => {
  const [premiumBooks, setPremiumBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPremiumBooks = async () => {
      try {
        setLoading(true);
        const books = await BookService.getPremiumBooks(4);
        setPremiumBooks(books);
      } catch (err) {
        console.error('Error fetching premium books:', err);
        setError('Failed to load premium books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumBooks();
  }, []);

  if (loading) {
    return (
      <div className="premiumloading-container">
        <h2 className="premiumpage-title">Premium Books</h2>
        <p className="premiumloading-message">Loading premium content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premiumerror-container">
        <h2 className="premiumpage-title">Premium Books</h2>
        <p className="premiumerror-message">{error}</p>
      </div>
    );
  }

  if (premiumBooks.length === 0) {
    return (
      <div className="premiumempty-container">
        <h2 className="premiumpage-title">Premium Books</h2>
        <p>No premium books available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h2 className="premiumpage-title">Premium Books</h2>
        <div className="premium-badge">
          Premium Content
        </div>
      </div>

      <div className="premiumbooks-grid">
        {premiumBooks.map((book) => (
          <div key={book._id} className="premiumbook-card">
            <div className="premiumbook-image-container">
              <img 
                src={book.image} 
                alt={book.title} 
                className="premiumbook-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-book.png';
                }}
              />
              <div className="book-premium-badge">
                PREMIUM
              </div>
            </div>

            <div className="premiumbook-details">
              <h3 className="premiumbook-title">{book.title}</h3>
              <p className="premiumbook-author">by {book.author}</p>
              
              <div className="premiumbook-rating">
                <div className="premiumstar-container">
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
                <span className="premiumreview-count">
                  ({book.ratingCount || 0} {book.ratingCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              
              <p className="premiumbook-caption">{book.caption}</p>
              
              <div className="premiumbook-action">
                <Link
                  to={`/book/premium/${book._id}`}
                  className="premiumread-button"
                >
                  Read Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;