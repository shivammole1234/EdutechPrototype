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
import { useThemeStore } from '@/stores/useThemeStore';
import { LiveWhiteboardStroke } from '@/types';

interface LiveWhiteboardProps {
  isInstructor: boolean;
  strokes: LiveWhiteboardStroke[];
  onAddStroke?: (stroke: LiveWhiteboardStroke) => void;
  onClear?: () => void;
}

const DARK_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Blue', value: '#60a5fa' },
  { name: 'Emerald', value: '#34d399' },
  { name: 'Amber', value: '#fbbf24' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Purple', value: '#c084fc' },
];

const LIGHT_COLORS = [
  { name: 'Black', value: '#18181b' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Purple', value: '#7c3aed' },
];

export const LiveWhiteboard: React.FC<LiveWhiteboardProps> = ({
  isInstructor,
  strokes,
  onAddStroke,
  onClear,
}) => {
  const { theme } = useThemeStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [selectedColor, setSelectedColor] = useState(theme === 'dark' ? '#60a5fa' : '#2563eb');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPointsRef = useRef<{ x: number; y: number }[]>([]);

  const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const canvasBg = theme === 'dark' ? '#09090b' : '#fafafa';
  const gridColor = theme === 'dark' ? '#18181b' : '#f4f4f5';

  // Redraw all strokes whenever strokes array updates or theme changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and fill canvas background
    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background lines
    ctx.strokeStyle = gridColor;
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
      let color = stroke.color;
      if (color === '#09090b' || color === '#fafafa') {
        color = canvasBg;
      }
      ctx.strokeStyle = color;
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
  }, [strokes, theme, canvasBg, gridColor]);

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
      ctx.strokeStyle = tool === 'eraser' ? canvasBg : selectedColor;
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
        color: tool === 'eraser' ? canvasBg : selectedColor,
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
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-sm">
      {/* Whiteboard Toolbar */}
      <div className="p-3 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="default" size="sm">
            {isInstructor ? 'Interactive Canvas (Host Broadcast)' : 'Live Faculty Whiteboard'}
          </Badge>
          <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline">Diagrams & Architecture</span>
        </div>

        {/* Tools */}
        {isInstructor && (
          <div className="flex items-center gap-2">
            {/* Tool Selection */}
            <div className="flex items-center bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-0.5">
              <button
                onClick={() => setTool('pen')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  tool === 'pen' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Pen"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTool('highlighter')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  tool === 'highlighter' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Highlighter"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  tool === 'eraser' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Color Palette */}
            {tool !== 'eraser' && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                      selectedColor === c.value ? 'scale-125 ring-2 ring-[var(--text-primary)]' : 'opacity-70 hover:opacity-100'
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
                className="p-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-rose-950/60 text-[var(--text-muted)] hover:text-rose-500 border border-[var(--border-default)] hover:border-rose-500/50 transition cursor-pointer"
                title="Clear Canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCanvas} className="bg-[var(--bg-muted)] border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Export Diagram
          </Button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 relative bg-[var(--bg-canvas)] min-h-[380px] lg:min-h-[440px]">
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
