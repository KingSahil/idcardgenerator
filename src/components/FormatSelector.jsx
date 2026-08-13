import React from 'react';
import { UserCheck, IdCard, Users } from 'lucide-react';

export default function FormatSelector({ activeFormat, onSelectFormat, isMultiTeammate, onToggleMultiTeammate }) {
  return (
    <div className="w-full max-w-xl mx-auto my-4 px-2">
      <div className="bg-[#05472A] p-1.5 rounded-2xl border-2 border-[#FFDF00] shadow-md flex items-center justify-between gap-2">
        {/* Format A Tab */}
        <button
          type="button"
          onClick={() => onSelectFormat('A')}
          className={`flex-1 py-3 px-4 rounded-xl font-mono text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeFormat === 'A'
              ? 'bg-[#FF007A] text-white shadow-lg scale-[1.02]'
              : 'text-[#FFFDF0] hover:bg-[#0B5A36] opacity-80'
          }`}
        >
          <UserCheck size={18} />
          <span>FORMAT A: PFP FRAME</span>
        </button>

        {/* Format B Tab */}
        <button
          type="button"
          onClick={() => onSelectFormat('B')}
          className={`flex-1 py-3 px-4 rounded-xl font-mono text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
            activeFormat === 'B'
              ? 'bg-[#FFDF00] text-[#121814] shadow-lg scale-[1.02]'
              : 'text-[#FFFDF0] hover:bg-[#0B5A36] opacity-80'
          }`}
        >
          <IdCard size={18} />
          <span>FORMAT B: BUILDER ID</span>
        </button>
      </div>

      {/* Format A Teammate Multi-Frame Banner */}
      {activeFormat === 'A' && (
        <div className="mt-3 flex items-center justify-center gap-3 bg-[#FFFDF0] border border-[#0B5A36]/20 p-2 rounded-xl text-xs font-mono text-[#0B5A36]">
          <Users size={16} className="text-[#FF007A]" />
          <span>Team Mode (Combine Teammates):</span>
          <button
            onClick={() => onToggleMultiTeammate(!isMultiTeammate)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isMultiTeammate ? 'bg-[#FF007A] text-white' : 'bg-[#0B5A36]/10 text-[#0B5A36] hover:bg-[#0B5A36]/20'
            }`}
          >
            {isMultiTeammate ? '✓ Multi-Photo ON' : '+ Enable Multi-Photo'}
          </button>
        </div>
      )}
    </div>
  );
}
