import { useState } from 'react';
import PropTypes from 'prop-types';
import './MCQQuestion.css';

const MCQQuestion = ({ question, onAnswer, showSolution }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);

    // Extract options from question data
    const options = question.variables_used?.options || question.options || [];

    const handleOptionSelect = (option, index) => {
        setSelectedOption(index);

        // Check if correct
        const correct = question.answer_value?.toString().trim().toLowerCase();
        const selected = option.toString().trim().toLowerCase();

        if (selected === correct) {
            setFeedback({ type: 'success', message: 'Correct! 🎉' });
            onAnswer?.(true, option);
        } else {
            setFeedback({ type: 'error', message: 'Incorrect!' });
            onAnswer?.(false, option);
        }
    };

    const getOptionLabel = (index) => {
        return String.fromCharCode(65 + index); // A, B, C, D...
    };

    return (
        <div className="mcq-question">
            <div
                className="question-content"
                dangerouslySetInnerHTML={{ __html: question.question_html }}
            />

            <div className="options-container">
                {options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrect = option.toString().trim().toLowerCase() ===
                        question.answer_value?.toString().trim().toLowerCase();

                    let optionClass = 'option-button';
                    if (feedback && isSelected) {
                        optionClass += isCorrect ? ' correct' : ' incorrect';
                    }
                    if (feedback && showSolution && isCorrect) {
                        optionClass += ' correct';
                    }

                    return (
                        <button
                            key={index}
                            className={optionClass}
                            onClick={() => handleOptionSelect(option, index)}
                            disabled={feedback !== null}
                        >
                            <span className="option-label">{getOptionLabel(index)}</span>
                            <span className="option-text">{option}</span>
                        </button>
                    );
                })}
            </div>

            {feedback && (
                <div className={`feedback-message ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

MCQQuestion.propTypes = {
    question: PropTypes.shape({
        question_html: PropTypes.string.isRequired,
        answer_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        options: PropTypes.array,
        variables_used: PropTypes.object
    }).isRequired,
    onAnswer: PropTypes.func,
    showSolution: PropTypes.bool
};

export default MCQQuestion;
