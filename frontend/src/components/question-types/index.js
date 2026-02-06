// Question Type Components
// Import and use these components based on question type

export { UserInputQuestion } from './user-input';
export { MCQQuestion } from './mcq';
export { ImageBasedQuestion } from './image-based';

/**
 * Helper function to select the appropriate question component based on type
 * 
 * Usage:
 * const QuestionComponent = getQuestionComponent(question.type);
 * return <QuestionComponent question={question} onAnswer={handleAnswer} />;
 */
export const getQuestionComponent = (type) => {
    const components = {
        'user_input': require('./user-input').UserInputQuestion,
        'userInput': require('./user-input').UserInputQuestion,
        'mcq': require('./mcq').MCQQuestion,
        'image_based': require('./image-based').ImageBasedQuestion,
        'imageBased': require('./image-based').ImageBasedQuestion,
    };

    return components[type] || components['user_input'];
};
