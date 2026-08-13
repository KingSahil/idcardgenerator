import React from 'react';

export default function Header() {
  return (
    <div className="w-full">
      {/* Topbar Navigation matching C:\GitRepos\goa UI/UX */}
      <header className="w-full bg-[#07150E] border-b-4 border-[#FFDF00] py-3 px-4 sm:px-8 font-mono text-xs text-[#FFFDF0]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-2 text-base font-extrabold tracking-tight text-[#FFDF00]">
            HH / GOA <span className="text-[#FF007A] font-black">2026</span>
          </div>

          {/* Task Metadata */}
          <div className="flex items-center gap-2 font-bold tracking-widest text-[#E2E8F0] uppercase text-[11px] sm:text-xs">
            <span>TASK #01</span>
            <span className="text-[#FF007A] font-black">//</span>
            <span>FRAME & BUILDER ID GENERATOR</span>
          </div>
        </div>
      </header>

      {/* Hero Copy Section matching C:\GitRepos\goa UI/UX */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="text-[#FF007A] font-mono font-extrabold text-xs tracking-widest uppercase mb-2">
          OPEN CALL // BUILD YOUR ID & FRAME
        </div>
        <h1 className="font-serif text-5xl sm:text-7xl font-black text-[#FFDF00] tracking-tight uppercase leading-none">
          FRAME <span className="text-[#FFFDF0] italic">IN GOA</span>
        </h1>
        <p className="font-mono font-bold text-sm sm:text-base text-[#FFFDF0] opacity-90 mt-3">
          Make your official HH Goa graphic. Share it on X. Get on the radar.
        </p>

        {/* Required Note Box */}
        <div className="mt-4 border-l-4 border-[#FF007A] bg-[#0D2419] p-3 rounded-r-lg font-mono text-xs text-[#E2E8F0] flex items-center gap-2 max-w-xl shadow-md border-y border-r border-[#050806]">
          <span className="bg-[#FF007A] text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">
            REQUIRED
          </span>
          <span>
            Your X post must include <strong className="text-[#FFDF00]">#FrameInGoa</strong> to qualify for featured radar.
          </span>
        </div>
      </section>
    </div>
  );
}
