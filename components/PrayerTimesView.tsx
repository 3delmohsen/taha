import React, { useEffect, useState } from 'react';
import { MapPin, Bell, Sun, Moon, Wind, Calendar, Navigation as NavIcon, ArrowRight, Clock } from 'lucide-react';
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
  const [qiblaRotation, setQiblaRotation] = useState(0);

  useEffect(() => {
    // 1. Get Location & Times
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Get Prayer Times
          const data = await getPrayerTimes(latitude, longitude);
          setTimings(data);
          
          // Reverse Geocoding to get City Name
          try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=${language}`
            );
            const addressData = await response.json();
            
            const city = addressData.address.city || addressData.address.town || addressData.address.village || addressData.address.state;
            const country = addressData.address.country;
            
            if (city) {
                setLocationName(`${city}${country ? `, ${country}` : ''}`);
            } else {
                setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            }
          } catch (e) {
            console.error("Geocoding failed", e);
            setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }

          setLoading(false);
          
          // Qibla Calc
          const kaabaLat = 21.4225;
          const kaabaLng = 39.8262;
          const y = Math.sin(kaabaLng - longitude) * Math.cos(kaabaLat);
          const x = Math.cos(latitude) * Math.sin(kaabaLat) -
                    Math.sin(latitude) * Math.cos(kaabaLat) * Math.cos(kaabaLng - longitude);
          let qibla = Math.atan2(y, x);
          qibla = (qibla * 180 / Math.PI + 360) % 360;
          setQiblaRotation(qibla);
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
        setLocationName(t('unsupported'));
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
      <div className="flex h-full flex-col items-center justify-center space-y-4">
          <Logo size={60} />
      </div>
  );

  return (
    <div className="pb-32 pt-6 px-5 space-y-6 bg-gradient-to-b from-[#fdfbf7] to-white h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center text-slate-800">
        <div className="flex items-center gap-3">
             <Logo size={40} />
             <div className="h-8 w-[1px] bg-slate-200"></div>
             <div>
                <h1 className="text-sm font-bold text-slate-900">{t('greeting')}</h1>
                <div className="flex items-center space-x-1 rtl:space-x-reverse text-slate-500">
                    <MapPin size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-medium max-w-[150px] truncate opacity-70" dir="ltr">{locationName}</span>
                </div>
             </div>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
             <Calendar size={14} className="text-emerald-600" />
             <div className="text-[10px] font-bold text-slate-700 leading-tight">
                {language === 'ar' 
                    ? format(new Date(), 'd MMM', { locale: ar })
                    : format(new Date(), 'd MMM')
                }
             </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Next Prayer - Large Card */}
        <div className="col-span-2 relative group overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-xl p-6 min-h-[180px] flex flex-col justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-slate-900 opacity-90"></div>
             {/* Abstract Shapes */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
             
             <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                     <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-2 w-fit">
                        <Clock size={12} className="text-emerald-300" />
                        <span className="text-[10px] font-medium text-emerald-100 uppercase tracking-wider">{t('nextPrayer')}</span>
                     </div>
                     <Bell size={18} className="text-white/50" />
                 </div>
                 
                 <div className="flex items-end gap-4">
                     <h2 className="text-5xl font-bold font-kufi text-white drop-shadow-md">
                        {nextPrayer ? t(nextPrayer.name.toLowerCase()) : "--"}
                     </h2>
                     <div className="mb-2 text-emerald-300 font-mono text-xl">
                        {nextPrayer?.time}
                     </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                     <div className="text-xs text-slate-300">{t('timeLeft')}</div>
                     <div className="font-mono text-2xl font-light tracking-widest tabular-nums">
                         {nextPrayer ? formatTimeLeft(nextPrayer.diffMs) : "00:00:00"}
                     </div>
                 </div>
             </div>
        </div>

        {/* Qibla Card - Small */}
        <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-50 rounded-bl-[2rem] -mr-2 -mt-2"></div>
            <div className="z-10">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-3">
                    <NavIcon size={16} style={{ transform: `rotate(${qiblaRotation}deg)` }} className="transition-transform duration-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{t('qibla')}</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">{t('qiblaDesc')}</p>
            </div>
        </div>

        {/* Azkar Card - Small */}
        <div onClick={() => setView(AppView.AZKAR)} className="bg-emerald-50 p-4 rounded-[1.5rem] shadow-sm border border-emerald-100 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform">
             <div className="flex justify-between items-start">
                 <Sun size={24} className="text-emerald-600" />
                 <ArrowRight size={16} className="text-emerald-400 rtl:rotate-180" />
             </div>
             <div>
                 <h3 className="font-bold text-emerald-900 text-sm">{t('azkar')}</h3>
                 <p className="text-[10px] text-emerald-700/70 mt-1">{t('azkarDesc')}</p>
             </div>
        </div>
      </div>

      {/* Prayer List - Clean */}
      <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
         <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {t('todayPrayers')}
         </h3>
         <div className="space-y-4">
             {timings && ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((key) => {
                 const time = timings[key];
                 const isNext = nextPrayer?.name === key;
                 return (
                     <div key={key} className={`flex justify-between items-center ${isNext ? 'opacity-100' : 'opacity-60'}`}>
                         <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                 isNext ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-400'
                             }`}>
                                 {isNext ? <Clock size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                             </div>
                             <span className={`text-sm font-medium ${isNext ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                                 {t(key.toLowerCase())}
                             </span>
                         </div>
                         <span className={`font-mono text-sm ${isNext ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                             {time}
                         </span>
                     </div>
                 );
             })}
         </div>
      </div>
    </div>
  );
};

export default PrayerTimesView;