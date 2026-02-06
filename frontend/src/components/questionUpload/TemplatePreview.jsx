import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import PropTypes from 'prop-types';

const MathRenderer = ({ html }) => {
    if (typeof html !== 'string') {
        console.warn("MathRenderer received non-string html:", html);
        return null;
    }

    try {
        // First, we need to decode HTML entities because the content might have been sanitized
        // For example &lt; should become < for the math parser to work correctly
        const decodeHtml = (html) => {
            const txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        };

        // We use a regex to split the content by various math delimiters
        // Supported:
        // $$ ... $$ (Display)
        // \[ ... \] (Display)
        // $ ... $ (Inline)
        // \( ... \) (Inline)

        // The regex captures the delimiter and the content
        // Note: The order matters. We check for display math first.
        const parts = html.split(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[\s\S]*?\$)/g);

        return (
            <div style={{ fontSize: 'inherit', color: 'inherit', lineHeight: '1.6' }}>
                {parts.map((part, index) => {
                    if (!part) return null;

                    // Display Mode: $$ ... $$
                    if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
                        const math = decodeHtml(part.slice(2, -2).trim());
                        try {
                            return <BlockMath key={index} math={math} errorColor={'#cc0000'} />;
                        } catch (e) {
                            console.error("Katex Block rendering error:", e);
                            return <div key={index} style={{ color: 'red' }}>Error rendering math</div>;
                        }
                    }

                    // Display Mode: \[ ... \]
                    if (part.startsWith('\\[') && part.endsWith('\\]') && part.length >= 4) {
                        const math = decodeHtml(part.slice(2, -2).trim());
                        try {
                            return <BlockMath key={index} math={math} errorColor={'#cc0000'} />;
                        } catch (e) {
                            console.error("Katex Block rendering error:", e);
                            return <div key={index} style={{ color: 'red' }}>Error rendering math</div>;
                        }
                    }

                    // Inline Mode: \( ... \)
                    if (part.startsWith('\\(') && part.endsWith('\\)') && part.length >= 4) {
                        const math = decodeHtml(part.slice(2, -2).trim());
                        try {
                            return <InlineMath key={index} math={math} errorColor={'#cc0000'} />;
                        } catch (e) {
                            console.error("Katex Inline rendering error:", e);
                            return <span key={index} style={{ color: 'red' }}>Error</span>;
                        }
                    }

                    // Inline Mode: $ ... $
                    // We need a bit of care here to not capture random $ signs (like prices) too aggressively if they aren't matching
                    // But for now, we assume if the split worked, it matched the regex which pairs them.
                    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
                        const math = decodeHtml(part.slice(1, -1).trim());
                        try {
                            return <InlineMath key={index} math={math} errorColor={'#cc0000'} />;
                        } catch (e) {
                            console.error("Katex Inline rendering error:", e);
                            // Fallback to text if it fails, assuming it wasn't math
                            return <span key={index}>{part}</span>;
                        }
                    }

                    // Regular text (HTML)
                    return (
                        <span
                            key={index}
                            dangerouslySetInnerHTML={{ __html: part }}
                        />
                    );
                })}
            </div>
        );
    } catch (err) {
        console.error("MathRenderer fatal error:", err);
        return <div dangerouslySetInnerHTML={{ __html: html }} />; // Fallback
    }
};

