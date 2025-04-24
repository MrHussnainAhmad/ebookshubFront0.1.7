import React, { useState, useEffect } from 'react';
import BookService from '../services/BookService';
import { Link } from 'react-router-dom';
import './styles/HomeComp.css';


const NewArrivals = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await BookService.getNewBooks(4);
        setBooks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching new books:', err);
        setError('Failed to load new arrivals');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading new arrivals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="new-arrivals-container">
      <h2 className="section-title">New Arrivals</h2>
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
                  <p className="book-genre">{book.genre}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No new arrivals available</p>
        )}
      </div>
      <div className="view-more">
        <Link to="/library" className="view-more-button">
          View More
        </Link>
      </div>
    </div>
  );
};

export default NewArrivals;