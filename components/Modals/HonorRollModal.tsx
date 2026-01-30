import React from 'react';
import { X, Trophy, Medal, Crown, Award } from 'lucide-react';
import { Student } from '../../types';

interface HonorRollModalProps {
  students: Student[];
  onClose: () => void;
}

const HonorRollModal: React.FC<HonorRollModalProps> = ({ students, onClose }) => {
  const sortedStudents = [...students].sort((a, b) => {
    const medalDiff = b.medals - a.medals;
    if (medalDiff !== 0) return medalDiff;
    return (b.pet?.level || 0) - (a.pet?.level || 0);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 bg-yellow-400 text-white relative">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl">
               <Trophy className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black">光荣榜</h2>
              <p className="text-yellow-100 text-sm font-bold uppercase tracking-widest">养成神兽，荣登榜首</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute right-8 top-8 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 cute-scrollbar space-y-4">
          {sortedStudents.map((student, index) => {
            const isTop3 = index < 3;
            const rankStyles = [
              'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200',
              'bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200',
              'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200',
            ][index] || 'bg-white border-slate-50';

            const badgeIcons = [
              <Crown className="w-6 h-6 text-yellow-500" />,
              <Medal className="w-6 h-6 text-slate-400" />,
              <Medal className="w-6 h-6 text-orange-500" />,
            ];

            return (
              <div 
                key={student.id}
                className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all hover:scale-[1.02] ${rankStyles}`}
              >
                {/* Rank */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  {isTop3 ? badgeIcons[index] : (
                    <span className="text-xl font-black text-slate-300">#{index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-white p-1">
                   <img src={student.pet?.image || 'https://picsum.photos/100/100'} className="w-full h-full object-cover rounded-xl" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-700 text-lg">{student.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{student.pet?.type || '新晋培育员'} · Lv.{student.pet?.level || 0}</p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">进度</span>
                    <span className="font-black text-slate-600">{student.pet?.xp || 0}/100</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-black text-slate-700">{student.medals} 徽章</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-slate-50 text-center">
           <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
             完成打卡任务，收集更多徽章吧
           </p>
        </div>
      </div>
    </div>
  );
};

export default HonorRollModal;