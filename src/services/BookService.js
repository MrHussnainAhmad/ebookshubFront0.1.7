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
const BASE_URL = 'https://ebookshub.up.railway.app';

const BookService = {
  // Public methods that don't require authentication
  getPublicFeaturedBooks: async () => {
    try {
      // Use direct axios instead of API instance to bypass auth interceptor
      const response = await axios.get(`${BASE_URL}/api/books/public/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public featured books:', error);
      return [];
    }
  },

  getPublicTrendingBooks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/public/trending`);
      return response.data;
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

  // Get all books with optional filters - explicitly use direct axios with auth header
  getBooks: async (filters = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books`, { 
        params: filters,
        ...createAuthHeader()
      });
      console.log('Books fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      // Don't throw - return empty data structure instead
      return { books: [], currentPage: 1, totalBooks: 0, totalPages: 0 };
    }
  },

  // Get premium books - fixed path
  getPremiumBooks: async (limit = 2) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/premium`, {
        params: { limit },
        ...createAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching premium books:', error);
      return [];
    }
  },

  // Get new books - fixed path
  getNewBooks: async (limit = 4) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/new`, {
        params: { limit },
        ...createAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new books:', error);
      return [];
    }
  },
  
  // Get books by genre - fixed path
  getBooksByGenre: async (genre, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/genre/${genre}`, {
        params: { page, limit },
        ...createAuthHeader()
      });
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
  
  // Rate a book - fixed path
  rateBook: async (id, rating) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/books/${id}/rate`, { rating }, createAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error rating book:', error);
      return { success: false, message: 'Failed to submit rating' };
    }
  },
  
  // Get book comments - fixed path
  getBookComments: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/${id}/comments`, createAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching book comments:', error);
      return [];
    }
  },
  
  // Add a comment to a book - fixed path
  addBookComment: async (id, text) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/books/${id}/comments`, { text }, createAuthHeader());
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, message: 'Failed to add comment' };
    }
  },
  
  // Get trending books (top rated)
  getTrendingBooks: async (limit = 5) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/books/top-rated`, { 
        params: { limit },
        ...createAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending books:', error);
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
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  },
  
  // Get user's books
  getUserBooks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/books/user`, createAuthHeader());
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error('Error fetching daily recommendations:', error);
      return [];
    }
  }
};

export default BookService;