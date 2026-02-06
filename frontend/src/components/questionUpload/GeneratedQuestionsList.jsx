import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import PropTypes from 'prop-types';

const GeneratedQuestionsList = ({ jobId }) => {
    const [questions, setQuestions] = useState([]);
    const [stats, setStats] = useState([]);
    const [templates, setTemplates] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState(jobId ? 'detail' : 'summary'); // 'summary' or 'detail'
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    // Fetch Stats & Templates for Summary View
    useEffect(() => {
        if (jobId) return; // If jobId is passed, we are in direct detail mode

        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsData, templatesData] = await Promise.all([
                    api.getGeneratedQuestionStats(),
                    api.getQuestionTemplates()
                ]);

                setStats(statsData || []);

                // Map templates for easy lookup
                const tMap = {};
                (templatesData.templates || []).forEach(t => {
                    tMap[t.template_id] = t;
                });
                setTemplates(tMap);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (viewMode === 'summary') {
            fetchData();
        }
    }, [viewMode, jobId]);

    // Fetch Questions for Detail View
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const filters = {};
                if (jobId) filters.jobId = jobId;
                if (selectedTemplateId) filters.templateId = selectedTemplateId;

                const data = await api.getGeneratedQuestions(filters);
                setQuestions(data.questions || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (viewMode === 'detail' && (jobId || selectedTemplateId)) {
            fetchQuestions();
        }
    }, [viewMode, jobId, selectedTemplateId]);


    const handleViewTemplate = (templateId) => {
        setSelectedTemplateId(templateId);
        setViewMode('detail');
    };

    const handleBackToSummary = () => {
        setViewMode('summary');
        setSelectedTemplateId(null);
    };

    if (loading && viewMode === 'summary' && stats.length === 0) return <div>Loading stats...</div>;
    if (loading && viewMode === 'detail' && questions.length === 0) return <div>Loading questions...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    // --- Detail View ---
    if (viewMode === 'detail') {
        return (
            <div className="generated-questions-container">
                <div className="list-header" style={{ marginBottom: '20px' }}>
                    <h3>
                        {jobId ? `Job #${jobId}` :
                            selectedTemplateId ? `Template: ${templates[selectedTemplateId]?.module || 'Unknown'} (ID: ${selectedTemplateId})` :
                                'Generated Questions'}
                    </h3>
                    {!jobId && (
                        <button onClick={handleBackToSummary} className="cancel-btn">
                            &larr; Back to Summary
                        </button>
                    )}
                </div>

                {questions.length === 0 ? (
                    <p>No questions found.</p>
                ) : (
                    <div className="questions-list">
                        {questions.map((q) => (
                            <div key={q.generated_question_id} className="question-item">
                                <div className="question-header">
                                    <span className="question-id">#{q.generated_question_id}</span>
                                    <span className="question-template">Template ID: {q.template_id}</span>
                                </div>
                                <div className="question-content">
                                    <div dangerouslySetInnerHTML={{ __html: q.question_html }} />
                                    <div className="answer-section">
                                        <strong>Answer:</strong> {q.answer_value}
                                    </div>
                                    <details>
                                        <summary>Variables Used</summary>
                                        <pre>{JSON.stringify(q.variables_used, null, 2)}</pre>
                                    </details>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // --- Summary View ---
    return (
        <div className="generated-questions-container">
            <h3>Generated Questions Summary</h3>
            {stats.length === 0 ? (
                <p>No generated questions found.</p>
            ) : (
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {stats.map(s => {
                        const t = templates[s.template_id] || { module: 'Unknown', topic: 'Unknown' };
                        return (
                            <div key={s.template_id} className="template-card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
                                <h4>{t.module} - {t.topic}</h4>
                                <p style={{ color: '#666', margin: '5px 0' }}>Grades: {(Array.isArray(t.grade_level) ? t.grade_level : [t.grade_level]).join(', ')}</p>
                                <p style={{ color: '#666', margin: '5px 0' }}>Template ID: {s.template_id}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#28a745' }}>
                                        {s.count} Questions
                                    </span>
                                    <button
                                        onClick={() => handleViewTemplate(s.template_id)}
                                        className="save-btn"
                                        style={{ padding: '5px 15px' }}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

GeneratedQuestionsList.propTypes = {
    jobId: PropTypes.string
};

export default GeneratedQuestionsList;
