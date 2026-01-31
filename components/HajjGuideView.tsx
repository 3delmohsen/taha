import React, { useState } from 'react';
import { Map, ChevronDown, ArrowRight } from 'lucide-react';
import { HajjStep } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

const steps: HajjStep[] = [
    {
        id: 1,
        title: "الإحرام",
        day: "8 ذو الحجة",
        description: "النية للدخول في النسك من الميقات، ولبس ملابس الإحرام، والتلبية.",
        duas: ["لبيك اللهم لبيك، لبيك لا شريك لك لبيك..."]
    },
    // ... Simplified for brevity, static data could also be moved to translation file if full localization required
];

const HajjGuideView: React.FC<Props> = ({ goBack }) => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24">
       {/* Header */}
       <div className="bg-emerald-700 text-white p-6 pt-10 rounded-b-[2.5rem] shadow-xl relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <button onClick={goBack} className="absolute top-6 right-6 rtl:right-auto rtl:left-6 ltr:right-6 ltr:left-auto p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors rtl:rotate-180">
                <ArrowRight size={20} />
            </button>
            <div className="relative z-10 mt-4">
                <div className="flex items-center gap-3 mb-2 opacity-80">
                    <Map size={18} />
                    <span className="text-sm font-medium">{t('hajj')}</span>
                </div>
                <h1 className="text-3xl font-bold font-quran mb-2">{t('hajj')}</h1>
                <p className="text-emerald-100 text-sm max-w-[80%] leading-relaxed">{t('hajjDesc')}</p>
            </div>
       </div>

       {/* Timeline */}
       <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="absolute top-6 bottom-0 right-9 rtl:right-9 ltr:left-9 w-0.5 bg-emerald-200/50"></div>
          
          <div className="space-y-6 relative">
             {steps.map((step) => {
                 const isActive = activeStep === step.id;
                 return (
                     <div key={step.id} className="relative pr-10 rtl:pr-10 ltr:pl-10 ltr:pr-0">
                         {/* Dot */}
                         <div 
                            onClick={() => setActiveStep(isActive ? null : step.id)}
                            className={`absolute right-0 rtl:right-0 ltr:left-0 top-1 w-6 h-6 rounded-full border-4 cursor-pointer transition-all z-10
                                ${isActive ? 'bg-emerald-600 border-emerald-200 scale-110 shadow-lg' : 'bg-white border-emerald-300'}
                            `}
                         ></div>

                         {/* Card */}
                         <div 
                            onClick={() => setActiveStep(isActive ? null : step.id)}
                            className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer overflow-hidden
                                ${isActive ? 'border-emerald-500 shadow-lg shadow-emerald-100 ring-1 ring-emerald-500/20' : 'border-slate-100 shadow-sm hover:border-emerald-200'}
                            `}
                         >
                             <div className="flex justify-between items-start">
                                 <div>
                                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block">{step.day}</span>
                                     <h3 className="font-bold text-slate-800 text-lg">{step.title}</h3>
                                 </div>
                                 <div className={`text-slate-400 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                                     <ChevronDown size={20} />
                                 </div>
                             </div>
                             
                             <div className={`transition-all duration-300 ease-in-out ${isActive ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                 <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-3">
                                     {step.description}
                                 </p>
                             </div>
                         </div>
                     </div>
                 );
             })}
          </div>
       </div>
    </div>
  );
};

export default HajjGuideView;
