import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FormatSelector from './components/FormatSelector';
import CanvasEditor from './components/CanvasEditor';
import ControlPanel from './components/ControlPanel';
import ExportActions from './components/ExportActions';
import { getRandomTitle } from './utils/titleGenerator';
import { Info } from 'lucide-react';

export default function App() {
  const [activeFormat, setActiveFormat] = useState('A'); // 'A' (PFP) | 'B' (Builder ID)
  const [isMultiTeammate, setIsMultiTeammate] = useState(false);

  // Core Application State
  const [editorState, setEditorState] = useState({
    imageObj: null,
    imageUrl: '',
    teammates: [],
    panX: 0,
    panY: 0,
    zoom: 1,
    rotation: 0,
    filter: 'none',
    name: 'Satoshi Nakamoto',
    stack: 'Fullstack & AI',
    teamName: 'Team Antigravity',
    builderTitle: 'Goa Vibe Coder 🌴',
    badgeId: `HHGOA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    theme: 'dark_green'
  });

  // URL Query Parameter Hydration for unique share links
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlFormat = params.get('format');
      const urlName = params.get('name');
      const urlTitle = params.get('title');
      const urlStack = params.get('stack');
      const urlTeam = params.get('team');
      const urlBadgeId = params.get('badgeId');
      const urlPhoto = params.get('photo');

      if (urlFormat === 'A' || urlFormat === 'B') {
        setActiveFormat(urlFormat);
      }

      if (urlName || urlTitle || urlStack || urlTeam || urlBadgeId || urlPhoto) {
        setEditorState((prev) => ({
          ...prev,
          name: urlName || prev.name,
          builderTitle: urlTitle || prev.builderTitle,
          stack: urlStack || prev.stack,
          teamName: urlTeam || prev.teamName,
          badgeId: urlBadgeId || prev.badgeId,
          cloudPhotoUrl: urlPhoto || prev.cloudPhotoUrl
        }));

      // Unconditionally load photo (custom photo from URL or default sample avatar)
      const photoToLoad = urlPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photoToLoad;
      img.onload = () => {
        setEditorState((prev) => ({
          ...prev,
          imageObj: img
        }));
      };

        // Dynamically update document title & OpenGraph metadata
        const displayTitle = urlName
          ? `${urlName} — HH Goa 2026 ${urlFormat === 'A' ? 'PFP Frame' : 'Builder Badge'}`
          : 'HH Goa 2026 — Frame & Builder ID Card Generator';

        document.title = displayTitle;

        const ogParams = new URLSearchParams({
          format: urlFormat || 'A',
          name: urlName || 'Builder',
          title: urlTitle || 'Goa Vibe Coder 🌴',
          badgeId: urlBadgeId || 'HHGOA-2026'
        });
        const absoluteOgImage = `${window.location.origin}/api/og?${ogParams.toString()}`;

        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        if (ogTitleMeta) ogTitleMeta.setAttribute('content', displayTitle);

        const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitleMeta) twitterTitleMeta.setAttribute('content', displayTitle);

        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        if (ogImageMeta) ogImageMeta.setAttribute('content', absoluteOgImage);

        const twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
        if (twitterImageMeta) twitterImageMeta.setAttribute('content', absoluteOgImage);
      }
    } catch (e) {
      console.warn('URL parameter hydration error:', e);
    }
  }, []);

  // Photo Loaded Handler
  const handleImageLoaded = (result) => {
    setEditorState((prev) => ({
      ...prev,
      imageObj: result.img,
      imageUrl: result.url,
      panX: 0,
      panY: 0,
      zoom: 1
    }));
  };

  // Field change handler
  const handleChangeField = (field, value) => {
    setEditorState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Pan update handler
  const handleUpdatePan = (dx, dy) => {
    setEditorState((prev) => ({
      ...prev,
      panX: prev.panX + dx,
      panY: prev.panY + dy
    }));
  };

  // Reroll title handler
  const handleRerollTitle = () => {
    setEditorState((prev) => ({
      ...prev,
      builderTitle: getRandomTitle(prev.builderTitle)
    }));
  };

  // Reset pan/zoom adjustments
  const handleResetAdjustments = () => {
    setEditorState((prev) => ({
      ...prev,
      panX: 0,
      panY: 0,
      zoom: 1,
      rotation: 0,
      filter: 'none'
    }));
  };

  return (
    <div className="min-h-screen bg-[#07150E] text-[#FFFDF0] flex flex-col font-sans selection:bg-[#FF007A] selection:text-white">
      {/* Neo-brutalist Header Bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 flex flex-col items-center gap-6">
        
        {/* Format Selector Tabs */}
        <FormatSelector
          activeFormat={activeFormat}
          onSelectFormat={setActiveFormat}
          isMultiTeammate={isMultiTeammate}
          onToggleMultiTeammate={setIsMultiTeammate}
        />

        {/* Generator Panel Grid Layout matching C:\GitRepos\goa UI/UX */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Mission Control (Lg: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
            
            <div className="bg-[#0D2419] border-3 border-[#050806] p-5 rounded-2xl shadow-[6px_6px_0px_#FF007A] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-[#FFDF00] pb-2 font-mono text-xs font-bold text-[#FFDF00] tracking-wider uppercase">
                <span>MISSION CONTROL</span>
                <span className="text-[#FF007A]">01 / 01</span>
              </div>

              {/* Form Input Control Panel */}
              <ControlPanel
                activeFormat={activeFormat}
                state={editorState}
                onChangeField={handleChangeField}
                onRerollTitle={handleRerollTitle}
                onResetAdjustments={handleResetAdjustments}
              />
            </div>

          </div>

          {/* RIGHT COLUMN: Live Preview Panel (Lg: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center gap-5 order-1 lg:order-2">
            
            <div className="w-full bg-[#0D2419] border-3 border-[#050806] p-5 rounded-2xl shadow-[6px_6px_0px_#FFDF00] flex flex-col items-center">
              
              <div className="w-full flex items-center justify-between border-b-2 border-[#FFDF00] pb-3 mb-4 font-mono text-xs font-bold text-[#FFDF00] tracking-wider uppercase">
                <span className="flex items-center gap-2">
                  LIVE PREVIEW <span className="w-2.5 h-2.5 bg-[#FF007A] inline-block animate-pulse" />
                </span>
                <span className="bg-[#FFDF00] text-[#121814] px-2.5 py-0.5 rounded font-black text-[11px]">
                  {activeFormat === 'A' ? 'PFP OVERLAY (1:1)' : 'BUILDER BADGE (1200x640)'}
                </span>
              </div>

              {/* Canvas Editor with Direct Drag & Drop Photo Upload */}
              <CanvasEditor
                activeFormat={activeFormat}
                state={editorState}
                onUpdatePan={handleUpdatePan}
                onImageLoaded={handleImageLoaded}
              />

              {/* Export & Sharing Actions */}
              <div className="w-full mt-6">
                <ExportActions
                  activeFormat={activeFormat}
                  state={editorState}
                />
              </div>

            </div>

            {/* Quick Status Note */}
            <div className="w-full bg-[#07150E] border-2 border-[#FFDF00]/40 p-3 rounded-xl font-mono text-xs text-[#E2E8F0] flex items-center justify-between shadow-sm">
              <span className="flex items-center gap-2">
                <Info size={16} className="text-[#FFDF00]" />
                <span className="opacity-90">Instant 100% Client-Side Render</span>
              </span>
              <span className="text-[#FF007A] font-bold">NO LOGIN REQUIRED</span>
            </div>

          </div>
        </div>
      </main>

      {/* Neo-brutalist Footer */}
      <footer className="w-full border-t-2 border-[#FFDF00]/30 bg-[#050E09] py-6 px-4 text-center mt-12 font-mono text-xs text-[#64748B]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#FFFDF0]">
            <span className="font-bold text-[#FF007A]">HH / GOA 2026</span>
            <span>// GOA, INDIA</span>
          </div>
          <p className="text-[#FFDF00] font-bold">UPLOAD → FRAME → SHARE → SUBMIT (#FRAMEINGOA)</p>
        </div>
      </footer>
    </div>
  );
}
