/**
 * Evaluates conditional visibility logic for a question.
 *
 * @param {object} logic - The visibility logic object (e.g., { questionId: "q_1", operator: "equals", value: "Yes" })
 * @param {object} currentAnswers - The current state of all answers (e.g., { "q_1": "Yes", "q_2": "3rd" })
 * @returns {boolean} - True if the question should be visible, false otherwise.
 */
export const checkVisibility = (visibilityLogic, currentAnswers) => {
  // If visibility logic is not enabled or not defined, the question is always visible.
  if (!visibilityLogic || !visibilityLogic.enabled) {
    return true;
  }

  // Destructure the specific logic parameters for this question
  const { targetQuestion, condition, value } = visibilityLogic;

  // Get the answer of the question that controls visibility
  const targetAnswer = currentAnswers[targetQuestion];

  // Evaluate the condition
  switch (condition) {
    case 'equals':
      // Compare the target answer to the required value
      return targetAnswer === value;
    default:
      console.warn(`Unknown visibility condition: ${condition}`);
      return true; // If condition is unknown, default to visible to avoid hiding content unintentionally
  }
};