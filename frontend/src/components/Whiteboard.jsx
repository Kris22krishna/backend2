import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pen, Trash2, X } from 'lucide-react';
import './Whiteboard.css';

const Whiteboard = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#1e293b');
    const [tool, setTool] = useState('pen'); // pen, eraser
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Handle resize using ResizeObserver for better accuracy
        const handleResize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                // Get the actual size of the container
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
                // Restore context settings after resize
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        };

        // Use ResizeObserver for dynamic size tracking
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        // Initial size with slight delay to ensure DOM is ready
        setTimeout(handleResize, 100);

        return () => resizeObserver.disconnect();
    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    if (!isOpen) return null;

    return (
        <div className="whiteboard-panel">
            <div className="whiteboard-header">
                <h3><Pen size={18} /> Scratchpad</h3>
            </div>

            <div className="wb-controls">
                <div className="tool-group">
                    <button
                        className={`wb-btn ${tool === 'pen' ? 'active' : ''}`}
                        onClick={() => setTool('pen')}
                        title="Pen"
                    >
                        <Pen size={16} />
                        <span>Pen</span>
                    </button>
                    <button
                        className={`wb-btn ${tool === 'eraser' ? 'active' : ''}`}
                        onClick={() => setTool('eraser')}
                        title="Eraser"
                    >
                        <Eraser size={16} />
                        <span>Eraser</span>
                    </button>
                    <button className="wb-btn delete" onClick={clearCanvas} title="Clear All">
                        <Trash2 size={16} />
                        <span>Clear</span>
                    </button>
                </div>

                <div className="color-group">
                    {['#1e293b', '#ef4444', '#3b82f6', '#10b981'].map(c => (
                        <button
                            key={c}
                            className={`color-btn ${color === c && tool === 'pen' ? 'selected' : ''}`}
                            style={{ background: c }}
                            onClick={() => { setColor(c); setTool('pen'); }}
                        />
                    ))}
                </div>
            </div>

            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
                    }}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        draw({ clientX: touch.clientX, clientY: touch.clientY });
                    }}
                    onTouchEnd={stopDrawing}
                />
            </div>

            <div className="wb-bg-hint">Work out your answer here</div>
        </div>
    );
};

export default Whiteboard;
