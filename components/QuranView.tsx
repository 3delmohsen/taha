import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, Play, Pause, ChevronRight, ChevronLeft, Settings, X, Bookmark as BookmarkIcon, BookOpen, Share2, ArrowRight, Mic2, Square, List, Book, Loader2, Check, ChevronUp, Users, Trash2 } from 'lucide-react';
import { Surah, Reciter, Ayah, Bookmark, PageDetail } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// --- CONSTANTS ---
const RECITERS_LIST = [
    { id: Reciter.ALAFASY, name: { ar: 'مشاري العفاسي', en: 'Mishary Alafasy' } },
    { id: Reciter.MAHER, name: { ar: 'ماهر المعيقلي', en: 'Maher Al Muaiqly' } },
    { id: Reciter.SUDAIS, name: { ar: 'عبدالرحمن السديس', en: 'Abdurrahmaan As-Sudais' } },
    { id: Reciter.SHURAIM, name: { ar: 'سعود الشريم', en: 'Saud Al-Shuraim' } },
    { id: Reciter.GĦAMDI, name: { ar: 'سعد الغامدي', en: 'Saad Al-Ghamdi' } },
    { id: Reciter.AJAMY, name: { ar: 'أحمد العجمي', en: 'Ahmed Al-Ajmi' } },
    { id: Reciter.HUSARY, name: { ar: 'محمود خليل الحصري', en: 'Mahmoud Al-Husary' } },
    { id: Reciter.HUSARY_MUJAWWAD, name: { ar: 'الحصري (مجود)', en: 'Al-Husary (Mujawwad)' } },
    { id: Reciter.MINSHAWI, name: { ar: 'محمد صديق المنشاوي', en: 'Mohamed Siddiq El-Minshawi' } },
    { id: Reciter.MINSHAWI_MUJAWWAD, name: { ar: 'المنشاوي (مجود)', en: 'El-Minshawi (Mujawwad)' } },
    { id: Reciter.ABDU_BASIT, name: { ar: 'عبدالباسط عبدالصمد', en: 'Abdul Basit (Murattal)' } },
    { id: Reciter.ABDUL_BASIT_MUJAWWAD, name: { ar: 'عبدالباسط (مجود)', en: 'Abdul Basit (Mujawwad)' } },
    { id: Reciter.HUDHAIFY, name: { ar: 'علي الحذيفي', en: 'Ali Al-Hudhaify' } },
    { id: Reciter.SHATRI, name: { ar: 'أبوبكر الشاطري', en: 'Abu Bakr Al-Shatri' } },
    { id: Reciter.TABLAWI, name: { ar: 'محمد الطبلاوي', en: 'Mohammad Al-Tablawi' } },
    { id: Reciter.SALAH_BUKHATIR, name: { ar: 'صلاح بو خاطر', en: 'Salah Bukhatir' } },
];

// --- VISUAL COMPONENTS ---

const AyahEndSymbol: React.FC<{ number: number }> = React.memo(({ number }) => (
  <span className="inline-flex items-center justify-center relative mx-1 align-middle select-none h-[0.9em] w-[0.9em] text-[#8A6D3B] my-0 opacity-90">
     <svg viewBox="0 0 40 40" className="w-full h-full fill-transparent stroke-current stroke-[1.5]">
        <circle cx="20" cy="20" r="18" />
        <path d="M20 2v4 M20 34v4 M2 20h4 M34 20h4 M7.5 7.5l2.5 2.5 M30 30l2.5 2.5 M7.5 32.5l2.5-2.5 M30 10l2.5-2.5" opacity="0.5" />
     </svg>
     <span className="absolute inset-0 flex items-center justify-center text-[0.45em] font-bold text-[#5c4033] pt-0.5 font-mono leading-none">
        {number.toLocaleString('ar-EG')}
     </span>
  </span>
));

