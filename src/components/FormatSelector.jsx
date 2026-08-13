import React from 'react';
import { UserCheck, IdCard, Users } from 'lucide-react';

export default function FormatSelector({ activeFormat, onSelectFormat, isMultiTeammate, onToggleMultiTeammate }) {
  return (
    <div className="sticky top-0 z-50 w-full max-w-xl mx-auto py-2 px-2 backdrop-blur-md bg-[#07150E]/80">
      <div className="bg-[#0D2419] p-1.5 rounded-2xl border-2 border-[#FFDF00] shadow-[0px_4px_16px_rgba(0,0,0,0.5)] flex items-center justify-between gap-2">
        {/* PFP Frame Tab */}
        <button
          type="button"
          onClick={() => onSelectFormat('A')}
          className={`flex-1 py-3 px-4 rounded-xl font-mono text-sm sm:text-base font-black transition-all duration-200 flex items-center justify-center gap-2 ${
            activeFormat === 'A'
              ? 'bg-[#FF007A] text-white shadow-lg scale-[1.02]'
              : 'text-[#FFFDF0] hover:bg-[#07150E] opacity-80'
          }`}
        >
          <UserCheck size={18} />
          <span>PFP Frame</span>
        </button>

        {/* Builder ID Card Tab */}
        <button
          type="button"
          onClick={() => onSelectFormat('B')}
          className={`flex-1 py-3 px-4 rounded-xl font-mono text-sm sm:text-base font-black transition-all duration-200 flex items-center justify-center gap-2 ${
            activeFormat === 'B'
              ? 'bg-[#FFDF00] text-[#121814] shadow-lg scale-[1.02]'
              : 'text-[#FFFDF0] hover:bg-[#07150E] opacity-80'
          }`}
        >
          <IdCard size={18} />
          <span>Builder ID Card</span>
        </button>
      </div>

      {/* Format A Teammate Multi-Frame Banner */}
      {activeFormat === 'A' && (
        <div className="mt-2 flex items-center justify-center gap-3 bg-[#0D2419] border border-[#FFDF00]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#FFFDF0]">
          <Users size={15} className="text-[#FF007A]" />
          <span>Team Mode (Combine Teammates):</span>
          <button
            onClick={() => onToggleMultiTeammate(!isMultiTeammate)}
            className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${
              isMultiTeammate ? 'bg-[#FF007A] text-white' : 'bg-[#FFDF00]/20 text-[#FFDF00] hover:bg-[#FFDF00]/30'
            }`}
          >
            {isMultiTeammate ? '✓ Multi-Photo ON' : '+ Enable Multi-Photo'}
          </button>
        </div>
      )}
    </div>
  );
}
