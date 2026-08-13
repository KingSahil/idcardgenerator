import React, { useState } from 'react';
import { Download, Share2, Twitter, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportActions({ activeFormat, state }) {
  const [isCopied, setIsCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

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
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setIsCopied(true);
          triggerConfetti();
          setShareStatus('✓ Graphic copied to clipboard! Paste directly into X.');
          setTimeout(() => {
            setIsCopied(false);
            setShareStatus('');
          }, 4000);
        } catch (clipErr) {
          console.warn('Clipboard write API not supported:', clipErr);
          setShareStatus('Copy image unsupported on this browser, download instead!');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy image error:', err);
    }
  };

  // 1-Click Share on X (Twitter Intent + Native Mobile Web Share API)
  const handleShareToX = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    // First attempt copying image to clipboard for easy paste into X
    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          } catch (e) {
            // silent fallback
          }
        }

        // Try Web Share API (Mobile Safari / Chrome native share sheet with file)
        if (navigator.canShare && blob) {
          const file = new File([blob], 'HH_Goa_2026_Graphic.png', { type: 'image/png' });
          const shareData = {
            title: 'HH Goa 2026 Graphic',
            text: `Just generated my official HH Goa 2026 graphic! Ready for Goa hackathon 🌴🚀 #FrameInGoa\nGenerate yours: https://hhgoa.com`,
            files: [file]
          };

          if (navigator.canShare(shareData)) {
            try {
              await navigator.share(shareData);
              triggerConfetti();
              return;
            } catch (shareErr) {
              if (shareErr.name !== 'AbortError') {
                console.warn('Native share error, opening X intent:', shareErr);
              } else {
                return; // User cancelled share sheet
              }
            }
          }
        }

        // Fallback: Open Twitter Share Intent URL
        const tweetCaption = activeFormat === 'A'
          ? `Just updated my PFP with the official HH Goa 2026 frame! See you in Goa 🌴🚀 #FrameInGoa\n\nGenerate yours:`
          : `Excited for HH Goa 2026! Here is my official Builder ID Badge: ${state.builderTitle} 🌴🚀 #FrameInGoa\n\nGenerate yours:`;

        const encodedText = encodeURIComponent(`${tweetCaption}\nhttps://hhgoa.com`);
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;

        triggerConfetti();
        setShareStatus('✓ Image copied to clipboard! Paste it directly into your tweet.');
        window.open(intentUrl, '_blank', 'width=600,height=400');

        setTimeout(() => setShareStatus(''), 5000);
      }, 'image/png');
    } catch (err) {
      console.error('Share error:', err);
    }
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
        ⚡ Instant client-side download • Auto-includes <span className="text-[#FF007A] font-bold">#FrameInGoa</span>
      </p>
    </div>
  );
}
