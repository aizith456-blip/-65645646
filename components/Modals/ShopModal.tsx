import React, { useState } from 'react';
import { X, Award, ChevronRight, Store } from 'lucide-react';
import { ShopItem, Student } from '../../types';
import { IconMap } from '../../constants';

interface ShopModalProps {
  items: ShopItem[];
  students: Student[];
  onClose: () => void;
  onRedeem: (studentId: string, itemId: string) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ items, students, onClose, onRedeem }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-500 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Store className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold">小卖部</h2>
               <p className="text-sky-100 text-xs uppercase tracking-widest font-bold">Magic Store</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Selector Bar */}
        <div className="p-4 bg-sky-50/50 border-b border-sky-100 flex items-center gap-4 overflow-x-auto cute-scrollbar">
           <span className="text-xs font-bold text-sky-600 whitespace-nowrap">正在为谁购买?</span>
           <div className="flex items-center gap-2">
              {students.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedStudentId === s.id ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'bg-white text-slate-500 border border-sky-100 hover:border-sky-300'}`}
                >
                  {s.name}
                </button>
              ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 cute-scrollbar">
          {/* Current Balance Display */}
          {selectedStudent && (
            <div className="mb-8 flex items-center justify-between bg-white border-2 border-dashed border-sky-100 rounded-3xl p-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                    <img src={selectedStudent.pet?.image || 'https://picsum.photos/100/100'} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-700">{selectedStudent.name}</h3>
                    <p className="text-xs text-slate-400">{selectedStudent.pet?.name || '等待孵化'}</p>
                 </div>
               </div>
               <div className="flex items-center gap-2 bg-yellow-400 text-white px-6 py-3 rounded-2xl font-black text-xl shadow-lg shadow-yellow-100">
                 <Award className="w-6 h-6" />
                 {selectedStudent.medals}
               </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => {
              const canAfford = selectedStudent && selectedStudent.medals >= item.price;
              const hasStock = item.stock > 0;

              return (
                <div 
                  key={item.id}
                  className={`relative bg-white border border-slate-100 rounded-[2rem] p-5 flex flex-col items-center text-center transition-all ${hasStock ? 'hover:shadow-xl hover:shadow-sky-50 hover:-translate-y-1' : 'opacity-60'}`}
                >
                  <div className="absolute top-3 right-3">
                     <div className="bg-yellow-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                       ✨ {item.price}
                     </div>
                  </div>
                  
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                    {IconMap[item.icon]}
                  </div>

                  <h4 className="font-bold text-slate-700 mb-1">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 mb-4 line-clamp-2">{item.description}</p>
                  
                  <button 
                    disabled={!canAfford || !hasStock}
                    onClick={() => onRedeem(selectedStudentId, item.id)}
                    className={`mt-auto w-full py-2 rounded-xl text-xs font-bold transition-all shadow-md ${canAfford && hasStock ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-sky-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    {!hasStock ? '缺货中' : '立即兑换'}
                  </button>

                  <div className="mt-2 text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                    库存: {item.stock}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 text-center border-t border-slate-50 bg-slate-50/50">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             * 兑换后请联系老师确认领用
           </p>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;