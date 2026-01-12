import React from 'react';

const Sidebar = ({ category, budget, onCategoryChange, onBudgetChange, onClearFilters }) => {
    return (
        <aside className="sidebar">
            <div className="filters-container">
                <h3 className="filters-title">Filters</h3>

                {/* Category Filter */}
                <div className="filter-group">
                    <label className="filter-label">Category</label>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        <option value="development">Development</option>
                        <option value="design">Design</option>
                        <option value="writing">Writing</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>

                {/* Budget Filter */}
                <div className="filter-group">
                    <label className="filter-label">Budget Range</label>
                    <select
                        value={budget}
                        onChange={(e) => onBudgetChange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Any Budget</option>
                        <option value="0-500">$0 - $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-5000">$1,000 - $5,000</option>
                        <option value="5000+">$5,000+</option>
                    </select>
                </div>

                {/* Clear Filters */}
                <button onClick={onClearFilters} className="btn-outline w-full">
                    Clear Filters
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
