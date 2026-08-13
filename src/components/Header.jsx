import React from 'react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-[#0B5A36] text-[#FFFDF0] border-b-4 border-[#FFDF00] py-4 px-4 sm:px-8 shadow-lg relative overflow-hidden">
      {/* Background Palm Leaf Deco */}
      <div className="absolute top-0 right-0 w-64 h-full opacity-10 pointer-events-none bg-palm-pattern" />

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FFDF00] text-[#121814] px-3 py-1 rounded border-2 border-[#121814] font-mono text-xs font-extrabold tracking-wider shadow-sm">
            2:47PM STUDIO
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#FFDF00] leading-none flex items-center gap-2">
              HACKER HOUSE
              <span className="bg-[#FF007A] text-white px-2 py-0.5 rounded-lg text-lg font-sans font-bold -rotate-3 inline-block shadow-md">
                गोवा
              </span>
            </h1>
            <p className="text-xs font-mono text-[#E2E8F0] tracking-widest uppercase mt-1 flex items-center gap-2">
              <MapPin size={12} className="text-[#FFDF00]" /> GOA, INDIA &nbsp;•&nbsp;
              <Calendar size={12} className="text-[#FFDF00]" /> 28 - 31 OCT 2026
            </p>
          </div>
        </div>

        {/* Brand Right Hashtag */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-mono text-[#FFDF00] font-bold">OFFICIAL GENERATOR</span>
            <span className="text-xs text-[#FFFDF0] opacity-80">Build & Share on X</span>
          </div>
          <span className="bg-[#FF007A] text-white font-mono font-bold text-sm px-4 py-2 rounded-full border-2 border-white shadow-md flex items-center gap-1.5 animate-pulse">
            <Sparkles size={16} /> #FrameInGoa
          </span>
        </div>
      </div>
    </header>
  );
}
