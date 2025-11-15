import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SubmissionDetail from "../components/SubmissionDetail.jsx";

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/submissions"
        );
        setSubmissions(response.data);
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
