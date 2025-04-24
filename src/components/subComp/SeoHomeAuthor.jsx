import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SeoHome.css';

const SeoRankAuthor = () => {
  const navigate = useNavigate();

  // Function to handle navigation to the Create page
  const handlePublishClick = () => {
    navigate('/create');
  };
  const handleReadClick = () => {
    navigate('/library');
  };
  return (
    <section className="SeoRank">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Free self-Publishing: Upload Unlimited Books Online</h1>
        <p className="hero-subtitle">
          Dive into a vast collection of free ebooks across all genres. Just endless uploading.
        </p>
        <button className="cta-button" onClick={handlePublishClick}>Publish Now</button>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <i className="icon-book-open"></i>
          <h2>For Readers</h2>
          <p>
            Access thousands of free ebooks spanning all genres—from fiction to non-fiction. Read anytime, anywhere, on any device.
          </p>
          <ul>
            <li><i className="icon-check"></i> Unlimited access to free books</li>
            <li><i className="icon-check"></i> New titles added daily</li>
            <li><i className="icon-check"></i> Read on mobile, tablet, or desktop</li>
          </ul>
          <button className="secondary-button" onClick={handleReadClick}>Explore Books</button>
        </div>

        <div className="feature-card">
          <i className="icon-pencil-alt"></i>
          <h2>For Authors</h2>
          <p>
            Boost your visibility and reach new audiences by publishing your ebooks for free. Use our platform to promote your work.
          </p>
          <ul>
            <li><i className="icon-check"></i> Free publishing tools</li>
            <li><i className="icon-check"></i> Connect with readers daily</li>
            <li><i className="icon-check"></i> Track performance with analytics</li>
          </ul>
          <button className="secondary-button" onClick={handlePublishClick}>Publish Your Book</button>
        </div>
      </div>

      {/* Why Readers Love Us */}
      <div className="love-section">
        <h2 className="section-title">Why Readers Love Our Free Online Book Library</h2>
        <div className="love-grid">
          <div className="love-card">
            <i className="icon-dollar-sign"></i>
            <h3>No Cost Reading</h3>
            <p>Access thousands of free digital books without subscription fees or membership costs.</p>
          </div>
          <div className="love-card">
            <i className="icon-books"></i>
            <h3>Diverse Book Selection</h3>
            <p>Explore a wide range of genres, from classic literature to contemporary bestsellers.</p>
          </div>
          <div className="love-card">
            <i className="icon-users"></i>
            <h3>Reader Community</h3>
            <p>Join an active community of book lovers to discover new authors and share recommendations.</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>Is it really free to read all the electronic books?</h3>
            <p>Yes! Our platform provides completely free access to all ebooks without any hidden charges or subscription requirements.</p>
          </div>
          <div className="faq-card">
            <h3>How do authors benefit from offering free books?</h3>
            <p>Authors gain exposure to thousands of potential readers, build their audience, and receive valuable feedback.</p>
          </div>
          <div className="faq-card">
            <h3>What ebook formats are supported?</h3>
            <p>We support all major ebook formats, including EPUB, MOBI, and PDF, ensuring compatibility across devices.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoRankAuthor;