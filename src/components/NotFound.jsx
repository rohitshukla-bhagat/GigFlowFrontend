
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'var(--slate-900)',
                marginBottom: '1rem'
            }}>404</h1>
            <p style={{
                fontSize: '1.5rem',
                color: 'var(--slate-600)',
                marginBottom: '2rem'
            }}>Page Not Found!</p>
            <Link to="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--slate-900)',
                color: 'var(--white)',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
            }}>
                <Home size={20} />
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
