import { useState, useCallback, memo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import "./styles/Auth.css";

const VerificationModal = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h3>Email Verification Required</h3>
          <p>
            A verification email has been sent to <strong>{email}</strong>.
          </p>
          <p>
            Please check your inbox and click the verification link to activate your account.
          </p>
          <p className="modal-note">
            If you don't see the email in your inbox, please check your spam folder.
          </p>
          <button className="modal-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginForm = memo(({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      // Check if user is admin and redirect to admin dashboard
      if (result.data.user.userType === 'admin') {
        navigate("/admin");
      } else {
        navigate("/"); // Redirect to homepage for regular users
      }
    } else {
      // Handle specific error cases
      if (result.details?.needsVerification) {
        setErrorMessage(
          `${result.error}. Please check your email or request a new verification link.`
        );
      } else {
        setErrorMessage(result.error);
      }
    }
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="switch-text" onClick={onSwitchToSignUp}>
        Don't have an account? Sign Up
      </p>
      {errorMessage && errorMessage.includes("verify") && (
        <button
          className="resend-verification"
          onClick={() => {
            // Implement resend verification logic here
            alert("Verification link will be sent to your email.");
          }}
        >
          Resend verification email
        </button>
      )}
    </>
  );
});

const UserTypeSelection = memo(({ onSelectType }) => (
  <div className="user-type-selection">
    <h4>Are you a Reader or an Author?</h4>
    <div className="button-group">
      <button onClick={() => onSelectType("reader")}>Reader</button>
      <button onClick={() => onSelectType("author")}>Author</button>
    </div>
  </div>
));

const SignUpForm = memo(({ userType, onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPass) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const userData = {
      username,
      email,
      password,
      userType,
    };

    const result = await register(userData);

    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(
        result.message || "Registration successful! Please check your email to verify your account."
      );
      // Show modal instead of alert
      setIsModalOpen(true);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    onSwitchToLogin(); // Immediately switch to login form when user clicks OK
  };

  return (
    <>
      <form onSubmit={handleSignUp}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <p className="note">
          This site promotes ebooks but does not allow selling or buying.
          Copyrights remain with the publisher.
        </p>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="switch-text" onClick={onSwitchToLogin}>
          Already have an account? Login
        </p>
      </form>
      
      <VerificationModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        email={email} 
      />
    </>
  );
});

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState("");
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // If user is admin, redirect to admin dashboard
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSwitchToSignUp = useCallback(() => setIsSignUp(true), []);
  const handleSwitchToLogin = useCallback(() => {
    setIsSignUp(false);
    setUserType("");
  }, []);
  const handleSelectUserType = useCallback((type) => setUserType(type), []);

  const backgroundClass = !isSignUp
    ? "login-bg"
    : !userType
    ? "reader-author-bg"
    : `${userType}-bg`;

  return (
    <div className={`auth-container ${backgroundClass}`}>
      <div className="auth-box">
        {isSignUp ? (
          <>
            <h2>Sign Up</h2>
            {!userType ? (
              <UserTypeSelection onSelectType={handleSelectUserType} />
            ) : (
              <SignUpForm
                userType={userType}
                onSwitchToLogin={handleSwitchToLogin}
              />
            )}
          </>
        ) : (
          <LoginForm onSwitchToSignUp={handleSwitchToSignUp} />
        )}
      </div>
    </div>
  );
}

export default Auth;