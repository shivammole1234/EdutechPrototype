import React, { useEffect, useRef, useState } from 'react';
import {
  Pencil,
  Highlighter,
  Eraser,
  Trash2,
  Download,
  Palette,
  Undo,
  Circle,
  Square,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LiveWhiteboardStroke } from '@/types';

interface LiveWhiteboardProps {
  isInstructor: boolean;
  strokes: LiveWhiteboardStroke[];
  onAddStroke?: (stroke: LiveWhiteboardStroke) => void;
  onClear?: () => void;
}

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Blue', value: '#60a5fa' },
  { name: 'Emerald', value: '#34d399' },
  { name: 'Amber', value: '#fbbf24' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Purple', value: '#c084fc' },
];

export const LiveWhiteboard: React.FC<LiveWhiteboardProps> = ({
  isInstructor,
  strokes,
  onAddStroke,
  onClear,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [selectedColor, setSelectedColor] = useState('#60a5fa');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Redraw all strokes whenever strokes array updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and fill dark canvas background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background lines
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Render each saved stroke
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (stroke.tool === 'highlighter') {
        ctx.globalAlpha = 0.35;
      } else {
        ctx.globalAlpha = 1.0;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    });
  }, [strokes]);

  // Adjust canvas resolution on mount / resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = rect.height || 500;
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isInstructor) return;
    setIsDrawing(true);
    const pt = getCoordinates(e);
    currentPointsRef.current = [pt];
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isInstructor) return;
    const pt = getCoordinates(e);
    currentPointsRef.current.push(pt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pts = currentPointsRef.current;
    if (pts.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = tool === 'eraser' ? '#09090b' : selectedColor;
      ctx.lineWidth = tool === 'eraser' ? strokeWidth * 4 : strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1.0;

      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  };

  const stopDrawing = () => {
    if (!isDrawing || !isInstructor) return;
    setIsDrawing(false);

    if (currentPointsRef.current.length > 1 && onAddStroke) {
      onAddStroke({
        points: [...currentPointsRef.current],
        color: tool === 'eraser' ? '#09090b' : selectedColor,
        width: tool === 'eraser' ? strokeWidth * 4 : strokeWidth,
        tool,
      });
    }
    currentPointsRef.current = [];
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiteboard_diagram_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Whiteboard Toolbar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            {isInstructor ? 'Interactive Canvas (Host Broadcast)' : 'Live Faculty Whiteboard'}
          </Badge>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Diagrams & Architecture</span>
        </div>

        {/* Tools */}
        {isInstructor && (
          <div className="flex items-center gap-2">
            {/* Tool Selection */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setTool('pen')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  tool === 'pen' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Pen"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTool('highlighter')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  tool === 'highlighter' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Highlighter"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Color Palette */}
            {tool !== 'eraser' && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                      selectedColor === c.value ? 'scale-125 ring-2 ring-blue-400' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            )}

            {/* Clear button */}
            {onClear && (
              <button
                onClick={onClear}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-700 transition cursor-pointer"
                title="Clear Canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCanvas} className="bg-slate-900 border-slate-700 text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Export Diagram
          </Button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 relative bg-[#09090b] min-h-[380px] lg:min-h-[440px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`w-full h-full block ${isInstructor ? 'cursor-crosshair' : 'cursor-default'}`}
        />
      </div>
    </div>
  );
};
