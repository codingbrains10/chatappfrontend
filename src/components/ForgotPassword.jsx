import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      // Store email in localStorage for OTP verification
      localStorage.setItem('resetEmail', email);
      
      // Redirect to OTP verification page
      navigate('/reset-password');
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>Forgot Password</h2>
          <p className="description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading || emailSent}
            />
            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">
                Reset link has been sent to your email
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading || emailSent}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Sending...
              </>
            ) : (
              'Send Link'
            )}
          </button>
        </form>

        <div className="back-to-login">
          <Link to="/" className="login-link">
            <svg
              className="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 