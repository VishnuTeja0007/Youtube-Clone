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
    const [showPassword, setShowPassword] = useState(false);

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
                        <div className="relative group">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                // Toggle type based on showPassword state
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            {/* Visibility Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-dark-muted)] hover:text-[var(--color-dark-text)] transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    /* Eye Off Icon */
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    /* Eye Icon */
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
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
