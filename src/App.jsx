import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import JobGrid from './components/JobGrid';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import ClientDashboard from './components/ClientDashboard';
import PostJob from './components/PostJob';
import JobDetails from './components/JobDetails';
import FreelancerDashboard from './components/FreelancerDashboard';
import FreelancerJobDetails from './components/FreelancerJobDetails';
import NotFound from './components/NotFound';
// import { jobs as initialJobs } from './data/jobs'; // Mock data removed

// Main content component to handle search usage specific to the home page
const Home = ({ isLoggedIn, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBudget, setFilterBudget] = useState('');

  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  const handleSearchSubmit = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    setActiveSearchTerm(tag);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setFilterCategory('');
    setFilterBudget('');
  };

  // State for jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from API
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { default: api } = await import('./api/axios');
        const response = await api.get('/gigs'); // Assuming GET /api/gigs returns open gigs
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          console.error('API Error: Expected array of jobs but got:', typeof response.data, response.data);
          setJobs([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Basic search on title/desc is supported by client-side filter for now
      // Ideally move search to backend if data grows
      const titleMatch = job.title?.toLowerCase().includes(activeSearchTerm.toLowerCase());
      const descMatch = job.description?.toLowerCase().includes(activeSearchTerm.toLowerCase());
      const matchesSearch = titleMatch || descMatch;

      const matchesCategory = !filterCategory || job.category === filterCategory;

      let matchesBudget = true;
      if (filterBudget) {
        if (filterBudget === '0-500') matchesBudget = job.budget <= 500;
        else if (filterBudget === '500-1000') matchesBudget = job.budget > 500 && job.budget <= 1000;
        else if (filterBudget === '1000-5000') matchesBudget = job.budget > 1000 && job.budget <= 5000;
        else if (filterBudget === '5000+') matchesBudget = job.budget > 5000;
      }

      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [jobs, activeSearchTerm, filterCategory, filterBudget]);

  return (
    <>
      <Hero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onTagClick={handleTagClick}
      />

      <main className="main-content container">
        <div className="layout-grid">
          <Sidebar
            category={filterCategory}
            budget={filterBudget}
            onCategoryChange={setFilterCategory}
            onBudgetChange={setFilterBudget}
            onClearFilters={clearFilters}
          />

          <div className="content-area">
            <div className="results-header">
              <h2 className="results-title">Available Jobs</h2>
              <span className="results-count">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <JobGrid jobs={filteredJobs} isLoggedIn={isLoggedIn} user={user} />
          </div>
        </div>
      </main>
    </>
  );
}



function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);

    // Redirect based on role
    if (userData?.role === 'client') {
      navigate('/dashboard');
    } else if (userData?.role === 'freelancer') {
      navigate('/freelancer-dashboard'); // Assuming this route exists and is correct
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      const { default: api } = await import('./api/axios');
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Navbar isLoggedIn={isLoggedIn} user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} user={user} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<ClientDashboard onLogout={handleLogout} />} />
        <Route path="/post-job" element={<PostJob onLogout={handleLogout} />} />
        <Route path="/job/:id" element={<JobDetails onLogout={handleLogout} />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard onLogout={handleLogout} />} />
        <Route path="/freelancer-job/:id" element={<FreelancerJobDetails user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
