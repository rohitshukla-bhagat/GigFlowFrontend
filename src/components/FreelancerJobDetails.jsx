import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Lightbulb, Info, Star, MapPin, ExternalLink, Bell, MessageSquare } from 'lucide-react';
import './FreelancerJobDetails.css';

const FreelancerJobDetails = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        proposal: '',
        bidPrice: '',
        timeline: ''
    });

    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch job data
    React.useEffect(() => {
        const fetchJob = async () => {
            try {
                const { default: api } = await import('../api/axios');

                const response = await api.get(`/api/gigs/${id}`);
                setJobData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch job:", err);
                setError("Failed to load job details. The server might be down or the job doesn't exist.");
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        } else {
            // Mock data if no ID (just for viewing component)
            setJobData({
                title: "Full-Stack Developer (Mock)",
                status: "Open",
                postedDate: "2 days ago",
                budgetMin: 4000,
                budgetMax: 6000,
                budgetType: "Fixed Price",
                description: "This is a mock job because no ID was provided.",
                responsibilities: [],
                requirements: [],
                skills: ["React", "Node.js"],
                client: { name: "Mock Client", location: "Remote" }
            });
            setLoading(false);
        }
    }, [id]);

    if (loading) return <div className="freelancer-job-loading">Loading job details...</div>;
    if (error) return <div className="freelancer-job-error">Error: {error}</div>;
    if (!jobData) return <div className="freelancer-job-error">Job not found</div>;

    const similarJobs = [
        {
            id: 2,
            title: "React Developer for E-commerce App",
            description: "Looking for a skilled React developer to build a modern e-commerce frontend with shopping cart and checkout functionality.",
            budgetMin: 2500,
            budgetMax: 4000,
            postedDate: "1 day ago"
        },
        {
            id: 3,
            title: "Node.js Backend Engineer",
            description: "We need a backend engineer to help scale our API infrastructure and implement new microservices architecture.",
            budgetMin: 5000,
            budgetMax: 8000,
            postedDate: "3 days ago"
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { default: api } = await import('../api/axios');
            await api.post('/api/bids', {
                gigId: id,
                message: formData.proposal,
                price: Number(formData.bidPrice)
            });

            alert('Bid submitted successfully!');
            navigate('/freelancer-dashboard');
        } catch (error) {
            console.error('Error submitting bid:', error);
            alert('Failed to submit bid. Please try again.');
        }
    };

    return (
        <>
            {/* Main Content */}
            <main className="freelancer-job-main">
                {/* Back Link */}
                <Link to="/" className="freelancer-job-back-link">
                    <ArrowLeft size={16} strokeWidth={1.5} />
                    Back to Jobs
                </Link>

                {/* Job Details Card */}
                <div className="freelancer-job-card">
                    {/* Job Information Section */}
                    <div className="freelancer-job-info-section">
                        {/* Header */}
                        <div className="freelancer-job-header">
                            <div className="freelancer-job-header-left">
                                <h1 className="freelancer-job-title">{jobData.title}</h1>
                                <div className="freelancer-job-meta">
                                    <span className="freelancer-job-status-badge">
                                        <span className="freelancer-job-status-dot"></span>
                                        {jobData.status}
                                    </span>
                                    <span className="freelancer-job-posted-date">Posted {new Date(jobData.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="freelancer-job-header-right">
                                <p className="freelancer-job-budget">
                                    ${jobData.budget?.toLocaleString() || '0'}
                                </p>
                                <p className="freelancer-job-budget-type">Fixed Price</p>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="freelancer-job-section">
                            <h2 className="freelancer-job-section-title">Job Description</h2>
                            <div className="freelancer-job-description">
                                <p>{jobData.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="freelancer-job-divider"></div>

                    {/* Bid Submission Section - Only visible to Freelancers */}
                    {user?.role === 'freelancer' && (
                        <div className="freelancer-job-bid-section">
                            <div className="freelancer-job-bid-header">
                                <div className="freelancer-job-bid-icon">
                                    <Send size={20} color="white" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h2 className="freelancer-job-bid-title">Submit Your Bid</h2>
                                    <p className="freelancer-job-bid-subtitle">Send a proposal to get hired for this project</p>
                                </div>
                            </div>

                            <form className="freelancer-job-form" onSubmit={handleSubmit}>
                                {/* Proposal Textarea */}
                                <div className="freelancer-job-form-group">
                                    <label htmlFor="proposal" className="freelancer-job-label">Your Proposal</label>
                                    <textarea
                                        id="proposal"
                                        name="proposal"
                                        rows="5"
                                        className="freelancer-job-textarea"
                                        placeholder="Introduce yourself and explain why you're the best fit for this project. Highlight your relevant experience and how you would approach this job..."
                                        value={formData.proposal}
                                        onChange={handleInputChange}
                                    />
                                    <p className="freelancer-job-hint">
                                        <Lightbulb size={16} strokeWidth={1.5} />
                                        Explain why you are the best fit for this job
                                    </p>
                                </div>

                                {/* Bid Price */}
                                <div className="freelancer-job-form-group">
                                    <label htmlFor="bidPrice" className="freelancer-job-label">Your Bid Price</label>
                                    <div className="freelancer-job-input-wrapper">
                                        <span className="freelancer-job-input-prefix">$</span>
                                        <input
                                            type="number"
                                            id="bidPrice"
                                            name="bidPrice"
                                            className="freelancer-job-input freelancer-job-input-with-prefix"
                                            placeholder="5,000"
                                            value={formData.bidPrice}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <p className="freelancer-job-hint">
                                        Client's budget: ${jobData.budget?.toLocaleString() || '0'}
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div style={{ paddingTop: '0.5rem' }}>
                                    <button type="submit" className="freelancer-job-submit-btn">
                                        <Send size={20} strokeWidth={1.5} />
                                        Place Bid
                                    </button>
                                </div>
                            </form>

                            {/* Info Notice */}
                            <div className="freelancer-job-notice">
                                <Info size={20} className="freelancer-job-notice-icon" strokeWidth={1.5} />
                                <div className="freelancer-job-notice-text">
                                    <p>
                                        By submitting a bid, you agree to GigFlow's{' '}
                                        <a href="#" className="freelancer-job-notice-link">Terms of Service</a>.
                                        The client will be notified of your proposal and may reach out for further discussion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default FreelancerJobDetails;
