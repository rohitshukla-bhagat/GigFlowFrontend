import React, { useState } from 'react';
import {
    Briefcase,
    PlusCircle,
    LogOut,
    ArrowLeft,
    Calendar,
    Eye,
    DollarSign,
    Edit2,
    Trash2,
    Star,
    CheckCircle,
    UserCheck,
    XCircle,
    Menu,
    X
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ClientDashboard.css'; // Shared Sidebar styles
import './JobDetails.css';
import './PostJob.css';

const JobDetails = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHireModal, setShowHireModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        budget: ''
    });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { default: api } = await import('../api/axios');
                // Parallel fetch
                const [gigRes, bidsRes] = await Promise.all([
                    api.get(`/api/gigs/${id}`),
                    api.get(`/api/bids/${id}`)
                ]);

                setGig(gigRes.data);
                setBids(bidsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching details:', error);
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);
    const confirmHire = async () => {
        if (selectedBidId) {
            try {
                const { default: api } = await import('../api/axios');
                await api.patch(`/api/bids/${selectedBidId}/hire`);

                // Refresh data or update local state
                // Refresh simpler for now
                const [gigRes, bidsRes] = await Promise.all([
                    api.get(`/api/gigs/${id}`),
                    api.get(`/api/bids/${id}`)
                ]);
                setGig(gigRes.data);
                setBids(bidsRes.data);

                setShowHireModal(false);
                setSelectedBidId(null);

            } catch (error) {
                console.error("Error hiring:", error);
                alert("Failed to hire freelancer");
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    if (!gig) return <div style={{ padding: '2rem', textAlign: 'center' }}>Job not found</div>;

    const handleHireClick = (bidId) => {
        setSelectedBidId(bidId);
        setShowHireModal(true);
    };

    const handleEditClick = () => {
        setEditFormData({
            title: gig.title,
            description: gig.description,
            budget: gig.budget
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { default: api } = await import('../api/axios');
            const res = await api.put(`/api/gigs/${id}`, editFormData);
            setGig(res.data);
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Failed to update job");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this job? This will also delete all associated bids. This action cannot be undone.")) {
            try {
                const { default: api } = await import('../api/axios');
                await api.delete(`/api/gigs/${id}`);
                navigate('/dashboard');
            } catch (error) {
                console.error("Error deleting job:", error);
                alert("Failed to delete job");
            }
        }
    };

    // Old confirmHire removed in place of async version


    // Helper to get random color based on name
    const getAvatarColor = (name) => {
        if (!name) return 'bg-avatar-1';
        const colors = ['bg-avatar-1', 'bg-avatar-2', 'bg-avatar-3', 'bg-avatar-4', 'bg-avatar-5'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="job-details-container">
            {/* Mobile Sidebar Overlay */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar (Desktop) */}
            <aside className={`client-dashboard-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', paddingBottom: '0' }} className="lg:hidden">
                    <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>
                <nav className="client-sidebar-nav">
                    <Link to="/dashboard" className="client-nav-item active">
                        <Briefcase className="client-nav-item-icon" />
                        My Jobs
                    </Link>
                    <Link to="/post-job" className="client-nav-item">
                        <PlusCircle className="client-nav-item-icon" />
                        Post New Job
                    </Link>
                </nav>
                <div className="client-sidebar-footer">
                    <button onClick={onLogout} className="client-nav-item w-full text-left" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut className="client-nav-item-icon" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="job-details-main">
                <div className="job-details-wrapper">
                    {/* Header Controls */}
                    <div className="mb-4 lg:hidden">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Back Link */}
                    <Link to="/dashboard" className="back-link">
                        <ArrowLeft size={16} strokeWidth={1.5} />
                        Back to My Jobs
                    </Link>

                    {/* Job Card */}
                    <div className="job-details-card">
                        <div className="job-header-row">
                            <div className="flex-1">
                                <h1 className="job-title-lk">{gig.title}</h1>
                                <div className="job-meta">
                                    <span>
                                        <Calendar size={16} strokeWidth={1.5} />
                                        Posted {new Date(gig.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className={`job-status-badge ${gig.status === 'Open' ? 'status-open' : 'status-assigned'}`}>
                                <span className={`status-dot-sm ${gig.status === 'Open' ? 'dot-green' : 'dot-blue'}`}></span>
                                {gig.status}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="budget-box">
                            <div className="budget-icon">
                                <DollarSign size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="budget-label">Budget</p>
                                <p className="budget-amount">${gig.budget?.toLocaleString()} <span className="budget-currency">USD</span></p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="desc-section">
                            <h2 className="desc-title">Job Description</h2>
                            <div className="desc-content">
                                <p>{gig.description}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="job-actions">
                            <button className="btn-secondary" onClick={handleEditClick}>
                                <Edit2 size={16} strokeWidth={1.5} />
                                Edit Job
                            </button>
                            <button className="btn-secondary btn-danger" onClick={handleDelete}>
                                <Trash2 size={16} strokeWidth={1.5} />
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Bids Section */}
                    <div className="bids-section">
                        <div className="bids-header">
                            <h2 className="bids-title">Bids from Freelancers</h2>
                            <span className="bids-count">{bids.length} bids received</span>
                        </div>

                        <div className="bids-list">
                            {bids.map(bid => {
                                const freelancerName = bid.freelancerId?.name || 'Freelancer';
                                const avatarColor = getAvatarColor(freelancerName);
                                const initial = freelancerName.charAt(0).toUpperCase();

                                return (
                                    <div key={bid._id} className={`bid-card ${bid.status === 'hired' ? 'bid-hired' : (bid.status === 'rejected' ? 'bid-rejected' : '')}`}>
                                        {bid.status === 'hired' && (
                                            <div className="bid-ribbon">Hired</div>
                                        )}
                                        <div className="bid-content">
                                            <div className="bid-info">
                                                <div className={`freelancer-avatar ${avatarColor}`}>
                                                    {initial}
                                                </div>
                                                <div className="freelancer-details flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3>{freelancerName}</h3>
                                                        {bid.status !== 'hired' && bid.status !== 'open' && (
                                                            <span className={`status-label ${bid.status === 'pending' ? 'lbl-pending' : 'lbl-rejected'}`}>
                                                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="freelancer-meta">Freelancer</p>
                                                    <div className="bid-msg">
                                                        <p>"{bid.message || 'No message provided'}"</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bid-actions">
                                                <div className="bid-actions-inner">
                                                    <p className="bid-amt-label">Bid Amount</p>
                                                    <p className="bid-amt">${bid.price?.toLocaleString() || '0'}</p>
                                                </div>
                                                {bid.status === 'hired' ? (
                                                    <button className="btn-hired-static">
                                                        <CheckCircle size={16} strokeWidth={1.5} />
                                                        Hired
                                                    </button>
                                                ) : bid.status === 'rejected' ? (
                                                    <button className="btn-secondary" disabled>
                                                        <XCircle size={16} strokeWidth={1.5} />
                                                        Rejected
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleHireClick(bid._id)} className="btn-hire">
                                                        <UserCheck size={16} strokeWidth={1.5} />
                                                        Hire Freelancer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {/* Hire Modal */}
            <div className={`modal-overlay ${showHireModal ? 'active' : ''}`}>
                <div className="modal-content" style={{ maxWidth: '28rem' }}>
                    <div className="modal-icon-bg bg-emerald-100 text-emerald-600">
                        <UserCheck size={28} strokeWidth={1.5} />
                    </div>
                    <div className="text-center mb-4">
                        <h2 className="modal-title">Hire Freelancer</h2>
                        <p className="text-sm text-slate-500">This action cannot be undone</p>
                    </div>
                    <p className="modal-message">Are you sure you want to hire this freelancer? Once confirmed, the job status will be changed to "Assigned" and other bids will be automatically rejected.</p>
                    <div className="modal-actions">
                        <button onClick={() => setShowHireModal(false)} className="btn-draft" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button onClick={confirmHire} className="btn-submit-job" style={{ flex: 1, backgroundColor: '#059669' }}> {/* emerald-600 */}
                            Confirm Hire
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Job Modal */}
            <div className={`modal-overlay ${showEditModal ? 'active' : ''}`}>
                <div className="modal-content" style={{ maxWidth: '42rem' }}>
                    <div className="modal-icon-bg bg-blue-100 text-blue-600">
                        <Edit2 size={28} strokeWidth={1.5} />
                    </div>
                    <div className="text-center mb-6">
                        <h2 className="modal-title">Edit Job Details</h2>
                        <p className="text-sm text-slate-500">Update your job posting information</p>
                    </div>

                    <form onSubmit={handleEditSubmit} className="post-job-form">
                        {/* Job Title */}
                        <div className="form-group">
                            <label htmlFor="edit-title" className="form-label">Job Title</label>
                            <input
                                type="text"
                                id="edit-title"
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditChange}
                                className="form-input"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="edit-desc" className="form-label">Description</label>
                            <textarea
                                id="edit-desc"
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditChange}
                                rows="6"
                                className="form-textarea"
                                required
                            ></textarea>
                        </div>

                        {/* Budget */}
                        <div className="form-group">
                            <label htmlFor="edit-budget" className="form-label">Budget</label>
                            <div className="budget-input-wrapper">
                                <div className="budget-prefix">
                                    <span className="currency-text">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="edit-budget"
                                    name="budget"
                                    value={editFormData.budget}
                                    onChange={handleEditChange}
                                    className="form-input input-with-currency"
                                    required
                                />
                                <div className="budget-suffix">
                                    <span className="currency-text">USD</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                            <button type="button" onClick={() => setShowEditModal(false)} className="btn-draft" style={{ flex: 1 }}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit-job" style={{ flex: 1 }}>
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
