
import React, { useState } from 'react';
import { Key, Sparkles, Wand2, ShieldCheck, AlertCircle } from 'lucide-react';
import { playSound } from '../../constants.tsx';

interface ActivationModalProps {
  onActivate: () => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ onActivate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputCode = code.trim().toUpperCase();
    if (!inputCode) return;

    setLoading(true);
    setError(null);
    
    try {
      // Use cache busting to ensure we get the latest codes.txt
      const response = await fetch(`./codes.txt?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('无法连接到激活码验证服务，请确认 codes.txt 文件已上传。');
      }
      
      const text = await response.text();
      const validCodes = text.split('\n')
        .map(c => c.trim().toUpperCase())
        .filter(c => c.length > 0);

      if (validCodes.includes(inputCode)) {
        playSound('magic');
        setTimeout(() => {
          onActivate();
        }, 800);
      } else {
        setError('激活码不正确哦，请核对后再试~');
        playSound('blip');
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '系统繁忙或文件丢失，请联系管理员。');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-rose-50/80 backdrop-blur-xl">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-pink-100 p-8 flex flex-col items-center text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-pink-200 animate-bounce">
            <Key className="w-10 h-10 text-white" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">欢迎来到班级宠物园</h2>
          <p className="text-slate-400 text-sm font-medium px-4">
            请输入您的 <span className="text-pink-500 font-bold">专属激活码</span> 以解锁所有魔法功能
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative">
            <input 
              autoFocus
              type="text" 
              placeholder="请输入激活码..."
              className={`w-full px-8 py-5 rounded-3xl border-2 transition-all text-center font-black tracking-widest text-lg outline-none ${
                error 
                ? 'border-rose-400 bg-rose-50 text-rose-600 animate-shake' 
                : 'border-pink-50 bg-slate-50 focus:border-pink-500 focus:bg-white text-slate-700'
              }`}
              value={code}
              onChange={e => { setCode(e.target.value); setError(null); }}
              disabled={loading}
            />
            {error && (
              <div className="flex items-center justify-center gap-1 mt-3 text-rose-500 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full py-5 bg-pink-500 text-white rounded-3xl font-black text-lg shadow-xl shadow-pink-100 hover:bg-pink-600 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm">验证中...</span>
              </div>
            ) : (
              <>
                <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                开启魔法园地
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">安全验证 · 已联网比对名单</span>
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;
