import React, { useState } from 'react';
import {
    Briefcase,
    PlusCircle,
    LogOut,
    Plus,
    CircleDot,
    UserCheck,
    Wallet,
    Users,
    Calendar,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './ClientDashboard.css';

const ClientDashboard = ({ onLogout }) => {
    const [myJobs, setMyJobs] = useState([]);
    const [stats, setStats] = useState({ totalJobs: 0, openJobs: 0, assignedJobs: 0 });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { default: api } = await import('../api/axios');
                const [jobsResponse, statsResponse] = await Promise.all([
                    api.get('/gigs/my-gigs'),
                    api.get('/gigs/my-stats')
                ]);

                setMyJobs(jobsResponse.data);
                setStats(statsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

    return (
        <div className="client-dashboard-container">
            {/* Mobile Sidebar Overlay */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar (Desktop & Mobile) */}
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
            <main className="client-dashboard-main">
                <div className="client-dashboard-content-wrapper">
                    {/* Header */}
                    <div className="client-dashboard-header">
                        <div>
                            <button
                                className="mobile-menu-btn lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={20} />
                            </button>
                            <h1 className="page-title">My Jobs</h1>
                            <p className="page-subtitle">Manage your posted jobs and view bids</p>
                        </div>
                        <Link to="/post-job" className="btn-new-job" style={{ textDecoration: 'none' }}>
                            <Plus size={18} strokeWidth={2} />
                            Post New Job
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="client-stats-grid">
                        <div className="client-stat-card">
                            <div className="client-stat-icon-bg bg-blue-50">
                                <Briefcase className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="client-stat-label">Total Jobs</p>
                                <p className="client-stat-value">{stats.totalJobs}</p>
                            </div>
                        </div>
                        <div className="client-stat-card">
                            <div className="client-stat-icon-bg bg-green-50">
                                <CircleDot className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="client-stat-label">Open Jobs</p>
                                <p className="client-stat-value">{stats.openJobs}</p>
                            </div>
                        </div>
                        <div className="client-stat-card">
                            <div className="client-stat-icon-bg bg-purple-50">
                                <UserCheck className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="client-stat-label">Assigned</p>
                                <p className="client-stat-value">{stats.assignedJobs}</p>
                            </div>
                        </div>
                    </div>

                    {/* Jobs List Header */}
                    <div className="jobs-list-header">
                        <h2 className="section-title">Posted Jobs</h2>
                        <span className="jobs-count">{myJobs.length} jobs found</span>
                    </div>

                    {/* Job Cards */}
                    <div className="job-card-list">
                        {myJobs.map((job) => (
                            <div key={job._id} className="dashboard-job-card">
                                <div className="job-card-content">
                                    <div className="job-info-main">
                                        <div className="job-title-row">
                                            <h3 className="job-title">{job.title}</h3>
                                            <span className={`status-badge ${job.status === 'Open' ? 'badge-open' : 'badge-assigned'}`}>
                                                <span className={`status-dot ${job.status === 'Open' ? 'status-dot-open' : 'status-dot-assigned'}`}></span>
                                                {job.status}
                                            </span>
                                        </div>
                                        <p className="job-desc">{job.description}</p>
                                        <div className="job-meta-row">
                                            <div className="meta-item">
                                                <Wallet size={16} strokeWidth={1.5} />
                                                <span className="meta-value">${job.budget?.toLocaleString()}</span>
                                                <span>budget</span>
                                            </div>
                                            <div className="meta-item">
                                                <Users size={16} strokeWidth={1.5} />
                                                <span>{0} bids</span> {/* Bids count not in gig model yet, needs aggregation or separate fetch */}
                                            </div>
                                            <div className="meta-item">
                                                <Calendar size={16} strokeWidth={1.5} />
                                                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 lg:mt-0">
                                        <Link to={`/job/${job._id}`} className="btn-view-bids" style={{ textDecoration: 'none' }}>
                                            View Bids
                                            <ArrowRight size={16} strokeWidth={1.5} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
