import React, { useRef, useEffect, useState } from 'react';
import { renderFormatA } from './FormatAOverlay';
import { renderFormatB } from './FormatBBadge';
import { ensureFontsLoaded } from '../utils/fontLoader';
import { processImageFile } from '../utils/heicConverter';
import { Upload, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function CanvasEditor({ activeFormat, state, onUpdatePan, onImageLoaded }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

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

  // Handle File Selection & Background Cloud Sync
  const handleFile = async (file) => {
    if (!file) return;
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await processImageFile(file);
      onImageLoaded(result);

      // Background upload photo to Catbox.moe for shareable URL photo parameter
      try {
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', file, `photo-${Date.now()}.${file.name.split('.').pop() || 'png'}`);
        const uploadRes = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const cloudUrl = await uploadRes.text();
          if (cloudUrl && cloudUrl.trim().startsWith('https://')) {
            onImageLoaded({ ...result, cloudPhotoUrl: cloudUrl.trim() });
          }
        }
      } catch (cloudErr) {
        console.warn('Background photo upload warning:', cloudErr);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error processing photo. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag-and-drop file listeners for desktop image drag onto canvas
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      setIsDraggingFile(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Sample photo generator for quick 1-click testing
  const handleSamplePhoto = async (url) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        onImageLoaded({ img, url, width: img.naturalWidth, height: img.naturalHeight });
        setIsProcessing(false);
      };
      img.onerror = () => {
        setErrorMsg('Failed to load sample photo.');
        setIsProcessing(false);
      };
      img.src = url;
    } catch (err) {
      setIsProcessing(false);
    }
  };

  // Touch & Mouse Drag Pan Listeners for photo repositioning
  const handlePointerDown = (e) => {
    if (!state.imageObj) return;
    setIsDraggingPan(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingPan || !state.imageObj) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    dragStartRef.current = { x: clientX, y: clientY };
    onUpdatePan(dx * 1.5, dy * 1.5);
  };

  const handlePointerUp = () => {
    setIsDraggingPan(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
        className="hidden"
      />

      {/* Canvas Viewport Box with File Drag & Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !state.imageObj && fileInputRef.current?.click()}
        className={`relative w-full max-w-lg aspect-square sm:aspect-auto rounded-2xl overflow-hidden shadow-2xl border-4 transition-all duration-300 ${
          isDraggingFile
            ? 'border-[#FF007A] shadow-[0_0_30px_rgba(255,0,122,0.8)] scale-[1.01]'
            : isDraggingPan
            ? 'border-[#FF007A] cursor-grabbing scale-[0.99]'
            : state.imageObj
            ? 'border-[#0B5A36] cursor-grab hover:border-[#FFDF00]'
            : 'border-[#FFDF00] border-dashed hover:border-[#FF007A] cursor-pointer'
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

        {/* Visual Drag Feedback Overlay when dragging file over canvas */}
        {isDraggingFile && (
          <div className="absolute inset-0 bg-[#07150E]/85 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-3 p-4 border-4 border-dashed border-[#FF007A] animate-pulse pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[#FFDF00] text-[#121814] flex items-center justify-center shadow-lg border-2 border-[#121814]">
              <Upload size={32} />
            </div>
            <p className="font-mono text-sm font-black text-[#FFDF00] tracking-wider uppercase">
              RELEASE TO DROP PHOTO 📸
            </p>
            <p className="text-xs font-mono text-[#FFFDF0]">
              PNG, JPG, WebP or iPhone HEIC supported
            </p>
          </div>
        )}

        {/* Processing Indicator Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-[#07150E]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-3 p-4 text-[#FFDF00]">
            <Loader2 size={36} className="animate-spin text-[#FF007A]" />
            <span className="font-mono text-xs font-bold text-center">Processing Photo (iPhone HEIC compatible)...</span>
          </div>
        )}

        {/* Top-Right Change Photo Hover Badge when photo is present */}
        {state.imageObj && !isDraggingFile && !isProcessing && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute top-3 right-3 bg-[#121814]/90 hover:bg-[#FF007A] text-[#FFFDF0] px-3 py-1.5 rounded-xl font-mono text-xs font-bold border border-[#FFDF00]/50 shadow-md transition-all flex items-center gap-1.5 z-20 backdrop-blur-sm active:scale-95"
          >
            <RefreshCw size={13} />
            <span>Change Photo</span>
          </button>
        )}
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <p className="mt-2 text-xs font-mono text-[#FF007A] bg-[#FF007A]/10 p-2 rounded-lg text-center font-bold border border-[#FF007A]/30">
          ⚠️ {errorMsg}
        </p>
      )}

      {/* Touch/Mouse Drag Helper Pill when photo loaded */}
      {state.imageObj && (
        <div className="mt-3 bg-[#0B5A36] text-[#FFDF00] px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-[#FFDF00]/40 shadow-sm flex items-center gap-1.5">
          🖐️ Touch/Click & drag photo on canvas to reposition
        </div>
      )}

      {/* Quick Sample Avatars */}
      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-[#64748B]">Try sample photo:</span>
        <button
          type="button"
          onClick={() => handleSamplePhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80')}
          className="text-xs font-mono font-bold px-2.5 py-1 bg-[#0D2419] border border-[#FFDF00]/30 rounded-lg hover:bg-[#FFDF00] hover:text-[#121814] text-[#FFDF00] transition-colors"
        >
          Avatar A
        </button>
        <button
          type="button"
          onClick={() => handleSamplePhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80')}
          className="text-xs font-mono font-bold px-2.5 py-1 bg-[#0D2419] border border-[#FFDF00]/30 rounded-lg hover:bg-[#FFDF00] hover:text-[#121814] text-[#FFDF00] transition-colors"
        >
          Avatar B
        </button>
      </div>

      <p className="mt-2 text-[11px] font-mono text-[#64748B]">
        Canvas Output: {canvasWidth}x{canvasHeight}px • 100% Client-Side
      </p>
    </div>
  );
}

