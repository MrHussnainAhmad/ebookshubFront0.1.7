import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import AuthorHome from "./pages/authorHome";
import Auth from "./pages/Auth";
import AboutUs from "./pages/About";
import PrivacyPolicy from "./pages/Pp";
import TermsOfService from "./pages/ToS";
import LibraryPage from "./components/Library";
import BooksDetail from "./components/BooksDetail";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Profile from "./components/Profile";
import Create from "./components/Create";
import Download from "./components/subComp/Download";
import BooksComponent from "./components/BooksComponent";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBooks from "./pages/AdminBooks";
import AdminRoute from "./components/AdminRoute";
import Premium from "./components/Premium";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
};

// Conditional Home route component
const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If no user is logged in, show the default Home for readers
  if (!user) {
    return <Home />;
  }

  // Check user type and render appropriate home page
  return user.userType === "author" ? <AuthorHome /> : <Home />;
};

function AppRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Router basename="/">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/books" element={<AdminBooks />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/BookComponent" element={<BooksComponent />} />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route path="/premium" element={<Premium />} />
            <Route
              path="/library/:genre"
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/:id"
              element={
                <ProtectedRoute>
                  <BooksDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/create" element={<Create />} />
            <Route path="/Download" element={<Download />} />
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
