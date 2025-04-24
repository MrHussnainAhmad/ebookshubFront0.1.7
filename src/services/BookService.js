// src/services/BookService.js
import API from './authApi';
import axios from 'axios';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create a consistent API instance with auth headers
const createAuthHeader = () => {
  const token = getToken();
  return {
    headers: { 
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

// Base URL - make sure it's consistent
const BASE_URL = 'http://192.168.3.58:3001';

// Add book transformation function to ensure consistent ID handling
const transformBookData = (books) => {
  if (Array.isArray(books)) {
    return books.map(book => ({
      ...book,
      _id: book._id || book.id // Ensure consistent ID field
    }));
  }
  return books;
};

const BookService = {
  // Public methods that don't require authentication
  getPublicFeaturedBooks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/public/featured`);
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching public featured books:', error);
      return [];
    }
  },

  // Add these methods to your BookService.js

// Get a single premium book by ID (public access)
getPremiumBookById: async (id) => {
  try {
    // Use the public endpoint that doesn't require authentication
    const response = await axios.get(`${BASE_URL}/api/books/public/premium/${id}`);
    
    // Still increment view count if possible (with auth if available)
    try {
      await BookService.incrementBookView(id);
    } catch (viewError) {
      console.log('View increment skipped for unauthenticated user');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching premium book details:', error);
    return null;
  }
},

// Get PDF for a premium book (public access)
getPremiumBookPdf: async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books/public/premium/${id}/pdf`);
    return response.data;
  } catch (error) {
    console.error('Error fetching premium book PDF:', error);
    return { pdfUrl: null };
  }
},

  getPublicTrendingBooks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/public/trending`);
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching public trending books:', error);
      return [];
    }
  },

  getPublicGenres: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/public/genres`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public genres:', error);
      return [];
    }
  },

  // Get all books with optional filters
  getBooks: async (filters = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books`, { 
        params: filters,
        ...createAuthHeader()
      });
      console.log('Books fetched successfully:', response.data);
      
      if (response.data.books) {
        response.data.books = transformBookData(response.data.books);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      return { books: [], currentPage: 1, totalBooks: 0, totalPages: 0 };
    }
  },

  // Get premium books
  getPremiumBooks: async (limit = 4) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/premium`, {
        params: { limit },
        ...createAuthHeader()
      });
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching premium books:', error);
      return [];
    }
  },

  // Get new books
  getNewBooks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/new`, createAuthHeader());
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching new books:', error);
      return [];
    }
  },
  
  // Get books by genre
  getBooksByGenre: async (genre, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/genre/${genre}`, {
        params: { page, limit },
        ...createAuthHeader()
      });
      
      if (response.data.books) {
        response.data.books = transformBookData(response.data.books);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${genre} books:`, error);
      return { books: [], currentPage: 1, totalBooks: 0, totalPages: 0 };
    }
  },
  
  // Get a single book by ID
  getBookById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/${id}`, createAuthHeader());
      // Increment view count when fetching book details
      await BookService.incrementBookView(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  },
  
  // Get PDF for a book
  getBookPdf: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/${id}/pdf`, createAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching book PDF:', error);
      return { pdfUrl: null };
    }
  },
  
  // Increment book view count
  incrementBookView: async (id) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/books/${id}/view`, {}, createAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error incrementing book view:', error);
      return { success: false };
    }
  },
  
  // Rate a book
  rateBook: async (id, rating) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/books/${id}/rate`, { rating }, createAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error rating book:', error);
      return { success: false, message: 'Failed to submit rating' };
    }
  },
  
  // Get book comments
  getBookComments: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/${id}/comments`, createAuthHeader());
      console.log('Comments data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching book comments:', error);
      return [];
    }
  },
  
  // Add book comment
  addBookComment: async (id, text) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/books/${id}/comments`, { text }, createAuthHeader());
      console.log('Comment added response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, message: 'Failed to add comment' };
    }
  },
  
  // Get top rated books - FIXED: using correct endpoint
  getTopRatedBooks: async (limit = 5) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/top-rated`, { 
        params: { limit },
        ...createAuthHeader()
      });
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching top-rated books:', error);
      return [];
    }
  },
  
  // Get recommended books
  getRecommendedBooks: async (limit = 4) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/recommended`, {
        params: { limit },
        ...createAuthHeader()
      });
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching recommended books:', error);
      return [];
    }
  },
  
  // Search for books
  searchBooks: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/search`, {
        params: { query },
        ...createAuthHeader()
      });
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  },
  
  // Get user's books
  getUserBooks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/user`, createAuthHeader());
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching user books:', error);
      return [];
    }
  },
  
  // Get genre statistics
  getGenreStats: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/genres`, createAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching genre statistics:', error);
      return [];
    }
  },
  
  // Daily recommendations
  getDailyRecommendations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/daily-recommendations`, createAuthHeader());
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error fetching daily recommendations:', error);
      return [];
    }
  },
  
  // For backward compatibility
  getTrendingBooks: async (limit = 5) => {
    return BookService.getTopRatedBooks(limit);
  }
};



export default BookService;