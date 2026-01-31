import React from 'react';
import { Home, BookOpen, MessageCircle, Menu, Compass } from 'lucide-react';
import { AppView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const { t } = useLanguage();
  
  // Main tabs
  const navItems = [
    { view: AppView.HOME, label: t('home'), icon: Home },
    { view: AppView.QURAN, label: t('quran'), icon: BookOpen },
    { view: AppView.FATWA, label: t('fatwa'), icon: MessageCircle },
    { view: AppView.MORE, label: t('more'), icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Floating Action Button for Hajj/Qibla - Lifted higher and z-index boosted */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-[60]">
             <div className="bg-emerald-600 p-1.5 rounded-full shadow-xl shadow-emerald-200 border-[5px] border-[#fdfbf7]">
                 <button 
                    className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-400 transition-colors active:scale-95" 
                    onClick={() => setView(AppView.HAJJ)}
                    aria-label="Hajj Guide"
                 >
                     <Compass size={28} className="text-white" strokeWidth={2} />
                 </button>
             </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] pb-safe safe-area-bottom relative z-50">
            <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
                {navItems.map((item, index) => {
                const isActive = currentView === item.view || 
                                 (item.view === AppView.MORE && (currentView === AppView.HAJJ || currentView === AppView.AZKAR));
                
                // Add spacing for center FAB
                const marginClass = index === 1 ? "mr-10 rtl:ml-10 rtl:mr-0 ltr:mr-10" : index === 2 ? "ml-10 rtl:mr-10 rtl:ml-0 ltr:ml-10" : "";

                return (
                    <button
                    key={item.view}
                    onClick={() => setView(item.view)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${marginClass} ${
                        isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    >
                    <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50 translate-y-[-4px]' : ''}`}>
                        <item.icon
                            size={22}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={isActive ? 'animate-pulse-slow' : ''}
                        />
                    </div>
                    <span className={`text-[10px] font-medium transition-all ${isActive ? 'font-bold opacity-100' : 'opacity-70'}`}>
                        {item.label}
                    </span>
                    </button>
                );
                })}
            </div>
        </div>
    </div>
  );
};

export default Navigation;