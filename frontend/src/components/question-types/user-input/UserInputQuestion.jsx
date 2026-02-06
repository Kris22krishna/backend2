import { useState } from 'react';
import PropTypes from 'prop-types';
import './UserInputQuestion.css';

const UserInputQuestion = ({ question, onAnswer, showSolution, onShowSolution }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);

    const handleCheck = () => {
        const correct = question.answer_value?.toString().trim().toLowerCase();
        const user = userAnswer.toString().trim().toLowerCase();

        if (user === correct) {
            setFeedback({ type: 'success', message: 'Correct! 🎉' });
            onAnswer?.(true, userAnswer);
        } else {
            setFeedback({ type: 'error', message: 'Incorrect. Try again.' });
            onAnswer?.(false, userAnswer);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCheck();
        }
    };

    return (
        <div className="user-input-question">
            <div
                className="question-content"
                dangerouslySetInnerHTML={{ __html: question.question_html }}
            />

            <div className="answer-input-container">
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your answer..."
                    className="user-answer-input"
                    autoFocus
                />
                <button onClick={handleCheck} className="check-button">
                    Check Answer
                </button>
            </div>

            {feedback && (
                <div className={`feedback-message ${feedback.type}`}>
                    {feedback.message}
                    {feedback.type === 'error' && (
                        <button
                            onClick={() => onShowSolution?.(!showSolution)}
                            className="show-solution-link"
                        >
                            {showSolution ? 'Hide Solution' : 'Show Solution'}
                        </button>
                    )}
                </div>
            )}

            {showSolution && (
                <div className="solution-box">
                    <strong>Correct Answer:</strong> {question.answer_value}
                </div>
            )}
        </div>
    );
};

UserInputQuestion.propTypes = {
    question: PropTypes.shape({
        question_html: PropTypes.string.isRequired,
        answer_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired,
    onAnswer: PropTypes.func,
    showSolution: PropTypes.bool,
    onShowSolution: PropTypes.func
};

export default UserInputQuestion;