const TemplatePreview = ({ template, onClose }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Add error state
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        handlePreview();
    }, []);

    const handlePreview = async () => {
        setLoading(true);
        setError(null); // Clear error on retry
        try {
            const data = await api.previewQuestionTemplate(template, {});
            setPreviewData(data);
            setCurrentIndex(0);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load preview"); // Set error
        } finally {
            setLoading(false);
        }
    };

    const currentSample = previewData?.preview_samples?.[currentIndex];
    const totalSamples = previewData?.preview_samples?.length || 0;

    const isCorrectAnswer = (option, answer) => {
        if (!option || !answer) return false;
        const normalize = (str) => {
            let s = str.toString().trim();
            if (s.startsWith('$$') && s.endsWith('$$')) s = s.slice(2, -2);
            else if (s.startsWith('\\[') && s.endsWith('\\]')) s = s.slice(2, -2);
            else if (s.startsWith('\\(') && s.endsWith('\\)')) s = s.slice(2, -2);
            else if (s.startsWith('$') && s.endsWith('$')) s = s.slice(1, -1);
            return s.trim();
        };
        return normalize(option) === normalize(answer);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                width: '100%',
                maxWidth: '600px',
                overflow: 'hidden',
                animation: 'slideUp 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Sparkles size={24} color="#fff" />
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                            Question Preview
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <span style={{ fontSize: '24px', lineHeight: '1', color: '#fff' }}>&times;</span>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '32px', maxHeight: '60vh', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#64748b'
                        }}>
                            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                            <p style={{ margin: 0, fontSize: '16px' }}>Generating preview...</p>
                        </div>
                    ) : error ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#ef4444'
                        }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Preview Error</p>
                            <div style={{
                                background: '#fef2f2',
                                padding: '12px',
                                borderRadius: '8px',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                textAlign: 'left',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {error}
                            </div>
                        </div>
                    ) : currentSample ? (
                        <div>
                            {/* Question Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                                borderRadius: '16px',
                                padding: '32px',
                                marginBottom: '24px',
                                border: '1px solid #e2e8f0',
                                textAlign: 'center'
                            }}>
                                <div
                                    style={{
                                        fontSize: '32px',
                                        fontWeight: '700',
                                        color: '#1e293b',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    <MathRenderer html={currentSample.question_html} />
                                </div>
                            </div>

                            {/* MCQ Options (if present) */}
                            {(currentSample.options || currentSample.variables_used?.options) && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px', fontWeight: '600' }}>
                                        OPTIONS:
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {(currentSample.options || currentSample.variables_used.options).map((option, idx) => {
                                            const isCorrect = isCorrectAnswer(option, currentSample.answer_value);
                                            return (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        padding: '12px 20px',
                                                        background: isCorrect
                                                            ? 'linear-gradient(135deg, #10b981, #059669)'
                                                            : '#fff',
                                                        color: isCorrect
                                                            ? '#fff'
                                                            : '#334155',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}
                                                >
                                                    <span style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        borderRadius: '50%',
                                                        background: isCorrect
                                                            ? 'rgba(255,255,255,0.3)'
                                                            : '#4f46e5',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '700',
                                                        fontSize: '14px'
                                                    }}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span style={{ fontSize: '18px' }}><MathRenderer html={option.toString()} /></span>
                                                    {isCorrect && (
                                                        <span style={{ marginLeft: 'auto', fontSize: '14px' }}>✓ Correct</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Answer Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                borderRadius: '12px',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                marginBottom: '24px'
                            }}>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: '500' }}>
                                    Answer:
                                </span>
                                <span style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>
                                    <MathRenderer html={currentSample.answer_value.toString()} />
                                </span>
                            </div>

                            {/* Solution Card (if present) */}
                            {currentSample.solution_html && (
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    padding: '24px',
                                    marginTop: '24px',
                                    textAlign: 'left'
                                }}>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        marginBottom: '12px',
                                        fontWeight: '600',
                                        borderBottom: '1px solid #f1f5f9',
                                        paddingBottom: '8px'
                                    }}>
                                        SOLUTION:
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '16px',
                                            color: '#334155',
                                            lineHeight: '1.6'
                                        }}
                                    >
                                        <MathRenderer html={currentSample.solution_html} />
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            {totalSamples > 1 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    marginTop: '24px'
                                }}>
                                    <button
                                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                        disabled={currentIndex === 0}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: currentIndex === 0 ? '#e2e8f0' : '#4f46e5',
                                            color: currentIndex === 0 ? '#94a3b8' : '#fff',
                                            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        ← Previous
                                    </button>
                                    <span style={{ color: '#64748b', fontWeight: '500' }}>
                                        {currentIndex + 1} / {totalSamples}
                                    </span>
                                    <button
                                        onClick={() => setCurrentIndex(Math.min(totalSamples - 1, currentIndex + 1))}
                                        disabled={currentIndex === totalSamples - 1}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: currentIndex === totalSamples - 1 ? '#e2e8f0' : '#4f46e5',
                                            color: currentIndex === totalSamples - 1 ? '#94a3b8' : '#fff',
                                            cursor: currentIndex === totalSamples - 1 ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#94a3b8'
                        }}>
                            <p style={{ margin: 0, fontSize: '16px' }}>No preview available</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    borderTop: '1px solid #e2e8f0',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    background: '#f8fafc'
                }}>
                    <button
                        onClick={handlePreview}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: '#fff',
                            color: '#475569',
                            cursor: 'pointer',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCw size={16} />
                        Regenerate
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

TemplatePreview.propTypes = {
    template: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};

export default TemplatePreview;
