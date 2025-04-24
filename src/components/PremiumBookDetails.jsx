import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BookService from "../services/BookService";
import "./styles/BooksDetail.css";

const PremiumBookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // In BooksDetail.jsx, modify the useEffect hook
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const bookData = await BookService.getBookById(id);
        setBook(bookData);

        // Set user rating if available
        if (bookData.userRating) {
          setUserRating(bookData.userRating);
        }

        // Load comments
        const commentsData = await BookService.getBookComments(id);
        console.log("Comments loaded:", commentsData); // Debug log
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handleReadNow = async () => {
    try {
      console.log("Read Now clicked - About to increment view count");

      // Call the view increment API
      const viewResponse = await BookService.incrementBookView(id);
      console.log("View increment response:", viewResponse);

      // Get and open the PDF
      const response = await BookService.getBookPdf(id);
      const { pdfUrl } = response;
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error opening PDF:", error);
      alert("Could not open the PDF. Please try again later.");
    }
  };

  const handleRateBook = async (rating) => {
    try {
      const response = await BookService.rateBook(id, rating);
      setUserRating(rating);

      // Update book with new rating data
      setBook((prev) => ({
        ...prev,
        Rating: response.newRating,
        ratingCount: response.ratingCount,
      }));

      alert("Thank you for rating this book!");
    } catch (error) {
      console.error("Error rating book:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await BookService.addBookComment(id, newComment);
      console.log("Add comment response:", response);

      if (response.comment) {
        // Verify the comment structure has user information
        console.log("New comment user info:", response.comment.user);
        setComments((prev) => [...prev, response.comment]);
        setNewComment("");
      } else {
        alert("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/premium" className="detailBack-to-library">
          Back to Premium Books
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="error-container">
        <p>Book not found.</p>
        <Link to="/premium" className="detailBack-to-library">
          Back to Premium Books
        </Link>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="cover-section">
        <img src={book.image} alt={book.title} className="detailBook-cover" />
        <div className="premium-badge">PREMIUM</div>

        {/* Rating Stars */}
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${userRating >= star ? "filled" : ""}`}
              onClick={() => handleRateBook(star)}
            >
              ★
            </span>
          ))}
          <span className="rating-label">
            {userRating > 0 ? `Your rating: ${userRating}/5` : "Rate this book"}
          </span>
        </div>
      </div>

      <div className="book-info">
        <h1 className="detailH1">{book.title}</h1>
        <div className="book-metadata">
          <p className="detailBook-author">By {book.author}</p>
          <p className="detailBook-category">Category: {book.genre}</p>
        </div>
        <p className="detailBook-summary">{book.caption}</p>
        <div className="engagement-section">
          <div className="detailLikes-dislikes">
            <span>
              <i className="like-icon">👍</i> Rating: {book.Rating?.toFixed(1)}{" "}
              ({book.ratingCount || 0} ratings)
            </span>
            <span>
              <i className="dislike-icon">📚</i> Views: {book.views || 0}
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
            />
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id || Math.random()}
                  className="comment-item"
                >
                  <div className="comment-header">
                    <img
                      src={comment.user?.profileImage || "/default-avatar.png"}
                      alt={comment.user?.username || "Unknown User"}
                      className="comment-avatar"
                    />
                    <span className="comment-username">
                      {comment.user?.username || "Unknown User"}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>

        <div className="detailButtons">
          <button className="read-now-btn" onClick={handleReadNow}>
            Read Now
          </button>
          <Link to="/premium" className="detailBack-to-library">
            Back to Premium Books
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PremiumBookDetails;
