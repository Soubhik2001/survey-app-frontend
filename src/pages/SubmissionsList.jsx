import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SubmissionDetail from "../components/SubmissionDetail.jsx";

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState({}); // Stores grouped submissions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetches all submissions from the backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/submissions"
        );
        setSubmissions(response.data); // Data is already grouped by survey title
      } catch (err) {
        setError("Failed to load submissions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="page-header">
        <Link to="/" className="page-header-back-link">
          &larr; Back
        </Link>
        <h2 className="page-header-title">View All Submissions</h2>
      </div>

      {/* Display submissions if available, otherwise a message */}
      {Object.keys(submissions).length > 0 ? (
        Object.keys(submissions).map((surveyTitle) => (
          <div key={surveyTitle} className="card">
            <h3>
              {surveyTitle} ({submissions[surveyTitle].length} submissions)
            </h3>

            <div>
              {submissions[surveyTitle].map((submission) => (
                <div key={submission._id} className="submission-card">
                  <strong>
                    Submitted at:{" "}
                    {new Date(submission.submittedAt).toLocaleString()}
                  </strong>
                  <SubmissionDetail
                    answers={submission.answers}
                    surveyTemplateId={submission.surveyTemplate._id}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No submissions have been recorded yet.</p>
      )}
    </div>
  );
};

export default SubmissionsList;
