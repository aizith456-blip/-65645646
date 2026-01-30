
import React, { useState } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { Student, PointRule } from '../../types';
import { IconMap } from '../../constants';

interface PointModalProps {
  student: Student;
  rules: PointRule[];
  onClose: () => void;
  onAction: (rule: PointRule) => void;
  onAddRule: (rule: PointRule) => void;
}

const PointModal: React.FC<PointModalProps> = ({ student, rules, onClose, onAction, onAddRule }) => {
  const [filter, setFilter] = useState('');
  const [addingType, setAddingType] = useState<'positive' | 'negative' | null>(null);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleValue, setNewRuleValue] = useState(1);
  
  const positiveRules = rules.filter(r => r.type === 'positive' && r.label.includes(filter));
  const negativeRules = rules.filter(r => r.type === 'negative' && r.label.includes(filter));

  const handleQuickAdd = () => {
    if (!newRuleName.trim() || !addingType) return;
    
    const rule: PointRule = {
      id: Math.random().toString(36).substr(2, 9),
      label: newRuleName,
      value: addingType === 'positive' ? Math.abs(newRuleValue) : -Math.abs(newRuleValue),
      icon: addingType === 'positive' ? 'Sparkles' : 'Ban',
      type: addingType
    };
    
    onAddRule(rule);
    setAddingType(null);
    setNewRuleName('');
    setNewRuleValue(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-50 relative">
          <p className="text-slate-400 text-sm font-medium mb-1">选择项目</p>
          <h2 className="text-xl font-bold text-slate-800">给 <span className="text-pink-500">{student.name}</span> 加分/扣分</h2>
          <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-8 py-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="搜索项目 (支持首字母如 'cd' 搜 '迟到')"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
           </div>
        </div>

        {/* Rules Grid */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 cute-scrollbar">
          {/* Positive Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm">加分项</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {positiveRules.map(rule => (
                <button 
                  key={rule.id}
                  onClick={() => onAction(rule)}
                  className="p-4 bg-white border border-emerald-50 rounded-2xl hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all flex flex-col items-center gap-2 group"
                >
                  <div className="p-2 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                    {IconMap[rule.icon]}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{rule.label}</span>
                  <span className="text-[10px] font-bold text-emerald-500">+{rule.value} 🍗</span>
                </button>
              ))}
              
              {/* Quick Add Button */}
              {addingType === 'positive' ? (
                <div className="p-4 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col gap-2">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="项目名"
                    className="w-full px-2 py-1 text-[10px] rounded-md border border-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    value={newRuleName}
                    onChange={e => setNewRuleName(e.target.value)}
                  />
                  <div className="flex gap-1">
                    <input 
                      type="number"
                      className="w-full px-2 py-1 text-[10px] rounded-md border border-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      value={newRuleValue}
                      onChange={e => setNewRuleValue(parseInt(e.target.value) || 0)}
                    />
                    <button onClick={handleQuickAdd} className="p-1 bg-emerald-500 text-white rounded-md">
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => { setAddingType('positive'); setNewRuleValue(1); }}
                  className="p-4 border-2 border-dashed border-emerald-100 rounded-2xl flex flex-col items-center justify-center gap-1 text-emerald-300 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-bold">自定义</span>
                </button>
              )}
            </div>
          </div>

          {/* Negative Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-rose-500">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <h3 className="font-bold text-sm">扣分项</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {negativeRules.map(rule => (
                <button 
                  key={rule.id}
                  onClick={() => onAction(rule)}
                  className="p-4 bg-white border border-rose-50 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-50 transition-all flex flex-col items-center gap-2 group"
                >
                  <div className="p-2 bg-rose-50 rounded-xl group-hover:scale-110 transition-transform">
                    {IconMap[rule.icon]}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{rule.label}</span>
                  <span className="text-[10px] font-bold text-rose-500">{rule.value} 🍗</span>
                </button>
              ))}

              {/* Quick Add Button Negative */}
              {addingType === 'negative' ? (
                <div className="p-4 bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl flex flex-col gap-2">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="项目名"
                    className="w-full px-2 py-1 text-[10px] rounded-md border border-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    value={newRuleName}
                    onChange={e => setNewRuleName(e.target.value)}
                  />
                  <div className="flex gap-1">
                    <input 
                      type="number"
                      className="w-full px-2 py-1 text-[10px] rounded-md border border-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
                      value={newRuleValue}
                      onChange={e => setNewRuleValue(parseInt(e.target.value) || 0)}
                    />
                    <button onClick={handleQuickAdd} className="p-1 bg-rose-500 text-white rounded-md">
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => { setAddingType('negative'); setNewRuleValue(1); }}
                  className="p-4 border-2 border-dashed border-rose-100 rounded-2xl flex flex-col items-center justify-center gap-1 text-rose-300 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-bold">自定义</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 text-center border-t border-slate-50 bg-slate-50/50">
           <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
             ✨ 点击项目直接操作
           </p>
        </div>
      </div>
    </div>
  );
};

export default PointModal;
