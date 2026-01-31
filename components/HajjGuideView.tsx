import React, { useState, useEffect } from 'react';
import { Map, ChevronDown, ArrowRight, CheckCircle2, Circle, Footprints, Moon, Sun, Heart, Scissors, RotateCcw, Plus, RotateCw, RefreshCcw, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

interface StepData {
  id: string;
  day?: string;
  title: string;
  description: string;
  fullDescription?: string;
  duas: { title: string; text: string }[];
  icon: any;
  countTarget?: number; // For Tawaf (7), Sa'i (7), Jamarat (7)
  countLabel?: string;
}

const HajjGuideView: React.FC<Props> = ({ goBack }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'hajj' | 'umrah'>('hajj');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stepCounts, setStepCounts] = useState<Record<string, number>>({});

  // Load progress and counts from local storage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`hajj_progress_${activeTab}`);
    const savedCounts = localStorage.getItem(`hajj_counts_${activeTab}`);
    
    if (savedProgress) setCompletedSteps(JSON.parse(savedProgress));
    else setCompletedSteps([]);

    if (savedCounts) setStepCounts(JSON.parse(savedCounts));
    else setStepCounts({});
    
    setExpandedStep(null);
  }, [activeTab]);

  const toggleStepCompletion = (id: string) => {
      let newCompleted;
      if (completedSteps.includes(id)) {
          newCompleted = completedSteps.filter(s => s !== id);
      } else {
          newCompleted = [...completedSteps, id];
      }
      setCompletedSteps(newCompleted);
      localStorage.setItem(`hajj_progress_${activeTab}`, JSON.stringify(newCompleted));
  };

  const updateCount = (id: string, target: number, increment: number) => {
      setStepCounts(prev => {
          const current = prev[id] || 0;
          const next = Math.min(Math.max(0, current + increment), target);
          
          const newCounts = { ...prev, [id]: next };
          localStorage.setItem(`hajj_counts_${activeTab}`, JSON.stringify(newCounts));
          
          // Auto-complete step if target reached
          if (next === target && !completedSteps.includes(id)) {
              const newCompleted = [...completedSteps, id];
              setCompletedSteps(newCompleted);
              localStorage.setItem(`hajj_progress_${activeTab}`, JSON.stringify(newCompleted));
              if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Success vibration
          } else if (increment > 0 && navigator.vibrate) {
              navigator.vibrate(50); // Tick vibration
          }

          return newCounts;
      });
  };

  const resetCount = (id: string) => {
       if (confirm(language === 'ar' ? 'هل أنت متأكد من تصفير العداد؟' : 'Reset counter?')) {
            setStepCounts(prev => {
                const newCounts = { ...prev, [id]: 0 };
                localStorage.setItem(`hajj_counts_${activeTab}`, JSON.stringify(newCounts));
                return newCounts;
            });
       }
  };

  const resetAll = () => {
       if (confirm(language === 'ar' ? 'هل أنت متأكد من تصفير الرحلة بالكامل؟' : 'Are you sure you want to reset the entire journey?')) {
            setCompletedSteps([]);
            setStepCounts({});
            localStorage.removeItem(`hajj_progress_${activeTab}`);
            localStorage.removeItem(`hajj_counts_${activeTab}`);
            if (navigator.vibrate) navigator.vibrate(100);
       }
  };

  const UMRAH_STEPS: StepData[] = [
      {
          id: 'u1',
          title: language === 'ar' ? 'الإحرام' : 'Ihram',
          description: language === 'ar' ? 'النية والتلبية عند الميقات.' : 'Intention and Talbiyah at Miqat.',
          fullDescription: language === 'ar' 
            ? 'الاغتسال والتطيب (في البدن لا الثوب)، لبس ملابس الإحرام، وعقد النية عند الميقات قائلاً: "لبيك اللهم عمرة". ثم التلبية.' 
            : 'Bathe, wear Ihram garments, and make intention at Miqat saying: "Labbayk Allahumma Umrah". Keep reciting Talbiyah.',
          duas: [
              {
                  title: language === 'ar' ? 'التلبية' : 'Talbiyah',
                  text: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ، وَالنِّعْمَةَ، لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ"
              }
          ],
          icon: UserIcon
      },
      {
          id: 'u2',
          title: language === 'ar' ? 'الطواف' : 'Tawaf',
          description: language === 'ar' ? '7 أشواط حول الكعبة.' : '7 circuits around Kaaba.',
          fullDescription: language === 'ar'
            ? 'ابدأ من الحجر الأسود، اجعل الكعبة عن يسارك، وطف 7 أشواط. يُسن الرمل (الإسراع) في الأشواط الثلاثة الأولى للرجال، والاضطباع (كشف الكتف الأيمن).'
            : 'Start at Black Stone. Keep Kaaba on left. 7 circuits. Men should do Ramal (fast walk) in first 3 rounds and Idtiba (uncover right shoulder).',
          duas: [
              {
                  title: language === 'ar' ? 'بين الركن اليماني والحجر الأسود' : 'Between Rukn Yamani & Black Stone',
                  text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
              },
              {
                  title: language === 'ar' ? 'عند بداية الشوط' : 'Start of Circuit',
                  text: "بِسْمِ اللهِ وَاللهُ أَكْبَرُ"
              }
          ],
          icon: RotateCcw,
          countTarget: 7,
          countLabel: language === 'ar' ? 'شوط' : 'Circuit'
      },
      {
          id: 'u3',
          title: language === 'ar' ? 'السعي' : 'Sa\'i',
          description: language === 'ar' ? '7 أشواط بين الصفا والمروة.' : '7 trips between Safa and Marwa.',
          fullDescription: language === 'ar'
            ? 'ابدأ بالصفا وانتهِ بالمروة. الذهاب شوط والعودة شوط. المجموع 7 أشواط (تنتهي عند المروة).'
            : 'Start at Safa, end at Marwa. One way is one trip. Total 7 trips (ending at Marwa).',
          duas: [
              {
                  title: language === 'ar' ? 'عند صعود الصفا والمروة' : 'On Safa & Marwa',
                  text: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ... لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ"
              }
          ],
          icon: Footprints,
          countTarget: 7,
          countLabel: language === 'ar' ? 'شوط' : 'Trip'
      },
      {
          id: 'u4',
          title: language === 'ar' ? 'الحلق أو التقصير' : 'Halq or Taqsir',
          description: language === 'ar' ? 'التحلل من الإحرام.' : 'Exiting Ihram.',
          fullDescription: language === 'ar'
            ? 'حلق شعر الرأس أو تقصيره للرجل (والحلق أفضل)، وقص قدر أنملة من طرف الشعر للمرأة.'
            : 'Shaving or trimming hair for men, cutting a fingertip length for women.',
          duas: [],
          icon: Scissors
      }
  ];

  const HAJJ_STEPS: StepData[] = [
      {
          id: 'h1',
          day: '8 Dhu al-Hijjah',
          title: language === 'ar' ? 'يوم التروية' : 'Tarwiyah',
          description: language === 'ar' ? 'المبيت بمنى.' : 'Stay in Mina.',
          fullDescription: language === 'ar'
             ? 'الإحرام بالحج (للمتمتع)، والتوجه إلى منى وصلاة الظهر والعصر والمغرب والعشاء والفجر قصراً بلا جمع.'
             : 'Enter Ihram (for Tamattu), go to Mina, pray Dhuhr, Asr, Maghrib, Isha and Fajr shortened but not combined.',
          duas: [{ title: 'الدعاء', text: "لَبَّيْكَ اللَّهُمَّ حَجّاً" }],
          icon: Sun
      },
      {
          id: 'h2',
          day: '9 Dhu al-Hijjah',
          title: language === 'ar' ? 'يوم عرفة' : 'Arafat',
          description: language === 'ar' ? 'الوقوف بعرفة (الركن الأعظم).' : 'Standing at Arafat.',
          fullDescription: language === 'ar'
             ? 'التوجه إلى عرفات بعد الشروق، صلاة الظهر والعصر جمعاً وقصراً، والإكثار من الدعاء حتى الغروب.'
             : 'Go to Arafat after sunrise. Pray Dhuhr and Asr combined. Stand in prayer and dua until sunset.',
          duas: [{ title: 'خير الدعاء دعاء عرفة', text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير" }],
          icon: Heart
      },
      {
          id: 'h3',
          day: 'Night of 10th',
          title: language === 'ar' ? 'مزدلفة' : 'Muzdalifah',
          description: language === 'ar' ? 'المبيت وجمع الحصى.' : 'Stay & Collect pebbles.',
          fullDescription: language === 'ar'
             ? 'التوجه لمزدلفة بعد الغروب، صلاة المغرب والعشاء جمعاً وقصراً، والمبيت وجمع الحصى لرمي الجمرات.'
             : 'Go to Muzdalifah after sunset. Pray Maghrib and Isha combined. Stay the night and collect pebbles.',
          duas: [{ title: 'عند المشعر الحرام', text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ" }],
          icon: Moon
      },
      {
          id: 'h4',
          day: '10 Dhu al-Hijjah',
          title: language === 'ar' ? 'رمي جمرة العقبة' : 'Jamarat Aqabah',
          description: language === 'ar' ? 'رمي 7 حصيات.' : 'Throw 7 pebbles.',
          fullDescription: language === 'ar'
             ? 'رمي الجمرة الكبرى (العقبة) بـ 7 حصيات متعاقبات، مع التكبير مع كل حصاة، وقطع التلبية.'
             : 'Throw 7 pebbles at the large pillar (Jamrat al-Aqabah), saying Allahu Akbar with each throw.',
          duas: [{ title: 'مع كل حصاة', text: "الله أكبر" }],
          icon: Circle,
          countTarget: 7,
          countLabel: language === 'ar' ? 'حصاة' : 'Pebble'
      },
      {
          id: 'h5',
          day: '10 Dhu al-Hijjah',
          title: language === 'ar' ? 'الهدي والحلق' : 'Sacrifice & Shave',
          description: language === 'ar' ? 'التحلل الأول.' : 'First Tahallul.',
          fullDescription: language === 'ar'
             ? 'ذبح الهدي (للمتمتع والقارن)، ثم حلق الرأس أو تقصيره. يحل للمحرم كل شيء إلا النساء.'
             : 'Sacrifice animal (Hady), then shave or trim hair. Everything becomes lawful except marital relations.',
          duas: [],
          icon: Scissors
      },
      {
          id: 'h6',
          day: '10 Dhu al-Hijjah',
          title: language === 'ar' ? 'طواف الإفاضة' : 'Tawaf Ifadah',
          description: language === 'ar' ? 'التحلل الأكبر.' : 'Major Tahallul.',
          fullDescription: language === 'ar'
             ? 'التوجه للحرم للطواف 7 أشواط والسعي (إن لم يسع مع طواف القدوم). وبهذا يحل كل شيء.'
             : 'Go to Haram for Tawaf (7 circuits) and Sa\'i. This completes the major Tahallul.',
          duas: [],
          icon: RotateCcw,
          countTarget: 7,
          countLabel: language === 'ar' ? 'شوط' : 'Circuit'
      },
      {
          id: 'h7',
          day: '11-13 Dhu al-Hijjah',
          title: language === 'ar' ? 'أيام التشريق' : 'Tashreeq Days',
          description: language === 'ar' ? 'رمي الجمرات الثلاث.' : 'Throwing Jamarat.',
          fullDescription: language === 'ar'
             ? 'المبيت بمنى ليالي التشريق. رمي الجمرات الثلاث (الصغرى، الوسطى، الكبرى) بـ 7 حصيات لكل واحدة بعد الزوال.'
             : 'Stay in Mina. Throw 7 pebbles at all three Jamarat after solar noon each day.',
          duas: [{ title: 'بعد الصغرى والوسطى', text: "الدعاء طويلاً مستقبل القبلة" }],
          icon: Footprints
      },
      {
          id: 'h8',
          title: language === 'ar' ? 'طواف الوداع' : 'Farewell Tawaf',
          description: language === 'ar' ? 'آخر عهد بالبيت.' : 'Last rite.',
          fullDescription: language === 'ar'
             ? 'الطواف حول الكعبة 7 أشواط قبل مغادرة مكة مباشرة، ولا يمكث بعدها بمكة.'
             : 'Perform Tawaf (7 circuits) right before leaving Makkah.',
          duas: [],
          icon: Heart,
          countTarget: 7,
          countLabel: language === 'ar' ? 'شوط' : 'Circuit'
      }
  ];

  const currentSteps = activeTab === 'hajj' ? HAJJ_STEPS : UMRAH_STEPS;
  const progress = Math.round((completedSteps.length / currentSteps.length) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24">
       {/* Header */}
       <div className="bg-emerald-700 text-white p-6 pt-8 pb-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-6">
                 <button onClick={goBack} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors rtl:rotate-180">
                    <ArrowRight size={20} />
                </button>
                <h1 className="text-xl font-bold">{t('hajj')}</h1>
                <button 
                    onClick={resetAll} 
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-white"
                    title={language === 'ar' ? 'تصفير الرحلة' : 'Reset Journey'}
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Mode Toggles */}
                <div className="flex bg-emerald-900/40 p-1 rounded-xl mb-6 backdrop-blur-sm border border-emerald-500/30">
                    <button 
                        onClick={() => setActiveTab('hajj')}
                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'hajj' ? 'bg-white text-emerald-800 shadow-lg' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
                    >
                        {language === 'ar' ? 'الحج' : 'Hajj'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('umrah')}
                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'umrah' ? 'bg-white text-emerald-800 shadow-lg' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
                    >
                        {language === 'ar' ? 'العمرة' : 'Umrah'}
                    </button>
                </div>

                {/* Circular Progress */}
                <div className="flex items-center gap-4 w-full px-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-xs text-emerald-100 mb-2 font-medium">
                            <span>{language === 'ar' ? 'مستوى التقدم' : 'Progress'}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2.5 bg-emerald-900/40 rounded-full overflow-hidden backdrop-blur-sm">
                            <div 
                                className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-1000 ease-out relative" 
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>

       {/* Timeline Content */}
       <div className="flex-1 overflow-y-auto p-4 -mt-6 relative z-20">
          <div className="space-y-4 pb-10">
             {currentSteps.map((step, index) => {
                 const isCompleted = completedSteps.includes(step.id);
                 const isExpanded = expandedStep === step.id;
                 const isNext = !isCompleted && (index === 0 || completedSteps.includes(currentSteps[index - 1].id));
                 const Icon = step.icon;
                 const currentCount = stepCounts[step.id] || 0;

                 return (
                     <div key={step.id} className={`transition-all duration-500 ${isNext ? 'transform translate-y-0 opacity-100' : ''}`}>
                         
                         {/* Day Label (Hajj only) */}
                         {step.day && (
                            <div className="flex items-center gap-2 mb-2 px-2">
                                <span className="h-px flex-1 bg-slate-200"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 rounded-full border border-slate-100">{step.day}</span>
                                <span className="h-px flex-1 bg-slate-200"></span>
                            </div>
                         )}

                         <div 
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden relative
                                ${isCompleted ? 'border-emerald-200 opacity-90' : isNext ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500/20' : 'border-slate-100 shadow-sm'}
                            `}
                         >
                             {/* Header Part */}
                             <div 
                                className="p-4 flex items-center gap-4 cursor-pointer"
                                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                             >
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors relative
                                     ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isNext ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}
                                 `}>
                                     {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                                     
                                     {/* Small counter badge on icon if relevant */}
                                     {step.countTarget && !isCompleted && (
                                         <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                             {currentCount}
                                         </div>
                                     )}
                                 </div>
                                 
                                 <div className="flex-1">
                                     <h3 className={`font-bold text-lg ${isCompleted ? 'text-emerald-800' : 'text-slate-800'}`}>
                                         {step.title}
                                     </h3>
                                     <p className="text-xs text-slate-400 line-clamp-1">
                                         {step.description}
                                     </p>
                                 </div>

                                 <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                             </div>

                             {/* Expanded Details */}
                             <div className={`transition-all duration-500 ease-in-out bg-slate-50 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                 <div className="p-4 pt-0 border-t border-slate-100">
                                     
                                     {/* Full Description */}
                                     <div className="mt-4 text-slate-700 text-sm leading-7 text-justify bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                         {step.fullDescription || step.description}
                                     </div>
                                     
                                     {/* Interactive Counter Section */}
                                     {step.countTarget && (
                                         <div className="mt-4 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                             <div className="flex justify-between items-center mb-3">
                                                 <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{language === 'ar' ? 'العداد' : 'Counter'}</span>
                                                 <span className="text-xs font-bold text-emerald-600">{currentCount} / {step.countTarget} {step.countLabel}</span>
                                             </div>
                                             
                                             <div className="flex items-center gap-4">
                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); resetCount(step.id); }}
                                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm active:scale-95 transition-transform"
                                                 >
                                                     <RefreshCcw size={20} />
                                                 </button>

                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); updateCount(step.id, step.countTarget!, 1); }}
                                                    disabled={currentCount >= step.countTarget!}
                                                    className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg active:scale-95 transition-all
                                                        ${currentCount >= step.countTarget! 
                                                            ? 'bg-emerald-200 text-emerald-700 cursor-default' 
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}
                                                    `}
                                                 >
                                                     {currentCount >= step.countTarget! ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                                                     <span>{currentCount >= step.countTarget! ? (language === 'ar' ? 'اكتمل' : 'Done') : (language === 'ar' ? 'سجل شوط' : 'Count')}</span>
                                                 </button>
                                             </div>
                                         </div>
                                     )}

                                     {/* Duas Section */}
                                     {step.duas.length > 0 && (
                                         <div className="mt-4 space-y-3">
                                             {step.duas.map((dua, i) => (
                                                 <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4 relative overflow-hidden">
                                                     <div className="absolute top-0 right-0 px-3 py-1 bg-amber-100 rounded-bl-xl">
                                                         <span className="text-[10px] font-bold text-amber-800">{dua.title}</span>
                                                     </div>
                                                     <p className="font-quran text-2xl text-center text-slate-800 leading-[2.5] mt-4">
                                                         {dua.text}
                                                     </p>
                                                 </div>
                                             ))}
                                         </div>
                                     )}

                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStepCompletion(step.id);
                                        }}
                                        className={`w-full mt-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95
                                            ${isCompleted 
                                                ? 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50' 
                                                : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700'}
                                        `}
                                     >
                                         {isCompleted ? (
                                             <>{language === 'ar' ? 'تراجع عن الإكمال' : 'Mark as Incomplete'}</>
                                         ) : (
                                             <>{language === 'ar' ? 'إتمام الخطوة يدوياً' : 'Mark as Completed'} <ArrowRight size={16} className="rtl:rotate-180" /></>
                                         )}
                                     </button>
                                 </div>
                             </div>

                             {/* Progress Line Connector */}
                             {index !== currentSteps.length - 1 && (
                                 <div className={`absolute left-10 rtl:right-10 right-auto rtl:left-auto -bottom-4 w-0.5 h-4 z-0
                                    ${completedSteps.includes(step.id) && completedSteps.includes(currentSteps[index+1].id) ? 'bg-emerald-300' : 'bg-slate-200'}
                                 `}></div>
                             )}
                         </div>
                     </div>
                 );
             })}
          </div>
       </div>
    </div>
  );
};

// Simple User Icon component for fallback
const UserIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default HajjGuideView;