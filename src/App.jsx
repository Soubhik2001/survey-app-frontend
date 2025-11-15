import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import SurveyForm from './pages/SurveyForm.jsx';
import SubmissionsList from './pages/SubmissionsList.jsx';
import './index.css';

/**
 * A new inner component that has access to location
 */
function AppContent() {
  const location = useLocation();
  const showSubmissionsLink = location.pathname !== '/submissions';

  return (
    <div className="app-container">
      <nav className="app-nav">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2>Student Survey PWA</h2>
        </Link>
        {/* This link will now hide on the submissions page */}
        {showSubmissionsLink && (
          <Link to="/submissions" className="nav-link">
            View Submissions
          </Link>
        )}
      </nav>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/survey/:surveyId" element={<SurveyForm />} />
        <Route path="/submissions" element={<SubmissionsList />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* We wrap the content so the hook works */}
      <AppContent />
    </BrowserRouter>
  );
}

export default App;