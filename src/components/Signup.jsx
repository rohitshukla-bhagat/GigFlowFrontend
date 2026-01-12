import React, { useState } from 'react';
import { Eye, EyeOff, Chrome, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'client'
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Please enter your full name';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        return newErrors;
    };

    // Import API
    // In a real app, you'd import this at the top level
    // import api from '../api/axios';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length === 0) {
            try {
                // Dynamically import api to ensure we use the configured instance
                const { default: api } = await import('../api/axios');

                const response = await api.post('/auth/register', {
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });

                // On success
                console.log('Registration success:', response.data);
                if (onLogin) onLogin(response.data); // Pass user data to onLogin

            } catch (err) {
                console.error('Registration error:', err);
                setErrors({
                    api: err.response?.data?.message || 'Registration failed. Please try again.'
                });
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                {/* Logo */}
                <div className="signup-logo">
                    <Link to="/" className="login-logo-link">
                        <div className="login-icon-bg">
                            <span className="login-icon-text">G</span>
                        </div>
                        <span className="login-text">GigFlow</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="signup-card">
                    {/* Header */}
                    <div className="signup-header">
                        <h1 className="signup-title">Create your account</h1>
                        <p className="signup-subtitle">Start your freelance journey today</p>
                        {errors.api && <div className="error-message" style={{ textAlign: 'center', marginTop: '10px' }}>{errors.api}</div>}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="signup-form">
                        {/* Full Name */}
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Create a strong password"
                                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>
                            <p className="password-hint">Must be at least 8 characters</p>
                        </div>

                        {/* Role Selection */}
                        <div className="form-group">
                            <label className="form-label">I am a...</label>
                            <div className="role-selection">
                                <label className={`role-option ${formData.role === 'client' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="client"
                                        checked={formData.role === 'client'}
                                        onChange={handleChange}
                                        className="role-radio"
                                    />
                                    <span className="role-text">Client</span>
                                </label>
                                <label className={`role-option ${formData.role === 'freelancer' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="freelancer"
                                        checked={formData.role === 'freelancer'}
                                        onChange={handleChange}
                                        className="role-radio"
                                    />
                                    <span className="role-text">Freelancer</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn-submit">
                            Sign Up
                        </button>
                    </form>
                </div>

                {/* Login Link */}
                <p className="login-link-container">
                    Already have an account?
                    <Link to="/login" className="login-link">Log in</Link>
                </p>

                {/* Terms */}
                <div className="terms-container">
                    <p className="terms-text">
                        By signing up, you agree to our <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
