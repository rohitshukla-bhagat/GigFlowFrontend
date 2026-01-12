import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, isLoggedIn, user }) => {
    // Determine the link destination based on login status and role
    let linkTo = '/login';
    if (isLoggedIn) {
        // Check if user is the owner of the job (assuming job.ownerId is populated object or ID string)
        const isOwner = user?.role === 'client' && (job.ownerId === user?._id || job.ownerId?._id === user?._id);

        if (isOwner) {
            linkTo = '/dashboard';
        } else {
            linkTo = `/freelancer-job/${job._id}`;
        }
    }

    return (
        <div className="job-card">
            <div className="job-card-header">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-status">
                    <span className="status-dot"></span>
                    {job.status}
                </span>
            </div>
            <p className="job-description">{job.description}</p>
            <div className="job-card-footer">
                <div className="job-budget">
                    <Wallet className="budget-icon" size={16} />
                    <span className="budget-amount">${job.budget.toLocaleString()}</span>
                    <span className="budget-label">budget</span>
                </div>
                <Link to={linkTo} className="btn-details" style={{ textDecoration: 'none' }}>
                    View Details
                    <ArrowRight className="btn-icon" size={16} />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