const SurahHeaderDecor: React.FC<{ surahName: string, type: string, number: number }> = React.memo(({ surahName, type, number }) => (
    <div className="my-3 relative py-3 flex items-center justify-center select-none w-full block">
        {/* Ornate Frame Background */}
        <div className="absolute inset-x-4 top-0 bottom-0 border-y-2 border-[#8A6D3B]/40 bg-[#D4B483]/10"></div>
        <div className="absolute inset-x-0 top-1 bottom-1 border-y border-[#8A6D3B]/20"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-between w-full px-12 md:px-20">
            <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-widest font-kufi opacity-80">{type}</span>
            
            <div className="flex items-center gap-3 bg-[#FFFBF2] px-6 py-1.5 border border-[#8A6D3B]/30 shadow-sm rounded-full relative">
                 {/* Decorative sides for the pill */}
                 <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#8A6D3B] rounded-full opacity-50"></div>
                 <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#8A6D3B] rounded-full opacity-50"></div>

                 <div className="w-6 h-6 flex items-center justify-center border border-[#8A6D3B]/40 rounded-full bg-[#E8DCC2]/30">
                    <span className="font-mono text-[9px] text-[#5c4033] font-bold">{number}</span>
                 </div>
                 <span className="font-quran-uthmani text-xl text-[#3d2b1f] pt-1 drop-shadow-sm">
                    {surahName.replace('سورة ', '')}
                 </span>
            </div>

            <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-widest font-kufi opacity-80 invisible md:visible">Surah</span>
        </div>
    </div>
));

const Basmalah: React.FC = React.memo(() => (
    <div className="text-center mb-4 mt-2 select-none opacity-90 block w-full">
        <div className="font-quran-uthmani text-3xl text-[#3d2b1f] leading-normal" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.1)' }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
    </div>
));

// Optimized Ayah Component
const AyahItem = React.memo(({ ayah, isActive, isMenuSelected, isBookmarked, showHeader, isBismillahLine, t, onTap, onLongPress }: any) => {
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (isActive && elementRef.current) {
            // Using scrollIntoView with block: 'center' to keep reading focus
            elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isActive]);

    let displayText = ayah.text;
    if (showHeader && ayah.surah?.number !== 1 && ayah.surah?.number !== 9) {
        displayText = displayText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
    }

    return (
        <>
            {showHeader && ayah.surah && (
                <SurahHeaderDecor 
                   surahName={ayah.surah.name} 
                   type={ayah.surah.revelationType === 'Meccan' ? t('meccan') : t('medinan')} 
                   number={ayah.surah.number} 
                />
            )}
            
            {isBismillahLine && <Basmalah />}
            
            <span 
                ref={elementRef}
                onClick={() => onTap(ayah)}
                onContextMenu={(e) => { e.preventDefault(); onLongPress(ayah); }}
                className={`
                    font-quran-uthmani text-[22px] md:text-[28px] cursor-pointer transition-colors duration-200 select-none
                    ${isActive ? 'bg-[#D4B483]/30 text-[#2a1a10] rounded-md shadow-sm' : 'hover:text-[#5c4033]'}
                    ${isMenuSelected ? 'bg-slate-200/50' : ''}
                    ${isBookmarked ? 'decoration-[#8b5e3c]/40 underline decoration-2 decoration-wavy' : ''}
                `}
                style={{ 
                    textShadow: isActive ? 'none' : '0 0.5px 0 rgba(61, 43, 31, 0.05)',
                    lineHeight: '2.2', // Optimal line height for readability
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                    padding: isActive ? '6px 0' : '0'
                }}
            >
                {displayText}
            </span>
            <AyahEndSymbol number={ayah.numberInSurah} />
        </>
    );
});

// --- MAIN COMPONENT ---

interface QuranViewProps {
  onToggleFullScreen?: (isFullScreen: boolean) => void;
}

