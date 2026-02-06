import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Pen, MousePointer } from 'lucide-react';

interface DrawingBoardProps {
  isOpen: boolean;
  onClose: () => void;
  color?: string;
}

export const DrawingBoard: React.FC<DrawingBoardProps> = ({ isOpen, onClose, color = '#31326F' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 300; // Fixed height for the panel
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
      }
    }
  }, [isOpen, color]); // Resize when opened

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;

    if (tool === 'eraser') {
      ctx.clearRect(x - 10, y - 10, 20, 20);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-xl z-50 rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
        <div className="flex gap-2">
            <button 
                onClick={() => setTool('pen')}
                className={`p-2 rounded hover:bg-gray-200 ${tool === 'pen' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                title="Pen"
            >
                <Pen size={18} />
            </button>
            <button 
                onClick={() => setTool('eraser')}
                className={`p-2 rounded hover:bg-gray-200 ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                title="Eraser"
            >
                <Eraser size={18} />
            </button>
            <button 
                onClick={clearCanvas}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
                Clear
            </button>
        </div>
        <span className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Scratchpad</span>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="w-full h-[300px] cursor-crosshair touch-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
