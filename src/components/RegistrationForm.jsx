import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/RegistrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.number.trim()) {
      newErrors.number = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.number)) {
      newErrors.number = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear submit error when user makes any change
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful, redirect to login page
      navigate('/login');
    } catch (error) {
      setSubmitError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="form-wrapper">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className={errors.number ? 'error' : ''}
              placeholder="Enter your mobile number"
              maxLength="10"
            />
            {errors.number && <span className="error-message">{errors.number}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {submitError && <div className="submit-error">{submitError}</div>}

          <div className="login-section">
            <p>Already have an account?</p>
            <Link to="/login" className="login-link">Login here</Link>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm; 
