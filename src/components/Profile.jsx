import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/authApi";
import "./styles/Profile.css";

// You could use icons from a library like react-icons
import { 
  FaUser, 
  FaLock, 
  FaTrash, 
  FaSignOutAlt,
  FaCircleNotch
} from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [booksError, setBooksError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [memberSince, setMemberSince] = useState("Unknown");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [sex, setSex] = useState(user?.sex || "Prefer not to say");

  // Define fetchUserBooks as a useCallback to ensure consistent reference
  const fetchUserBooks = useCallback(async () => {
    if (!user) return; // Don't fetch if user is not available
    
    setIsLoading(true);
    setBooksError("");
    console.log("Fetching books for author:", user?.username);

    try {
      // Add a timestamp to prevent caching issues
      const response = await API.get(`/books/user?t=${new Date().getTime()}`);
      console.log("Books response:", response.data);
      setBooks(response.data);
    } catch (error) {
      console.error(
        "Error fetching books:",
        error.response?.data || error.message
      );

      // Set a user-friendly error message
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch book details. Please check your connection and try again.";

      setBooksError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Auto refresh for authors
  useEffect(() => {
    if (user?.userType === "author") {
      // Call once immediately
      fetchUserBooks();
      
      // Set up interval
      const intervalId = setInterval(() => {
        fetchUserBooks();
      }, 15000); // 15000 ms = 15 seconds

      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [user, fetchUserBooks]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;
      
      try {
        const response = await API.get("/auth/user-details");

        if (response.data?.user?.createdAt) {
          const date = new Date(response.data.user.createdAt);
          setMemberSince(
            date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          );
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleUsernameUpdate = async () => {
    try {
      setError("");
      if (!newUsername || newUsername.length < 4) {
        setError("Username must be at least 4 characters");
        return;
      }

      const response = await API.put("/auth/update-username", {
        newUsername,
      });

      if (response.data && response.data.user) {
        // Since we're using the AuthContext, we need to update the user state
        // This might require adding a function to AuthContext to update user
        setEditMode(false);
        
        // Refresh user data
        const userResponse = await API.get("/auth/user-details");
        if (userResponse.data?.user) {
          // Ideally, you would have an updateUser function in your AuthContext
          // For now, we'll just refresh the page to get the updated user
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(
        "Update error:",
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || "Failed to update username");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      setError("");
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        setError("Both passwords are required");
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setError("New password must be at least 8 characters");
        return;
      }

      await API.put("/auth/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({ currentPassword: "", newPassword: "" });
      setError("Password updated successfully!");
    } catch (error) {
      console.error(
        "Password update error:",
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || "Failed to update password");
    }
  };

  const handleSexUpdate = async () => {
    try {
      setError("");
  
      const response = await API.put("/auth/update-sex", { sex });
  
      if (response.data?.user) {
        // Refresh user data
        const userResponse = await API.get("/auth/user-details");
        if (userResponse.data?.user) {
          // Ideally, you would have an updateUser function in your AuthContext
          window.location.reload();
        }
        alert("Sex updated successfully");
      }
    } catch (error) {
      console.error("Sex update error:", error);
      setError(error.response?.data?.message || "Failed to update sex");
    }
  };
  
  const handleDeleteBook = async (bookId) => {
    // Confirm deletion with the user
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      try {
        setIsDeleting(true);
        await API.delete(`/books/${bookId}`);

        // Remove the deleted book from the state
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId)
        );

        // Show success message
        alert("Book deleted successfully");
      } catch (error) {
        console.error(
          "Error deleting book:",
          error.response?.data?.message || error.message
        );
        alert(error.response?.data?.message || "Failed to delete book");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const retryFetchBooks = () => {
    fetchUserBooks();
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser size={80} />
        </div>
        <h2>{user?.username || "User"}</h2>
        <p className="profile-email">{user?.email || "email@example.com"}</p>
        <p className="profile-status">Account status: {user?.userType}</p>
        <p className="profile-member-since">Member since: {memberSince}</p>
      </div>

      {error && (
        <div className="profile-error-container">
          <p className="profile-error-text">{error}</p>
        </div>
      )}

      <div className="profile-content">
        <h3>Account Settings</h3>

        <div className="profile-option-item">
          <div className="profile-option-icon">
            <FaUser size={24} />
          </div>
          <div className="profile-option-content">
            {editMode ? (
              <>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="profile-input"
                  placeholder="Enter new username"
                />
                <button 
                  onClick={handleUsernameUpdate}
                  className="profile-save-button"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <div className="profile-option-row">
                <span className="profile-option-text">{user?.username}</span>
                <button 
                  onClick={() => setEditMode(true)}
                  className="profile-edit-button"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sex */}
        <div className="profile-option-item">
          <div className="profile-option-icon">
            <FaUser size={24} />
          </div>
          <div className="profile-option-content">
            <label className="profile-sex-label">Sex</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="profile-input"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <button 
              onClick={handleSexUpdate}
              className="profile-save-button"
            >
              Update
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="profile-option-item">
          <div className="profile-option-icon">
            <FaLock size={24} />
          </div>
          <div className="profile-option-content">
            <div className="profile-password-container">
              <label className="profile-password-label">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="profile-input"
                placeholder="Enter current password"
              />
            </div>
            <div className="profile-password-container">
              <label className="profile-password-label">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="profile-input"
                placeholder="Enter new password"
              />
            </div>
            <button 
              onClick={handlePasswordUpdate}
              className="profile-save-button"
            >
              Update Password
            </button>
          </div>
        </div>

        <p className="profile-note-text">
          Note: Changing email is currently not available. Stay tuned for
          updates!
        </p>
      </div>

      {user?.userType === "author" && (
        <div className="profile-content">
          <div className="profile-books-header">
            <h3>Your Uploads</h3>
            <span className="profile-books-count">{books.length} books</span>
          </div>

          {isLoading ? (
            <div className="profile-loading-container">
              <FaCircleNotch className="profile-spinner" size={24} />
              <p>Loading your books...</p>
            </div>
          ) : booksError ? (
            <div className="profile-error-container">
              <p className="profile-error-text">{booksError}</p>
              <button
                className="profile-retry-button"
                onClick={retryFetchBooks}
              >
                Retry
              </button>
            </div>
          ) : books.length > 0 ? (
            <div className="profile-books-list">
              {books.map((book) => (
                <div key={book._id} className="profile-book-item">
                  <div className="profile-book-item-header">
                    <h4 className="profile-book-title">{book.title}</h4>
                    <button
                      className="profile-delete-button"
                      onClick={() => handleDeleteBook(book._id)}
                      disabled={isDeleting}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                  <p className="profile-book-genre">Genre: {book.genre || "Unknown"}</p>
                  <div className="profile-book-stats">
                    <span className="profile-book-views">Views: {book.views || 0}</span>
                    <span className="profile-book-rating">
                      Rating: {book.Rating !== undefined ? book.Rating : book.rating || 0}/5
                      ({book.ratingCount || 0} ratings)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="profile-empty-text">No books uploaded yet</p>
          )}
        </div>
      )}

      <button className="profile-logout-button" onClick={handleLogout}>
        <FaSignOutAlt size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Profile;