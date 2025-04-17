import React from "react";
import "./styles/Home.css";
import mB from "./assets/books/mystery.jpg";
import fB from "./assets/books/fantasy.jpg";
import sfB from "./assets/books/scifi.jpg";
import rB from "./assets/books/romance.jpg";
import { Link } from "react-router-dom";
import SeoRank from "../components/subComp/SeoHome";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to eBooksHub</h1>
          <p>Your Gateway to the World of Books</p>
          <Link to="/library" className="cta-button">Explore Now</Link>
        </div>
      </section>
      {/* Featured Content Section */}
      <section className="featured-section">
        <h2>Featured Categories</h2>
        <div className="featuedCategories">
          <Link to="/library/Fantasy" className="featuedCategory-card">
            <img src={fB} alt="Fantasy" />
            <p>Fantasy</p>
          </Link>
          <Link to="/book/library/mystery" className="featuedCategory-card">
            <img src={mB} alt="Mystery" />
            <p>Mystery</p>
          </Link>
          <Link to="/library/Science Fiction" className="featuedCategory-card">
            <img src={sfB} alt="Sci-Fi" />
            <p>Sci-Fi</p>
          </Link>
          <Link to="/library/Romance" className="featuedCategory-card">
            <img src={rB} alt="Romance" />
            <p>Romance</p>
          </Link>
        </div>
      </section>
      <SeoRank />
      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Join Our Community</h2>
        <p>Discover, Read, and Share Your Favorite Books</p>
        <Link to="/auth" className="cta-button">Sign Up Today</Link>
      </section>
    </div>
  );
}
export default Home;