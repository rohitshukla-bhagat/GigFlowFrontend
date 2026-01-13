import React, { useState } from 'react';
import {
    ArrowLeft,
    Send,
    Lightbulb,
    Check,
    CheckCircle,
    Briefcase,
    PlusCircle,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './ClientDashboard.css'; // Reusing Layout Styles
import './PostJob.css';

const PostJob = ({ onLogout }) => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: '',
        jobDescription: '',
        budget: ''
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { default: api } = await import('../api/axios');
            await api.post('/api/gigs', {
                title: formData.jobTitle,
                description: formData.jobDescription,
                budget: Number(formData.budget)
            });
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post job. Please try again. Ensure you are logged in.');
        }
    };

    const handleCloseModal = (redirectPath) => {
        setShowSuccessModal(false);
        if (redirectPath) {
            navigate(redirectPath);
        } else {
            setFormData({ jobTitle: '', jobDescription: '', budget: '' }); // Reset form
        }
    };

    return (
        <div className="post-job-container">
            {/* Mobile Sidebar Overlay */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar (Reused structure) */}
            <aside className={`client-dashboard-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', paddingBottom: '0' }} className="lg:hidden">
                    <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>
                <nav className="client-sidebar-nav">
                    <Link to="/dashboard" className="client-nav-item">
                        <Briefcase className="client-nav-item-icon" />
                        My Jobs
                    </Link>
                    <Link to="/post-job" className="client-nav-item active">
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
            <main className="post-job-main">
                <div className="post-job-wrapper">
                    {/* Header */}
                    <div className="post-job-header">
                        <button
                            className="mobile-menu-btn lg:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <Link to="/dashboard" className="back-link">
                            <ArrowLeft size={16} strokeWidth={1.5} />
                            Back to My Jobs
                        </Link>
                        <h1 className="page-title">Post New Job</h1>
                        <p className="page-subtitle">Fill in the details below to post your job and start receiving bids.</p>
                    </div>

                    {/* Form Card */}
                    <div className="post-job-card">
                        <form onSubmit={handleSubmit} className="post-job-form">
                            {/* Job Title */}
                            <div className="form-group">
                                <label htmlFor="jobTitle" className="form-label">Job Title</label>
                                <input
                                    type="text"
                                    id="jobTitle"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    placeholder="e.g., Full-Stack Developer for SaaS Platform"
                                    className="form-input"
                                    required
                                />
                                <p className="form-help">Write a clear, descriptive title that attracts the right freelancers.</p>
                            </div>

                            {/* Job Description */}
                            <div className="form-group">
                                <label htmlFor="jobDescription" className="form-label">Job Description</label>
                                <textarea
                                    id="jobDescription"
                                    name="jobDescription"
                                    value={formData.jobDescription}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Describe your project in detail. Include the scope of work, required skills, deliverables, and any specific requirements..."
                                    className="form-textarea"
                                    required
                                ></textarea>
                                <p className="form-help">Be specific about your requirements to receive more accurate bids.</p>
                            </div>

                            {/* Budget */}
                            <div className="form-group">
                                <label htmlFor="budget" className="form-label">Budget</label>
                                <div className="budget-input-wrapper">
                                    <div className="budget-prefix">
                                        <span className="currency-text">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        id="budget"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="1"
                                        step="0.01"
                                        className="form-input input-with-currency"
                                        required
                                    />
                                    <div className="budget-suffix">
                                        <span className="currency-text">USD</span>
                                    </div>
                                </div>
                                <p className="form-help">Set a realistic budget for your project to attract quality freelancers.</p>
                            </div>

                            {/* Divider & Actions */}
                            <div className="form-actions">
                                <button type="submit" className="btn-submit-job">
                                    <Send size={16} strokeWidth={1.5} />
                                    Submit Job
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tips Card */}
                    <div className="tips-card">
                        <div className="tips-content">
                            <div className="tips-icon-bg">
                                <Lightbulb className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="tips-title">Tips for a great job post</h3>
                                <ul className="tips-list">
                                    <li className="tip-item">
                                        <Check size={16} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                        <span>Be specific about skills and experience required</span>
                                    </li>
                                    <li className="tip-item">
                                        <Check size={16} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                        <span>Include clear deliverables and timeline expectations</span>
                                    </li>
                                    <li className="tip-item">
                                        <Check size={16} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                                        <span>Set a competitive budget to attract quality bids</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            <div className={`modal-overlay ${showSuccessModal ? 'active' : ''}`}>
                <div className="modal-content">
                    <div className="modal-icon-bg">
                        <CheckCircle size={28} strokeWidth={1.5} />
                    </div>
                    <h2 className="modal-title">Job Posted Successfully!</h2>
                    <p className="modal-message">Your job has been published. Freelancers can now start submitting their bids.</p>
                    <div className="modal-actions">
                        <button onClick={() => handleCloseModal('/dashboard')} className="btn-submit-job">
                            View My Jobs
                        </button>
                        <button onClick={() => handleCloseModal(null)} className="btn-draft">
                            Post Another Job
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
