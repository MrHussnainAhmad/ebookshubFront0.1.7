import React from "react";
import "./styles/Home.css";
import { Link } from "react-router-dom";
import SeoRankAuthor from "../components/subComp/SeoHomeAuthor";
import Trending from "../components/Trending";

function authorHome() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to eBooksHub</h1>
          <p>Your Gateway to the World of Books</p>
          <Link to="/create" className="cta-special">Upload Now!</Link>
        </div>
      </section>
      <Trending />
      <SeoRankAuthor />
      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Join Our Community</h2>
        <p>Discover, Read, and Share Your Favorite Books</p>
        <Link to="/auth" className="cta-button">Sign Up Today</Link>
      </section>
    </div>
  );
}
export default authorHome;