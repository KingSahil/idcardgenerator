import React, { useRef, useEffect, useState } from 'react';
import { renderFormatA } from './FormatAOverlay';
import { renderFormatB } from './FormatBBadge';
import { ensureFontsLoaded } from '../utils/fontLoader';

export default function CanvasEditor({ activeFormat, state, onUpdatePan }) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Native render resolution: High DPI for crystal clear export
  const canvasWidth = activeFormat === 'A' ? 1080 : 1200;
  const canvasHeight = activeFormat === 'A' ? 1080 : 640;

  // Re-render canvas whenever state or active format changes
  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = async () => {
      await ensureFontsLoaded();
      if (!isMounted) return;

      if (activeFormat === 'A') {
        renderFormatA(ctx, canvasWidth, canvasHeight, state);
      } else {
        renderFormatB(ctx, canvasWidth, canvasHeight, state);
      }
    };

    draw();

    return () => {
      isMounted = false;
    };
  }, [activeFormat, state, canvasWidth, canvasHeight]);

  // Touch & Mouse Drag Pan Listeners for photo repositioning
  const handlePointerDown = (e) => {
    if (!state.imageObj) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !state.imageObj) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    dragStartRef.current = { x: clientX, y: clientY };
    onUpdatePan(dx * 1.5, dy * 1.5);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Canvas Viewport Box */}
      <div
        className={`relative w-full max-w-lg aspect-square sm:aspect-auto rounded-2xl overflow-hidden shadow-2xl border-4 transition-all duration-300 ${
          isDragging
            ? 'border-[#FF007A] cursor-grabbing scale-[0.99]'
            : 'border-[#0B5A36] cursor-grab hover:border-[#FFDF00]'
        }`}
        style={{
          aspectRatio: activeFormat === 'A' ? '1 / 1' : '1200 / 640'
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="w-full h-full object-contain block bg-[#FFFDF0]"
        />
      </div>

      {/* Touch/Mouse Drag Helper Pill - Placed OUTSIDE the canvas frame so it never overlaps exports */}
      {state.imageObj && (
        <div className="mt-3 bg-[#0B5A36] text-[#FFDF00] px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-[#FFDF00]/40 shadow-sm flex items-center gap-1.5">
          🖐️ Touch/Click and drag photo on canvas to reposition
        </div>
      )}

      <p className="mt-2 text-[11px] font-mono text-[#64748B]">
        Canvas Output: {canvasWidth}x{canvasHeight}px • 100% Client-Side
      </p>
    </div>
  );
}
