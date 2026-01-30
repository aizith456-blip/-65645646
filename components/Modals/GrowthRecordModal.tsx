import React from 'react';
import { X, Download, Trash2, CheckCircle2, ShoppingBag, Trophy, Baby } from 'lucide-react';
import { GrowthRecord } from '../../types';

interface GrowthRecordModalProps {
  records: GrowthRecord[];
  onClose: () => void;
  onClear: () => void;
}

const GrowthRecordModal: React.FC<GrowthRecordModalProps> = ({ records, onClose, onClear }) => {
  const exportToCSV = () => {
    if (records.length === 0) return;
    
    const headers = ['时间', '学生', '记录类型', '描述', '分值变动'];
    const rows = records.map(r => [
      r.timestamp,
      r.studentName,
      r.type,
      r.description,
      r.valueChange || ''
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `班级成长记录_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = (type: GrowthRecord['type']) => {
    switch (type) {
      case 'point': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'redeem': return <ShoppingBag className="w-4 h-4 text-sky-500" />;
      case 'adopt': return <Baby className="w-4 h-4 text-purple-500" />;
      case 'milestone': return <Trophy className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getIconBg = (type: GrowthRecord['type']) => {
    switch (type) {
      case 'point': return 'bg-emerald-50';
      case 'redeem': return 'bg-sky-50';
      case 'adopt': return 'bg-purple-50';
      case 'milestone': return 'bg-yellow-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-[85vh] animate-in zoom-in duration-300">
        {/* Header - Matching Screenshot Style */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">成长记录</h2>
              <p className="text-[10px] text-slate-400 font-bold">{records.length}/10000 条记录</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-slate-50/30">
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm"
          >
            <Download className="w-4 h-4" />
            导出CSV
          </button>
          <button 
            onClick={onClear}
            className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            清理记录
          </button>
        </div>

        <div className="px-6 py-2 border-b border-slate-50 flex justify-between items-center bg-white">
           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">第 1/1 页 · 共 {records.length} 条记录</span>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 cute-scrollbar bg-white">
          {records.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
               {/* Fixed: BABY corrected to Baby */}
               <Baby className="w-16 h-16 mb-2" />
               <p className="font-bold">暂无记录</p>
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="flex items-center gap-4 py-3 px-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-50/50 last:border-0">
                <span className="text-[11px] font-bold text-slate-300 w-10">{record.timestamp}</span>
                <div className={`p-2 rounded-full ${getIconBg(record.type)}`}>
                  {getIcon(record.type)}
                </div>
                <div className="flex-1 flex items-baseline gap-2">
                  <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{record.studentName}</span>
                  <span className="text-slate-500 text-xs truncate">{record.description}</span>
                </div>
                {record.valueChange && (
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    record.valueChange.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {record.valueChange}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthRecordModal;