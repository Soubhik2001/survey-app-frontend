import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import WeatherWidget from "../components/WeatherWidget.jsx";
import Notification from "../components/Notification.jsx";

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(null);

  // Handles displaying success messages from survey submission
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state to prevent message reappearing on refresh
      window.history.replaceState({}, document.title);
    }

    // Fetches available surveys from the backend
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/surveys");
        setSurveys(response.data);
      } catch (err) {
        setError("Failed to load surveys.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [location.state]); // Empty dependency array means this runs once on mount

  return (
    <div>
      {/* Success notification for survey submission */}
      {successMessage && (
        <Notification
          message={successMessage}
          type="success"
          onClear={() => setSuccessMessage(null)}
        />
      )}

      <WeatherWidget />

      <div className="card" style={{ marginTop: "24px" }}>
        <h3>Available Surveys</h3>
        {loading && <p>Loading surveys...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {surveys.length > 0 && (
          <ul className="survey-list">
            {surveys.map((survey) => (
              <li key={survey._id} className="survey-list-item">
                <Link to={`/survey/${survey._id}`}>{survey.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;