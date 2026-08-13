import React, { useState } from 'react';
import { Download, Twitter, Copy, Check, Sparkles, X, ExternalLink, CheckCircle2, FileImage } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportActions({ activeFormat, state }) {
  const [isCopied, setIsCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fire celebratory confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#FF007A', '#FFDF00', '#0B5A36', '#FFFFFF']
    });
  };

  // Helper to grab canvas element
  const getCanvas = () => {
    return document.querySelector('canvas');
  };

  // 1-Click High-DPI PNG Download
  const handleDownload = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filename = activeFormat === 'A'
        ? 'HH_Goa_2026_PFP_Frame.png'
        : `HH_Goa_2026_Builder_ID_${(state.name || 'Builder').replace(/\s+/g, '_')}.png`;

      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerConfetti();
      setShareStatus('✓ Image downloaded!');
      setTimeout(() => setShareStatus(''), 3000);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // 1-Click Copy Image to Clipboard
  const handleCopyImage = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        const blobPromise = new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blobPromise })
        ]);
        setIsCopied(true);
        triggerConfetti();
        setShareStatus('✓ Graphic copied to clipboard! Hit Ctrl+V to paste.');
        setTimeout(() => {
          setIsCopied(false);
          setShareStatus('');
        }, 4000);
      }
    } catch (clipErr) {
      console.warn('Clipboard write API error:', clipErr);
      setShareStatus('Copy image unsupported on this browser, download instead!');
    }
  };

  // Generate clean unique share URL for user state
  const getUniqueShareUrl = () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('format', activeFormat);
      if (state.name && state.name !== 'Satoshi Nakamoto') url.searchParams.set('name', state.name);
      if (state.builderTitle && !state.builderTitle.includes('Goa Vibe Coder')) url.searchParams.set('title', state.builderTitle);
      url.searchParams.set('v', '1');
      return url.toString();
    } catch (e) {
      return window.location.origin;
    }
  };

  // Predefined text for Twitter/X post
  const getTweetCaption = () => {
    const shareUrl = getUniqueShareUrl();

    if (activeFormat === 'A') {
      return `Just framed my PFP for HackHazards Goa 2026! 🌴🚀 See you in Goa!\n\nView my card & generate yours: ${shareUrl} #FrameInGoa #HHGoa2026`;
    } else {
      return `Excited for HackHazards Goa 2026! 🌴🚀 Here is my official Builder ID Badge:\n👤 ${state.name || 'Builder'}\n⚡ ${state.builderTitle || 'Goa Vibe Coder'}\n\nView my badge & generate yours: ${shareUrl} #FrameInGoa #HHGoa2026`;
    }
  };

  // Open X Intent
  const openXIntent = () => {
    const tweetCaption = getTweetCaption();
    const encodedText = encodeURIComponent(tweetCaption);
    const intentUrl = `https://x.com/intent/post?text=${encodedText}`;
    window.open(intentUrl, '_blank');
  };

  // Devfolio & Hackhazards Automated Share Workflow
  const handleShareToX = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    let copySuccess = false;

    // 1. Use ClipboardItem with Promise<Blob> to preserve user focus & activation
    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        const blobPromise = new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blobPromise })
        ]);
        copySuccess = true;
      }
    } catch (clipErr) {
      console.warn('Clipboard write error:', clipErr);
      // Fallback if Promise<Blob> ClipboardItem fails in older engines
      try {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          copySuccess = true;
        }
      } catch (fallbackErr) {
        console.warn('Clipboard fallback error:', fallbackErr);
      }
    }

    // 2. Open X Intent URL in new tab
    openXIntent();

    // 3. Trigger celebratory confetti & show guide modal
    triggerConfetti();
    setShareStatus(
      copySuccess
        ? '✓ Graphic copied to clipboard! Click X window & hit Ctrl+V.'
        : '✓ X Intent opened! Click "Re-copy Image" if paste needed.'
    );
    setShowModal(true);

    setTimeout(() => setShareStatus(''), 6000);
  };

  return (
    <div className="w-full max-w-[#0B5A36] space-y-3">
      {/* Toast Notification Banner */}
      {shareStatus && (
        <div className="w-full bg-[#FFDF00] text-[#121814] p-3 rounded-xl font-mono text-xs font-bold text-center border-2 border-[#121814] shadow-md animate-bounce flex items-center justify-center gap-2">
          <Sparkles size={16} className="text-[#FF007A]" />
          <span>{shareStatus}</span>
        </div>
      )}

      {/* Main Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Download PNG Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="btn-pink py-3.5 px-4 text-sm w-full shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={18} />
          <span>DOWNLOAD PNG</span>
        </button>

        {/* Share to X Button */}
        <button
          type="button"
          onClick={handleShareToX}
          className="btn-yellow py-3.5 px-4 text-sm w-full shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Twitter size={18} className="fill-current text-[#121814]" />
          <span>SHARE TO X</span>
        </button>

        {/* Copy Image Button */}
        <button
          type="button"
          onClick={handleCopyImage}
          className="btn-outline py-3.5 px-4 text-sm w-full bg-white hover:bg-[#FF007A]/10 shadow-sm"
        >
          {isCopied ? <Check size={18} className="text-[#0B5A36]" /> : <Copy size={18} />}
          <span>{isCopied ? 'COPIED!' : 'COPY GRAPHIC'}</span>
        </button>
      </div>

      <p className="text-[11px] font-mono text-center text-[#64748B]">
        ⚡ Direct X intent opening • Auto-copies image for instant <span className="text-[#FF007A] font-bold">Ctrl+V</span> paste
      </p>

      {/* Devfolio & Hackhazards Interactive Share Guidance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D2419] border-3 border-[#FFDF00] rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#FF007A] text-[#FFFDF0] relative flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#FFDF00]/30 pb-3">
              <div className="flex items-center gap-2 text-[#FFDF00] font-mono font-black text-sm tracking-wider uppercase">
                <Twitter size={20} className="fill-current" />
                <span>SHARE TO X WORKFLOW</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#64748B] hover:text-[#FF007A] transition-colors p-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Steps Container */}
            <div className="flex flex-col gap-3 font-sans text-xs">
              
              {/* Step 1 */}
              <div className="flex items-start gap-3 bg-[#07150E] p-3 rounded-xl border border-[#0B5A36]">
                <CheckCircle2 size={20} className="text-[#00FF66] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFFDF0]">Step 1: Image Copied to Clipboard</div>
                  <div className="text-[#94A3B8] text-[11px] mt-0.5">
                    Your graphic PNG has been copied to your system clipboard.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 bg-[#07150E] p-3 rounded-xl border border-[#0B5A36]">
                <ExternalLink size={20} className="text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFFDF0]">Step 2: X Composer Opened</div>
                  <div className="text-[#94A3B8] text-[11px] mt-0.5">
                    We launched X (x.com/intent/post) in a new tab with predefined text & hashtags.
                  </div>
                </div>
              </div>

              {/* Step 3 - Highlighted */}
              <div className="flex items-start gap-3 bg-[#FFDF00] text-[#121814] p-3.5 rounded-xl border-2 border-[#121814] shadow-md animate-pulse">
                <FileImage size={22} className="text-[#FF007A] shrink-0 mt-0.5" />
                <div>
                  <div className="font-black text-xs uppercase tracking-wide">Step 3: Press Ctrl + V (or Cmd + V)</div>
                  <div className="text-[#121814]/90 text-[11px] font-medium mt-0.5 leading-snug">
                    Click inside X's post text box and hit <kbd className="bg-[#121814] text-[#FFDF00] px-1.5 py-0.5 rounded font-mono font-bold">Ctrl + V</kbd> to paste your graphic directly into the tweet!
                  </div>
                </div>
              </div>

            </div>

            {/* Action buttons inside modal */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#FFDF00]/20">
              <button
                type="button"
                onClick={handleCopyImage}
                className="btn-outline py-2.5 px-3 text-xs flex-1 bg-white/10 hover:bg-white/20 text-[#FFFDF0] border-white/20"
              >
                <Copy size={14} />
                <span>Re-copy Image</span>
              </button>

              <button
                type="button"
                onClick={openXIntent}
                className="btn-yellow py-2.5 px-3 text-xs flex-1 text-[#121814]"
              >
                <ExternalLink size={14} />
                <span>Re-open X</span>
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-pink py-2.5 px-3 text-xs flex-1"
              >
                <span>GOT IT!</span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-center text-[#64748B]">
              💡 Tip: Click DOWNLOAD PNG anytime if you'd like a local copy of your badge!
            </p>

          </div>
        </div>
      )}
    </div>
  );
}

