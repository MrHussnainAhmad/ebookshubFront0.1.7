import React from "react";
import "./styles/Footer.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  const date = new Date();
  const currentYear = date.getFullYear(); // Extract the current year

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About eBooksHub</h3>
          <p>
            eBooksHub is your gateway to the world of books. Discover, read, and share your favorite stories.
          </p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            {/* <li><a href="/contact">Contact</a></li> */}
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a> */}
            <a href="https://www.instagram.com/ebookshub.live" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} eBooksHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;