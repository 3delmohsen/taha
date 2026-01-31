import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Sun, Moon, Hand } from 'lucide-react';
import { ZikrItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

const AZKAR_DATA: ZikrItem[] = [
    { id: 1, category: 'morning', text: "سبحان الله وبحمده", count: 0, target: 100 },
    { id: 2, category: 'morning', text: "أستغفر الله العظيم وأتوب إليه", count: 0, target: 100 },
    { id: 3, category: 'evening', text: "اللهم بك أمسينا وبك أصبحنا", count: 0, target: 1 },
    { id: 4, category: 'prayer', text: "سبحان الله", count: 0, target: 33 },
    { id: 5, category: 'prayer', text: "الحمد لله", count: 0, target: 33 },
    { id: 6, category: 'prayer', text: "الله أكبر", count: 0, target: 33 },
];

const AzkarView: React.FC<Props> = ({ goBack }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'prayer'>('morning');
  const [items, setItems] = useState<ZikrItem[]>(AZKAR_DATA);

  const increment = (id: number) => {
      if (navigator.vibrate) navigator.vibrate(15);
      setItems(prev => prev.map(item => {
          if (item.id === id) {
              return { ...item, count: item.count + 1 };
          }
          return item;
      }));
  };

  const reset = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, count: 0 } : item));
  };

  const filteredItems = items.filter(i => i.category === activeTab);

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white p-4 pt-8 shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={goBack} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 rtl:rotate-180">
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">{t('azkar')}</h1>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
                {[
                    { id: 'morning', label: t('morning'), icon: Sun },
                    { id: 'evening', label: t('evening'), icon: Moon },
                    { id: 'prayer', label: t('prayer'), icon: Hand },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                            activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
            {filteredItems.map(item => {
                const progress = Math.min(100, (item.count / item.target) * 100);
                const isComplete = item.count >= item.target;

                return (
                    <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div 
                            className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md">
                                {item.target} {t('times')}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); reset(item.id); }} className="text-slate-300 hover:text-red-400">
                                <RotateCcw size={16} />
                            </button>
                        </div>

                        <p className="font-quran text-2xl text-center text-slate-800 leading-relaxed mb-6">
                            {item.text}
                        </p>

                        <button 
                            onClick={() => increment(item.id)}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                ${isComplete 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800'
                                }
                            `}
                        >
                            {isComplete ? t('completed') : item.count}
                        </button>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default AzkarView;
