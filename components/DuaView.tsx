import React, { useState } from 'react';
import { ArrowRight, Book, Star, Copy, Check, Heart, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  goBack: () => void;
}

interface DuaItem {
  id: number;
  category: 'quranic' | 'prophetic' | 'hajj';
  arabic: string;
  title: { ar: string; en: string };
  translation: { ar: string; en: string };
  reference: { ar: string; en: string };
}

const DUAS_DATA: DuaItem[] = [
    // Quranic
    { 
        id: 1, 
        category: 'quranic', 
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", 
        title: { ar: 'ربنا آتنا في الدنيا حسنة', en: 'Rabbana Atina' },
        translation: { 
            ar: "دعاء جامع لخيري الدنيا والآخرة والوقاية من عذاب النار.",
            en: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire."
        },
        reference: { ar: "سورة البقرة: ٢٠١", en: "Al-Baqarah: 201" }
    },
    { 
        id: 2, 
        category: 'quranic', 
        arabic: "رَبَّنَا لاَ تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا رَبَّنَا وَلاَ تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا", 
        title: { ar: 'ربنا لا تؤاخذنا', en: 'Rabbana La Tu\'akhidhna' },
        translation: {
            ar: "دعاء لطلب المغفرة والتجاوز عن النسيان والخطأ ورفع المشقة.",
            en: "Our Lord, do not impose blame upon us if we have forgotten or erred."
        },
        reference: { ar: "سورة البقرة: ٢٨٦", en: "Al-Baqarah: 286" } 
    },
    { 
        id: 3, 
        category: 'quranic', 
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلاَةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاء", 
        title: { ar: 'رب اجعلني مقيم الصلاة', en: 'Rabbi Jalni Muqim As-Salah' },
        translation: {
            ar: "دعاء للثبات على الصلاة وللذرية الصالحة وقبول الدعاء.",
            en: "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication."
        },
        reference: { ar: "سورة إبراهيم: ٤٠", en: "Ibrahim: 40" } 
    },
    // Prophetic
    { 
        id: 4, 
        category: 'prophetic', 
        arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", 
        title: { ar: 'يا مقلب القلوب', en: 'Ya Muqallib Al-Qulub' },
        translation: {
            ar: "دعاء النبي ﷺ لطلب الثبات على الدين.",
            en: "O Turner of the hearts, make my heart firm upon Your religion."
        },
        reference: { ar: "رواه الترمذي", en: "At-Tirmidhi" } 
    },
    { 
        id: 5, 
        category: 'prophetic', 
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", 
        title: { ar: 'اللهم إنك عفو', en: 'Allahumma Innaka Afuwwun' },
        translation: {
            ar: "دعاء ليلة القدر وطلب العفو من الله الكريم.",
            en: "O Allah, You are Forgiving and love forgiveness, so forgive me."
        },
        reference: { ar: "رواه ابن ماجه", en: "Ibn Majah" } 
    },
    // Hajj & Umrah
    { 
        id: 6, 
        category: 'hajj', 
        arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ، وَالنِّعْمَةَ، لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ", 
        title: { ar: 'التلبية', en: 'Talbiyah' },
        translation: {
            ar: "شعار الحج والعمرة، وإعلان التوحيد والاستجابة لأمر الله.",
            en: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and blessings are Yours, and all sovereignty, You have no partner."
        },
        reference: { ar: "متفق عليه", en: "Muttafaq Alaih" } 
    },
    { 
        id: 7, 
        category: 'hajj', 
        arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", 
        title: { ar: 'دعاء يوم عرفة', en: 'Dua of Arafat' },
        translation: {
            ar: "خير الدعاء دعاء يوم عرفة، وهو تهليل وتوحيد وثناء على الله.",
            en: "There is no god but Allah alone, He has no partner. His is the dominion, and His is the praise, and He is capable of all things."
        },
        reference: { ar: "رواه الترمذي", en: "At-Tirmidhi" } 
    }
];

const DuaView: React.FC<Props> = ({ goBack }) => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'quranic' | 'prophetic' | 'hajj'>('quranic');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = (text: string, id: number) => {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDuas = DUAS_DATA.filter(dua => 
      (dua.category === activeCategory) && 
      (
          dua.title[language].toLowerCase().includes(searchTerm.toLowerCase()) || 
          dua.arabic.includes(searchTerm) ||
          dua.translation[language].toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] pb-24">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md p-4 pt-8 border-b border-slate-100 sticky top-0 z-20">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={goBack} className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-full text-slate-600 hover:bg-slate-50 rtl:rotate-180 transition-colors">
                    <ArrowRight size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-800">{t('dua')}</h1>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? "بحث..." : "Search..."}
                        className="bg-slate-50 border border-slate-200 rounded-full py-2 px-4 pl-10 text-sm w-32 focus:w-40 transition-all outline-none focus:ring-1 focus:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-100/80 rounded-2xl gap-1">
                {[
                    { id: 'quranic', label: t('quranicDua'), icon: Book },
                    { id: 'prophetic', label: t('propheticDua'), icon: Star },
                    { id: 'hajj', label: t('hajjDua'), icon: Heart },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveCategory(tab.id as any)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] md:text-xs font-bold flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all duration-300 ${
                            activeCategory === tab.id 
                            ? 'bg-white text-emerald-600 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
            {filteredDuas.map(dua => (
                <div key={dua.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 group hover:border-emerald-100 transition-colors relative">
                    
                    {/* Header: Title & Ref */}
                    <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-3">
                        <h3 className="font-bold text-emerald-800 text-sm bg-emerald-50 px-3 py-1 rounded-lg">
                            {dua.title[language]}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium">
                            {dua.reference[language]}
                        </span>
                    </div>

                    {/* Arabic Text */}
                    <p className="font-quran text-2xl text-center text-slate-800 leading-[2.5] mb-4" dir="rtl">
                        {dua.arabic}
                    </p>

                    {/* Translation / Explanation */}
                    <p className="text-xs text-slate-500 text-center leading-relaxed italic mb-4">
                        {dua.translation[language]}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-center pt-2">
                        <button 
                            onClick={() => handleCopy(dua.arabic, dua.id)}
                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 px-4 py-2 rounded-full"
                        >
                            {copiedId === dua.id ? (
                                <>
                                    <Check size={14} className="text-emerald-500" />
                                    <span className="text-emerald-500">{t('copied')}</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>{t('copy')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ))}

            {filteredDuas.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    <p>{language === 'ar' ? 'لا توجد نتائج' : 'No duas found'}</p>
                </div>
            )}
            
            <div className="h-10"></div>
        </div>
    </div>
  );
};

export default DuaView;