import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import PropTypes from 'prop-types';

const GenerationJobMonitor = ({ onJobCreated, onQuestionsGenerated }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [count, setCount] = useState(10);
    const [activeJob, setActiveJob] = useState(null);
    const [polling, setPolling] = useState(false);

    useEffect(() => {
        // Load templates for dropdown
        api.getQuestionTemplates().then(data => setTemplates(data.templates || [])).catch(console.error);
    }, []);

    useEffect(() => {
        let interval;
        if (activeJob && polling) {
            interval = setInterval(async () => {
                try {
                    const job = await api.getGenerationJob(activeJob.id);
                    setActiveJob(job);
                    if (job.status === 'completed' || job.status === 'failed') {
                        setPolling(false);
                        if (job.status === 'completed') {
                            onQuestionsGenerated(job.id);
                        }
                    }
                } catch (e) {
                    console.error("Polling error", e);
                    setPolling(false);
                }
            }, 2000); // Poll every 2 seconds
        }
        return () => clearInterval(interval);
    }, [activeJob, polling, onQuestionsGenerated]);

    const handleGenerate = async () => {
        if (!selectedTemplate) return;
        try {
            const job = await api.createGenerationJob(selectedTemplate, parseInt(count));
            setActiveJob(job);
            setPolling(true);
            onJobCreated(job);
        } catch (err) {
            alert('Failed to start generation: ' + err.message);
        }
    };

    return (
        <div className="job-monitor-container">
            <div className="generation-controls">
                <h3>Generate Questions</h3>
                <div className="control-group">
                    <label>Template:</label>
                    <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}>
                        <option value="">-- Select Template --</option>
                        {templates.map(t => (
                            <option key={t.template_id} value={t.template_id}>{t.module} - {t.topic}</option>
                        ))}
                    </select>
                </div>
                <div className="control-group">
                    <label>Count:</label>
                    <input
                        type="number"
                        value={count}
                        onChange={e => setCount(e.target.value)}
                        min="1"
                        max="100"
                    />
                </div>
                <button onClick={handleGenerate} disabled={!selectedTemplate || polling} className="generate-btn">
                    {polling ? 'Generating...' : 'Start Generation'}
                </button>
            </div>

            {activeJob && (
                <div className={`job-status status-${activeJob.status}`}>
                    <h4>Current Job: {activeJob.id}</h4>
                    <p>Status: <strong>{activeJob.status}</strong></p>
                    {activeJob.progress && <p>Progress: {activeJob.progress}</p>}
                </div>
            )}
        </div>
    );
};

GenerationJobMonitor.propTypes = {
    onJobCreated: PropTypes.func,
    onQuestionsGenerated: PropTypes.func.isRequired
};

export default GenerationJobMonitor;
