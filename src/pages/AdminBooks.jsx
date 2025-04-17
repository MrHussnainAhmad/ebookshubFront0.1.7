import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import './styles/AdminBooks.css'; // Assuming you have a CSS file for styles

const AdminBooks = () => {
  const { fetchAllBooks } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Function to load books
  const loadBooks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchAllBooks(page);
      if (response.success) {
        setBooks(response.data.data);
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
          totalItems: response.data.pagination.total
        });
      } else {
        setError(response.error || 'Failed to fetch books');
      }
    } catch (err) {
      setError('Error loading books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchAllBooks]);

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadBooks(newPage);
    }
  };

  // Toggle premium status for a book
  const handleTogglePremium = async (bookId, currentStatus) => {
    setActionLoading(true);
    try {
      // Implement API call to update premium status
      // Example: await updateBookPremiumStatus(bookId, !currentStatus);
      console.log(`Toggle premium for book ${bookId} to ${!currentStatus}`);
      
      // Temporarily simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // After successful update, update the UI
      setBooks(books.map(book => 
        book._id === bookId ? {...book, isPremium: !currentStatus} : book
      ));
      
      // Show success notification (you could use a toast library here)
    } catch (err) {
      console.error("Failed to update premium status:", err);
      // Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit book
  const handleEditBook = (bookId) => {
    // Navigate to edit page or open edit modal
    console.log(`Editing book ${bookId}`);
    // Example: navigate(`/admin/books/edit/${bookId}`);
    window.location.href = `/admin/books/edit/${bookId}`;
  };

  // Open delete confirmation modal
  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  // Handle delete book
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    
    setActionLoading(true);
    try {
      // Implement API call to delete book
      // Example: await deleteBook(bookToDelete._id);
      console.log(`Deleting book ${bookToDelete._id}`);
      
      // Temporarily simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // After successful delete, update the UI
      setBooks(books.filter(book => book._id !== bookToDelete._id));
      setDeleteModalOpen(false);
      setBookToDelete(null);
      
      // Show success notification
    } catch (err) {
      console.error("Failed to delete book:", err);
      // Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  // Handle feature book
  const handleFeatureBook = async (bookId, isCurrentlyFeatured) => {
    setActionLoading(true);
    try {
      // Implement API call to toggle featured status
      // Example: await updateBookFeaturedStatus(bookId, !isCurrentlyFeatured);
      console.log(`Toggle featured status for book ${bookId} to ${!isCurrentlyFeatured}`);
      
      // Temporarily simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // After successful update, update the UI
      setBooks(books.map(book => 
        book._id === bookId ? {...book, isFeatured: !isCurrentlyFeatured} : book
      ));
      
      // Show success notification
    } catch (err) {
      console.error("Failed to update featured status:", err);
      // Show error notification
    } finally {
      setActionLoading(false);
    }
  };

  // Handle view book details
  const handleViewDetails = (bookId) => {
    // Navigate to book details page
    console.log(`Viewing details for book ${bookId}`);
    window.open(`/books/${bookId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          onClick={() => window.location.href = '/admin/books/add'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Book
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Author</th>
                <th className="py-3 px-6 text-left">Genre</th>
                <th className="py-3 px-6 text-center">Views</th>
                <th className="py-3 px-6 text-center">Rating</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <img 
                            src={book.image || '/placeholder-book.png'} 
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        </div>
                        <span className="font-medium">{book.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {book.author?.username || book.author}
                    </td>
                    <td className="py-3 px-6 text-left">{book.genre}</td>
                    <td className="py-3 px-6 text-center">{book.views || 0}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {book.rating ? book.rating.toFixed(1) : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex flex-col space-y-1 items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${book.isPremium ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                          {book.isPremium ? 'Premium' : 'Free'}
                        </span>
                        {book.isFeatured && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-3">
                        {/* View Details Button */}
                        <button 
                          onClick={() => handleViewDetails(book._id)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="View Details"
                          disabled={actionLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {/* Toggle Premium Button */}
                        <button 
                          onClick={() => handleTogglePremium(book._id, book.isPremium)}
                          className={`hover:scale-110 ${book.isPremium ? 'text-green-600' : 'text-gray-500'} hover:text-green-700`}
                          title={book.isPremium ? "Remove Premium Status" : "Make Premium"}
                          disabled={actionLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        
                        {/* Toggle Featured Button */}
                        <button 
                          onClick={() => handleFeatureBook(book._id, book.isFeatured)}
                          className={`hover:scale-110 ${book.isFeatured ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-700`}
                          title={book.isFeatured ? "Remove from Featured" : "Feature this Book"}
                          disabled={actionLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                        
                        {/* Edit Button */}
                        <button 
                          onClick={() => handleEditBook(book._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit Book"
                          disabled={actionLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => openDeleteModal(book)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Book"
                          disabled={actionLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 px-6 text-center text-gray-500">
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
            <div className="text-xs xs:text-sm text-gray-500">
              Showing {(pagination.currentPage - 1) * 20 + 1} to {Math.min(pagination.currentPage * 20, pagination.totalItems)} of {pagination.totalItems} entries
            </div>
            <div className="inline-flex mt-2 xs:mt-0">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || actionLoading}
                className={`text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-l ${(pagination.currentPage === 1 || actionLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || actionLoading}
                className={`text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-r ${(pagination.currentPage === pagination.totalPages || actionLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBookToDelete(null);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBook}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;