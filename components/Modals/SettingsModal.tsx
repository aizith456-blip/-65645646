import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, CheckCircle, Fingerprint, Layout, Settings } from 'lucide-react';
import { PointRule } from '../../types';
import { IconMap } from '../../constants';

interface SettingsModalProps {
  systemName: string;
  className: string;
  rules: PointRule[];
  onSave: (systemName: string, className: string, rules: PointRule[]) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  systemName: initialSystemName, 
  className: initialClassName, 
  rules: initialRules, 
  onSave, 
  onClose 
}) => {
  const [sysName, setSysName] = useState(initialSystemName);
  const [clsName, setClsName] = useState(initialClassName);
  const [rules, setRules] = useState<PointRule[]>([...initialRules]);
  
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleValue, setNewRuleValue] = useState(1);

  const addRule = () => {
    if (!newRuleName.trim()) return;
    const newRule: PointRule = {
      id: Math.random().toString(36).substr(2, 9),
      label: newRuleName,
      value: newRuleValue,
      icon: newRuleValue >= 0 ? 'Sparkles' : 'Ban',
      type: newRuleValue >= 0 ? 'positive' : 'negative'
    };
    setRules([...rules, newRule]);
    setNewRuleName('');
    setNewRuleValue(1);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-slate-100 rounded-2xl">
                <Settings className="w-6 h-6 text-slate-600" />
             </div>
             <h2 className="text-xl font-bold text-slate-800">系统设置</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 cute-scrollbar">
          {/* General Config */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-slate-700">基础配置</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">系统名称 (全局)</label>
                 <input 
                  type="text" 
                  className="w-full px-5 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all font-bold text-slate-700"
                  value={sysName}
                  onChange={e => setSysName(e.target.value)}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">当前班级名称</label>
                 <input 
                  type="text" 
                  className="w-full px-5 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all font-bold text-slate-700"
                  value={clsName}
                  onChange={e => setClsName(e.target.value)}
                 />
               </div>
             </div>
          </section>

          {/* Rules Config */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <Fingerprint className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-700">加减分配置 <span className="text-slate-400 font-normal">({rules.length}个)</span></h3>
             </div>
             <p className="text-xs text-slate-400 px-1">设置老师可以给学生操作的项目。正数为加分，负数为扣分。</p>
             
             <div className="space-y-2 bg-slate-50/50 p-4 rounded-3xl">
                {rules.map(rule => (
                  <div key={rule.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm group">
                     <div className="p-2 bg-slate-50 rounded-xl">
                       {IconMap[rule.icon] || <CheckCircle className="w-5 h-5" />}
                     </div>
                     <span className="flex-1 text-sm font-bold text-slate-600">{rule.label}</span>
                     <div className={`px-3 py-1 rounded-full text-xs font-black ${rule.value >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {rule.value > 0 ? `+${rule.value}` : rule.value} 🍗
                     </div>
                     <button onClick={() => deleteRule(rule.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                ))}
                
                {/* New Rule Input */}
                <div className="flex gap-2 mt-4 items-center">
                   <input 
                    type="text" 
                    placeholder="项目名称 (如: 早读、迟到)"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={newRuleName}
                    onChange={e => setNewRuleName(e.target.value)}
                   />
                   <input 
                    type="number" 
                    className="w-20 px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={newRuleValue}
                    onChange={e => setNewRuleValue(parseInt(e.target.value) || 0)}
                   />
                   <button 
                    onClick={addRule}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-100 transition-all"
                   >
                     <Plus className="w-6 h-6" />
                   </button>
                </div>
             </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-50 bg-white flex justify-end gap-3">
           <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
           >
             取消
           </button>
           <button 
            onClick={() => onSave(sysName, clsName, rules)}
            className="px-8 py-2 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 hover:-translate-y-0.5 transition-all"
           >
             保存修改
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;