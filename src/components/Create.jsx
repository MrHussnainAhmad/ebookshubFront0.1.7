import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoBook,
  IoBookmark,
  IoImage,
  IoDocument,
  IoCloudUpload,
  IoClose,
  IoCheckmarkCircle,
  IoChevronDown,
} from "react-icons/io5";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./styles/Create.css";

// Book genres list
const GENRES = [
  "Fiction",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Historical Fiction",
  "Horror",
  "Adventure",
  "Non-fiction",
  "Biography",
  "Autobiography",
  "Memoir",
  "Self-help",
  "Business",
  "Philosophy",
  "Children",
  "Young Adult",
  "Poetry",
  "Drama",
  "Humor",
  "Spirituality",
  "Health & Wellness",
  "Travel",
  "Other",
];

export default function Create() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfBase64, setPdfBase64] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [genre, setGenre] = useState("");
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Check if user is a reader or author
  const isReader = user?.userType === "reader";

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);

      // Convert image to base64 for backend
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract base64 data (remove the data:image/jpeg;base64, prefix)
        const base64Data = reader.result.split(",")[1];
        setImageBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (10MB limit to match Cloudinary)
      if (file.size > 10 * 1024 * 1024) {
        setError(
          "PDF file is too large (max 10MB). Please compress your file."
        );
        return;
      }

      // Sanitize the filename - remove special characters and spaces
      const originalName = file.name || "book.pdf";
      const sanitizedName = originalName
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9_.-]/g, "") // Remove other special characters
        .replace(/__+/g, "_"); // Replace multiple underscores with single one

      // Create a new File object with the sanitized name
      // We need to create a new file object to change the name
      const sanitizedFile = new File([file], sanitizedName, {
        type: file.type,
      });

      setPdfFile(sanitizedFile);
      setPdfFileName(sanitizedName);

      // Convert PDF to base64 for backend fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract base64 data (remove the data:application/pdf;base64, prefix)
        const base64Data = reader.result.split(",")[1];
        setPdfBase64(base64Data);
      };
      reader.readAsDataURL(file);

      console.log("PDF selected:", {
        originalName,
        sanitizedName,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      });

      setError(""); // Clear error if file is valid
    }
  };

  const handleSelectGenre = (selectedGenre) => {
    setGenre(selectedGenre);
    setShowGenreModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // Form validation
    if (!title.trim()) {
      setError("Please enter a book title");
      return;
    }
    if (!author.trim()) {
      setError("Please enter author name");
      return;
    }
    if (!caption.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!imageBase64) {
      setError("Please select an image");
      return;
    }
    if (!pdfFile) {
      setError("Please select a PDF file");
      return;
    }
    if (!genre) {
      setError("Please select a genre");
      return;
    }

    // Validate file size again
    if (pdfFile.size > 10 * 1024 * 1024) {
      setError("PDF file is too large (max 10MB). Please compress your file.");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      console.log("Starting upload. File size:", pdfFile.size);

      // Create FormData object for multipart/form-data submission
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("caption", caption.trim());
      formData.append("genre", genre);

      // Add image as base64 string - this matches backend expectation
      formData.append("image", `data:image/jpeg;base64,${imageBase64}`);

      // Add PDF file
      formData.append("pdfFile", pdfFile);

      // Also include base64 as fallback if file upload fails - matching mobile app
      formData.append("pdfBase64", pdfBase64);
      formData.append("pdfFileName", pdfFileName);

      const response = await axios.post(
        "https://ebookshub.up.railway.app/api/books",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
            console.log(`Upload progress: ${percent}%`);
          },
          timeout: 180000, // 3 minutes timeout for large files (matching mobile)
        }
      );

      console.log("Upload successful:", response.data);
      setShowSuccessModal(true);

      // Reset form
      setTitle("");
      setCaption("");
      setImage("");
      setImageBase64(null);
      setAuthor("");
      setPdfFile(null);
      setPdfFileName("");
      setPdfBase64(null);
      setGenre("");
      setUploadProgress(0);
    } catch (error) {
      console.error("Submission error:", error);

      let errorMessage = "Upload failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes("timeout")) {
        errorMessage =
          "Upload timed out. Try a smaller file or check your connection.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If user is a reader, show restricted message and button
  if (isReader) {
    return (
      <div className="container">
        <div className="card-restricted">
          <div className="restricted-container">
            <IoBook size={80} className="restricted-icon" />
            <h2 className="restricted-title">Authors Only Area</h2>
            <p className="restricted-text">
              This section is reserved for authors to upload their books. As a
              reader, you can discover and enjoy books in our library
              collection.
            </p>
            <button
              className="restricted-button"
              onClick={() => navigate("/library")}
            >
              <IoBook size={22} />
              <span>Explore Library</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content for authors
  return (
    <div className="container">
      <div className="card">
        {/* HEADER */}
        <div className="header">
          <h1 className="title">Your Story Awaits—Begin Uploading!</h1>
          <p className="subtitle">Share the data below:</p>
        </div>

        {/* Error display */}
        {error && (
          <div className="error-alert">
            <IoClose size={20} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* BookTitle */}
          <div className="form-group">
            <label className="label">Book Title</label>
            <div className="input-container">
              <IoBook size={20} className="input-icon" />
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the Book Title"
              />
            </div>
          </div>

          {/* CAPTION */}
          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              className="text-area"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="About your Book"
              rows={4}
            />
          </div>

          {/* GENRE SELECTION */}
          <div className="form-group">
            <label className="label">Book Genre</label>
            <div
              className="genre-selector"
              onClick={() => setShowGenreModal(true)}
            >
              <div className="input-container">
                <IoBookmark size={20} className="input-icon" />
                <span
                  className={`genre-selector-text ${
                    !genre ? "placeholder" : ""
                  }`}
                >
                  {genre || "Select Book Genre"}
                </span>
                <IoChevronDown size={20} className="chevron-icon" />
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="form-group">
            <label className="label">Upload Image</label>
            <div className="image-picker">
              <input
                type="file"
                id="image-upload"
                className="file-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload" className="file-label">
                {image ? (
                  <img src={image} alt="Preview" className="preview-image" />
                ) : (
                  <div className="placeholder-container">
                    <IoImage size={40} className="placeholder-icon" />
                    <span className="placeholder-text">
                      Click to Select an Image
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* PDF */}
          <div className="form-group">
            <label className="label">Upload PDF</label>
            <p className="helper-text">Maximum file size: 10MB</p>
            <div className="pdf-picker">
              <input
                type="file"
                id="pdf-upload"
                className="file-input"
                accept="application/pdf"
                onChange={handlePdfChange}
                style={{ display: "none" }}
              />
              <label htmlFor="pdf-upload" className="file-label">
                {pdfFile ? (
                  <div className="pdf-preview">
                    <IoDocument size={40} className="pdf-icon" />
                    <span className="pdf-name">
                      {pdfFileName || "PDF Selected"}
                    </span>
                    {pdfFile && (
                      <span className="file-size">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="placeholder-container">
                    <IoDocument size={40} className="placeholder-icon" />
                    <span className="placeholder-text">
                      Click to Select a PDF
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* AUTHOR */}
          <div className="form-group">
            <label className="label">Book Author</label>
            <div className="input-container">
              <IoBook size={20} className="input-icon" />
              <input
                type="text"
                className="input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Book Author Name"
              />
            </div>
            <p className="helper-text">Make sure this book belongs to you.</p>
          </div>

          {/* SUBMIT */}
          <div className="form-group">
            <button type="submit" className="button" disabled={loading}>
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  {uploadProgress > 0 && (
                    <span className="upload-progress">{uploadProgress}%</span>
                  )}
                </div>
              ) : (
                <>
                  <IoCloudUpload size={14} className="button-icon" />
                  <span> Publish</span>
                </>
              )}
            </button>
            <p className="helper-text-2">
              Upload speed is related to file size and network conditions.
            </p>
          </div>
        </form>
      </div>

      {/* Genre Selection Modal */}
      {showGenreModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Select Book Genre</h3>
              <button
                className="close-button"
                onClick={() => setShowGenreModal(false)}
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="genre-list">
              {GENRES.map((item) => (
                <div
                  key={item}
                  className="genre-item"
                  onClick={() => handleSelectGenre(item)}
                >
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <div className="success-icon-container">
              <IoCheckmarkCircle size={80} className="success-icon" />
            </div>
            <h2 className="success-modal-title">Hurrah!</h2>
            <p className="success-modal-text">Book published successfully</p>
            <p className="premium-info-text">
              Want to get a chance to add your book in premium section? Then try
              to keep your book in topRated section for 7 days, if it happens
              our moderators will put it in premium section. Thanks for
              publishing through us!
            </p>
            <button
              className="success-button"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/library");
              }}
            >
              Go to Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
