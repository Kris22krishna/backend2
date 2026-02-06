import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import PropTypes from 'prop-types';

const COMPONENT_DEFAULT = {
    skill_id: "",
    grade: "",
    category: "",
    skill_name: "",
    type: "MCQ",
    format: 1,
    difficulty: "Easy",
    question_template: "",
    answer_template: "",
    solution_template: ""
};

const QuestionTemplateForm = ({ template, onSave, onCancel, onPreview }) => {
    const [formData, setFormData] = useState(COMPONENT_DEFAULT);
    const [loading, setLoading] = useState(false);
    const [fetchingSkill, setFetchingSkill] = useState(false);
    const [error, setError] = useState(null);
    const [skillError, setSkillError] = useState(null);

    // New state for gallery
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        if (template) {
            setFormData({
                skill_id: template.skill_id || '',
                grade: template.grade || '',
                category: template.category || '',
                skill_name: template.skill_name || '',
                type: template.type || 'MCQ',
                format: template.format || 1,
                difficulty: template.difficulty || 'Easy',
                question_template: template.question_template || '',
                answer_template: template.answer_template || '',
                solution_template: template.solution_template || ''
            });
        }
    }, [template]);

    const handleChange = (e) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const fetchSkillDetails = async () => {
        if (!formData.skill_id) {
            setSkillError("Please enter a Skill ID");
            return;
        }

        setFetchingSkill(true);
        setSkillError(null);

        try {
            const response = await api.getSkillById(formData.skill_id);
            if (response) {
                setFormData(prev => ({
                    ...prev,
                    grade: response.grade || '',
                    category: response.topic || '',
                    skill_name: response.skill_name || ''
                }));
            }
        } catch (err) {
            setSkillError("Skill not found. Please check the ID.");
            setFormData(prev => ({
                ...prev,
                grade: '',
                category: '',
                skill_name: ''
            }));
        } finally {
            setFetchingSkill(false);
        }
    };

    const loadExample = () => {
        const exampleQuestionTemplate = `# Define vars -> question, answer, solution, options (optional)
import random

a = random.randint(1, 10)
b = random.randint(1, 10)
ans = a + b

question = f"<div className='question-container'><p>What is {a} + {b}?</p></div>"`;

        const exampleAnswerTemplate = `# Use variables from Question Template
# answer variable is already set generally, but you can override specifically if needed
# basically just return nothing if you set 'answer' above, or format it here.
answer = ans`;

        const exampleSolutionTemplate = `# Explain logic
solution = f"""
<div className="solution">
    <p>To add {a} and {b}:</p>
    <p>{a} + {b} = {ans}</p>
</div>
"""`;

        setFormData(prev => ({
            ...prev,
            skill_id: 1, // Dummy ID
            grade: 5,
            category: "Mathematics",
            skill_name: "Addition Practice",
            type: "MCQ",
            format: 1,
            difficulty: "Easy",
            question_template: exampleQuestionTemplate,
            answer_template: exampleAnswerTemplate,
            solution_template: exampleSolutionTemplate
        }));
    };

    const getPayload = () => {
        return {
            skill_id: parseInt(formData.skill_id) || 0,
            grade: parseInt(formData.grade) || 0,
            category: formData.category || "",
            skill_name: formData.skill_name || "",
            type: formData.type || "MCQ",
            format: parseInt(formData.format) || 1,
            difficulty: formData.difficulty || "Easy",
            question_template: formData.question_template || "",
            answer_template: formData.answer_template || "",
            solution_template: formData.solution_template || ""
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.skill_id) return setError("Skill ID is required");
        if (!formData.grade) return setError("Grade is required");
        if (!formData.category) return setError("Category is required");
        if (!formData.skill_name) return setError("Skill Name is required");

        setLoading(true);
        setError(null);
        try {
            const payload = getPayload();
            console.log("Submitting payload to parent:", payload);
            await onSave(payload);
        } catch (err) {
            console.error("Save error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePreviewClick = async () => {
        // Validate templates before preview
        if (!formData.question_template?.trim()) return setError("Question Template cannot be empty for preview.");
        if (!formData.answer_template?.trim()) return setError("Answer Template cannot be empty for preview.");
        if (!formData.solution_template?.trim()) return setError("Solution Template cannot be empty for preview.");

        // Use current form data directly
        const payload = {
            skill_id: parseInt(formData.skill_id) || 0,
            grade: parseInt(formData.grade) || 0,
            category: formData.category || 'Preview',
            skill_name: formData.skill_name || 'Preview',
            type: formData.type,
            format: parseInt(formData.format),
            difficulty: formData.difficulty,
            question_template: formData.question_template,
            answer_template: formData.answer_template,
            solution_template: formData.solution_template,
            is_v2: true // Important for TemplatePreview to know which API to use
        };

        // Pass the payload to the parent/dashboard, which renders TemplatePreview.
        // TemplatePreview will handle the API call and loading state.
        setError(null); // Clear any previous form errors
        onPreview(payload);
    };

    const handleDeleteImage = (indexToRemove) => {
        const imageToRemove = uploadedImages[indexToRemove];

        // 1. Remove from state
        setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));

        // 2. Attempt to remove from question_template code
        // This is a best-effort text replacement
        if (imageToRemove && imageToRemove.url) {
            const templateCode = formData.question_template;
            // Construct the exact string we added earlier
            // We need to be careful with the exact format matching what we added
            // The added format was:
            // \nquestion += f'<div class="image-container"><img src="${imageSrc}" alt="Question Image" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px;" /></div>'

            // We try to match the URL part specifically
            const regex = new RegExp(`\\nquestion \\+= f'<div class="image-container"><img src="${imageToRemove.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*></div>'`, 'g');

            const newTemplateCode = templateCode.replace(regex, '');

            if (newTemplateCode !== templateCode) {
                setFormData(prev => ({
                    ...prev,
                    question_template: newTemplateCode
                }));
            }
        }
    };

    return (
        <div className="template-form-container">
            {/* Header with Load Example button */}
            <div className="form-header">
                <h3>{template ? 'Edit Template' : 'Create New Template'}</h3>
                <button type="button" onClick={loadExample} className="load-example-btn">
                    <span className="icon">↻</span> Load Example
                </button>
            </div>

            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                {/* --- Skill Configuration --- */}
                <div className="form-section skill-config-section">
                    <div className="section-header">
                        <span className="section-icon">#</span>
                        <h4>Skill Configuration</h4>
                    </div>

                    <div className="form-group">
                        <label>Skill ID</label>
                        <input
                            type="number"
                            name="skill_id"
                            value={formData.skill_id}
                            onChange={handleChange}
                            onBlur={fetchSkillDetails}
                            placeholder="Enter skill ID"
                            required
                        />
                        <small className="helper-text">Enter ID and click outside to fetch details.</small>
                        {fetchingSkill && <small className="info-text">Fetching skill details...</small>}
                        {skillError && <small className="error-text">{skillError}</small>}
                    </div>

                    <div className="form-row three-cols">
                        <div className="form-group third">
                            <label><span className="field-icon">◈</span> Grade</label>
                            <input
                                type="number"
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                placeholder="Grade Level"
                                required
                            />
                        </div>
                        <div className="form-group third">
                            <label><span className="field-icon">☐</span> Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category"
                                required
                            />
                        </div>
                        <div className="form-group third">
                            <label><span className="field-icon">T</span> Skill Name</label>
                            <input
                                type="text"
                                name="skill_name"
                                value={formData.skill_name}
                                onChange={handleChange}
                                placeholder="Skill Name"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* --- Question Type and Difficulty --- */}
                <div className="form-row two-cols">
                    <div className="form-group half">
                        <label>Question Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="MCQ">MCQ</option>
                            <option value="User Input">User Input</option>
                            <option value="Image Based">Image Based</option>
                            <option value="Code Based">Code Based</option>
                        </select>
                    </div>
                    <div className="form-group half">
                        <label><span className="field-icon">‖</span> Difficulty</label>
                        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {formData.type === 'Image Based' && (
                    <div className="form-row" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        {/* Left Column: Upload Dropzone */}
                        <div className="form-group" style={{ flex: 1 }}>
                            <label><span className="field-icon">🖼️</span> Upload Images</label>

                            <div
                                className="upload-dropzone"
                                onClick={() => document.getElementById('hidden-file-input').click()}
                                style={{
                                    border: '2px dashed #646cff',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(100, 108, 255, 0.05)',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '10px',
                                    minHeight: '200px',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(100, 108, 255, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(100, 108, 255, 0.05)'}
                            >
                                <span style={{ fontSize: '32px' }}>☁️</span>
                                <div>
                                    <strong style={{ color: '#646cff' }}>Click to upload</strong> or drag and drop
                                </div>
                                <span style={{ fontSize: '12px', color: '#888' }}>SVG, PNG, JPG (max. 5MB)</span>
                            </div>

                            <input
                                id="hidden-file-input"
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    const files = Array.from(e.target.files);
                                    if (!files.length) return;

                                    try {
                                        setLoading(true);
                                        let newImageHtml = "";
                                        const newImages = [];

                                        for (const file of files) {
                                            const response = await api.uploadImage(file, formData.grade);
                                            const imageUrl = response.url;

                                            // Auto-insert into question template
                                            let imageSrc = "";
                                            if (imageUrl.startsWith("http")) {
                                                imageSrc = imageUrl;
                                            } else {
                                                // Resolve full URL here in JS, so Python doesn't need BASE_URL variable
                                                const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
                                                imageSrc = `${baseUrl}${imageUrl}`;
                                            }

                                            newImageHtml += `\nquestion += f'<div class="image-container"><img src="${imageSrc}" alt="Question Image" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px;" /></div>'`;
                                            newImages.push({ url: imageSrc, name: file.name });
                                        }

                                        setFormData(prev => ({
                                            ...prev,
                                            question_template: prev.question_template + newImageHtml
                                        }));

                                        // Update local gallery state
                                        setUploadedImages(prev => [...prev, ...newImages]);

                                    } catch (err) {
                                        alert("Upload failed: " + err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            />
                            <small className="helper-text" style={{ display: 'block', marginTop: '8px', textAlign: 'center' }}>
                                Uploading will automatically append the code to the editor below.
                            </small>
                        </div>

                        {/* Right Column: Image Gallery */}
                        {uploadedImages.length > 0 && (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Gallery ({uploadedImages.length})</label>
                                <div className="image-gallery" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                    gap: '10px',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    padding: '10px',
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9'
                                }}>
                                    {uploadedImages.map((img, index) => (
                                        <div key={index} className="gallery-item" title={img.name} style={{ position: 'relative' }}>
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    border: '1px solid #ddd',
                                                    backgroundColor: 'white'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-5px',
                                                    background: 'rgba(255, 0, 0, 0.8)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    zIndex: 10
                                                }}
                                                title="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- Code Templates --- */}
                <div className="form-section code-templates-section">
                    <div className="section-header">
                        <span className="section-icon">&lt;&gt;</span>
                        <h4>Code Templates (Python)</h4>
                        <button type="button" onClick={handlePreviewClick} className="run-preview-btn" disabled={loading}>
                            <span>▷</span> Run Preview
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Question Template<small>(Python script. Set `question` variable.)</small></label>
                        <textarea
                            name="question_template"
                            value={formData.question_template}
                            onChange={handleChange}
                            rows={10}
                            className="code-editor"
                            placeholder="# Import random, math... \n# Set 'question' = HTML string"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Answer Template<small>(Python script. Shared scope. Set `answer` variable.)</small></label>
                        <textarea
                            name="answer_template"
                            value={formData.answer_template}
                            onChange={handleChange}
                            rows={5}
                            className="code-editor"
                            placeholder="# Set 'answer' variable"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Solution Template<small>(Python script. Shared scope. Set `solution` variable.)</small></label>
                        <textarea
                            name="solution_template"
                            value={formData.solution_template}
                            onChange={handleChange}
                            rows={5}
                            className="code-editor"
                            placeholder="# Set 'solution' = HTML string"
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                    <button type="submit" disabled={loading} className="save-btn">
                        {loading ? 'Creating...' : 'Create Template'}
                    </button>
                </div>
            </form>
        </div>
    );
};

QuestionTemplateForm.propTypes = {
    template: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onPreview: PropTypes.func.isRequired
};

export default QuestionTemplateForm;
