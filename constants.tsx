
import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  FileCheck, 
  Mic, 
  Hand, 
  Heart, 
  Sparkles, 
  Book, 
  TrendingUp,
  Clock,
  Volume2,
  Moon,
  Ban,
  MessageSquare,
  Users,
  Eraser,
  Armchair,
  Cookie,
  Award,
  Film,
  Crown,
  Key,
  Zap,
  Target,
  Shield,
  Palette,
  Glasses,
  Music,
  Ghost
} from 'lucide-react';
import { PointRule, ShopItem, Student, PetType, GrowthStage, Ability } from './types';

// Sound Effect Utility using Web Audio API
export const playSound = (type: 'pop' | 'magic' | 'levelUp' | 'blip') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case 'pop':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
      
    case 'blip':
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'magic':
      osc.type = 'triangle';
      [440, 554, 659, 880].forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
      });
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;

    case 'levelUp':
      osc.type = 'sine';
      const notes = [523, 659, 783, 1046]; 
      notes.forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
      });
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
  }
};

export const ALL_PETS = [
  { breed: '白猫', type: PetType.CAT, img: 'https://api.iconify.design/noto:cat.svg' },
  { breed: '比熊', type: PetType.DOG, img: 'https://api.iconify.design/noto:dog.svg' },
  { breed: '边牧', type: PetType.DOG, img: 'https://api.iconify.design/noto:guide-dog.svg' },
  { breed: '布偶', type: PetType.CAT, img: 'https://api.iconify.design/noto:cat-face.svg' },
  { breed: '柴犬', type: PetType.DOG, img: 'https://api.iconify.design/noto:service-dog.svg' },
  { breed: '斗牛', type: PetType.DOG, img: 'https://api.iconify.design/noto:poodle.svg' },
  { breed: '法斗', type: PetType.DOG, img: 'https://api.iconify.design/noto:dog-face.svg' },
  { breed: '黑猫', type: PetType.CAT, img: 'https://api.iconify.design/fluent-emoji:cat-face.svg' },
  { breed: '橘猫', type: PetType.CAT, img: 'https://api.iconify.design/fluent-emoji:smiling-cat-with-heart-eyes.svg' },
  { breed: '柯基', type: PetType.DOG, img: 'https://api.iconify.design/fluent-emoji:dog-face.svg' },
  { breed: '拉布拉多', type: PetType.DOG, img: 'https://api.iconify.design/fluent-emoji:guide-dog.svg' },
  { breed: '蓝猫', type: PetType.CAT, img: 'https://api.iconify.design/fluent-emoji:cat.svg' },
  { breed: '萨摩耶', type: PetType.DOG, img: 'https://api.iconify.design/noto:poodle.svg' },
  { breed: '三花', type: PetType.CAT, img: 'https://api.iconify.design/noto:cat-with-wry-smile.svg' },
  { breed: '泰迪', type: PetType.DOG, img: 'https://api.iconify.design/fluent-emoji:poodle.svg' },
  { breed: '暹罗猫', type: PetType.CAT, img: 'https://api.iconify.design/fluent-emoji:crying-cat.svg' },
  { breed: '银渐层', type: PetType.CAT, img: 'https://api.iconify.design/fluent-emoji:kissing-cat.svg' },
  { breed: '金毛', type: PetType.DOG, img: 'https://api.iconify.design/fluent-emoji:service-dog.svg' },
  { breed: '德牧', type: PetType.DOG, img: 'https://api.iconify.design/noto:dog.svg' },
  { breed: '哈士奇', type: PetType.DOG, img: 'https://api.iconify.design/noto:wolf.svg' },
  { breed: '兔宝宝', type: PetType.RABBIT, img: 'https://api.iconify.design/fluent-emoji:rabbit-face.svg' }
];

export const ABILITIES: Ability[] = [
  { id: 'a1', name: '勤学之眼', description: '获得XP时有20%概率额外获得1点', unlockedAt: 5, icon: 'Zap' },
  { id: 'a2', name: '荣誉之心', description: '兑换奖品时享受9折优惠', unlockedAt: 10, icon: 'Target' },
  { id: 'a3', name: '守护光环', description: '扣分项目的影响减少1点', unlockedAt: 15, icon: 'Shield' },
];

export const getStageFromLevel = (level: number): GrowthStage => {
  if (level <= 5) return GrowthStage.BABY;
  if (level <= 10) return GrowthStage.TEEN;
  return GrowthStage.ADULT;
};

