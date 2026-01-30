
import React, { useState, useEffect } from 'react';
import { 
  Store, Trophy, Settings, Plus, Search, Sparkles, History, Volume2, VolumeX, Heart, Star, Award
} from 'lucide-react';
import { Student, PointRule, ShopItem, PetType, Pet, GrowthRecord } from './types.ts';
import { INITIAL_STUDENTS, POINT_RULES, SHOP_ITEMS, getPetImage, getStageFromLevel, ABILITIES, playSound, ALL_PETS } from './constants.tsx';

// 导入子组件 (在 GitHub Pages 模式下，这些也将被 Babel 实时处理)
import StudentCard from './components/StudentCard.tsx';
import PointModal from './components/Modals/PointModal.tsx';
import AdoptionModal from './components/Modals/AdoptionModal.tsx';
import ShopModal from './components/Modals/ShopModal.tsx';
import HonorRollModal from './components/Modals/HonorRollModal.tsx';
import SettingsModal from './components/Modals/SettingsModal.tsx';
import AddStudentModal from './components/Modals/AddStudentModal.tsx';
import ActivationModal from './components/Modals/ActivationModal.tsx';
import GrowthRecordModal from './components/Modals/GrowthRecordModal.tsx';

const App: React.FC = () => {
  const [isActivated, setIsActivated] = useState<boolean>(() => localStorage.getItem('pet_garden_activated') === 'true');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('pet_garden_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showHonorRoll, setShowHonorRoll] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showGrowthRecords, setShowGrowthRecords] = useState(false);

  // 保存数据
  useEffect(() => localStorage.setItem('pet_garden_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('pet_garden_activated', isActivated.toString()), [isActivated]);

  if (!isActivated) {
    return <ActivationModal onActivate={() => setIsActivated(true)} />;
  }

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || (s.pet?.name && s.pet.name.includes(searchTerm))
  );

  return (
    <div className="flex flex-col h-screen bg-[#FFF5F7] text-slate-800">
      {/* 顶部导航：梦幻粉紫色调 */}
      <header className="px-8 py-5 bg-white/80 backdrop-blur-xl border-b-4 border-pink-100 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_20px_rgba(255,182,193,0.2)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <Heart className="text-white w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-pink-500 tracking-tight leading-none">班级宠物园</h1>
            <p className="text-xs text-purple-300 mt-1 font-bold">快乐学习 · 宠物相伴</p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-5 h-5 group-focus-within:text-pink-500 transition-colors" />
            <input 
              type="text" 
              placeholder="寻找哪只小可爱？"
              className="w-full pl-12 pr-6 py-3 bg-pink-50/50 border-2 border-pink-100 rounded-full text-sm font-bold focus:outline-none focus:ring-4 focus:ring-pink-200 focus:bg-white transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button onClick={() => setShowGrowthRecords(true)} className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
              <History className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-emerald-400">足迹</span>
          </button>
          
          <button onClick={() => setShowShopModal(true)} className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-sky-400">集市</span>
          </button>

          <button onClick={() => setShowHonorRoll(true)} className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-orange-400">榜单</span>
          </button>

          <div className="w-px h-8 bg-pink-100 mx-2" />

          <button onClick={() => setShowSettings(true)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all">
            <Settings className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* 主视图：卡片网格 */}
      <main className="flex-1 overflow-y-auto p-8 cute-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredStudents.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onCardClick={() => {
                  setActiveStudentId(student.id);
                  student.pet ? setShowPointModal(true) : setShowAdoptionModal(true);
                }}
              />
            ))}
            
            <button 
              onClick={() => setShowAddStudentModal(true)}
              className="aspect-[4/5] bg-white/50 border-4 border-dashed border-pink-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-pink-300 hover:border-pink-400 hover:text-pink-500 hover:bg-white transition-all group shadow-sm"
            >
              <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <Plus className="w-8 h-8" />
              </div>
              <span className="text-sm font-black tracking-widest">添加新同学</span>
            </button>
          </div>
        </div>
      </main>

      {/* 所有的弹窗组件 */}
      {showGrowthRecords && (
        <GrowthRecordModal 
          records={[]} // 示例
          onClose={() => setShowGrowthRecords(false)} 
          onClear={() => {}} 
        />
      )}
      {showAddStudentModal && (
        <AddStudentModal 
          onClose={() => setShowAddStudentModal(false)}
          onAdd={(name) => {
            setStudents([...students, { id: Date.now().toString(), name, foodCount: 0, medals: 0 }]);
            setShowAddStudentModal(false);
          }}
        />
      )}
      {showPointModal && activeStudentId && (
        <PointModal 
          student={students.find(s => s.id === activeStudentId)!}
          rules={POINT_RULES}
          onClose={() => setShowPointModal(false)}
          onAction={(rule) => {
             // 逻辑简化，实际需要更新 students 状态
             setShowPointModal(false);
          }}
          onAddRule={() => {}}
        />
      )}
      {showAdoptionModal && activeStudentId && (
        <AdoptionModal 
          student={students.find(s => s.id === activeStudentId)!}
          onClose={() => setShowAdoptionModal(false)}
          onAdopt={(type, name, img) => {
            setStudents(prev => prev.map(s => s.id === activeStudentId ? {
              ...s, pet: { id: Date.now().toString(), name, type, level: 1, xp: 0, baseImage: img, image: img, stage: getStageFromLevel(1), abilities: [] }
            } : s));
            setShowAdoptionModal(false);
          }}
        />
      )}
      {showShopModal && (
        <ShopModal 
          items={SHOP_ITEMS}
          students={students}
          onClose={() => setShowShopModal(false)}
          onRedeem={() => {}}
        />
      )}
      {showHonorRoll && (
        <HonorRollModal 
          students={students}
          onClose={() => setShowHonorRoll(false)}
        />
      )}
      {showSettings && (
        <SettingsModal 
          systemName="班级宠物园"
          className="五年级3班"
          rules={POINT_RULES}
          onSave={() => setShowSettings(false)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
