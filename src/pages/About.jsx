import React from "react";
import "../pages/styles/LegalPages.css"; // Shared CSS for styling

function AboutUs() {
  return (
    <div className="legal-container">
      <h1>About Us</h1>
      <p>
        Welcome to <strong>eBooksHub</strong>, your trusted platform for discovering and sharing books. 
        Our mission is to provide a seamless and engaging reading experience for book lovers worldwide.
      </p>

      <h2>Our Vision</h2>
      <p>
        We believe in the power of stories to transform lives. Our goal is to create a 
        digital space where readers and authors connect, explore, and inspire each other.
      </p>

      <h2>Why Choose Us?</h2>
      <ul>
        <li>📚 A vast collection of books in various genres.</li>
        <li>✍ A platform for authors to publish and share their work.</li>
        <li>🔍 Advanced search and recommendation features.</li>
        <li>👥 A growing community of passionate readers.</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        Have questions? Reach out at <strong>official@ebookshub.live</strong>.
      </p>
    </div>
  );
}

export default AboutUs;
