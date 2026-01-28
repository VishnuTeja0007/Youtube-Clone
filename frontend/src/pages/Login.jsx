import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toaster';
/**
 * Login Component
 * Provides a professional YouTube-style login interface.
 * Implements JWT-based authentication flow.
 */
import { useAuth } from "../contexts/userContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateLogin = () => {
        const { email, password } = formData;

        if (!email || !password) {
            return "Please provide both email and password.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        return null;
    };

    // State for form fields [Requirement 2.236]
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // State for toastError handling [Requirement 2.238]
    const [toastError, setToastError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (toastError) setToastError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateLogin();
        if (err) {
            setToastError(err);
            return;
        }
        // Validation [Requirement 2.238]


        try {
            // API call placeholder for JWT login [Requirement 1.178]
            const response = await axios.post('http://localhost:3000/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);

            console.log('User logged in successfully');
            login(response.data.user);

            // Redirect to home page after successful login [Requirement 2.62]
            navigate('/');
        } catch (err) {
            setToastError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[var(--color-dark-surface)] p-8 rounded-xl border border-[var(--color-dark-border)] shadow-2xl">

                {/* Branding/Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-[var(--color-dark-text)]">
                        Sign in
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-dark-muted)]">
                        to continue to YouTube Clone
                    </p>
                </div>

                {toastError && (
                    <div className='flex flex-col gap-3 items-center justify-center'>
                        <Toast
                            message={toastError}
                            onClose={() => setToastError(null)}
                        />
                    </div>

                )}

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>


                    <div className="rounded-md shadow-sm space-y-4">
                        {/* Email Field [Requirement 2.57] */}
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

                        {/* Password Field [Requirement 2.58] */}
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

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-dark-muted)] cursor-pointer hover:underline">
                            Forgot password?
                        </span>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[var(--color-dark-primary)] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            Next
                        </button>
                    </div>
                </form>

                {/* Redirect to Register */}
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
