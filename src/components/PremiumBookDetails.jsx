import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookService from '../services/BookService';
import './styles/BookDetails.css'; 

const PremiumBookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        // Use the public premium endpoint that works for both authenticated and unauthenticated users
        const bookData = await BookService.getPremiumBookById(id);
        
        if (bookData) {
          setBook(bookData);
          
          // Also fetch the PDF URL
          const pdfData = await BookService.getPremiumBookPdf(id);
          if (pdfData && pdfData.pdfUrl) {
            setPdfUrl(pdfData.pdfUrl);
          }
        } else {
          setError('Book not found');
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Book Details</h2>
        <p className="loading-message">Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <Link to="/premium" className="back-link">Back to Premium Books</Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="not-found-container">
        <h2>Book Not Found</h2>
        <p>The book you're looking for does not exist or may have been removed.</p>
        <Link to="/premium" className="back-link">Back to Premium Books</Link>
      </div>
    );
  }

  return (
    <div className="book-details-container">
      <div className="book-header">
        <h1 className="book-title">{book.title}</h1>
        <div className="premium-badge">PREMIUM</div>
      </div>
      
      <div className="book-content">
        <div className="book-image-section">
          <img 
            src={book.image} 
            alt={book.title} 
            className="book-cover-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-book.png';
            }}
          />
          
          <div className="book-meta">
            <p className="book-author">By {book.author}</p>
            <p className="book-genre">Genre: {book.genre}</p>
            
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
              <span>
                ({book.ratingCount || 0} {book.ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <p className="book-views">Views: {book.views || 0}</p>
          </div>
          
          {pdfUrl && (
            <div className="book-actions">
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="read-button"
              >
                Read PDF
              </a>
            </div>
          )}
        </div>
        
        <div className="book-details-section">
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.caption || 'No description available.'}</p>
          </div>
          
          {book.user && (
            <div className="book-uploader">
              <h3>Uploaded by</h3>
              <div className="uploader-info">
                <img 
                  src={book.user.profileImage || '/default-avatar.png'} 
                  alt={book.user.username}
                  className="uploader-avatar"
                />
                <span>{book.user.username}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="navigation-links">
        <Link to="/premium" className="back-link">Back to Premium Books</Link>
      </div>
    </div>
  );
};

export default PremiumBookDetails;