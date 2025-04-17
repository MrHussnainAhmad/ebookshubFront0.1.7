import React from "react";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';
import './styles/Trending.css';

const Trending = () => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        setLoading(true);
        const books = await BookService.getTrendingBooks(4); // Get top 4 trending books
        setTrendingBooks(books);
      } catch (error) {
        console.error("Error fetching trending books:", error);
        setError("Could not load trending books");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  if (loading) {
    return (
      <section className="trending">
        <h2 className="trending-title">Trending eBooks</h2>
        <div className="loading-container">
          <p>Loading trending books...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="trending">
        <h2 className="trending-title">Trending eBooks</h2>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </section>
    );
  }

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
              <Link to={`/book/${book._id}`} className="trendingRead-now-button">
                Read Now
              </Link>
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

export default Trending;