// Simplified image logic: keeps the user's selected breed image
export const getPetImage = (baseImage: string, level: number): string => {
  return baseImage; 
};

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: '王可可', foodCount: 5, medals: 2, pet: { id: 'p1', name: '小白', type: PetType.CAT, level: 2, xp: 15, baseImage: ALL_PETS[0].img, image: ALL_PETS[0].img, stage: getStageFromLevel(2), abilities: [] } },
  { id: '2', name: '陈思琪', foodCount: 12, medals: 5, pet: { id: 'p2', name: '比比', type: PetType.DOG, level: 1, xp: 8, baseImage: ALL_PETS[1].img, image: ALL_PETS[1].img, stage: getStageFromLevel(1), abilities: [] } },
  { id: '3', name: '胡斌', foodCount: 3, medals: 1, pet: { id: 'p3', name: '壮壮', type: PetType.DOG, level: 4, xp: 35, baseImage: ALL_PETS[2].img, image: ALL_PETS[2].img, stage: getStageFromLevel(4), abilities: [] } },
  { id: '5', name: '唐可馨', foodCount: 8, medals: 3, pet: { id: 'p5', name: '花花', type: PetType.CAT, level: 8, xp: 75, baseImage: ALL_PETS[13].img, image: ALL_PETS[13].img, stage: getStageFromLevel(8), abilities: [ABILITIES[0]] } },
];

export const POINT_RULES: PointRule[] = [
  { id: 'r1', label: '早读打卡', value: 1, icon: 'BookOpen', type: 'positive' },
  { id: 'r2', label: '答对问题', value: 2, icon: 'HelpCircle', type: 'positive' },
  { id: 'r3', label: '作业优秀', value: 3, icon: 'FileCheck', type: 'positive' },
  { id: 'r4', label: '完成背诵', value: 2, icon: 'Mic', type: 'positive' },
  { id: 'r5', label: '积极举手', value: 1, icon: 'Hand', type: 'positive' },
  { id: 'r10', label: '迟到早退', value: -1, icon: 'Clock', type: 'negative' },
  { id: 'r11', label: '课堂吵闹', value: -2, icon: 'Volume2', type: 'negative' },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 's1', name: '免作业卡', description: '可免一次作业', price: 10, icon: 'Eraser', stock: 10, type: 'consumable' },
  { id: 's4', name: '贴纸奖励', description: '获得精美贴纸一张', price: 5, icon: 'Award', stock: 50, type: 'consumable' },
  { id: 's5', name: '电影时间', description: '全班共赏小视频', price: 50, icon: 'Film', stock: 2, type: 'consumable' },
  { id: 'c1', name: '梦幻粉', description: '宠物变身为粉色调', price: 15, icon: 'Palette', stock: 99, type: 'color', value: 300 },
  { id: 'c2', name: '翡翠绿', description: '宠物变身为绿色调', price: 15, icon: 'Palette', stock: 99, type: 'color', value: 90 },
  { id: 'c3', name: '海洋蓝', description: '宠物变身为蓝色调', price: 15, icon: 'Palette', stock: 99, type: 'color', value: 200 },
  { id: 'a1_acc', name: '酷酷墨镜', description: '给宠物戴上一副墨镜', price: 20, icon: 'Glasses', stock: 99, type: 'accessory', value: 'Glasses' },
  { id: 'a2_acc', name: '音乐耳机', description: '宠物戴上时尚耳机', price: 20, icon: 'Music', stock: 99, type: 'accessory', value: 'Music' },
  { id: 'a3_acc', name: '幽灵披风', description: '宠物披上神秘披风', price: 25, icon: 'Ghost', stock: 99, type: 'accessory', value: 'Ghost' },
];

export const IconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5 text-emerald-500" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-sky-500" />,
  FileCheck: <FileCheck className="w-5 h-5 text-indigo-500" />,
  Mic: <Mic className="w-5 h-5 text-orange-500" />,
  Hand: <Hand className="w-5 h-5 text-teal-500" />,
  Heart: <Heart className="w-5 h-5 text-pink-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-yellow-500" />,
  Book: <Book className="w-5 h-5 text-blue-500" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-green-500" />,
  Clock: <Clock className="w-5 h-5 text-rose-500" />,
  Volume2: <Volume2 className="w-5 h-5 text-red-500" />,
  Moon: <Moon className="w-5 h-5 text-purple-500" />,
  Ban: <Ban className="w-5 h-5 text-gray-500" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-amber-500" />,
  Users: <Users className="w-5 h-5 text-stone-500" />,
  Eraser: <Eraser className="w-5 h-5 text-indigo-400" />,
  Armchair: <Armchair className="w-5 h-5 text-purple-400" />,
  Cookie: <Cookie className="w-5 h-5 text-amber-600" />,
  Award: <Award className="w-5 h-5 text-pink-400" />,
  Film: <Film className="w-5 h-5 text-sky-600" />,
  Crown: <Crown className="w-5 h-5 text-yellow-600" />,
  Key: <Key className="w-5 h-5 text-rose-600" />,
  Zap: <Zap className="w-4 h-4 text-yellow-400" />,
  Target: <Target className="w-4 h-4 text-sky-400" />,
  Shield: <Shield className="w-4 h-4 text-emerald-400" />,
  Palette: <Palette className="w-5 h-5 text-purple-400" />,
  Glasses: <Glasses className="w-5 h-5 text-slate-700" />,
  Music: <Music className="w-5 h-5 text-sky-500" />,
  Ghost: <Ghost className="w-5 h-5 text-indigo-400" />,
};
