
import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Student, PetType } from '../../types';
import { ALL_PETS } from '../../constants';

interface AdoptionModalProps {
  student: Student;
  onClose: () => void;
  onAdopt: (type: PetType, name: string, img: string) => void;
}

const AdoptionModal: React.FC<AdoptionModalProps> = ({ student, onClose, onAdopt }) => {
  const [petName, setPetName] = useState('');
  const [selectedPet, setSelectedPet] = useState<{breed: string, type: PetType, img: string} | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header - Vibrant Purple Style */}
        <div className="p-7 bg-[#8A4FFF] text-white relative flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-white/20 rounded-xl">
               <Sparkles className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-black tracking-tight">选择守护神兽</h2>
          </div>
          <p className="text-white/80 text-sm font-bold opacity-90">为 <span className="text-white font-black underline decoration-wavy underline-offset-4 decoration-yellow-300">{student.name}</span> 选择一只可爱的神兽吧</p>
          <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-white/20 rounded-full transition-colors text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 cute-scrollbar bg-[#fdfdfd]">
          {/* Pet Selection Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {ALL_PETS.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedPet(opt)}
                className={`group flex flex-col items-center gap-2 p-2 rounded-2xl border-2 transition-all pet-card-inner ${
                  selectedPet?.breed === opt.breed 
                  ? 'selected-pet' 
                  : 'border-slate-50 hover:border-purple-200 hover:bg-purple-50/50'
                }`}
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden shadow-sm bg-white p-2 flex items-center justify-center">
                  <img 
                    src={opt.img} 
                    alt={opt.breed} 
                    className={`w-full h-full object-contain transition-transform group-hover:scale-110 ${selectedPet?.breed === opt.breed ? 'pet-float-img' : ''}`} 
                  />
                </div>
                <span className={`text-[11px] font-black ${
                  selectedPet?.breed === opt.breed ? 'text-[#8A4FFF]' : 'text-slate-400'
                }`}>
                  {opt.breed}
                </span>
              </button>
            ))}
          </div>

          {/* Detailed Input Section for Selected Pet */}
          {selectedPet && (
            <div className="mt-8 bg-[#8A4FFF]/5 p-6 rounded-[2.5rem] space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-500 border border-[#8A4FFF]/10 shadow-inner">
               <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white flex-shrink-0 bg-white p-3">
                    <img src={selectedPet.img} className="w-full h-full object-contain pet-float-img" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-black text-[#8A4FFF] mb-2 uppercase tracking-widest">
                      给你的 <span className="text-slate-800">{selectedPet.breed}</span> 起个超级可爱的名字
                    </label>
                    <div className="relative">
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="糯米团子, 大福, 旺财..."
                        className="w-full px-6 py-4 rounded-2xl border-2 border-[#8A4FFF]/10 focus:outline-none focus:border-[#8A4FFF] text-lg font-black text-slate-700 bg-white shadow-sm transition-all"
                        value={petName}
                        onChange={e => setPetName(e.target.value)}
                      />
                      <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8A4FFF]/20" />
                    </div>
                  </div>
               </div>
               
               <button 
                disabled={!petName.trim()}
                onClick={() => onAdopt(selectedPet.type, petName, selectedPet.img)}
                className="w-full py-5 bg-[#8A4FFF] text-white rounded-[2rem] text-xl font-black shadow-xl shadow-purple-100 hover:shadow-2xl hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
               >
                 <Sparkles className="w-6 h-6" />
                 签订契约，开启冒险!
               </button>
            </div>
          )}
        </div>

        {/* Footer Text */}
        <div className="p-5 text-center border-t border-slate-50 bg-slate-50/50 flex-shrink-0">
           <p className="text-[12px] text-slate-400 font-bold tracking-tight">
             ✨ 选择神兽后，它将常驻你的个人主页，并随着你的成长不断进化 ✨
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdoptionModal;
