import React from 'react';
import { Dices, ZoomIn, RotateCw, SlidersHorizontal, Sparkles } from 'lucide-react';
import { STACK_SUGGESTIONS } from '../constants/titles';

export default function ControlPanel({
  activeFormat,
  state,
  onChangeField,
  onRerollTitle,
  onResetAdjustments
}) {
  const {
    name = '',
    stack = '',
    teamName = '',
    builderTitle = '',
    zoom = 1,
    rotation = 0,
    filter = 'none'
  } = state;

  const filterOptions = [
    { id: 'none', label: 'Normal' },
    { id: 'warm_sunset', label: 'Sunset 🌅' },
    { id: 'cyber_glow', label: 'Cyber ⚡' },
    { id: 'retro_film', label: 'Retro 📽️' },
    { id: 'high_contrast', label: 'Vivid 🔥' },
    { id: 'monochrome', label: 'B&W 🏁' }
  ];

  return (
    <div className="w-full glass-panel p-5 rounded-2xl border-2 border-[#0B5A36]/20 shadow-md space-y-4">
      {/* SECTION 1: FORMAT B CUSTOMIZATION FIELDS */}
      {activeFormat === 'B' && (
        <div className="space-y-3 pb-3 border-b border-[#0B5A36]/15">
          <div className="flex items-center gap-2 text-[#0B5A36] font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#FF007A]" /> Builder ID Details
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#0B5A36] mb-1">
              Your Name / Handle
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onChangeField('name', e.target.value)}
              placeholder="e.g. Satoshi Nakamoto (@satoshin)"
              className="custom-input font-bold"
              maxLength={30}
            />
          </div>

          {/* Builder Title (With Reroll Button) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-[#0B5A36]">
                Builder Class Title
              </label>
              <button
                type="button"
                onClick={onRerollTitle}
                className="text-xs font-mono font-bold text-[#FF007A] hover:text-[#E0006B] flex items-center gap-1 bg-[#FF007A]/10 px-2 py-0.5 rounded-full"
              >
                <Dices size={13} /> Reroll Title 🎲
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={builderTitle}
                onChange={(e) => onChangeField('builderTitle', e.target.value)}
                placeholder="Click reroll button!"
                className="custom-input bg-[#FF007A]/5 border-[#FF007A]/30 text-[#FF007A] font-extrabold"
              />
            </div>
          </div>

          {/* Stack & Role Field */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#0B5A36] mb-1">
              Stack / Role
            </label>
            <input
              type="text"
              value={stack}
              onChange={(e) => onChangeField('stack', e.target.value)}
              placeholder="e.g. Fullstack & Rust"
              className="custom-input"
              maxLength={40}
            />
            {/* Quick Stack Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {STACK_SUGGESTIONS.slice(0, 4).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChangeField('stack', item)}
                  className="text-[10px] font-mono bg-white hover:bg-[#FFDF00] border border-[#0B5A36]/20 px-2 py-0.5 rounded text-[#0B5A36] font-semibold transition"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Team Name Field */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#0B5A36] mb-1">
              Team / Squad Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => onChangeField('teamName', e.target.value)}
              placeholder="e.g. Team Antigravity"
              className="custom-input"
              maxLength={35}
            />
          </div>
        </div>
      )}

      {/* SECTION 2: PHOTO ADJUSTMENT CONTROLS (ZOOM & ROTATION) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0B5A36] uppercase">
            <SlidersHorizontal size={14} className="text-[#FF007A]" /> Photo Adjustments
          </span>
          <button
            type="button"
            onClick={onResetAdjustments}
            className="text-[11px] font-mono text-[#64748B] hover:text-[#0B5A36] underline"
          >
            Reset position
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-3">
          <ZoomIn size={16} className="text-[#0B5A36]" />
          <span className="text-xs font-mono text-[#0B5A36] w-12 font-bold">Zoom:</span>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={zoom}
            onChange={(e) => onChangeField('zoom', parseFloat(e.target.value))}
            className="w-full accent-[#FF007A]"
          />
          <span className="text-xs font-mono text-[#0B5A36] w-10 text-right font-bold">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-[#0B5A36] font-bold flex items-center gap-1">
            <RotateCw size={14} /> Rotate:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeField('rotation', (rotation - 90) % 360)}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-white border border-[#0B5A36]/30 rounded-lg hover:bg-[#FFDF00]"
            >
              ↺ -90°
            </button>
            <button
              type="button"
              onClick={() => onChangeField('rotation', 0)}
              className="px-2 py-1 text-xs font-mono font-bold bg-white border border-[#0B5A36]/30 rounded-lg hover:bg-[#FFDF00]"
            >
              0°
            </button>
            <button
              type="button"
              onClick={() => onChangeField('rotation', (rotation + 90) % 360)}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-white border border-[#0B5A36]/30 rounded-lg hover:bg-[#FFDF00]"
            >
              ↻ +90°
            </button>
          </div>
        </div>

        {/* Drag Hint */}
        <p className="text-[11px] font-mono text-center text-[#64748B] bg-[#0B5A36]/5 py-1 rounded">
          💡 Touch/click and drag photo on canvas to reposition off-center faces
        </p>
      </div>

      {/* SECTION 3: PHOTO FILTERS */}
      <div className="pt-2 border-t border-[#0B5A36]/15">
        <label className="block text-xs font-mono font-bold text-[#0B5A36] mb-2">
          Color Filter Preset
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChangeField('filter', f.id)}
              className={`py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-[#0B5A36] text-[#FFDF00] shadow-sm'
                  : 'bg-white text-[#0B5A36] border border-[#0B5A36]/20 hover:bg-[#FFDF00]/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
