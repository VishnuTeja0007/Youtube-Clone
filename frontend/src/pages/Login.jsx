import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Toast from '../components/SuccessToast';
import { setAuth } from '../store/authSlice';

/**
 * Login Component
 * Provides a professional YouTube-style login interface.
 * Implements JWT-based authentication flow with form validation and error handling.
 */
const Login = () => {
    // Redux hooks for state management and navigation
    const dispatch = useDispatch(); // Action dispatcher for Redux store
    const navigate = useNavigate(); // Navigation hook for route changes

    /**
     * Form validation function
     * Validates email and password inputs before submission
     * @returns {string|null} Error message if validation fails, null if valid
     */
    const validateLogin = () => {
        const { email, password } = formData;

        // Check if both fields are provided
        if (!email || !password) {
            return "Please provide both email and password.";
        }

        // Email format validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        return null; // Validation passed
    };

    // State management for form fields
    const [formData, setFormData] = useState({
        email: '', // User email input
        password: '', // User password input
    });

    // State for toast notification handling
    const [toastError, setToastError] = useState(null); // Error message for toast

    /**
     * Handle form input changes
     * Updates form state and clears any existing error messages
     * @param {Object} e - Event object from input change
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error message when user starts typing
        if (toastError) setToastError('');
    };

    /**
     * Handle form submission
     * Validates form data and attempts authentication with backend API
     * @param {Object} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        // Validate form inputs
        const err = validateLogin();
        if (err) {
            setToastError(err); // Show validation error
            return;
        }

        try {
            // Make API call to backend for JWT authentication
            const response = await axios.post('http://localhost:3000/api/auth/login', formData);

            console.log('User logged in successfully');
            
            // Update Redux store with user data and token
            dispatch(setAuth({ user: response.data.user, token: response.data.token }));

            // Redirect to home page after successful login
            navigate('/');
        } catch (err) {
            // Handle authentication error with user-friendly message
            setToastError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    // Render the login form with responsive design
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[var(--color-dark-surface)] p-8 rounded-xl border border-[var(--color-dark-border)] shadow-2xl">

                {/* Branding/Header section */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-[var(--color-dark-text)]">
                        Sign in
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-dark-muted)]">
                        to continue to YouTube Clone
                    </p>
                </div>

                {/* Error toast notification */}
                {toastError && (
                    <div className='flex flex-col gap-3 items-center justify-center'>
                        <Toast
                            type="error"
                            message={toastError}
                            onClose={() => setToastError(null)}
                        />
                    </div>
                )}

                {/* Login form with validation */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {/* Email input field */}
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
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

                        {/* Password input field */}
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Forgot password link */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-dark-muted)] cursor-pointer hover:underline">
                            Forgot password?
                        </span>
                    </div>

                    {/* Submit button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[var(--color-dark-primary)] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            Next
                        </button>
                    </div>
                </form>

                {/* Redirect to registration page */}
                <div className="text-center mt-4">
                    <p className="text-sm text-[var(--color-dark-muted)]">
                        Not your computer? Use Guest mode to sign in privately.
                    </p>
                    <div className="mt-4">
                        <Link to="/register" className="font-medium text-[var(--color-dark-accent)] hover:underline">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
