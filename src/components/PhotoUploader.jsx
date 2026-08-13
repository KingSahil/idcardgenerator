import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { processImageFile } from '../utils/heicConverter';

export default function PhotoUploader({ onImageLoaded, hasImage, onResetImage }) {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await processImageFile(file);
      onImageLoaded(result);
    } catch (err) {
      setErrorMsg(err.message || 'Error processing photo. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

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

  return (
    <div className="w-full">
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
        className="hidden"
      />

      {/* Main Upload Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full p-5 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center relative ${
          isDragging
            ? 'border-[#FF007A] bg-[#FF007A]/10 scale-[1.01]'
            : hasImage
            ? 'border-[#0B5A36] bg-[#0B5A36]/5 hover:bg-[#0B5A36]/10'
            : 'border-[#0B5A36]/40 bg-white hover:border-[#FF007A] hover:bg-[#FF007A]/5'
        }`}
      >
        {isProcessing ? (
          <div className="py-4 flex flex-col items-center gap-2 text-[#0B5A36]">
            <Loader2 size={32} className="animate-spin text-[#FF007A]" />
            <span className="font-mono text-sm font-bold">Processing Photo (iPhone HEIC compatible)...</span>
          </div>
        ) : hasImage ? (
          <div className="py-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0B5A36] text-[#FFDF00] flex items-center justify-center font-bold">
                <ImageIcon size={20} />
              </div>
              <div className="text-left">
                <p className="font-mono text-xs font-bold text-[#0B5A36]">PHOTO UPLOADED ✓</p>
                <p className="text-xs text-[#64748B]">Click or drag to change photo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-xs font-mono font-bold text-[#FF007A] bg-[#FF007A]/10 px-3 py-1.5 rounded-lg hover:bg-[#FF007A]/20 flex items-center gap-1"
            >
              <RefreshCw size={12} /> Replace
            </button>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#FFDF00] text-[#0B5A36] flex items-center justify-center shadow-md">
              <Upload size={24} />
            </div>
            <p className="font-mono text-sm font-bold text-[#0B5A36]">
              UPLOAD YOUR PHOTO <span className="text-[#FF007A]">*</span>
            </p>
            <p className="text-xs text-[#64748B] max-w-xs">
              Supports PNG, JPG, WebP, or iPhone HEIC. Touch or drag photo here.
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="mt-2 text-xs font-mono text-[#FF007A] bg-[#FF007A]/10 p-2 rounded-lg text-center font-bold">
          ⚠️ {errorMsg}
        </p>
      )}

      {/* Quick Demo Avatars for fast testing */}
      {!hasImage && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-xs font-mono text-[#64748B]">Try sample photo:</span>
          <button
            type="button"
            onClick={() => handleSamplePhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80')}
            className="text-xs font-mono font-bold px-2 py-1 bg-white border border-[#0B5A36]/30 rounded hover:bg-[#FFDF00] text-[#0B5A36]"
          >
            Avatar A
          </button>
          <button
            type="button"
            onClick={() => handleSamplePhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80')}
            className="text-xs font-mono font-bold px-2 py-1 bg-white border border-[#0B5A36]/30 rounded hover:bg-[#FFDF00] text-[#0B5A36]"
          >
            Avatar B
          </button>
        </div>
      )}
    </div>
  );
}
