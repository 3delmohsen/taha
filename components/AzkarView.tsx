import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Sun, Moon, Hand, Check } from 'lucide-react';
import { ZikrItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

const AZKAR_DATA: ZikrItem[] = [
    { id: 1, category: 'morning', text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 0, target: 100 },
    { id: 2, category: 'morning', text: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", count: 0, target: 100 },
    { id: 3, category: 'evening', text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا", count: 0, target: 1 },
    { id: 4, category: 'prayer', text: "سُبْحَانَ اللهِ", count: 0, target: 33 },
    { id: 5, category: 'prayer', text: "الْحَمْدُ لِلَّهِ", count: 0, target: 33 },
    { id: 6, category: 'prayer', text: "اللهُ أَكْبَرُ", count: 0, target: 33 },
];

const AzkarView: React.FC<Props> = ({ goBack }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'prayer'>('morning');
  const [items, setItems] = useState<ZikrItem[]>(AZKAR_DATA);

  const increment = (id: number) => {
      // Vibrate if available
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(10);
      }
      
      setItems(prev => prev.map(item => {
          if (item.id === id) {
              if (item.count >= item.target) return item;
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
    <div className="flex flex-col h-full bg-[#fdfbf7] pb-24">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md p-4 pt-8 border-b border-slate-100 sticky top-0 z-20">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={goBack} className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-full text-slate-600 hover:bg-slate-50 rtl:rotate-180 transition-colors">
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">{t('azkar')}</h1>
            </div>

            {/* Floating Tabs */}
            <div className="flex p-1.5 bg-slate-100/80 rounded-2xl">
                {[
                    { id: 'morning', label: t('morning'), icon: Sun },
                    { id: 'evening', label: t('evening'), icon: Moon },
                    { id: 'prayer', label: t('prayer'), icon: Hand },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                            activeTab === tab.id 
                            ? 'bg-white text-emerald-600 shadow-sm scale-100' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
            {filteredItems.map(item => {
                const progress = (item.count / item.target) * 100;
                const isComplete = item.count >= item.target;
                
                // Radius for the circular progress
                const r = 24;
                const c = 2 * Math.PI * r;
                const offset = c - (item.count / item.target) * c;

                return (
                    <div key={item.id} className={`group bg-white rounded-3xl p-5 shadow-sm border transition-all duration-300 ${isComplete ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
                        <div className="flex justify-between items-start mb-6">
                             <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {item.count} / {item.target}
                                </span>
                             </div>
                             {!isComplete && (
                                <button onClick={(e) => { e.stopPropagation(); reset(item.id); }} className="text-slate-300 hover:text-red-400 transition-colors">
                                    <RotateCcw size={16} />
                                </button>
                             )}
                        </div>

                        <p className="font-quran text-2xl text-center text-slate-800 leading-loose mb-8 px-2">
                            {item.text}
                        </p>

                        {/* Interactive Counter Button */}
                        <button 
                            onClick={() => increment(item.id)}
                            disabled={isComplete}
                            className="w-full relative h-16 rounded-2xl overflow-hidden active:scale-98 transition-transform touch-manipulation group-hover:shadow-lg group-hover:shadow-emerald-900/5"
                        >
                            <div className={`absolute inset-0 transition-colors duration-500 flex items-center justify-center
                                ${isComplete ? 'bg-emerald-500' : 'bg-slate-900'}
                            `}>
                                {/* Background Progress Bar (Linear visual fallback) */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-white/10 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>

                                {isComplete ? (
                                    <div className="flex items-center gap-2 text-white animate-bounce-short">
                                        <Check size={20} />
                                        <span className="font-bold">{t('completed')}</span>
                                    </div>
                                ) : (
                                    <span className="font-mono text-xl text-white font-medium relative z-10">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                );
            })}
            <div className="h-10"></div>
        </div>
    </div>
  );
};

export default AzkarView;