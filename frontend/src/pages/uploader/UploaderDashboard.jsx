import { useState, useEffect } from 'react';
import QuestionTemplatesList from '../../components/questionUpload/QuestionTemplatesList';
import QuestionTemplateForm from '../../components/questionUpload/QuestionTemplateForm';
import TemplatePreview from '../../components/questionUpload/TemplatePreview';
import GeneratedQuestionsList from '../../components/questionUpload/GeneratedQuestionsList';
import TopicArrangement from '../../components/questionUpload/TopicArrangement';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/Navbar';
import { api } from '../../services/api';
import '../../styles/DynamicQuestionsDashboard.css'; // Reusing existing styles

const UploaderDashboard = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(api.isAuthenticated());
    const userType = localStorage.getItem('userType');

    // Dashboard State
    const [activeTab, setActiveTab] = useState('templates');
    const [viewMode, setViewMode] = useState('list');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);

    // Redirect if not uploader or not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = '/uploader-login';
        } else if (userType !== 'uploader') {
            // If admin tries to access, maybe let them? Or redirect to admin dashboard. 
            // For now, strict separation.
            window.location.href = '/admin';
        }
    }, [isAuthenticated, userType]);


    const handleLogout = () => {
        api.logout();
        setIsAuthenticated(false);
        window.location.href = '/uploader-login';
    };

    // --- Template Handlers ---
    const handleEditTemplate = (template) => {
        setSelectedTemplate(template);
        setViewMode('edit');
    };

    const handleCreateTemplate = () => {
        setSelectedTemplate(null);
        setViewMode('create');
    };

    const handleSaveTemplate = async (data) => {
        try {
            if (selectedTemplate) {
                await api.updateQuestionTemplate(selectedTemplate.template_id, data);
            } else {
                await api.createQuestionTemplate(data);
            }
            setViewMode('list');
            setSelectedTemplate(null);
        } catch (error) {
            alert('Error saving template: ' + error.message);
        }
    };

    const handleCancelEdit = () => {
        setViewMode('list');
        setSelectedTemplate(null);
    };

    const handlePreviewTemplate = (template) => {
        setPreviewTemplate(template);
    };

    const handleClosePreview = () => {
        setPreviewTemplate(null);
    };

    // --- Navigation Items ---
    const navItems = [
        { id: 'templates', label: 'Templates', icon: '📝' },
        { id: 'arrange', label: 'Arrangement', icon: '🔢' },
        { id: 'questions', label: 'Questions', icon: '❓' }
    ];

    if (!isAuthenticated) return null; // Or loading spinner

    return (
        <>
            <Navbar />
            <div className="admin-layout" style={{ paddingTop: '80px' }}>
                <SEO title="Uploader Dashboard - Learner's Hub" description="Question Upload Panel" />

                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="sidebar-header">
                        <h1 style={{
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            background: 'linear-gradient(to right, #818cf8, #f472b6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            skill100.AI
                        </h1>
                    </div>
                    <nav className="sidebar-nav">
                        <div className="nav-group">
                            <div className="nav-group-label">Question Generation</div>
                            <div className="nav-group-children">
                                {navItems.map(item => (
                                    <button
                                        key={item.id}
                                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="logout-btn">
                            <span className="nav-icon">🚪</span> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <header className="admin-header">
                        <h3>{navItems.find(i => i.id === activeTab)?.label}</h3>
                        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="user-info" style={{ fontWeight: 'bold' }}>
                                {localStorage.getItem('userName') || 'Uploader'}
                            </div>
                            <div className="avatar-placeholder" style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: '#3498db', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px'
                            }}>
                                {(localStorage.getItem('userName') || 'U')[0].toUpperCase()}
                            </div>
                        </div>
                    </header>

                    <div className="admin-content-area">
                        {activeTab === 'templates' && (
                            <>
                                {viewMode === 'list' && (
                                    <QuestionTemplatesList
                                        onEdit={handleEditTemplate}
                                        onPreview={handlePreviewTemplate}
                                        onCreate={handleCreateTemplate} // Pass create handler if list has button
                                    />
                                )}
                                {(viewMode === 'create' || viewMode === 'edit') && (
                                    <QuestionTemplateForm
                                        template={selectedTemplate}
                                        onSave={handleSaveTemplate}
                                        onCancel={handleCancelEdit}
                                        onPreview={handlePreviewTemplate}
                                    />
                                )}
                            </>
                        )}

                        {activeTab === 'arrange' && (
                            <TopicArrangement />
                        )}

                        {activeTab === 'questions' && (
                            <GeneratedQuestionsList jobId={selectedJobId} />
                        )}
                    </div>
                </main>

                {previewTemplate && (
                    <TemplatePreview
                        template={previewTemplate}
                        onClose={handleClosePreview}
                    />
                )}
            </div>
        </>
    );
};

export default UploaderDashboard;
