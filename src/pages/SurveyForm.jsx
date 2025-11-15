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

  // This ref will be attached to our notification component
  const notificationRef = useRef(null);

  // A helper function to set error and scroll
  const setAndScrollToError = (message) => {
    setNotification({ type: 'error', message });
    // We use setTimeout to ensure the notification has rendered before scrolling
    setTimeout(() => {
      notificationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 0);
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotification(null);
        const response = await axios.get(`http://localhost:5001/api/surveys/${surveyId}`);
        setSurvey(response.data);

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

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };
  
  const validateForm = () => {
    for (const section of survey.surveyData.sections) {
      for (const question of section.questions) {
        const isVisible = checkVisibility(question.visibilityLogic, answers);
        
        if (isVisible && question.isRequired) {
          const answer = answers[question.questionId];
          if (!answer || String(answer).trim() === '') {
            setAndScrollToError(`Error: "${question.questionText}" is a required field.`);
            return false;
          }
        }
        
        if (isVisible && question.validationRules && question.validationRules.type === 'range') {
          const answer = parseFloat(answers[question.questionId]);
          const min = parseFloat(question.validationRules.min);
          const max = parseFloat(question.validationRules.max);

          if (answers[question.questionId] !== '' && !isNaN(answer)) {
            if (answer < min || answer > max) {
              setAndScrollToError(`Error: "${question.questionText}" must be between ${min} and ${max}.`);
              return false;
            }
          }
        }
      }
    }
    return true; // All good
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (!validateForm()) {
      return; // Validation failed, notification is set and scrolled
    }

    try {
      await axios.post(`http://localhost:5001/api/surveys/${surveyId}/submit`, {
        answers: answers,
      });

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