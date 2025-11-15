import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * This component renders a single submission's answers
 * by fetching the matching survey template to get the questions.
 */
const SubmissionDetail = ({ answers, surveyTemplateId }) => {
  const [questionMap, setQuestionMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch the original survey this answer belongs to
        const response = await axios.get(`http://localhost:5001/api/surveys/${surveyTemplateId}`);
        const { sections } = response.data.surveyData;
        
        // Create a simple map of {q_1: "What is your name?"}
        const newMap = {};
        sections.forEach(section => {
          section.questions.forEach(question => {
            newMap[question.questionId] = question.questionText;
          });
        });
        setQuestionMap(newMap);

      } catch (err) {
        console.error("Failed to fetch survey template for answers", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [surveyTemplateId]);

  if (loading) return <p>Loading answers...</p>;

  return (
    <ul style={{ listStyleType: 'none', paddingLeft: '10px', marginTop: '10px' }}>
      
      {Object.entries(answers).map(([qId, answer]) => {
        
        // Only show answers that have a value
        if (!answer) return null;
        
        // Use the map to show the question text, or fall back to the ID if not found
        const questionText = questionMap[qId] || qId;
        
        return (
          <li key={qId} style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#333' }}>{questionText}:</strong>
            <span style={{ marginLeft: '8px', color: '#555' }}>{answer}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default SubmissionDetail;