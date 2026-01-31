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
    <div className="fixed bottom-6 left-4 right-4 z-50">
        {/* Floating Navbar Container */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-emerald-900/10 rounded-3xl relative h-[70px] flex items-center justify-between px-2">
            
            {/* Center FAB (Floating Action Button) for Qibla/Hajj */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
                 <button 
                    className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full shadow-lg shadow-emerald-500/30 border-4 border-[#fdfbf7] active:scale-95 transition-transform duration-300"
                    onClick={() => setView(AppView.QIBLA)}
                    aria-label="Qibla"
                 >
                     <Compass size={28} className="text-white group-hover:rotate-45 transition-transform duration-500" strokeWidth={2} />
                 </button>
            </div>

            {navItems.map((item, index) => {
                const isActive = currentView === item.view || 
                                 (item.view === AppView.MORE && (currentView === AppView.HAJJ || currentView === AppView.AZKAR || currentView === AppView.SETTINGS));
                
                // Add spacer div for the middle FAB
                const isLeft = index < 2;

                return (
                    <button
                        key={item.view}
                        onClick={() => setView(item.view)}
                        className={`relative flex-1 flex flex-col items-center justify-center h-full rounded-2xl transition-all duration-300 group
                            ${isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}
                            ${index === 1 ? 'mr-8 rtl:ml-8 rtl:mr-0' : ''} 
                            ${index === 2 ? 'ml-8 rtl:mr-8 rtl:ml-0' : ''}
                        `}
                    >
                        <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50 translate-y-[-2px]' : 'group-hover:bg-slate-50'}`}>
                            <item.icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={isActive ? 'scale-110 transition-transform' : ''}
                            />
                        </div>
                        <span className={`text-[10px] font-medium mt-0.5 transition-all ${isActive ? 'opacity-100 font-bold' : 'opacity-0 h-0 overflow-hidden'}`}>
                            {item.label}
                        </span>
                        
                        {/* Active Indicator Dot */}
                        {isActive && (
                            <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default Navigation;