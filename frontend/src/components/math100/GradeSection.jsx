import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GradeSection.css';

const gradeCategories = [
    {
        title: 'EARLY LEARNERS',
        grades: [
            { id: '1', label: 'Grade 1', color: '#22d3ee' }, // Cyan-400
            { id: '2', label: 'Grade 2', color: '#06b6d4' }, // Cyan-500
            { id: '3', label: 'Grade 3', color: '#0891b2' }, // Cyan-600
        ]
    },
    {
        title: 'JUNIOR',
        grades: [
            { id: '4', label: 'Grade 4', color: '#34d399' }, // Emerald-400
            { id: '5', label: 'Grade 5', color: '#10b981' }, // Emerald-500
            { id: '6', label: 'Grade 6', color: '#059669' }, // Emerald-600
        ]
    },
    {
        title: 'MIDDLE SCHOOL',
        grades: [
            { id: '7', label: 'Grade 7', color: '#60a5fa' }, // Blue-400
            { id: '8', label: 'Grade 8', color: '#3b82f6' }, // Blue-500
            { id: '9', label: 'Grade 9', color: '#2563eb' }, // Blue-600
        ]
    },
    {
        title: 'HIGH SCHOOL',
        grades: [
            { id: '10', label: 'Grade 10', color: '#818cf8' }, // Indigo-400
            { id: '11', label: 'Grade 11', color: '#6366f1' }, // Indigo-500
            { id: '12', label: 'Grade 12', color: '#4f46e5' }, // Indigo-600
        ]
    }
];

const GradeSection = () => {
    const navigate = useNavigate();

    return (
        <section className="grade-section container">
            <div className="grade-categories-grid">
                {gradeCategories.map((category, index) => (
                    <div key={index} className="grade-category-column">
                        <h3 className="category-title">{category.title}</h3>
                        <div className="category-header-card">
                            <span className="sc-header-text">Grade {category.grades[0].label.split(' ')[1]}–{category.grades[category.grades.length - 1].label.split(' ')[1]}</span>
                        </div>
                        <div className="category-grades-list">
                            {category.grades.map((grade, gIndex) => (
                                <div
                                    key={grade.id}
                                    className="grade-item-card"
                                    style={{
                                        '--hover-color': grade.color
                                    }}
                                    onClick={() => navigate(`/math/grade/${grade.id}`)}
                                >
                                    <span className="grade-text">{grade.label}</span>
                                    {/* Arrow icon could be added here */}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GradeSection;
