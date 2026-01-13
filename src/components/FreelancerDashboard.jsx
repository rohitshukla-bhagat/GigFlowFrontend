import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, XCircle, Calendar, Briefcase, ArrowRight, ChevronLeft, ChevronRight, Bell, MessageSquare, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import './FreelancerDashboard.css';

const FreelancerDashboard = ({ onLogout }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [bidsData, setBidsData] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchMyBids = async () => {
            try {
                const { default: api } = await import('../api/axios');
                const response = await api.get('/api/bids/my-bids');

                // Transform API data to match component structure
                const transformedBids = response.data.map(bid => ({
                    id: bid._id,
                    title: bid.gigId?.title || 'Untitled Gig',
                    description: bid.message || bid.proposal || 'No description provided',
                    bidAmount: bid.price || bid.bidAmount || 0,
                    status: bid.status,
                    submittedDate: new Date(bid.createdAt).toLocaleDateString(),
                    category: 'General' // Can be enhanced if category is added to gig model
                }));

                setBidsData(transformedBids);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bids:', error);
                setLoading(false);
            }
        };
        fetchMyBids();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your bids...</div>;

    const filteredBids = activeFilter === 'all'
        ? bidsData
        : bidsData.filter(bid => bid.status === activeFilter);

    const stats = {
        total: bidsData.length,
        pending: bidsData.filter(b => b.status === 'pending').length,
        hired: bidsData.filter(b => b.status === 'hired').length,
        rejected: bidsData.filter(b => b.status === 'rejected').length
    };

    return (
        <>
            {/* Main Dashboard Content */}
            <div className="freelancer-dashboard">
                <div className="freelancer-dashboard-container">
                    {/* Header */}
                    <div className="freelancer-dashboard-header">
                        <div>
                            <h1 className="freelancer-dashboard-title">My Bids</h1>
                            <p className="freelancer-dashboard-subtitle">Track and manage all your submitted proposals</p>
                        </div>
                        <Link to="/" className="freelancer-btn-find-jobs">
                            <Search size={16} strokeWidth={1.5} />
                            Find New Jobs
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="freelancer-stats-grid">
                        <div className="freelancer-stat-card">
                            <div className="freelancer-stat-content">
                                <div className="freelancer-stat-icon-wrapper bg-gray-100">
                                    <FileText size={20} className="text-gray-600" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="freelancer-stat-value">{stats.total}</p>
                                    <p className="freelancer-stat-label">Total Bids</p>
                                </div>
                            </div>
                        </div>
                        <div className="freelancer-stat-card">
                            <div className="freelancer-stat-content">
                                <div className="freelancer-stat-icon-wrapper bg-amber-50">
                                    <Clock size={20} className="text-amber-600" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="freelancer-stat-value">{stats.pending}</p>
                                    <p className="freelancer-stat-label">Pending</p>
                                </div>
                            </div>
                        </div>
                        <div className="freelancer-stat-card">
                            <div className="freelancer-stat-content">
                                <div className="freelancer-stat-icon-wrapper bg-emerald-50">
                                    <CheckCircle size={20} className="text-emerald-600" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="freelancer-stat-value">{stats.hired}</p>
                                    <p className="freelancer-stat-label">Hired</p>
                                </div>
                            </div>
                        </div>
                        <div className="freelancer-stat-card">
                            <div className="freelancer-stat-content">
                                <div className="freelancer-stat-icon-wrapper bg-red-50">
                                    <XCircle size={20} className="text-red-500" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="freelancer-stat-value">{stats.rejected}</p>
                                    <p className="freelancer-stat-label">Rejected</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="freelancer-filter-tabs">
                        <button
                            className={`freelancer-tab-btn ${activeFilter === 'all' ? 'active' : 'inactive'}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All Bids
                        </button>
                        <button
                            className={`freelancer-tab-btn ${activeFilter === 'pending' ? 'active' : 'inactive'}`}
                            onClick={() => setActiveFilter('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`freelancer-tab-btn ${activeFilter === 'hired' ? 'active' : 'inactive'}`}
                            onClick={() => setActiveFilter('hired')}
                        >
                            Hired
                        </button>
                        <button
                            className={`freelancer-tab-btn ${activeFilter === 'rejected' ? 'active' : 'inactive'}`}
                            onClick={() => setActiveFilter('rejected')}
                        >
                            Rejected
                        </button>
                    </div>

                    {/* Bids List */}
                    <div className="bids-list">
                        {filteredBids.map(bid => (
                            <div key={bid.id} className={`bid-item-card ${bid.status === 'rejected' ? 'rejected' : ''}`}>
                                <div className="bid-main-row">
                                    <div className="bid-info-col">
                                        <div className="bid-header-flex">
                                            <h3 className="bid-project-title">{bid.title}</h3>
                                            <span className={`bid-status-pill pill-${bid.status}`}>
                                                <span className="pill-dot"></span>
                                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="bid-desc">{bid.description}</p>
                                        <div className="bid-meta">
                                            <div className="bid-meta-item">
                                                <Calendar size={16} strokeWidth={1.5} />
                                                <span>Submitted {bid.submittedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bid-action-col">
                                        <div className="bid-own-amt">
                                            <p className="amt-value">${bid.bidAmount.toLocaleString()}</p>
                                            <p className="amt-label">Your Bid</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--slate-200)' }}>
                        <button
                            onClick={onLogout}
                            className="freelancer-btn-find-jobs"
                            style={{
                                backgroundColor: 'transparent',
                                color: 'var(--slate-700)',
                                border: '1px solid var(--slate-200)',
                                width: '100%'
                            }}
                        >
                            <LogOut size={16} strokeWidth={1.5} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FreelancerDashboard;
