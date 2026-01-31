import React from 'react';
import { Settings, HelpCircle, Share2, Star, Map, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AppView } from '../types';

interface Props {
    setView: (view: AppView) => void;
}

const MoreView: React.FC<Props> = ({ setView }) => {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const menuItems = [
    { icon: Settings, label: t('settings'), color: "text-slate-500", action: () => setView(AppView.SETTINGS) },
    { icon: Share2, label: t('share'), color: "text-amber-500", action: () => { if(navigator.share) navigator.share({title: 'Taha App', url: window.location.href}); } },
    { icon: Star, label: t('rate'), color: "text-yellow-500", action: () => {} },
    { icon: HelpCircle, label: t('support'), color: "text-slate-500", action: () => setView(AppView.SUPPORT) },
  ];

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">{t('more')}</h1>
        
        {/* Hajj Feature Highlight */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-200">
             <Map className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto opacity-20" size={60} />
             <h3 className="text-xl font-bold mb-2">{t('hajjHighlight')}</h3>
             <p className="text-emerald-100 text-sm mb-4">{t('hajjHighlightDesc')}</p>
             <button 
                onClick={() => setView(AppView.HAJJ)}
                className="bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform"
             >
                {t('startJourney')}
             </button>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             {/* Language Switcher */}
             <div className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={toggleLanguage}>
                <div className="flex items-center gap-3">
                    <Globe size={20} className="text-indigo-500" />
                    <span className="text-slate-700 font-medium">{t('language')}</span>
                </div>
                <button 
                    className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                >
                    <span className={language === 'ar' ? 'text-emerald-600' : 'opacity-50'}>العربية</span>
                    <span className="opacity-30">|</span>
                    <span className={language === 'en' ? 'text-emerald-600' : 'opacity-50'}>English</span>
                </button>
             </div>

             {menuItems.map((item, idx) => (
                <button 
                    key={idx} 
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <item.icon size={20} className={item.color} />
                        <span className="text-slate-700 font-medium">{item.label}</span>
                    </div>
                </button>
             ))}
        </div>
        
        <div className="text-center text-xs text-slate-300 py-4">
            Version 1.0.0
        </div>
    </div>
  );
};

export default MoreView;