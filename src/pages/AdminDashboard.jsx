import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import './styles/AdminDashboard.css'; // Assuming you have a CSS file for styles

const AdminDashboard = () => {
  const { isAdmin, user, fetchDashboardStats, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const result = await fetchDashboardStats();
        
        if (result.success) {
          setStats(result.data);
        } else {
          setError(result.error || "Failed to load dashboard data");
        }
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchDashboardStats]);

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading dashboard data...</h2>
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
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Welcome, {user?.username || "Admin"}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.users?.total || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Books</h3>
          <p className="stat-number">{stats?.books?.total || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Readers</h3>
          <p className="stat-number">{stats?.users?.readers || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Authors</h3>
          <p className="stat-number">{stats?.users?.authors || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Premium Books</h3>
          <p className="stat-number">{stats?.books?.premium || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Verified Users</h3>
          <p className="stat-number">{stats?.users?.verified || 0}</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/users" className="admin-action-button">
          Manage Users
        </Link>
        <Link to="/admin/books" className="admin-action-button">
          Manage Books
        </Link>
      </div>

      {stats?.topViewedBooks && stats.topViewedBooks.length > 0 && (
        <div className="admin-section">
          <h2>Top Viewed Books</h2>
          <ul className="admin-list">
            {stats.topViewedBooks.map((book) => (
              <li key={book._id}>
                {book.title} - {book.views} views
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats?.topRatedBooks && stats.topRatedBooks.length > 0 && (
        <div className="admin-section">
          <h2>Top Rated Books</h2>
          <ul className="admin-list">
            {stats.topRatedBooks.map((book) => (
              <li key={book._id}>
                {book.title} - {book.Rating} rating
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats?.recentUsers && stats.recentUsers.length > 0 && (
        <div className="admin-section">
          <h2>Recent Users</h2>
          <ul className="admin-list">
            {stats.recentUsers.map((user) => (
              <li key={user._id}>
                {user.username} ({user.userType}) - {new Date(user.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;