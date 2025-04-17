// src/components/CombinedBooksComponent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';
import './styles/BookComponents.css';

const BooksComponent = () => {
  // State for all three book types
  const [premiumBooks, setPremiumBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  
  // Shared loading and error states
  const [loading, setLoading] = useState({
    premium: true,
    newArrivals: true,
    trending: true
  });
  
  const [error, setError] = useState({
    premium: null,
    newArrivals: null,
    trending: null
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Premium Books
    const fetchPremiumBooks = async () => {
      try {
        const response = await BookService.getPremiumBooks(2);
        setPremiumBooks(response);
        setLoading(prev => ({ ...prev, premium: false }));
      } catch (err) {
        console.error('Error fetching premium books:', err);
        setError(prev => ({ ...prev, premium: 'Failed to load premium books' }));
        setLoading(prev => ({ ...prev, premium: false }));
      }
    };

    // Fetch New Arrivals
    const fetchNewBooks = async () => {
      try {
        const response = await BookService.getNewBooks();
        setNewBooks(response);
        setLoading(prev => ({ ...prev, newArrivals: false }));
      } catch (err) {
        console.error('Error fetching new books:', err);
        setError(prev => ({ ...prev, newArrivals: 'Failed to load new arrivals' }));
        setLoading(prev => ({ ...prev, newArrivals: false }));
      }
    };

    // Fetch Trending Books
    const fetchTrendingBooks = async () => {
      try {
        const books = await BookService.getTrendingBooks(4);
        setTrendingBooks(books);
        setLoading(prev => ({ ...prev, trending: false }));
      } catch (err) {
        console.error('Error fetching trending books:', err);
        setError(prev => ({ ...prev, trending: 'Could not load trending books' }));
        setLoading(prev => ({ ...prev, trending: false }));
      }
    };

    fetchPremiumBooks();
    fetchNewBooks();
    fetchTrendingBooks();
  }, []);

  const handleReadNow = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Render Premium Books Section
  const renderPremiumBooks = () => {
    if (loading.premium) return <div className="premium-loading">Loading premium books...</div>;
    if (error.premium) return <div className="premium-error">{error.premium}</div>;

    return (
      <div className="premium">
        <h2 className="premium-title">Premium Books</h2>
        <div className="premiumCategories">
          {premiumBooks.length > 0 ? (
            premiumBooks.map((book) => (
              <div key={book._id} className="premiumCategory-card">
                <img src={book.image} alt={book.title} />
                <h3 className="premiumCategory-card-title">{book.title}</h3>
                <p className="premiumCategory-card-genre">{book.genre}</p>
                <p className="premiumCategory-card-reads">
                  {book.views || 0} reads • {book.Rating ? book.Rating.toFixed(1) : '0.0'} ★
                </p>
                <button 
                  className="read-now-button"
                  onClick={() => handleReadNow(book._id)}
                >
                  Read Now
                </button>
              </div>
            ))
          ) : (
            <p className="no-books-message">No premium books available at the moment</p>
          )}
        </div>
      </div>
    );
  };

  // Render New Arrivals Section
  const renderNewArrivals = () => {
    if (loading.newArrivals) return <div className="new-arrivals-loading">Loading new arrivals...</div>;
    if (error.newArrivals) return <div className="new-arrivals-error">{error.newArrivals}</div>;

    return (
      <div className="new-arrivals">
        <h2 className="new-arrivals-title">New Arrivals</h2>
        <div className="categories">
          {newBooks.length > 0 ? (
            newBooks.map((book) => (
              <div key={book._id} className="new-arrival-card">
                <img src={book.image} alt={book.title} />
                <h3 className="new-arrival-card-title">{book.title}</h3>
                <p className="new-arrival-card-genre">{book.genre}</p>
                <p className="new-arrival-card-reads">
                  {book.views || 0} reads • {book.Rating ? book.Rating.toFixed(1) : '0.0'} ★
                </p>
                <button 
                  className="new-arrival-read-now-button"
                  onClick={() => handleReadNow(book._id)}
                >
                  Read Now
                </button>
              </div>
            ))
          ) : (
            <p className="no-books-message">No new arrivals available at the moment</p>
          )}
        </div>
      </div>
    );
  };

  // Render Trending Books Section
  const renderTrendingBooks = () => {
    if (loading.trending) return (
      <div className="trending">
        <h2 className="trending-title">Trending eBooks</h2>
        <div className="loading-container">
          <p>Loading trending books...</p>
        </div>
      </div>
    );
    
    if (error.trending) return (
      <div className="trending">
        <h2 className="trending-title">Trending eBooks</h2>
        <div className="error-container">
          <p>{error.trending}</p>
        </div>
      </div>
    );

    return (
      <section className="trending">
        <h2 className="trending-title">Trending eBooks</h2>
        <div className="categories">
          {trendingBooks.length > 0 ? (
            trendingBooks.map((book) => (
              <div className="trendingCategory-card" key={book._id}>
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="trendingCategory-card-image" 
                  loading="lazy"
                />
                <p className="trendingCategory-card-title">{book.title}</p>
                <p className="trendingCategory-card-genre">{book.genre}</p>
                <p className="trendingCategory-card-reads">Reads: {book.views || 0}+</p>
                <button 
                  className="trendingRead-now-button"
                  onClick={() => handleReadNow(book._id)}
                >
                  Read Now
                </button>
              </div>
            ))
          ) : (
            // Default placeholder cards if no trending books are found
            <>
              {[1, 2, 3, 4].map((index) => (
                <div className="category-card" key={index}>
                  <div className="placeholder-image"></div>
                  <p className="category-card-title">Book Title</p>
                  <p className="category-card-genre">Genre</p>
                  <p className="category-card-reads">No reads yet</p>
                  <button className="read-now-button disabled">Read Now</button>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="books-showcase">
      {renderPremiumBooks()}
      {renderNewArrivals()}
      {renderTrendingBooks()}
    </div>
  );
};

export default BooksComponent;