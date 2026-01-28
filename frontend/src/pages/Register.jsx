import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Register Component
 * * Provides a responsive user registration form for the YouTube Clone.
 * Uses custom theme variables for a professional YouTube-style UI.
 */
const Register = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for error messages [Requirement 2.38]
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation [Requirement 2.38]
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Logic for calling your Backend API [Requirement 1.178]
      // const response = await axios.post('/api/auth/register', formData);
      
      console.log('User registered:', formData);
      
      // On success, redirect to login page [Requirement 2.239]
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--color-dark-surface)] p-8 rounded-xl border border-[var(--color-dark-border)] shadow-2xl">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[var(--color-dark-text)]">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-[var(--color-dark-muted)]">
            Join the community and start sharing videos
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-600 text-red-500 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            {/* Username Field [Requirement 2.56] */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email Field [Requirement 2.57] */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field [Requirement 2.58] */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[var(--color-dark-primary)] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Redirect to Login */}
        <div className="text-center mt-4">
          <p className="text-sm text-[var(--color-dark-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--color-dark-accent)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;