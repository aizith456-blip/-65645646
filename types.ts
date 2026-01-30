
export enum PetType {
  EGG = 'Egg',
  CAT = 'Cat',
  DOG = 'Dog',
  RABBIT = 'Rabbit'
}

export enum GrowthStage {
  BABY = '幼年期',
  TEEN = '成长期',
  ADULT = '成熟期'
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  icon: string;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  level: number;
  xp: number;
  image: string;
  baseImage: string; // Store the original selected breed image
  stage: GrowthStage;
  abilities: Ability[];
  hueRotate?: number; 
  accessoryIcon?: string;
}

export interface Student {
  id: string;
  name: string;
  pet?: Pet;
  foodCount: number;
  medals: number;
}

export interface PointRule {
  id: string;
  label: string;
  value: number;
  icon: string;
  type: 'positive' | 'negative';
}

export type ShopItemType = 'consumable' | 'accessory' | 'color';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  stock: number;
  type: ShopItemType;
  value?: string | number;
}

export interface GrowthRecord {
  id: string;
  studentName: string;
  timestamp: string;
  type: 'point' | 'redeem' | 'adopt' | 'milestone';
  description: string;
  valueChange?: string;
}
