import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-top">
                    <div className="footer-logo">
                        <span className="logo-text">GigFlow</span>
                    </div>
                    <div className="footer-links">
                        <a href="#" className="footer-link">Terms</a>
                        <a href="#" className="footer-link">Privacy</a>
                        <a href="#" className="footer-link">Support</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="copyright">© 2026 GigFlow. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
