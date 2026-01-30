
import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check, Minus, ShoppingBag, List, ClipboardList } from 'lucide-react';
import { ShopItem, ShopItemType } from '../../types';
import { IconMap } from '../../constants';

interface StoreManagerModalProps {
  items: ShopItem[];
  onClose: () => void;
  onUpdateItems: (items: ShopItem[]) => void;
}

const StoreManagerModal: React.FC<StoreManagerModalProps> = ({ items: initialItems, onClose, onUpdateItems }) => {
  const [items, setItems] = useState<ShopItem[]>([...initialItems]);
  const [activeTab, setActiveTab] = useState<'list' | 'records'>('list');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const updateStock = (id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ));
  };

  const handleStockChange = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, num) } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addNewItem = () => {
    const newItem: ShopItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '新商品',
      description: '请填写商品描述',
      price: 1,
      icon: 'Gift',
      stock: 10,
      type: 'consumable'
    };
    setItems([newItem, ...items]);
  };

  const handleSave = () => {
    onUpdateItems(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-[85vh] animate-in zoom-in duration-300">
        {/* Header - Matching screenshot */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-100">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">货架管理</h2>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Store Manager</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" />
                商品列表
              </button>
              <button 
                onClick={() => setActiveTab('records')}
                className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'records' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ClipboardList className="w-4 h-4" />
                兑换记录
              </button>
            </div>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-orange-100 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-200 transition-all flex items-center gap-2 border border-orange-200"
            >
              <Check className="w-4 h-4" />
              完成编辑
            </button>
          </div>
          
          <button onClick={onClose} className="absolute right-4 top-4 p-2 text-slate-300 hover:text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 cute-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Add New Item Card */}
            <button 
              onClick={addNewItem}
              className="h-full min-h-[280px] border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-orange-300 hover:text-orange-400 hover:bg-white transition-all group"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <span className="text-sm font-bold">上架新商品</span>
            </button>

            {items.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-yellow-400 text-white w-8 h-8 flex items-center justify-center rounded-full font-black text-xs shadow-md shadow-yellow-100">
                  {item.price}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                  {IconMap[item.icon] || <ShoppingBag className="w-8 h-8 text-slate-300" />}
                </div>

                {/* Details */}
                <h4 className="font-bold text-slate-700 text-base mb-1">{item.name}</h4>
                <p className="text-[11px] text-slate-400 font-medium mb-6 h-8 line-clamp-2">{item.description}</p>

                {/* Stock Controls - Matching screenshot */}
                <div className="w-full space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">库存管理</span>
                  </div>
                  <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                    <button 
                      onClick={() => updateStock(item.id, -10)}
                      className="p-2 text-slate-400 hover:bg-white hover:text-orange-500 rounded-xl transition-all"
                    >
                      <span className="text-[10px] font-bold">-10</span>
                    </button>
                    <button 
                      onClick={() => updateStock(item.id, -1)}
                      className="p-2 text-slate-400 hover:bg-white hover:text-orange-500 rounded-xl transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input 
                      type="text" 
                      className="w-full text-center bg-transparent font-black text-slate-700 text-sm focus:outline-none"
                      value={item.stock}
                      onChange={(e) => handleStockChange(item.id, e.target.value)}
                    />
                    <button 
                      onClick={() => updateStock(item.id, 1)}
                      className="p-2 text-slate-400 hover:bg-white hover:text-emerald-500 rounded-xl transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="w-full flex items-center justify-between pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingItemId(item.id)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-sky-500 text-[11px] font-bold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    编辑信息
                  </button>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item Details Editor Overlay */}
      {editingItemId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingItemId(null)} />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative p-8 animate-in slide-in-from-bottom-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-orange-500" />
              修改商品详情
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">商品名称</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                  value={items.find(i => i.id === editingItemId)?.name}
                  onChange={e => setItems(prev => prev.map(i => i.id === editingItemId ? { ...i, name: e.target.value } : i))}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">商品描述</label>
                <textarea 
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium h-24"
                  value={items.find(i => i.id === editingItemId)?.description}
                  onChange={e => setItems(prev => prev.map(i => i.id === editingItemId ? { ...i, description: e.target.value } : i))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">兑换价格</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none font-black"
                    value={items.find(i => i.id === editingItemId)?.price}
                    onChange={e => setItems(prev => prev.map(i => i.id === editingItemId ? { ...i, price: parseInt(e.target.value) || 1 } : i))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">展示图标 (Lucide)</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none font-bold"
                    value={items.find(i => i.id === editingItemId)?.icon}
                    onChange={e => setItems(prev => prev.map(i => i.id === editingItemId ? { ...i, icon: e.target.value } : i))}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setEditingItemId(null)}
              className="w-full mt-8 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all"
            >
              应用修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagerModal;
