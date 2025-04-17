import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';
import './styles/PremiumBanner.css';

const PremiumBanner = () => {
  const [featuredPremium, setFeaturedPremium] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremiumBook = async () => {
      try {
        setLoading(true);
        const premiumBooks = await BookService.getPremiumBooks(1);
        if (premiumBooks && premiumBooks.length > 0) {
          setFeaturedPremium(premiumBooks[0]);
        }
      } catch (error) {
        console.error("Error fetching premium book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumBook();
  }, []);

  if (loading) {
    return <div className="banner-loading"></div>;
  }

  if (!featuredPremium) {
    return null;
  }

  return (
    <div className="premium-banner">
      <div className="banner-content">
        <div className="banner-image-container">
          <img 
            src={featuredPremium.image} 
            alt={featuredPremium.title}
            className="book-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-book.png';
            }}
          />
        </div>
        
        <div className="banner-details">
          <div className="premium-label">
            PREMIUM SELECTION
          </div>
          
          <h3 className="book-title">{featuredPremium.title}</h3>
          <p className="book-author">by {featuredPremium.author}</p>
          
          <div className="rating-container">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`star-icon ${i < Math.round(featuredPremium.Rating || 0) ? 'star-filled' : 'star-empty'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <p className="book-description">{featuredPremium.caption}</p>
          
          <div className="banner-actions">
            <Link
              to={`/books/${featuredPremium._id}`}
              className="read-button"
            >
              Read Now
            </Link>
            
            <Link
              to="/premium"
              className="view-all-button"
            >
              View All Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;