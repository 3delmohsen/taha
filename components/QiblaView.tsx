import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, MapPin, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

const QiblaView: React.FC<Props> = ({ goBack }) => {
  const { t } = useLanguage();
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Calculate Qibla Direction relative to North
          const kaabaLat = 21.4225;
          const kaabaLng = 39.8262;
          
          const y = Math.sin((kaabaLng - longitude) * (Math.PI / 180)) * Math.cos(kaabaLat * (Math.PI / 180));
          const x = Math.cos(latitude * (Math.PI / 180)) * Math.sin(kaabaLat * (Math.PI / 180)) -
                    Math.sin(latitude * (Math.PI / 180)) * Math.cos(kaabaLat * (Math.PI / 180)) * Math.cos((kaabaLng - longitude) * (Math.PI / 180));
          
          let qibla = Math.atan2(y, x);
          qibla = (qibla * 180 / Math.PI + 360) % 360;
          
          setQiblaAngle(qibla);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] pb-24">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md p-4 pt-8 border-b border-slate-100 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button onClick={goBack} className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-full text-slate-600 hover:bg-slate-50 rtl:rotate-180 transition-colors">
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">{t('qibla')}</h1>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
             
             {/* Background Map Decoration */}
             <div className="absolute inset-0 opacity-5 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
             </div>

             <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-emerald-900/10 border border-slate-100 relative">
                 {/* Compass Outer Ring */}
                 <div className="w-64 h-64 rounded-full border-4 border-slate-100 relative flex items-center justify-center shadow-inner">
                     
                     {/* Cardinal Points */}
                     <span className="absolute top-2 text-xs font-bold text-slate-400">N</span>
                     <span className="absolute bottom-2 text-xs font-bold text-slate-400">S</span>
                     <span className="absolute right-3 text-xs font-bold text-slate-400">E</span>
                     <span className="absolute left-3 text-xs font-bold text-slate-400">W</span>

                     {/* The Compass Needle/Dial (Static North, User rotates phone usually, but here we rotate needle to Qibla relative to North) */}
                     {/* Note: On web, getting absolute device orientation is tricky. We display the angle relative to North. */}
                     
                     <div 
                        className="absolute w-full h-full transition-transform duration-1000 ease-out"
                        style={{ transform: `rotate(${qiblaAngle}deg)` }}
                     >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4">
                             <div className="bg-emerald-600 text-white p-2 rounded-full shadow-lg shadow-emerald-500/40">
                                 <Navigation size={24} fill="currentColor" />
                             </div>
                         </div>
                         <div className="absolute top-1/2 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-transparent to-emerald-200 -translate-x-1/2 origin-bottom"></div>
                     </div>
                     
                     {/* Center Hub */}
                     <div className="w-4 h-4 bg-slate-800 rounded-full z-10 shadow-md"></div>
                 </div>
             </div>

             <div className="mt-10 text-center">
                 <h2 className="text-4xl font-bold font-mono text-slate-800 mb-2">{Math.round(qiblaAngle)}°</h2>
                 <p className="text-slate-500 text-sm max-w-[250px] mx-auto leading-relaxed">
                     {t('qiblaDesc')}
                 </p>
                 <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold border border-amber-100">
                     <Compass size={14} />
                     <span>Relative to North</span>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default QiblaView;