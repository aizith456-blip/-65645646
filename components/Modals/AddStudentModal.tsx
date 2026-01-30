
import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white relative">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            添加新学生
          </h2>
          <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-pink-400 uppercase tracking-widest px-1">学生姓名</label>
            <input 
              autoFocus
              type="text" 
              placeholder="请输入学生姓名..."
              className="w-full px-5 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all font-bold text-slate-700"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            加入班级
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
