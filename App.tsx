
import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Trophy, 
  Settings, 
  Plus, 
  Search,
  Sparkles,
  Package,
  History,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Student, PointRule, ShopItem, PetType, Pet, GrowthRecord } from './types';
import { INITIAL_STUDENTS, POINT_RULES, SHOP_ITEMS, getPetImage, getStageFromLevel, ABILITIES, playSound } from './constants';
import StudentCard from './components/StudentCard';
import PointModal from './components/Modals/PointModal';
import AdoptionModal from './components/Modals/AdoptionModal';
import ShopModal from './components/Modals/ShopModal';
import HonorRollModal from './components/Modals/HonorRollModal';
import SettingsModal from './components/Modals/SettingsModal';
import AddStudentModal from './components/Modals/AddStudentModal';
import StoreManagerModal from './components/Modals/StoreManagerModal';
import GrowthRecordModal from './components/Modals/GrowthRecordModal';
import ActivationModal from './components/Modals/ActivationModal';

const App: React.FC = () => {
  // Persistence Keys
  const STORAGE_KEY_STUDENTS = 'pet_garden_students';
  const STORAGE_KEY_RULES = 'pet_garden_rules';
  const STORAGE_KEY_SHOP = 'pet_garden_shop';
  const STORAGE_KEY_RECORDS = 'pet_garden_records';
  const STORAGE_KEY_CONFIG = 'pet_garden_config';
  const STORAGE_KEY_ACTIVATED = 'pet_garden_activated';

  // Load Initial State from Local Storage
  const [isActivated, setIsActivated] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY_ACTIVATED) === 'true');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [pointRules, setPointRules] = useState<PointRule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RULES);
    return saved ? JSON.parse(saved) : POINT_RULES;
  });
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHOP);
    return saved ? JSON.parse(saved) : SHOP_ITEMS;
  });
  const [records, setRecords] = useState<GrowthRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
    return saved ? JSON.parse(saved) : [];
  });
  const [systemName, setSystemName] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    return saved ? JSON.parse(saved).systemName : '班级宠物园';
  });
  const [className, setClassName] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    return saved ? JSON.parse(saved).className : '五年级3班';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // UI States
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showStoreManager, setShowStoreManager] = useState(false);
  const [showHonorRoll, setShowHonorRoll] = useState(false);
  const [showGrowthRecords, setShowGrowthRecords] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync State to Local Storage
  useEffect(() => localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(pointRules)), [pointRules]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(shopItems)), [shopItems]);
  useEffect(() => localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records)), [records]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({ systemName, className }));
  }, [systemName, className]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVATED, isActivated.toString());
  }, [isActivated]);

  const triggerSound = (type: 'pop' | 'magic' | 'levelUp' | 'blip') => {
    if (soundEnabled) playSound(type);
  };

  const addRecord = (studentName: string, type: GrowthRecord['type'], description: string, valueChange?: string) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newRecord: GrowthRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentName,
      timestamp,
      type,
      description,
      valueChange
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || (s.pet?.name && s.pet.name.includes(searchTerm))
  );

  const handlePointAction = (studentId: string, rule: PointRule) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      
      const newFoodCount = Math.max(0, s.foodCount + rule.value);
      const newMedals = rule.value > 0 ? s.medals + 1 : s.medals;
      
      let updatedPet = s.pet;
      if (updatedPet) {
        let newXp = updatedPet.xp + rule.value * 2;
        if (newXp < 0) newXp = 0;
        
        const newLevel = Math.floor(newXp / 10) + 1;
        const newStage = getStageFromLevel(newLevel);
        const newImage = getPetImage(updatedPet.baseImage, newLevel);
        
        if (newLevel > updatedPet.level) {
          addRecord(s.name, 'milestone', `完成了养成！进化为 ${newStage}`, '🎉');
          triggerSound('levelUp');
        } else {
          triggerSound(rule.value >= 0 ? 'pop' : 'blip');
        }

        const currentAbilityIds = new Set(updatedPet.abilities.map(a => a.id));
        const newlyUnlockedAbilities = ABILITIES.filter(
          a => a.unlockedAt <= newLevel && !currentAbilityIds.has(a.id)
        );
        
        updatedPet = { 
          ...updatedPet, 
          xp: newXp, 
          level: newLevel,
          stage: newStage,
          image: newImage,
          abilities: [...updatedPet.abilities, ...newlyUnlockedAbilities]
        };
      } else {
        triggerSound(rule.value >= 0 ? 'pop' : 'blip');
      }

      addRecord(s.name, 'point', rule.label, `${rule.value > 0 ? '+' : ''}${rule.value} 🍗`);
      return { ...s, foodCount: newFoodCount, medals: newMedals, pet: updatedPet };
    }));
    setShowPointModal(false);
  };

  const handleAdopt = (studentId: string, petType: PetType, petName: string, image: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const newPet: Pet = {
        id: Math.random().toString(36).substr(2, 9),
        name: petName,
        type: petType,
        level: 1,
        xp: 0,
        baseImage: image,
        image: image,
        stage: getStageFromLevel(1),
        abilities: []
      };
      addRecord(s.name, 'adopt', `成功领养了 ${petName}`, '🐣');
      triggerSound('magic');
      return { ...s, pet: newPet };
    }));
    setShowAdoptionModal(false);
  };

  const handleRedeem = (studentId: string, itemId: string) => {
    const item = shopItems.find(i => i.id === itemId);
    const student = students.find(s => s.id === studentId);
    if (!item || item.stock <= 0 || !student) return;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId || s.medals < item.price) return s;
      
      let updatedPet = s.pet;
      if (updatedPet) {
        if (item.type === 'color') {
          updatedPet = { ...updatedPet, hueRotate: item.value as number };
        } else if (item.type === 'accessory') {
          updatedPet = { ...updatedPet, accessoryIcon: item.value as string };
        }
      }

      addRecord(s.name, 'redeem', `兑换: ${item.name}`, `-${item.price} 徽章`);
      triggerSound('pop');
      return { ...s, medals: s.medals - item.price, pet: updatedPet };
    }));
    
    setShopItems(prev => prev.map(i => i.id === itemId ? { ...i, stock: Math.max(0, i.stock - 1) } : i));
  };

  if (!isActivated) {
    return <ActivationModal onActivate={() => setIsActivated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-rose-50 text-slate-800 transition-colors duration-500">
      <header className="px-6 py-4 bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-pink-600 leading-none">{systemName}</h1>
            <p className="text-xs text-pink-400 mt-1 font-medium">{className}</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-pink-500 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索学生或宠物..."
              className="w-full pl-11 pr-4 py-2.5 bg-rose-50/50 border border-pink-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex items-center gap-5">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-all ${soundEnabled ? 'text-pink-500 bg-pink-50' : 'text-slate-300 bg-slate-50'}`}
            title={soundEnabled ? '静音' : '开启音效'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setShowGrowthRecords(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold transition-all group"
          >
            <History className="w-5 h-5 group-hover:rotate-[-15deg] transition-transform" />
            <span className="text-sm hidden lg:inline">成长记录</span>
          </button>
          <button 
            onClick={() => setShowShopModal(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-sky-500 font-bold transition-all"
          >
            <Store className="w-5 h-5" />
            <span className="text-sm hidden lg:inline">小卖部</span>
          </button>
          <button 
            onClick={() => setShowHonorRoll(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-yellow-500 font-bold transition-all"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-sm hidden lg:inline">光荣榜</span>
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-300 hover:text-pink-500 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-6 cute-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
            {filteredStudents.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onCardClick={() => {
                  setActiveStudentId(student.id);
                  if (student.pet) {
                    setShowPointModal(true);
                  } else {
                    setShowAdoptionModal(true);
                  }
                }}
              />
            ))}
            
            <button 
              onClick={() => setShowAddStudentModal(true)}
              className="aspect-[4/5] border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-pink-300 hover:border-pink-300 hover:text-pink-400 hover:bg-white transition-all group shadow-sm bg-white/50"
            >
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">添加新学生</span>
            </button>
          </div>
        </div>
      </main>

      {showGrowthRecords && (
        <GrowthRecordModal 
          records={records}
          onClose={() => setShowGrowthRecords(false)}
          onClear={() => setRecords([])}
        />
      )}

      {showStoreManager && (
        <StoreManagerModal 
          items={shopItems}
          onClose={() => setShowStoreManager(false)}
          onUpdateItems={(newItems) => setShopItems(newItems)}
        />
      )}

      {showAddStudentModal && (
        <AddStudentModal 
          onClose={() => setShowAddStudentModal(false)}
          onAdd={(name) => {
            const newS: Student = { id: Math.random().toString(36).substr(2, 9), name, foodCount: 0, medals: 0 };
            setStudents([...students, newS]);
            setShowAddStudentModal(false);
          }}
        />
      )}

      {showPointModal && activeStudentId && (
        <PointModal 
          student={students.find(s => s.id === activeStudentId)!}
          rules={pointRules}
          onClose={() => setShowPointModal(false)}
          onAction={(rule) => handlePointAction(activeStudentId, rule)}
          onAddRule={(rule) => setPointRules([...pointRules, rule])}
        />
      )}

      {showAdoptionModal && activeStudentId && (
        <AdoptionModal 
          student={students.find(s => s.id === activeStudentId)!}
          onClose={() => setShowAdoptionModal(false)}
          onAdopt={(type, name, img) => handleAdopt(activeStudentId, type, name, img)}
        />
      )}

      {showShopModal && (
        <ShopModal 
          items={shopItems}
          students={students}
          onClose={() => setShowShopModal(false)}
          onRedeem={handleRedeem}
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
          systemName={systemName}
          className={className}
          rules={pointRules}
          onSave={(sys, cls, rls) => {
            setSystemName(sys);
            setClassName(cls);
            setPointRules(rls);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
