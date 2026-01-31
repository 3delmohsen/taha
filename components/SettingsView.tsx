import React, { useState } from 'react';
import { ArrowRight, Bell, Globe, MapPin, Moon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

const SettingsView: React.FC<Props> = ({ goBack }) => {
  const { t, language, setLanguage } = useLanguage();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [calcMethod, setCalcMethod] = useState("4"); // Default Umm Al Qura

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white p-4 pt-8 shadow-sm border-b border-slate-100 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button onClick={goBack} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 rtl:rotate-180">
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-bold text-slate-800">{t('settings')}</h1>
            </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto no-scrollbar">
            
            {/* Language Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4 text-emerald-700">
                    <Globe size={20} />
                    <h3 className="font-bold">{t('language')}</h3>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setLanguage('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'ar' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
                    >
                        العربية
                    </button>
                    <button 
                         onClick={() => setLanguage('en')}
                         className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
                    >
                        English
                    </button>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-emerald-700">
                        <Bell size={20} />
                        <h3 className="font-bold">{t('notifications')}</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 rtl:peer-checked:after:-translate-x-full"></div>
                    </label>
                </div>
                <p className="text-xs text-slate-400 pl-8 rtl:pr-8">{t('adhanAlerts')}</p>
            </div>

            {/* Prayer Calculation Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4 text-emerald-700">
                    <MapPin size={20} />
                    <h3 className="font-bold">{t('calcMethod')}</h3>
                </div>
                <select 
                    value={calcMethod}
                    onChange={(e) => setCalcMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 outline-none"
                >
                    <option value="4">{t('ummAlQura')}</option>
                    <option value="5">{t('egypt')}</option>
                    <option value="3">{t('mwl')}</option>
                    <option value="1">{t('karachi')}</option>
                </select>
            </div>

            {/* Appearance (Static for visual) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 opacity-60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-emerald-700">
                        <Moon size={20} />
                        <h3 className="font-bold">Dark Mode</h3>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Coming Soon</span>
                </div>
            </div>

        </div>
    </div>
  );
};

export default SettingsView;