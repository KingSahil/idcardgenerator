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
    <div className="w-full bg-[#07150E] p-4 rounded-xl border border-[#FFDF00]/30 space-y-4">
      {/* SECTION 1: FORMAT B CUSTOMIZATION FIELDS WITH STRICT LIMITS */}
      {activeFormat === 'B' && (
        <div className="space-y-3 pb-3 border-b border-[#FFDF00]/20">
          <div className="flex items-center gap-2 text-[#FFDF00] font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#FF007A]" /> Builder ID Inputs (Strictly Bounded)
          </div>

          {/* Name Field (Max 25 chars) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-[#FFFDF0]">
                Your Name / Handle
              </label>
              <span className="text-[10px] font-mono text-[#FFDF00]">
                {name.length}/25
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => onChangeField('name', e.target.value)}
              placeholder="e.g. Satoshi Nakamoto (@satoshin)"
              className="custom-input font-bold"
              maxLength={25}
            />
          </div>

          {/* Builder Title (With Reroll Button - Max 35 chars) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-[#FFFDF0]">
                Builder Class Title
              </label>
              <button
                type="button"
                onClick={onRerollTitle}
                className="text-xs font-mono font-bold text-[#FFDF00] hover:text-[#FF007A] flex items-center gap-1 bg-[#FF007A]/20 hover:bg-[#FF007A]/40 px-2 py-0.5 rounded-full border border-[#FF007A]"
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
                className="custom-input bg-[#FF007A]/10 border-[#FF007A] text-[#FFDF00] font-extrabold"
                maxLength={35}
              />
            </div>
          </div>

          {/* Stack & Role Field (Max 30 chars) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-[#FFFDF0]">
                Tech Stack / Role
              </label>
              <span className="text-[10px] font-mono text-[#FFDF00]">
                {stack.length}/30
              </span>
            </div>
            <input
              type="text"
              value={stack}
              onChange={(e) => onChangeField('stack', e.target.value)}
              placeholder="e.g. Fullstack & Rust"
              className="custom-input"
              maxLength={30}
            />
            {/* Quick Stack Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {STACK_SUGGESTIONS.slice(0, 4).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChangeField('stack', item)}
                  className="text-[10px] font-mono bg-[#0D2419] hover:bg-[#FFDF00] hover:text-[#121814] border border-[#FFDF00]/30 px-2 py-0.5 rounded text-[#FFDF00] font-semibold transition"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Team Name Field (Max 30 chars) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-[#FFFDF0]">
                Team / Squad Name
              </label>
              <span className="text-[10px] font-mono text-[#FFDF00]">
                {teamName.length}/30
              </span>
            </div>
            <input
              type="text"
              value={teamName}
              onChange={(e) => onChangeField('teamName', e.target.value)}
              placeholder="e.g. Team Antigravity"
              className="custom-input"
              maxLength={30}
            />
          </div>
        </div>
      )}

      {/* SECTION 2: PHOTO ADJUSTMENT CONTROLS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFDF00] uppercase">
            <SlidersHorizontal size={14} className="text-[#FF007A]" /> Photo Adjustments
          </span>
          <button
            type="button"
            onClick={onResetAdjustments}
            className="text-[11px] font-mono text-[#FFDF00]/70 hover:text-[#FFDF00] underline"
          >
            Reset position
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-3">
          <ZoomIn size={16} className="text-[#FFDF00]" />
          <span className="text-xs font-mono text-[#FFFDF0] w-12 font-bold">Zoom:</span>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={zoom}
            onChange={(e) => onChangeField('zoom', parseFloat(e.target.value))}
            className="w-full accent-[#FF007A]"
          />
          <span className="text-xs font-mono text-[#FFDF00] w-10 text-right font-bold">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-[#FFFDF0] font-bold flex items-center gap-1">
            <RotateCw size={14} /> Rotate:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeField('rotation', (rotation - 90) % 360)}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#0D2419] border border-[#FFDF00]/30 rounded hover:bg-[#FFDF00] hover:text-[#121814] text-[#FFDF00]"
            >
              ↺ -90°
            </button>
            <button
              type="button"
              onClick={() => onChangeField('rotation', 0)}
              className="px-2 py-1 text-xs font-mono font-bold bg-[#0D2419] border border-[#FFDF00]/30 rounded hover:bg-[#FFDF00] hover:text-[#121814] text-[#FFDF00]"
            >
              0°
            </button>
            <button
              type="button"
              onClick={() => onChangeField('rotation', (rotation + 90) % 360)}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#0D2419] border border-[#FFDF00]/30 rounded hover:bg-[#FFDF00] hover:text-[#121814] text-[#FFDF00]"
            >
              ↻ +90°
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: PHOTO FILTERS */}
      <div className="pt-2 border-t border-[#FFDF00]/20">
        <label className="block text-xs font-mono font-bold text-[#FFDF00] mb-2">
          Color Filter Preset
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChangeField('filter', f.id)}
              className={`py-1.5 px-2 rounded font-mono text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-[#FF007A] text-white shadow-sm'
                  : 'bg-[#0D2419] text-[#FFFDF0] border border-[#FFDF00]/30 hover:bg-[#FFDF00]/20'
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
