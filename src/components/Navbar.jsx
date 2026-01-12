import React from 'react';
import { Link } from 'react-router-dom';
import { User, Sun, Moon } from 'lucide-react';

const Navbar = ({ isLoggedIn, user, darkMode, toggleDarkMode }) => {
    // Determine dashboard route based on user role
    const dashboardRoute = user?.role === 'freelancer' ? '/freelancer-dashboard' : '/dashboard';

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <div className="navbar-logo">
                        <Link to="/" className="navbar-logo-link">
                            <span className="logo-text">GigFlow</span>
                        </Link>
                    </div>

                    {/* Auth Buttons & Toggle */}
                    <div className="navbar-auth">
                        <button
                            onClick={toggleDarkMode}
                            className="btn-icon-toggle"
                            aria-label="Toggle Dark Mode"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                border: '1px solid var(--slate-200)',
                                color: 'var(--slate-600)',
                                cursor: 'pointer',
                                background: 'transparent'
                            }}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {isLoggedIn ? (
                            <Link to={dashboardRoute} className="nav-profile-link" title="My Dashboard">
                                <div className="nav-avatar">
                                    <User size={20} className="nav-avatar-icon" />
                                </div>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-text" style={{ textDecoration: 'none' }}>Log in</Link>
                                <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
