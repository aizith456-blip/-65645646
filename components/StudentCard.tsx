
import React from 'react';
import { Student } from '../types';
import { Award, Sparkles } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onCardClick: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onCardClick }) => {
  const { pet, foodCount, medals, name } = student;
  
  const currentXp = pet?.xp || 0;
  const level = pet?.level || 1;
  const xpInLevel = currentXp % 10;
  const progressPercent = xpInLevel * 10;
  const xpRemaining = 10 - xpInLevel;

  // Visual effects based on level
  const isHighLevel = level >= 5;

  return (
    <div 
      onClick={onCardClick}
      className={`bg-white rounded-2xl p-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border group overflow-hidden relative flex flex-col gap-2 aspect-[4/5] ${isHighLevel ? 'border-yellow-100 bg-gradient-to-b from-white to-yellow-50/20' : 'border-slate-50'}`}
    >
      {/* Level Indicator */}
      <div className="flex items-center gap-1 absolute top-3 left-3 z-20">
        <div className={`w-1.5 h-1.5 rounded-full ${isHighLevel ? 'bg-yellow-400 animate-pulse' : 'bg-blue-400'}`} />
        <span className={`text-[10px] font-bold ${isHighLevel ? 'text-yellow-600' : 'text-slate-400'}`}>Lv.{level}</span>
      </div>

      {/* Compact Pet Image Area */}
      <div className="w-full flex-1 flex items-center justify-center relative">
        {pet ? (
          <div className="w-24 h-24 z-10 transition-all duration-500 group-hover:scale-125 relative">
            {isHighLevel && (
               <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-full animate-pulse -z-10" />
            )}
            <img 
              src={pet.image} 
              alt={pet.name} 
              style={{ filter: pet.hueRotate ? `hue-rotate(${pet.hueRotate}deg)` : 'none' }}
              className={`w-full h-full object-contain drop-shadow-lg pet-float-img`} 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center opacity-10">
             <span className="text-4xl text-slate-400">?</span>
          </div>
        )}
      </div>

      {/* Info Rows - Compact Mode */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline gap-1">
          <h3 className="text-sm font-bold text-slate-700 truncate">{name}</h3>
          <span className="text-[9px] text-slate-300 font-bold whitespace-nowrap">{pet?.name || '---'}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-bold text-slate-400">
            <span>本地进度</span>
            <span className="flex items-center gap-0.5">还差 {xpRemaining} 🍗</span>
          </div>

          <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isHighLevel ? 'bg-yellow-400' : 'bg-purple-400'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
          <div className="flex items-center gap-1">
            <span className="text-xs">🍗</span>
            <span className="text-[11px] font-black text-slate-500">{foodCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className={`w-3 h-3 ${isHighLevel ? 'text-yellow-500' : 'text-yellow-400'}`} />
            <span className="text-[11px] font-black text-slate-500">{medals}</span>
          </div>
        </div>
      </div>

      {!pet && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-30">
          <div className="bg-pink-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg">
            立即领养
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
