import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BookService from "../services/BookService";
import { useAuth } from "../context/AuthContext"; // Import auth context
import "./styles/LibraryPage.css";

function LibraryPage() {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
// Fetch book data based on genre or all books
useEffect(() => {
  const fetchBooks = async () => {
    try {
      setLoading(true);
      let response;
      
      if (genre) {
        response = await BookService.getBooksByGenre(genre, currentPage, 12);
      } else {
        response = await BookService.getBooks({ 
          page: currentPage, 
          limit: 12 
        });
      }
      
      setBooks(response.books || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || 1);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch if authenticated
  if (isAuthenticated) {
    fetchBooks();
  } else {
    navigate("/login", { state: { from: `/library${genre ? '/' + genre : ''}` } });
  }
}, [genre, currentPage, isAuthenticated, navigate]);

// Add this useEffect to fetch genre statistics
useEffect(() => {
  const fetchGenres = async () => {
    try {
      if (isAuthenticated) {
        const genreStats = await BookService.getGenreStats();
        setGenres(genreStats || []);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };
  
  fetchGenres();
}, [isAuthenticated]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const searchResults = await BookService.searchBooks(searchQuery);
      setBooks(searchResults);
      // Reset pagination for search results
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching books:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting to login
  }

  return (
    <div className="library-page">
      <h1 className="libraryH1">Our {genre ? genre : "Books"} Collection</h1>
      
      {/* Search and Filter Section */}
      <div className="library-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author"
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        
        <div className="genre-filters">
          <Link 
            to="/library" 
            className={`genre-filter ${!genre ? 'active' : ''}`}
          >
            All
          </Link>
          {genres.map((genreItem) => (
            <Link
              key={genreItem._id}
              to={`/library/${genreItem._id}`}
              className={`genre-filter ${genre === genreItem._id ? 'active' : ''}`}
            >
              {genreItem._id} ({genreItem.count})
            </Link>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <p>Loading books...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="libraryBooks-grid">
            {books.length > 0 ? (
              books.map((book) => (
                <Link to={`/book/${book._id}`} className="libraryBook-card" key={book._id}>
                  <div className="book-card-inner">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="libraryBook-cover"
                      loading="lazy"
                    />
                    <div className="book-card-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">By {book.author}</p>
                      <p className="book-genre">{book.genre}</p>
                      {book.Rating && (
                        <div className="book-rating">
                          <span className="rating-stars">
                            {'★'.repeat(Math.round(book.Rating))}
                            {'☆'.repeat(5 - Math.round(book.Rating))}
                          </span>
                          <span className="rating-value">
                            {book.Rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-results">⚠️ No books found. Try a different search or category.</p>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-button"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page and pages around current page
                    return page === 1 || 
                           page === totalPages || 
                           (page >= currentPage - 1 && page <= currentPage + 1);
                  })
                  .map((page, index, array) => {
                    // Add ellipsis when there are gaps
                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && <span className="ellipsis">...</span>}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`page-number ${currentPage === page ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                        {showEllipsisAfter && <span className="ellipsis">...</span>}
                      </React.Fragment>
                    );
                  })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LibraryPage;