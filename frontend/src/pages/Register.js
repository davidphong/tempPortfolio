import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './AuthPages.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [passwordRequirements, setPasswordRequirements] = useState({
    lowercase: false,
    special: false,
    uppercase: false,
    length: false,
    number: false
  });
  
  const { register, loading, error, clearError } = useAuthStore();

  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      lowercase: /[a-z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
      length: password.length >= 8,
      number: /[0-9]/.test(password)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      checkPasswordRequirements(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    console.log('📝 Register: Form submitted with data:', {
      email: formData.email,
      name: formData.name,
      hasPassword: !!formData.password
    });
    
    // Validate required fields
    if (!formData.email || !formData.password) {
      console.error('❌ Register: Missing required fields');
      return;
    }
    
    // Check if all password requirements are met
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    if (!allRequirementsMet) {
      console.error('❌ Register: Password requirements not met');
      return;
    }
    
    console.log('🚀 Register: Calling auth store register...');
    
    try {
      const success = await register(formData.email, formData.password, formData.name);
      console.log('📊 Register: Registration result:', success);
      
      if (success) {
        console.log('✅ Register: Registration successful, redirecting...');
        // Force reload to ensure clean state
        window.location.href = '/profile-settings';
      } else {
        console.log('❌ Register: Registration failed - handled by auth store');
      }
    } catch (error) {
      console.error('❌ Register: Unexpected error:', error);
    }
  };

  const isFormValid = () => {
    return formData.email && 
           formData.password && 
           Object.values(passwordRequirements).every(req => req);
  };

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <h1>Easy Portfolio for Developer</h1>
          <p>
            As a web developer, having a portfolio is essential for showcasing your technical skills and attracting potential clients. A portfolio is a museum of your work, with past tech stacks, case studies, and your work history.
          </p>
        </div>
      </div>
      <div className="auth-main">
        <div className="auth-logo">
          <div className="logo-icon"></div>
          <span>DevPort</span>
        </div>
        
        <div className="auth-form-container">
          <h1>Create your account</h1>
          <p className="auth-subtitle">Enter the fields below to get started</p>

          <div className="auth-github">
            <button className="btn btn-github">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10C0 14.42 2.865 18.17 6.839 19.49C7.339 19.58 7.52 19.27 7.52 19C7.52 18.73 7.512 18.15 7.508 17.31C4.726 17.91 4.139 15.97 4.139 15.97C3.685 14.81 3.029 14.5 3.029 14.5C2.121 13.88 3.098 13.9 3.098 13.9C4.101 13.97 4.629 14.93 4.629 14.93C5.521 16.45 6.969 16.02 7.54 15.76C7.631 15.11 7.889 14.67 8.175 14.42C5.955 14.17 3.62 13.31 3.62 9.47C3.62 8.39 4.01 7.5 4.649 6.82C4.546 6.56 4.203 5.55 4.747 4.15C4.747 4.15 5.587 3.88 7.497 5.17C8.31 4.95 9.15 4.84 9.99 4.836C10.83 4.84 11.67 4.95 12.483 5.17C14.393 3.88 15.233 4.15 15.233 4.15C15.777 5.55 15.434 6.56 15.331 6.82C15.97 7.5 16.36 8.39 16.36 9.47C16.36 13.32 14.025 14.17 11.805 14.42C12.15 14.72 12.463 15.33 12.463 16.26C12.463 17.6 12.453 18.64 12.453 19C12.453 19.27 12.633 19.58 13.139 19.49C17.137 18.17 20 14.417 20 10C20 4.477 15.523 0 10 0Z" fill="white"/>
              </svg>
              Sign in with Github
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name (optional)"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Enter a password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="password-requirements">
              <div className={`requirement ${passwordRequirements.lowercase ? 'met' : ''}`}>
                <div className="requirement-icon"></div>
                <span>one lower case character</span>
              </div>
              <div className={`requirement ${passwordRequirements.special ? 'met' : ''}`}>
                <div className="requirement-icon"></div>
                <span>one special character</span>
              </div>
              <div className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
                <div className="requirement-icon"></div>
                <span>one uppercase character</span>
              </div>
              <div className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
                <div className="requirement-icon"></div>
                <span>8 character minimum</span>
              </div>
              <div className={`requirement ${passwordRequirements.number ? 'met' : ''}`}>
                <div className="requirement-icon"></div>
                <span>one number</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={loading || !isFormValid()}
            >
              {loading ? 'Creating Account...' : 'Create account'}
            </button>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 