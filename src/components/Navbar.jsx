import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/authApi";
import "./styles/Navbar.css";

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      const response = await API.get(`/books/search`, {
        params: { query },
      });
      setSearchResult(response.data || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleResultClick = () => {
    setSearchQuery("");
    setSearchResult([]);
  };

  const showSearchBar = !["/auth", "/library"].includes(location.pathname);
  const showAuthButton = location.pathname !== "/auth";

  return (
    <>
      <div className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="logo">eBooksHub</Link>

        {showSearchBar && (
          <form className="search-box" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={handleChange}
            />
            <button className="search-btn" type="submit">🔍</button>
          </form>
        )}

        {showSearchBar && searchResult.length > 0 && (
          <div className="search-result">
            <ul>
              {searchResult.map((book) => (
                <li key={book._id}>
                  <Link
                    to={`/book/${book._id}`}
                    className="search-result-item"
                    onClick={handleResultClick}
                  >
                    {book.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
<div className="download-btn">
  <Link to="/download" className="download-link">
    📱 Download App
  </Link>
</div>
        {showSearchBar && searchResult.length === 0 && searchQuery && (
          <div className="search-result">
            <ul>
              <li>No results found for "{searchQuery}"</li>
            </ul>
          </div>
        )}

        {showAuthButton && (
          <>
            {isAuthenticated ? (
              <Link to="/profile" className="profile-btn">
                {user?.username || "Profile"}
              </Link>
            ) : (
              <Link to="/auth" className="signup-btn">
                Login/Sign Up
              </Link>
            )}
          </>
        )}
      </div>

      <div className="flowing-div">
        <p>
          Help keep free books available! Your small donation helps maintain the website and app and supports authors and readers.
        </p>
        <button className="flowing-div-button">Donate!</button>
      </div>
    </>
  );
}

export default Navbar;