import React from 'react';
import { Search } from 'lucide-react';

const Hero = ({ searchTerm, onSearchChange, onSearchSubmit, onTagClick }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchSubmit();
        }
    };

    return (
        <section className="hero-section">
            <div className="container hero-content">
                <h1 className="hero-title">Find your next opportunity</h1>
                <p className="hero-subtitle">Connect with top clients and discover freelance projects that match your skills. Start building your career today.</p>

                {/* Search Bar */}
                <div className="search-wrapper">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search jobs by title, skill, or keyword..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={onSearchSubmit} className="search-button">
                            Search
                        </button>
                    </div>
                </div>

                {/* Popular searches */}
                <div className="popular-tags">
                    <span className="tags-label">Popular:</span>
                    {['Web Development', 'Design', 'Writing', 'Marketing'].map(tag => (
                        <button key={tag} onClick={() => onTagClick(tag)} className="tag-button">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
