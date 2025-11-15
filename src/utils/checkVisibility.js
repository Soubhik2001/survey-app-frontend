/**
 * Checks if a question should be visible based on its logic
 * and the current state of all answers.
 */
export const checkVisibility = (visibilityLogic, currentAnswers) => {
  // If logic is disabled, the question is always visible
  if (!visibilityLogic || !visibilityLogic.enabled) {
    return true;
  }

  const { targetQuestion, condition, value } = visibilityLogic;

  // Get the actual answer for the question we depend on
  const targetAnswer = currentAnswers[targetQuestion];

  // Check the condition [cite: 420]
  switch (condition) {
    case 'equals':
      return targetAnswer === value;
    // You could add more conditions here like 'notEquals', 'greaterThan', etc.
    default:
      console.warn(`Unknown visibility condition: ${condition}`);
      return true; // Default to visible if condition is unknown
  }
};