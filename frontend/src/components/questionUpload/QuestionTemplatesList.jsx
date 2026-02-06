import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const QuestionTemplatesList = ({ onEdit, onPreview }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const LIMIT = 15;

    const [selectedGrade, setSelectedGrade] = useState('');

    const fetchTemplates = async (currentPage, gradeFilter, search) => {
        try {
            setLoading(true);
            const offset = (currentPage - 1) * LIMIT;

            // Pass filters to backend
            const filters = {
                limit: LIMIT,
                offset,
                grade: gradeFilter,
                search: search
            };

            const data = await api.getQuestionTemplates(filters);

            const fetchedTemplates = data.templates || [];

            setTemplates(fetchedTemplates);

            // Use accurate total from API
            const total = data.total || 0;
            setTotalCount(total);

            // Accurate pagination
            setTotalPages(Math.ceil(total / LIMIT) || 1);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplates(page, selectedGrade, searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [page, selectedGrade, searchTerm]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleGradeChange = (e) => {
        setSelectedGrade(e.target.value);
        setPage(1);
    };

    const handleDelete = async (template) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;
        try {
            await api.deleteQuestionTemplate(template.template_id, template.is_v2);
            fetchTemplates(page, selectedGrade, searchTerm);
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    if (loading && page === 1 && !templates.length) return <div>Loading templates...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="templates-list-container">
            <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <h3>Available Templates <span style={{ fontSize: '0.8em', color: '#666', fontWeight: 'normal' }}>({totalCount})</span></h3>

                    {/* Grade Filter */}
                    <select
                        value={selectedGrade}
                        onChange={handleGradeChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">All Grades</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                        ))}
                    </select>

                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search topic, module or ID..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset to first page
                        }}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '250px'
                        }}
                    />
                </div>
                <button className="create-btn" onClick={() => onEdit(null)}>
                    <Plus size={16} /> New Template
                </button>
            </div>

            {templates.length === 0 && !loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    {searchTerm ? `No templates found matching "${searchTerm}"` : 'No templates found. Create one to get started.'}
                </div>
            ) : (
                <>
                    <div className="template-grid">
                        {templates.map(template => (
                            <div key={template.template_id} className="template-card">
                                <div className="template-info">
                                    <h4>{template.module} - {template.topic}</h4>
                                    <span className="template-id">Grades: {(Array.isArray(template.grade_level) ? template.grade_level : [template.grade_level]).join(', ')} | ID: {template.template_id}</span>
                                </div>
                                <div className="template-actions">
                                    <button onClick={() => onPreview(template)} title="Preview">
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => onEdit(template)} title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(template)} title="Delete" className="delete-btn">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', alignItems: 'center' }}>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            style={{ padding: '8px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                        >
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            style={{ padding: '8px 16px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

QuestionTemplatesList.propTypes = {
    onEdit: PropTypes.func.isRequired,
    onPreview: PropTypes.func.isRequired
};

export default QuestionTemplatesList;
