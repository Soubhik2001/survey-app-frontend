import TextInput from './inputs/TextInput.jsx';
import DropdownInput from './inputs/DropdownInput.jsx';
import NumberInput from './inputs/NumberInput.jsx';
import { checkVisibility } from '../utils/checkVisibility';

const QuestionRenderer = ({ question, onAnswerChange, currentAnswers }) => {
  
  // Check if this question should be visible 
  const isVisible = checkVisibility(question.visibilityLogic, currentAnswers);

  // If not visible, render nothing
  if (!isVisible) {
    return null;
  }

  const handleChange = (e) => {
    onAnswerChange(question.questionId, e.target.value);
  };

  const renderInput = () => {
    const { inputType, questionId, questionText, questionHintText, options } = question;
    const value = currentAnswers[questionId];

    switch (inputType) {
      case 'Text':
        return (
          <TextInput
            questionText={questionText}
            hintText={questionHintText}
            value={value}
            onChange={handleChange}
          />
        );
      case 'Dropdown':
        return (
          <DropdownInput
            questionText={questionText}
            hintText={questionHintText}
            value={value}
            options={options}
            onChange={handleChange}
          />
        );
      case 'Number':
        return (
          <NumberInput
            questionText={questionText}
            hintText={questionHintText}
            value={value}
            onChange={handleChange}
            validationRules={question.validationRules}
          />
        );
      default:
        return <p>Warning: Unknown input type "{inputType}"</p>;
    }
  };

  return (
    <div style={{ marginBottom: '20px', paddingLeft: '10px' }}>
      {renderInput()}
    </div>
  );
};

export default QuestionRenderer;