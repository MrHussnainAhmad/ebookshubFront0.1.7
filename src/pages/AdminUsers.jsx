import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import './styles/AdminUsers.css'; // Assuming you have a CSS file for styles

const AdminUsers = () => {
  const { isAdmin, fetchAllUsers, adminUpdateUser, adminDeleteUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: ""
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const result = await fetchAllUsers(currentPage);
        
        if (result.success) {
          setUsers(result.data.data);
          setTotalPages(result.data.pagination.pages);
        } else {
          setError(result.error || "Failed to load users");
        }
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [fetchAllUsers, currentPage]);

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      email: user.email
    });
  };

  const handleEditCancel = () => {
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateUser = async (userId) => {
    try {
      const result = await adminUpdateUser(userId, editFormData);
      
      if (result.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === userId ? {...user, ...editFormData} : user
        ));
        setEditingUser(null);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const result = await adminDeleteUser(userId);
      
      if (result.success) {
        // Remove the user from the local state
        setUsers(users.filter(user => user._id !== userId));
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading users...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Error: {error}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <header className="admin-header">
        <h1>Manage Users</h1>
        <div className="admin-nav">
          <Link to="/admin/dashboard">Back to Dashboard</Link>
        </div>
      </header>

      <div className="users-list">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleInputChange}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>{user.userType}</td>
                <td>{user.verified ? "Yes" : "No"}</td>
                <td>
                  {editingUser && editingUser._id === user._id ? (
                    <>
                      <button onClick={() => handleUpdateUser(user._id)}>Save</button>
                      <button onClick={handleEditCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                      <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;