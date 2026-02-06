import React from 'react';
import { Play, Clock, Star, Users, ArrowRight } from 'lucide-react';
import './CourseCarousel.css';

const courses = [
    {
        id: 1,
        title: "Math100",
        subtitle: "Complete Foundation",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
        modules: 24,
        rating: 4.8,
        students: "8.5k",
        level: "Grades 1-10",
        color: "#ea580c"
    },
    {
        id: 5,
        title: "SAT",
        subtitle: "The Art of Learning",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
        modules: 12,
        rating: 4.9,
        students: "12k+",
        level: "All Levels",
        color: "#7c3aed"
    },
    {
        id: 3,
        title: "NEET",
        subtitle: "Future Ready Skills",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
        modules: 18,
        rating: 4.9,
        students: "5k+",
        level: "Advanced",
        color: "#06b6d4"
    }
];

const CourseCarousel = ({ compact = false }) => {
    return (
        <div className={`carousel-section ${compact ? 'compact' : ''}`}>
            <div className="carousel-header container">
                <h2>Explore a Skill</h2>
                <div className="carousel-controls">
                    <span className="view-all">View All <ArrowRight size={16} /></span>
                </div>
            </div>

            <div className="carousel-container">
                <div className="carousel-track">
                    {courses.map((course) => (
                        <div key={course.id} className="course-card" style={{ '--accent-color': course.color }}>
                            <div className="card-image-wrapper">
                                <img src={course.image} alt={course.title} className="card-image" />
                                <div className="card-overlay"></div>
                                <div className="card-content">
                                    <span className="course-level">{course.level}</span>
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-subtitle">{course.subtitle}</p>

                                    {/* <div className="course-meta">
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            <span>{course.modules} Modules</span>
                                        </div>
                                        <div className="meta-item">
                                            <Star size={14} fill="currentColor" />
                                            <span>{course.rating}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={14} />
                                            <span>{course.students}</span>
                                        </div>
                                    </div> */}

                                    <div className="card-actions">
                                        <button className="btn-course-primary">
                                            <Play size={16} fill="currentColor" /> Start Learning
                                        </button>
                                        <button className="btn-course-secondary">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseCarousel;
