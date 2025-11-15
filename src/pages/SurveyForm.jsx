import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import QuestionRenderer from '../components/QuestionRenderer.jsx';
import { checkVisibility } from '../utils/checkVisibility.js';
import Notification from '../components/Notification.jsx';

function SurveyForm() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Ref to scroll to the notification on error
  const notificationRef = useRef(null);

  // Helper to set error notification and scroll to it
  const setAndScrollToError = (message) => {
    setNotification({ type: 'error', message });
    // Ensure notification has rendered before attempting to scroll
    setTimeout(() => {
      notificationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 0);
  };

  // Fetches the survey template data
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotification(null);
        const response = await axios.get(`http://localhost:5001/api/surveys/${surveyId}`);
        setSurvey(response.data);

        // Initialize answers state with empty strings for all questions
        const initialAnswers = {};
        response.data.surveyData.sections.forEach(section => {
          section.questions.forEach(q => {
            initialAnswers[q.questionId] = '';
          });
        });
        setAnswers(initialAnswers);
        
      } catch (err) {
        setError('Failed to load survey. Check the ID or try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [surveyId]);

  // Handles updates to individual answers
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };
  
  // Client-side form validation
  const validateForm = () => {
    for (const section of survey.surveyData.sections) {
      for (const question of section.questions) {
        // Only validate visible questions
        const isVisible = checkVisibility(question.visibilityLogic, answers);
        
        if (isVisible && question.isRequired) {
          const answer = answers[question.questionId];
          if (!answer || String(answer).trim() === '') {
            setAndScrollToError(`Error: "${question.questionText}" is a required field.`);
            return false;
          }
        }
        
        // Validate number range if applicable
        if (isVisible && question.validationRules && question.validationRules.type === 'range') {
          const answer = parseFloat(answers[question.questionId]);
          const min = parseFloat(question.validationRules.min);
          const max = parseFloat(question.validationRules.max);

          // Only validate if an answer is provided and it's a number
          if (answers[question.questionId] !== '' && !isNaN(answer)) {
            if (answer < min || answer > max) {
              setAndScrollToError(`Error: "${question.questionText}" must be between ${min} and ${max}.`);
              return false;
            }
          }
        }
      }
    }
    return true; // All validation passed
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null); // Clear any previous notifications

    if (!validateForm()) {
      return; //Stop if validation failed (error notification already set)
    }

    try {
      await axios.post(`http://localhost:5001/api/surveys/${surveyId}/submit`, {
        answers: answers,
      });

      // Navigate to dashboard and pass a success message via state
      navigate('/', { state: { message: 'Survey submitted successfully!' } });
      
    } catch (err) {
      setAndScrollToError('An error occurred while submitting. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading survey...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!survey) return <p>No survey found.</p>;

  const { title, sections } = survey.surveyData;

  return (
    <div>
      <div className="page-header">
        <Link to="/" className="page-header-back-link">
          &larr; Back
        </Link>
        <h2 className="page-header-title">{title}</h2>
      </div>
      
      {/* Notification display area, scrolled to on error */}
      <div ref={notificationRef}>
        <Notification
          message={notification?.message}
          type={notification?.type}
          onClear={() => setNotification(null)}
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        {sections.map((section) => (
          <div key={section.sectionId} className="survey-section">
            <div className="section-header">
              <h3>{section.title}</h3>
              <p>{section.sectionChecklist}</p>
            </div>
            
            <div className="section-content">
              {section.questions.map((question) => (
                <QuestionRenderer
                  key={question.questionId}
                  question={question}
                  onAnswerChange={handleAnswerChange}
                  currentAnswers={answers}
                />
              ))}
            </div>
          </div>
        ))}
        
        <button type="submit" className="btn" style={{ width: '100%', padding: '16px' }}>
          Submit Survey
        </button>
      </form>
    </div>
  );
}

export default SurveyForm;