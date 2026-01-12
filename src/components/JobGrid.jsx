import React from 'react';
import { SearchX } from 'lucide-react';
import JobCard from './JobCard';

const JobGrid = ({ jobs, isLoggedIn, user }) => {
    if (jobs.length === 0) {
        return (
            <div className="no-jobs">
                <SearchX className="no-jobs-icon" size={48} />
                <h3 className="no-jobs-title">No jobs found</h3>
                <p className="no-jobs-text">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="job-grid">
            {jobs.map(job => (
                <JobCard key={job.id} job={job} isLoggedIn={isLoggedIn} user={user} />
            ))}
        </div>
    );
};

export default JobGrid;
