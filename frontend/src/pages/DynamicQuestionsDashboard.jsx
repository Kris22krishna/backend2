import { useState, useEffect } from 'react';
import UploaderManagement from '../components/admin/UploaderManagement';
import QuestionTemplatesList from '../components/questionUpload/QuestionTemplatesList';
import QuestionTemplateForm from '../components/questionUpload/QuestionTemplateForm';
import TemplatePreview from '../components/questionUpload/TemplatePreview';
import GeneratedQuestionsList from '../components/questionUpload/GeneratedQuestionsList';
import TopicArrangement from '../components/questionUpload/TopicArrangement';
import SEO from '../components/common/SEO';
import { api } from '../services/api';
import '../styles/DynamicQuestionsDashboard.css';

const DynamicQuestionsDashboard = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(api.isAuthenticated());
    const [authLoading, setAuthLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        username: 'admin@learners.com',
        password: 'admin123'
    });

    // Dashboard State
    const userType = localStorage.getItem('userType');
    const [activeTab, setActiveTab] = useState('overview');
    const [viewMode, setViewMode] = useState('list');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);
    // Add state for created uploader
    const [createdUploader, setCreatedUploader] = useState(null);

    // --- Auth Handlers ---

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            await api.login(credentials.username, credentials.password);
            setIsAuthenticated(true);
        } catch (err) {
            alert('Login failed: ' + err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        api.logout();
        setIsAuthenticated(false);
    };

    // --- Uploader Management Handlers ---
    const handleCreateUploader = async (name) => {
        try {
            const data = await api.createUploader(name);
            setCreatedUploader(data);
        } catch (error) {
            alert('Error creating uploader: ' + error.message);
        }
    };

    // --- Navigation Items ---
    const allNavItems = [
        { id: 'overview', label: 'Overview', icon: '📊', roles: ['admin'] },
        { id: 'uploaders', label: 'User Management', icon: '👥', roles: ['admin'] },
        {
            id: 'generation', label: 'Question Generation', icon: '⚡', roles: ['admin'], children: [
                { id: 'templates', label: 'Templates', icon: '📝' },
                { id: 'arrange', label: 'Arrangement', icon: '🔢' },
                { id: 'questions', label: 'Generated Questions', icon: '❓' }
            ]
        }
    ];

    const navItems = allNavItems;

    // Add state for stats
    const [totalTemplates, setTotalTemplates] = useState(null);

    // Fetch stats when overview is active
    useEffect(() => {
        if (activeTab === 'overview' && isAuthenticated) {
            const fetchStats = async () => {
                try {
                    // Fetch just 1 to get the total count in metadata
                    const data = await api.getQuestionTemplates({ limit: 1 });
                    if (data && typeof data.total !== 'undefined') {
                        setTotalTemplates(data.total);
                    }
                } catch (err) {
                    console.error("Failed to fetch template stats:", err);
                }
            };
            fetchStats();
        }
    }, [activeTab, isAuthenticated]);


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

    // ... (existing helper functions)

    if (!isAuthenticated) {
        // ... (login form)
        return (
            <div className="login-container">
                <SEO title="Admin Login - skill100.AI" />
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="brand-title">skill100.AI</h1>
                        <p className="login-subtitle">Admin Portal Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="form-grid" style={{ gap: '20px' }}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={credentials.username}
                                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                required
                                placeholder="admin@learners.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" disabled={authLoading} className="save-btn" style={{ width: '100%', marginTop: '10px' }}>
                            {authLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <SEO title="Admin Dashboard - Learner's Hub" description="Admin control panel" />

            {/* Sidebar */}
            <aside className="admin-sidebar">
                {/* ... (sidebar content) */}
                <div className="sidebar-header">
                    <h1 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(to right, #818cf8, #f472b6)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        skill100.AI
                    </h1>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <div key={item.id} className="nav-group">
                            {item.children ? (
                                <>
                                    <div className="nav-group-label">{item.icon} {item.label}</div>
                                    <div className="nav-group-children">
                                        {item.children.map(child => (
                                            <button
                                                key={child.id}
                                                className={`nav-item ${activeTab === child.id ? 'active' : ''}`}
                                                onClick={() => setActiveTab(child.id)}
                                            >
                                                <span className="nav-icon">{child.icon}</span>
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <button
                                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    {item.label}
                                </button>
                            )}
                        </div>
                    ))}
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
                    <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                    <div className="user-profile">
                        <span className="user-info">Admin</span>
                        <div className="avatar-placeholder">A</div>
                    </div>
                </header>

                <div className="admin-content-area">
                    {activeTab === 'overview' && (
                        <div className="overview-container">
                            {/* ... (existing overview) */}
                            <div className="stat-card">
                                <h3>Total Templates</h3>
                                <p className="stat-value">{totalTemplates !== null ? totalTemplates : '--'}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Recent Activity</h3>
                                <p>System functioning normally.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'uploaders' && (
                        <UploaderManagement
                            onCreateUploader={handleCreateUploader}
                            createdUploader={createdUploader}
                        />
                    )}

                    {activeTab === 'templates' && (
                        <>
                            {viewMode === 'list' && (
                                <QuestionTemplatesList
                                    onEdit={handleEditTemplate}
                                    onPreview={handlePreviewTemplate}
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
    );
};

export default DynamicQuestionsDashboard;