const QuranView: React.FC<QuranViewProps> = ({ onToggleFullScreen }) => {
  const { t, language } = useLanguage();
  
  // -- Data State --
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [activePage, setActivePage] = useState<PageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // -- Playback State --
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [currentAyahGlobalIndex, setCurrentAyahGlobalIndex] = useState<number>(-1); 
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(Reciter.ALAFASY);
  const [showRecitersList, setShowRecitersList] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(false); // Flag for auto page turn
  
  // -- UI Interaction State --
  const [selectedAyahForMenu, setSelectedAyahForMenu] = useState<Ayah | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  
  const [tafsirData, setTafsirData] = useState<{text: string, source: string} | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  
  // -- Refs --
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null); // For Parallax
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));

    const saved = localStorage.getItem('taha_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  // --- HANDLE FULL SCREEN ---
  useEffect(() => {
    if (onToggleFullScreen) {
        onToggleFullScreen(!!activePage);
    }
  }, [activePage, onToggleFullScreen]);

  // --- LOAD SURAH START PAGE ---
  const handleSurahClick = async (surahNumber: number) => {
      setLoadingPage(true);
      try {
          const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
          const data = await res.json();
          const startPage = data.data.ayahs[0].page;
          loadPage(startPage);
      } catch (e) {
          console.error(e);
          setLoadingPage(false);
      }
  };

  // --- LOAD PAGE (MUSHAF MODE) ---
  const loadPage = async (pageNumber: number, highlightAyahId: number = -1) => {
    if (pageNumber < 1 || pageNumber > 604) return;
    
    setLoadingPage(true);
    // Note: We do NOT stop audio here if it's an auto-flip, handled by autoPlayNext effect
    if (!autoPlayNext) {
       stopAudio();
    }
    
    // Override index if highlighting specific ayah
    if (highlightAyahId !== -1) {
        setCurrentAyahGlobalIndex(highlightAyahId);
    }

    setSelectedAyahForMenu(null);
    setTafsirData(null);
    
    if (scrollViewRef.current) scrollViewRef.current.scrollTop = 0;

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
      const data = await res.json();
      setActivePage(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPage(false);
    }
  };

  // --- AUTO PLAY NEXT PAGE EFFECT ---
  useEffect(() => {
      if (activePage && autoPlayNext && !loadingPage) {
          // Play the first ayah of the new page
          const firstAyah = activePage.ayahs[0];
          if (firstAyah) {
             // Slight delay to ensure DOM is ready and transition feels natural
             const timer = setTimeout(() => {
                 playAyah(firstAyah);
                 setAutoPlayNext(false); // Reset flag
             }, 500);
             return () => clearTimeout(timer);
          }
      }
  }, [activePage, loadingPage, autoPlayNext]);

  // --- FETCH TAFSIR ---
  const fetchTafsir = async (ayahNumber: number) => {
      setLoadingTafsir(true);
      setTafsirData(null);
      try {
          const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.muyassar`);
          const data = await res.json();
          setTafsirData({
              text: data.data.text,
              source: data.data.edition.name
          });
      } catch (error) {
          console.error("Tafsir error", error);
          setTafsirData({ text: "تعذر تحميل التفسير. يرجى التحقق من اتصال الإنترنت.", source: "" });
      } finally {
          setLoadingTafsir(false);
      }
  };

  // --- AUDIO ENGINE ---
  const getAudioUrl = (ayahId: number) => {
      return `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${ayahId}.mp3`;
  };

  const playAyah = useCallback(async (ayah: Ayah) => {
      if (!activePage) return;
      
      setCurrentAyahGlobalIndex(ayah.number);
      setIsPlaying(true);
      setIsAudioLoading(true);

      if (audioRef.current) {
          try {
             audioRef.current.pause();
             audioRef.current.src = getAudioUrl(ayah.number);
             audioRef.current.load();
             await audioRef.current.play();
             setIsAudioLoading(false);
          } catch(e: any) {
             if (e.name !== 'AbortError') {
                console.error("Playback failed", e);
                setIsPlaying(false);
                setIsAudioLoading(false);
             }
          }
      }
  }, [activePage, selectedReciter]);

  const stopAudio = useCallback(() => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setIsAudioLoading(false);
      setCurrentAyahGlobalIndex(-1);
  }, []);

  const togglePlay = async () => {
      if (!activePage) return;

      if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
      } else {
          setIsPlaying(true);
          if (currentAyahGlobalIndex === -1) {
              // Play first ayah of page
              playAyah(activePage.ayahs[0]);
          } else {
              try {
                  await audioRef.current?.play();
              } catch (e: any) {
                  if (e.name !== 'AbortError') console.error("Resume failed", e);
              }
          }
      }
  };

  const handleAudioEnded = () => {
      if (!activePage) return;
      
      const currentIndexInPage = activePage.ayahs.findIndex(a => a.number === currentAyahGlobalIndex);
      
      // If NOT the last ayah in the page, play next one
      if (currentIndexInPage !== -1 && currentIndexInPage < activePage.ayahs.length - 1) {
          playAyah(activePage.ayahs[currentIndexInPage + 1]);
      } else {
          // Last Ayah in the page -> Flip Page Automatically
          if (activePage.number < 604) {
              setAutoPlayNext(true); // Flag to play first ayah of next page
              loadPage(activePage.number + 1);
          } else {
              setIsPlaying(false); // End of Quran
          }
      }
  };

  const handleReciterSelect = (reciterId: Reciter) => {
      setSelectedReciter(reciterId);
      setShowRecitersList(false);
      
      if (isPlaying && currentAyahGlobalIndex !== -1 && activePage) {
          // Restart current ayah with new reciter
          const currentAyah = activePage.ayahs.find(a => a.number === currentAyahGlobalIndex);
          if (currentAyah) {
              setTimeout(() => playAyah(currentAyah), 100);
          }
      }
  };

  // --- INTERACTION ---

  const handleAyahTap = useCallback((ayah: Ayah) => {
      playAyah(ayah);
  }, [playAyah]);

  const handleAyahLongPress = useCallback((ayah: Ayah) => {
       setSelectedAyahForMenu(ayah);
  }, []);

  const toggleBookmark = () => {
      if (!activePage || !selectedAyahForMenu) return;
      
      const targetAyah = selectedAyahForMenu;
      const isBookmarked = bookmarks.some(b => b.ayahNumber === targetAyah.number);
      
      let newBookmarks;
      if (isBookmarked) {
          newBookmarks = bookmarks.filter(b => b.ayahNumber !== targetAyah.number);
      } else {
          const newBookmark: Bookmark = {
              surahNumber: targetAyah.surah?.number || 0,
              surahName: targetAyah.surah?.name || '',
              ayahNumber: targetAyah.number,
              ayahInSurah: targetAyah.numberInSurah,
              pageNumber: activePage.number,
              timestamp: Date.now()
          };
          // Add to beginning
          newBookmarks = [newBookmark, ...bookmarks];
      }
      
      setBookmarks(newBookmarks);
      localStorage.setItem('taha_bookmarks', JSON.stringify(newBookmarks));
      setSelectedAyahForMenu(null);
  };

  const handleContinueReading = () => {
      if (bookmarks.length > 0) {
          const lastBookmark = bookmarks[0];
          loadPage(lastBookmark.pageNumber, lastBookmark.ayahNumber);
      }
  };

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(searchTerm) || s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PAGE NAVIGATION ---
  const handleNextPage = () => {
      if (activePage && activePage.number < 604) {
          loadPage(activePage.number + 1);
      }
  };

  const handlePrevPage = () => {
      if (activePage && activePage.number > 1) {
          loadPage(activePage.number - 1);
      }
  };

  // --- PARALLAX & SWIPE GESTURES ---
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      // Parallax effect: Move background at half speed
      if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${scrollTop * 0.4}px)`;
      }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchEndX.current = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) handleNextPage();
        else handlePrevPage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // === RENDER: SURAH LIST (List View) ===
  if (!activePage) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7] relative">
         {/* Sticky Header */}
         <div className="sticky top-0 z-20 px-5 pt-8 pb-4 bg-[#fdfbf7]/95 backdrop-blur-xl border-b border-emerald-900/5">
             <div className="flex justify-between items-start mb-6">
                 <div>
                     <h1 className="text-3xl font-bold text-slate-800 font-kufi">{t('quran')}</h1>
                     <p className="text-xs text-slate-500 mt-1">{t('greeting')}</p>
                 </div>
                 <div className="flex gap-2">
                    {bookmarks.length > 0 && (
                        <>
                            <button 
                                onClick={() => setShowBookmarksModal(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm active:scale-95 transition-transform"
                            >
                                <BookmarkIcon size={20} />
                            </button>
                            <button 
                                onClick={handleContinueReading}
                                className="group flex items-center gap-2 bg-emerald-600 text-white pl-3 pr-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                            >
                                <BookOpen size={16} className="text-emerald-100" />
                                <span>{t('continueReading')}</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#fdfbf7]"></div>
                            </button>
                        </>
                    )}
                 </div>
             </div>
             
             {/* Search */}
             <div className="relative">
                 <input 
                    type="text" 
                    placeholder={t('searchSurah')}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400 shadow-sm text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <Search className="absolute top-3.5 right-4 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto text-slate-400" size={20} />
             </div>
         </div>

         {/* Loading */}
         {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center">
               <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
         ) : (
           <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-3 no-scrollbar pt-2">
              {filteredSurahs.map((surah) => (
                  <button 
                      key={surah.number}
                      onClick={() => handleSurahClick(surah.number)}
                      className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between group active:scale-[0.98] transition-all hover:border-emerald-200 hover:shadow-emerald-500/5"
                  >
                      <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold font-mono text-sm relative overflow-hidden group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                               <div className="absolute inset-0 border border-emerald-200 rounded-xl opacity-50"></div>
                               {surah.number}
                          </div>
                          <div className="text-start">
                              <h3 className="font-bold text-slate-800 font-kufi text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                                  {language === 'ar' ? surah.name : surah.englishName}
                              </h3>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                                  <span>{surah.revelationType === 'Meccan' ? t('meccan') : t('medinan')}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span>{surah.numberOfAyahs} {t('ayahs')}</span>
                              </div>
                          </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <ChevronLeft size={18} className="rtl:rotate-0 ltr:rotate-180" />
                      </div>
                  </button>
              ))}
           </div>
         )}
         
        {/* Bookmarks Modal */}
        {showBookmarksModal && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center sm:justify-center animate-fade-in" onClick={() => setShowBookmarksModal(false)}>
                <div 
                    className="bg-[#fdfbf7] w-full sm:w-[400px] sm:rounded-3xl rounded-t-[2rem] p-6 max-h-[70vh] flex flex-col animate-slide-up shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-slate-800 font-kufi flex items-center gap-2">
                            <BookmarkIcon size={24} className="text-[#8b5e3c]" fill="currentColor" />
                            {t('bookmarks')}
                        </h3>
                        <button onClick={() => setShowBookmarksModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    {bookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <BookmarkIcon size={48} strokeWidth={1} className="mb-4 opacity-50" />
                            <p>{t('noBookmarks')}</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto space-y-3 pr-1">
                            {bookmarks.map((b, i) => (
                                <button 
                                    key={i}
                                    onClick={() => {
                                        loadPage(b.pageNumber, b.ayahNumber);
                                        setShowBookmarksModal(false);
                                    }}
                                    className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#D4B483] transition-all text-start"
                                >
                                    <div>
                                        <div className="font-bold text-slate-800 font-kufi text-lg">{b.surahName}</div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{t('ayah')} {b.ayahInSurah}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>Page {b.pageNumber}</span>
                                        </div>
                                    </div>
                                    <ArrowRight size={18} className="text-slate-300 group-hover:text-[#D4B483] rtl:rotate-180" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    );
  }

  // === RENDER: MUSHAF PAGE READER (Realistic Book View) ===
  const selectedReciterName = RECITERS_LIST.find(r => r.id === selectedReciter)?.name;
  
  return (
    <div className="flex flex-col h-full bg-[#2a2a2a] relative overflow-hidden">
        
        {/* CSS Animation for Page Turn */}
        <style>
          {`
            @keyframes pageTurn {
              from { opacity: 0; transform: perspective(1000px) rotateY(-10deg) scale(0.95); }
              to { opacity: 1; transform: perspective(1000px) rotateY(0) scale(1); }
            }
            .animate-page-turn {
              animation: pageTurn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
              transform-origin: center left;
            }
          `}
        </style>

        {/* Ambient Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-black/10"></div>

        {/* Header Controls */}
        <div className="absolute top-4 left-4 z-50">
            <button 
                onClick={() => { setActivePage(null); stopAudio(); }} 
                className="w-10 h-10 flex items-center justify-center bg-black/30 text-white/90 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/50 transition-colors"
            >
                <ArrowRight size={20} className="rtl:rotate-180" />
            </button>
        </div>

        <div className="absolute top-4 right-4 z-50">
             <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-white/90 shadow-lg">
                 <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{t('juz')} {activePage.ayahs[0].juz}</span>
                 <span className="w-1 h-3 bg-white/20 rounded-full"></span>
                 <span className="font-mono text-sm font-bold">{activePage.number}</span>
             </div>
        </div>

        {/* Loading Overlay */}
        {loadingPage && (
            <div className="absolute inset-0 z-50 bg-[#2a2a2a]/90 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                     <div className="w-12 h-12 border-4 border-[#D4B483] border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-[#D4B483] font-kufi text-sm animate-pulse">جاري تقليب الصفحة...</span>
                </div>
            </div>
        )}

        {/* --- MAIN PAGE CONTAINER --- */}
        <div 
            ref={scrollViewRef} 
            className="flex-1 flex items-center justify-center p-2 md:p-6 relative z-10 touch-pan-y overflow-y-auto"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onScroll={handleScroll}
        >
            {/* The Physical Paper Sheet */}
            <div 
                key={activePage.number} // Forces re-render and animation on page change
                className="w-full max-w-2xl min-h-[90vh] bg-[#fdfbf7] relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden rounded-[2px] animate-page-turn"
            >
                
                {/* 1. Parallax Paper Texture */}
                <div className="absolute inset-0 z-0 bg-[#FFFBF2] overflow-hidden">
                     {/* Parallax Layer */}
                     <div 
                        ref={bgRef}
                        className="absolute inset-0 -top-20 -bottom-20 opacity-40 mix-blend-multiply" 
                        style={{ 
                            backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                            transition: 'transform 0.1s linear' 
                        }}
                     ></div>
                     
                     {/* Spine Curve */}
                     <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#d4b483]/20 via-[#d4b483]/5 to-transparent mix-blend-multiply pointer-events-none"></div>
                     <div className="absolute top-0 bottom-0 right-0 w-1 bg-[#8a6d3b]/10 blur-[1px]"></div>
                </div>

                {/* 2. Page Stacking Effect */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 z-20 bg-[#e3dccf] border-r border-[#d6cfc2] shadow-[-2px_0_4px_rgba(0,0,0,0.1)]"></div>
                <div className="absolute top-0 bottom-0 left-[2px] w-px bg-white/40"></div>

                {/* Content Area */}
                <div className="flex-1 relative z-10 mx-3 my-3 md:mx-5 md:my-5 border-[2px] border-[#3d2b1f] flex flex-col">
                     {/* Inner Decorations */}
                     <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#D4B483]"></div>
                     <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#D4B483]"></div>
                     <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#D4B483]"></div>
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#D4B483]"></div>
                     <div className="absolute inset-1 border border-[#D4B483]/50 pointer-events-none"></div>

                     {/* TEXT AREA */}
                     <div className="flex-1 px-5 py-6 md:px-10 text-justify text-[#1a1a1a]" dir="rtl" style={{ textAlignLast: 'center', paddingBottom: '140px', lineHeight: '2.2' }}>
                             {activePage.ayahs.map((ayah, index) => {
                                 const showHeader = ayah.numberInSurah === 1;
                                 const surah = ayah.surah;
                                 const isBismillahLine = showHeader && surah?.number !== 1 && surah?.number !== 9;
                                 const isActive = currentAyahGlobalIndex === ayah.number;
                                 const isMenuSelected = selectedAyahForMenu?.number === ayah.number;
                                 const isBookmarked = bookmarks.some(b => b.ayahNumber === ayah.number);

                                 return (
                                     <AyahItem 
                                        key={ayah.number}
                                        ayah={ayah}
                                        isActive={isActive}
                                        isMenuSelected={isMenuSelected}
                                        isBookmarked={isBookmarked}
                                        showHeader={showHeader}
                                        isBismillahLine={isBismillahLine}
                                        t={t}
                                        onTap={handleAyahTap}
                                        onLongPress={handleAyahLongPress}
                                     />
                                 );
                             })}
                     </div>

                     {/* Page Footer */}
                     <div className="h-8 border-t border-[#D4B483]/30 flex items-center justify-center bg-[#fcf9f2]">
                         <span className="font-mono text-sm font-bold text-[#5c4033]">{activePage.number}</span>
                     </div>
                </div>
            </div>

            {/* Side Navigation */}
            <button 
                onClick={handleNextPage}
                disabled={activePage.number >= 604}
                className="fixed left-2 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-0 active:scale-95 z-30 group"
            >
                <ChevronLeft size={40} strokeWidth={1.5} className="filter drop-shadow-md group-hover:drop-shadow-xl" />
            </button>

            <button 
                onClick={handlePrevPage}
                disabled={activePage.number <= 1}
                className="fixed right-2 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-0 active:scale-95 z-30 group"
            >
                <ChevronRight size={40} strokeWidth={1.5} className="filter drop-shadow-md group-hover:drop-shadow-xl" />
            </button>
        </div>

        {/* Floating Audio Player */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-slide-up">
             <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-full p-2 pl-3 shadow-2xl border border-white/10 text-white flex items-center justify-between gap-3">
                 
                 {/* Play/Pause Button */}
                 <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-[#D4B483] rounded-full flex items-center justify-center text-[#3d2b1f] shadow-lg shadow-[#D4B483]/20 hover:scale-105 active:scale-95 transition-all shrink-0"
                 >
                    {isAudioLoading ? (
                        <Loader2 size={20} className="animate-spin text-[#3d2b1f]" />
                    ) : isPlaying ? (
                        <Pause size={20} fill="currentColor" />
                    ) : (
                        <Play size={20} fill="currentColor" className="ml-1" />
                    )}
                 </button>
                 
                 {/* Info & Reciter Select */}
                 <div className="flex flex-col flex-1 min-w-0 px-2 cursor-pointer group" onClick={() => setShowRecitersList(true)}>
                     <span className="text-[10px] font-bold text-[#D4B483] truncate tracking-wide uppercase">
                         {currentAyahGlobalIndex !== -1 ? `${t('ayahs')} in Page` : t('listen')}
                     </span>
                     <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-white transition-colors">
                        <Users size={12} />
                        <span className="text-xs font-medium truncate">
                             {selectedReciterName ? (language === 'ar' ? selectedReciterName.ar : selectedReciterName.en) : t('reciter')}
                        </span>
                        <ChevronUp size={10} className="text-[#D4B483]" />
                     </div>
                 </div>

                 {/* Stop Button */}
                 <div className="flex gap-1 items-center pr-1 border-l border-white/10 pl-2">
                    <button onClick={stopAudio} className="w-10 h-10 flex items-center justify-center hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors active:scale-95">
                        <Square size={16} fill="currentColor" />
                    </button>
                 </div>
             </div>
        </div>

        <audio ref={audioRef} onEnded={handleAudioEnded} hidden />

        {/* Reciters List Modal */}
        {showRecitersList && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end animate-fade-in" onClick={() => setShowRecitersList(false)}>
                <div 
                    className="bg-[#1a1a1a] w-full rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto animate-slide-up shadow-2xl border-t border-white/10"
                    onClick={e => e.stopPropagation()}
                >
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-[#D4B483] font-kufi">{t('reciter')}</h3>
                        <button onClick={() => setShowRecitersList(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white">
                            <X size={18} />
                        </button>
                     </div>
                     
                     <div className="space-y-2">
                        {RECITERS_LIST.map(r => (
                            <button 
                                key={r.id}
                                onClick={() => handleReciterSelect(r.id)}
                                className={`w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98] ${
                                    selectedReciter === r.id 
                                    ? 'bg-[#D4B483] text-[#3d2b1f] font-bold shadow-lg' 
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                }`}
                            >
                                <span className="text-sm font-medium">{language === 'ar' ? r.name.ar : r.name.en}</span>
                                {selectedReciter === r.id && <Check size={18} />}
                            </button>
                        ))}
                     </div>
                </div>
            </div>
        )}

        {/* Context Menu */}
        {selectedAyahForMenu && (
            <div className="fixed inset-0 z-[60] flex items-end bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedAyahForMenu(null)}>
                <div 
                    onClick={e => e.stopPropagation()}
                    className="bg-[#fdfbf7] w-full rounded-t-[2rem] p-6 animate-slide-up shadow-2xl relative max-h-[85vh] flex flex-col"
                >
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>
                    
                    {!tafsirData ? (
                        <>
                             <div className="mb-6 text-center px-4 overflow-y-auto max-h-[25vh]">
                                <div className="inline-block bg-[#D4B483]/20 text-[#8b5e3c] px-3 py-1 rounded-lg text-xs font-bold mb-3 border border-[#D4B483]/30">
                                    {t('ayahs')} {selectedAyahForMenu.numberInSurah} - {selectedAyahForMenu.surah?.name}
                                </div>
                                <p className="font-quran-uthmani text-xl text-[#3d2b1f] leading-loose" dir="rtl">
                                    {selectedAyahForMenu.text}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3 shrink-0">
                                <ActionBtn icon={Book} label="التفسير" onClick={() => fetchTafsir(selectedAyahForMenu.number)} highlight />
                                <ActionBtn 
                                    icon={BookmarkIcon} 
                                    label={bookmarks.some(b => b.ayahNumber === selectedAyahForMenu.number) ? (language === 'ar' ? 'إزالة' : 'Remove') : t('bookmark')} 
                                    active={bookmarks.some(b => b.ayahNumber === selectedAyahForMenu.number)} 
                                    onClick={toggleBookmark} 
                                />
                                <ActionBtn icon={Share2} label={t('share')} onClick={() => {}} />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col h-full max-h-[60vh]">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Book size={18} className="text-[#8b5e3c]" />
                                    التفسير الميسر
                                </h3>
                                <button onClick={() => setTafsirData(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-red-500">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="overflow-y-auto pr-2">
                                <p className="text-base text-slate-700 leading-8 font-medium font-arabic text-justify" dir="rtl">
                                    {tafsirData.text}
                                </p>
                            </div>
                        </div>
                    )}

                    {loadingTafsir && (
                        <div className="absolute inset-0 bg-[#fdfbf7]/80 flex items-center justify-center rounded-t-[2rem]">
                            <div className="w-8 h-8 border-4 border-[#D4B483] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

const ActionBtn: React.FC<{ icon: any, label: string, onClick: () => void, highlight?: boolean, active?: boolean }> = React.memo(({ icon: Icon, label, onClick, highlight, active }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-3 h-20 rounded-2xl transition-all active:scale-95
            ${highlight 
                ? 'bg-[#8b5e3c] text-white shadow-lg shadow-[#8b5e3c]/20' 
                : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 shadow-sm'}
        `}
    >
        <Icon size={22} fill={active ? "currentColor" : "none"} className={active ? "text-red-500" : ""} />
        <span className="text-[10px] font-bold">{label}</span>
    </button>
));

export default QuranView;