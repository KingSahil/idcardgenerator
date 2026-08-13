import React, { useState } from 'react';
import Header from './components/Header';
import FormatSelector from './components/FormatSelector';
import PhotoUploader from './components/PhotoUploader';
import CanvasEditor from './components/CanvasEditor';
import ControlPanel from './components/ControlPanel';
import ExportActions from './components/ExportActions';
import { getRandomTitle } from './utils/titleGenerator';
import { Sparkles, Info } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col font-sans selection:bg-[#FF007A] selection:text-white">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col items-center gap-6">
        
        {/* Format Selector Tabs */}
        <FormatSelector
          activeFormat={activeFormat}
          onSelectFormat={setActiveFormat}
          isMultiTeammate={isMultiTeammate}
          onToggleMultiTeammate={setIsMultiTeammate}
        />

        {/* Studio Grid Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Form Inputs (Lg: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5 order-2 lg:order-1">
            {/* Step 1: Photo Uploader */}
            <PhotoUploader
              onImageLoaded={handleImageLoaded}
              hasImage={!!editorState.imageObj}
            />

            {/* Step 2: Controls & Form Input Panel */}
            <ControlPanel
              activeFormat={activeFormat}
              state={editorState}
              onChangeField={handleChangeField}
              onRerollTitle={handleRerollTitle}
              onResetAdjustments={handleResetAdjustments}
            />
          </div>

          {/* RIGHT COLUMN: Real-Time Interactive Canvas Preview & Export Actions (Lg: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center gap-5 order-1 lg:order-2">
            
            {/* Canvas Viewport */}
            <div className="w-full glass-panel p-4 sm:p-6 rounded-3xl border-2 border-[#0B5A36]/30 shadow-xl flex flex-col items-center">
              
              <div className="w-full flex items-center justify-between mb-3 text-xs font-mono font-bold text-[#0B5A36]">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#FF007A]" /> LIVE GRAPHIC PREVIEW
                </span>
                <span className="bg-[#FFDF00] text-[#121814] px-2 py-0.5 rounded border border-[#121814]">
                  {activeFormat === 'A' ? 'PFP OVERLAY (1:1)' : 'BUILDER BADGE (16:9)'}
                </span>
              </div>

              {/* Canvas Editor */}
              <CanvasEditor
                activeFormat={activeFormat}
                state={editorState}
                onUpdatePan={handleUpdatePan}
              />

              {/* Export & Sharing Actions */}
              <div className="w-full mt-6">
                <ExportActions
                  activeFormat={activeFormat}
                  state={editorState}
                />
              </div>
            </div>

            {/* Event Instructions / Tips Box */}
            <div className="w-full bg-[#0B5A36] text-[#FFFDF0] p-4 rounded-2xl border-2 border-[#FFDF00] shadow-md flex items-start gap-3">
              <Info size={20} className="text-[#FFDF00] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-mono font-bold text-[#FFDF00] uppercase">
                  How to Submit for #FrameInGoa:
                </p>
                <p className="opacity-90">
                  1. Click <strong className="text-[#FFDF00]">DOWNLOAD PNG</strong> or <strong className="text-[#FF007A]">SHARE TO X</strong>.
                </p>
                <p className="opacity-90">
                  2. Post on X with your generated graphic & hashtag <strong className="text-[#FFDF00]">#FrameInGoa</strong> to get featured on the HH Goa Radar!
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#0B5A36]/20 bg-[#F7F3DC] py-6 px-4 text-center mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#0B5A36]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#FF007A]">HACKER HOUSE GOA 2026</span>
            <span>• 28-31 OCT 2026</span>
          </div>
          <p className="opacity-75">Designed & Built for HH Goa Hackathon • #FrameInGoa</p>
        </div>
      </footer>
    </div>
  );
}
