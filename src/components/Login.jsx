import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, Github, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberToggle = () => {
        setRememberMe(!rememberMe);
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate Password
        if (password.length < 1) {
            newErrors.password = 'Please enter your password';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            try {
                const { default: api } = await import('../api/axios');
                const response = await api.post('/api/auth/login', {
                    email,
                    password
                });

                setIsLoading(false);
                if (onLogin) onLogin(response.data);
            } catch (err) {
                console.error(
                    'Login error:',
                    err.response?.data || err.message || err
                );
                setIsLoading(false);
                setErrors({
                    api: err.response?.data?.message || 'Invalid email or password'
                });
            }
        }
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Logo */}
                <div className="login-logo">
                    <Link to="/" className="login-logo-link">
                        <div className="login-icon-bg">
                            <span className="login-icon-text">G</span>
                        </div>
                        <span className="login-text">GigFlow</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">Sign in to your account to continue</p>
                        {errors.api && <div className="error-message" style={{ textAlign: 'center', marginTop: '10px' }}>{errors.api}</div>}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="login-label">Email address</label>
                            <div className="login-input-wrapper">
                                <Mail className="login-input-icon" size={18} strokeWidth={1.5} />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    className={`login-input ${errors.email ? 'input-error' : ''}`}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                                />
                            </div>
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" class="login-label" style={{ marginBottom: 0 }}>Password</label>
                            </div>
                            <div className="login-input-wrapper">
                                <Lock className="login-input-icon" size={18} strokeWidth={1.5} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    className={`login-input ${errors.password ? 'input-error' : ''}`}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeOff size={18} strokeWidth={1.5} />}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={18} />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                </div>

                {/* Sign Up Link */}
                <p className="login-signup-link">
                    Don't have an account? <Link to="/signup" className="link-primary">Create one</Link>
                </p>

                {/* Footer */}
                <div className="login-footer">
                    <a href="#" className="footer-link-sm">Privacy</a>
                    <span className="footer-sep">·</span>
                    <a href="#" className="footer-link-sm">Terms</a>
                    <span className="footer-sep">·</span>
                    <a href="#" className="footer-link-sm">Help</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
