import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/OtpVerification.css';

const OtpVerification = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if all OTP fields are filled
    if (otp.some(digit => !digit)) {
      setError('Please enter the complete OTP');
      return;
    }

    try {
      setLoading(true);
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful verification
      setOtpVerified(true);
      setSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      // Simulate resend OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setError('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>Verify OTP</h2>
          <p className="description">
            Enter the 6-digit OTP sent to your email address.
          </p>
          {email && (
            <p className="email-info">
              Sent to: <span>{email}</span>
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={error ? 'error' : ''}
                disabled={loading || otpVerified}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && <span className="error-message">{error}</span>}
          
          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading || otpVerified}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : otpVerified ? (
              'Verified'
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="resend-otp">
            <button 
              type="button" 
              className="resend-button"
              onClick={handleResendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
        </form>

        {success && (
          <div className="success-message">
            <svg className="success-icon" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <p>
              {otpVerified 
                ? "OTP verified successfully. You can now reset your password."
                : "New OTP has been sent to your email."}
            </p>
          </div>
        )}

        <div className="back-to-login">
          <Link to="/login" className="login-link">
            <svg className="arrow-icon" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification; 