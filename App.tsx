import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import PrayerTimesView from './components/PrayerTimesView';
import QuranView from './components/QuranView';
import AIFatwaView from './components/AIFatwaView';
import MoreView from './components/MoreView';
import HajjGuideView from './components/HajjGuideView';
import AzkarView from './components/AzkarView';
import SettingsView from './components/SettingsView';
import SupportView from './components/SupportView';
import SplashScreen from './components/SplashScreen';
import { AppView } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const MainApp: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.HOME);
  const [loading, setLoading] = useState(true);
  const { dir } = useLanguage();

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <PrayerTimesView setView={setView} />;
      case AppView.QURAN:
        return <QuranView />;
      case AppView.FATWA:
        return <AIFatwaView />;
      case AppView.HAJJ:
        return <HajjGuideView goBack={() => setView(AppView.MORE)} />;
      case AppView.AZKAR:
        return <AzkarView goBack={() => setView(AppView.HOME)} />;
      case AppView.SETTINGS:
        return <SettingsView goBack={() => setView(AppView.MORE)} />;
      case AppView.SUPPORT:
        return <SupportView goBack={() => setView(AppView.MORE)} />;
      case AppView.MORE:
        return <MoreView setView={setView} />;
      default:
        return <PrayerTimesView setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900" dir={dir}>
      <div className="max-w-md mx-auto min-h-screen bg-[#fdfbf7] shadow-2xl shadow-slate-300 relative overflow-hidden flex flex-col">
         {/* Top Status Bar Decoration */}
         <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600 w-full sticky top-0 z-50 shrink-0"></div>

         {/* Main Content Area */}
         <main className="flex-1 overflow-hidden relative pb-20">
            {renderView()}
         </main>

         {/* Bottom Navigation */}
         <Navigation currentView={currentView} setView={setView} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;