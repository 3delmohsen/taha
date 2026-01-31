import React, { useEffect, useState } from 'react';
import { MapPin, Bell, Sun, Moon, Calendar, Navigation as NavIcon, ArrowRight, Clock, ChevronRight, HeartHandshake } from 'lucide-react';
import { getPrayerTimes, getNextPrayer } from '../services/prayerService';
import { PrayerTimings, AppView } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  setView: (view: AppView) => void;
}

const PrayerTimesView: React.FC<Props> = ({ setView }) => {
  const { t, language } = useLanguage();
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diffMs: number } | null>(null);
  const [locationName, setLocationName] = useState(t('location'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await getPrayerTimes(latitude, longitude);
          setTimings(data);
          
          try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=${language}`
            );
            const addressData = await response.json();
            const city = addressData.address.city || addressData.address.town || addressData.address.state;
            if (city) setLocationName(city);
          } catch (e) {
            console.error("Geocoding failed", e);
            setLocationName(`${latitude.toFixed(1)}, ${longitude.toFixed(1)}`);
          }
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLocationName("Makkah");
          getPrayerTimes(21.42, 39.82).then(data => {
            setTimings(data);
            setLoading(false);
          });
        }
      );
    } else {
        setLoading(false);
    }
  }, [t, language]);

  useEffect(() => {
    if (timings) {
        const interval = setInterval(() => {
            setNextPrayer(getNextPrayer(timings));
        }, 1000);
        setNextPrayer(getNextPrayer(timings));
        return () => clearInterval(interval);
    }
  }, [timings]);

  const formatTimeLeft = (ms: number) => {
     if (ms < 0) return "00:00:00";
     const seconds = Math.floor((ms / 1000) % 60);
     const minutes = Math.floor((ms / 1000 / 60) % 60);
     const hours = Math.floor((ms / 1000 / 3600) % 24);
     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 bg-[#fdfbf7]">
          <Logo size={80} />
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
  );

  return (
    <div className="pb-32 pt-6 px-5 space-y-6 h-full overflow-y-auto no-scrollbar bg-[#fdfbf7]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
             <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                <Logo size={32} />
             </div>
             <div>
                <h1 className="text-sm font-bold text-slate-800">{t('greeting')}</h1>
                <div className="flex items-center space-x-1 rtl:space-x-reverse text-slate-500">
                    <MapPin size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-medium opacity-80">{locationName}</span>
                </div>
             </div>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
             <div className="text-[10px] font-bold text-slate-700">
                {language === 'ar' ? format(new Date(), 'd MMMM', { locale: ar }) : format(new Date(), 'd MMM')}
             </div>
        </div>
      </div>

      {/* Hero: Next Prayer */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-emerald-900/20 min-h-[220px] flex flex-col justify-between p-7 group">
           {/* Background Effects */}
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-slate-900 opacity-90"></div>
           <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -ml-5 -mb-5"></div>
           
           <div className="relative z-10 flex justify-between items-start">
               <div className="bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/5">
                  <Clock size={12} className="text-emerald-300" />
                  <span className="text-[10px] font-medium text-emerald-50 uppercase tracking-widest">{t('nextPrayer')}</span>
               </div>
               <Bell size={20} className="text-white/70" />
           </div>
           
           <div className="relative z-10 flex flex-col items-center justify-center py-2">
               <h2 className="text-6xl font-bold font-kufi text-white drop-shadow-lg tracking-tight">
                  {nextPrayer ? t(nextPrayer.name.toLowerCase()) : "--"}
               </h2>
               <div className="text-emerald-200 font-mono text-xl mt-1 opacity-90 tracking-widest">
                  {nextPrayer?.time}
               </div>
           </div>

           <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between border border-white/5">
               <div className="text-xs text-emerald-100/70 font-medium">{t('timeLeft')}</div>
               <div className="font-mono text-xl font-medium tracking-wider tabular-nums">
                   {nextPrayer ? formatTimeLeft(nextPrayer.diffMs) : "00:00:00"}
               </div>
           </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setView(AppView.AZKAR)}
            className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center h-28 relative overflow-hidden group hover:border-emerald-200 transition-colors gap-2"
          >
             <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                 <Sun size={20} />
             </div>
             <span className="font-bold text-slate-700 text-xs">{t('azkar')}</span>
          </button>

          <button 
            onClick={() => setView(AppView.DUA)}
            className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center h-28 relative overflow-hidden group hover:border-indigo-200 transition-colors gap-2"
          >
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                 <HeartHandshake size={20} />
             </div>
             <span className="font-bold text-slate-700 text-xs">{t('dua')}</span>
          </button>

          <button 
            onClick={() => setView(AppView.QIBLA)}
            className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center h-28 relative overflow-hidden group hover:border-amber-200 transition-colors gap-2"
          >
             <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                 <NavIcon size={20} />
             </div>
             <span className="font-bold text-slate-700 text-xs">{t('qibla')}</span>
          </button>
      </div>

      {/* Prayers List */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></span>
                {t('todayPrayers')}
            </h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Makkah Time</span>
         </div>
         
         <div className="space-y-1">
             {timings && ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((key, idx) => {
                 const time = timings[key];
                 const isNext = nextPrayer?.name === key;
                 return (
                     <div 
                        key={key} 
                        className={`group flex justify-between items-center p-3 rounded-2xl transition-all duration-300 ${
                            isNext ? 'bg-emerald-50 shadow-sm translate-x-2 rtl:-translate-x-2' : 'hover:bg-slate-50'
                        }`}
                     >
                         <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                 isNext ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                             }`}>
                                 {isNext ? <Clock size={16} /> : idx + 1}
                             </div>
                             <span className={`text-sm font-medium ${isNext ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                                 {t(key.toLowerCase())}
                             </span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className={`font-mono text-sm ${isNext ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                                {time}
                            </span>
                            {isNext && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                         </div>
                     </div>
                 );
             })}
         </div>
      </div>
    </div>
  );
};

export default PrayerTimesView;