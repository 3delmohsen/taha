import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, ChevronRight, ChevronLeft, Settings, X, Bookmark as BookmarkIcon, BookOpen, SkipForward, SkipBack, Share2, MoreHorizontal, Volume2 } from 'lucide-react';
import { Surah, SurahDetail, Reciter, Ayah, Bookmark } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// --- VISUAL COMPONENTS ---

const AyahEndSymbol: React.FC<{ number: number }> = ({ number }) => (
  <span className="inline-flex items-center justify-center relative mx-1.5 align-middle select-none h-[1em] w-[1em] opacity-90">
     <svg viewBox="0 0 40 40" className="w-[1.5em] h-[1.5em] text-[#D4B483] fill-transparent stroke-current stroke-[1.5]">
        <circle cx="20" cy="20" r="18" />
        <path d="M20 2v4 M20 34v4 M2 20h4 M34 20h4 M7.5 7.5l2.5 2.5 M30 30l2.5 2.5 M7.5 32.5l2.5-2.5 M30 10l2.5-2.5" />
     </svg>
     <span className="absolute inset-0 flex items-center justify-center text-[0.4em] font-bold text-[#3d2b1f] pt-0.5 font-ar">
        {number.toLocaleString('ar-EG')}
     </span>
  </span>
);

const SurahHeaderDecor: React.FC<{ surahName: string, type: string }> = ({ surahName, type }) => (
    <div className="my-6 relative py-4">
        <div className="surah-header-ornament h-12 flex items-center justify-center relative overflow-hidden">
            {/* Geometric Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#3d2b1f 1px, transparent 1px)", backgroundSize: "8px 8px" }}></div>
            
            <div className="flex flex-col items-center justify-center z-10">
                <span className="font-quran-uthmani text-2xl text-[#3d2b1f] font-bold drop-shadow-sm">
                    سورة {surahName.replace('سورة ', '')}
                </span>
            </div>
            
            {/* Side Ornaments */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3d2b1f] rotate-45"></div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3d2b1f] rotate-45"></div>
        </div>
    </div>
);

const Basmalah: React.FC = () => (
    <div className="text-center mb-8 relative">
        <div className="font-quran-uthmani text-3xl text-[#3d2b1f] relative z-10 leading-loose">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const QuranView: React.FC = () => {
  const { t, language } = useLanguage();
  
  // -- Data State --
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [activeSurah, setActiveSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // -- Playback State --
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(-1); 
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(Reciter.ALAFASY);
  
  // -- UI Interaction State --
  const [activeAyahId, setActiveAyahId] = useState<number | null>(null); // For visual highlight
  const [selectedAyahForMenu, setSelectedAyahForMenu] = useState<Ayah | null>(null); // For bottom sheet
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  
  // -- Refs --
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);

  // -- Swipe Gesture Refs --
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));

    const saved = localStorage.getItem('taha_bookmark');
    if (saved) setBookmark(JSON.parse(saved));
  }, []);

  // --- LOAD SURAH ---
  const loadSurah = async (number: number) => {
    setLoading(true);
    setIsPlaying(false);
    setCurrentAyahIndex(-1);
    setActiveAyahId(null);
    setSelectedAyahForMenu(null);
    
    // Reset Scroll Position
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollTop = 0;
    }

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`);
      const data = await res.json();
      setActiveSurah(data.data);
    } catch (e) {
      console.error(e);
      // Simple fallback
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
      const data = await res.json();
      setActiveSurah(data.data);
    } finally {
      setLoading(false);
    }
  };

  // --- AUDIO ENGINE (Gapless & Sync) ---
  
  const getAudioUrl = (ayahId: number) => {
      return `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${ayahId}.mp3`;
  };

  const preloadNextAyah = (index: number) => {
      if (!activeSurah || index >= activeSurah.ayahs.length - 1) return;
      const nextAyah = activeSurah.ayahs[index + 1];
      const url = getAudioUrl(nextAyah.number);
      // Create a floating audio object to force browser to cache the file
      if (!preloadAudioRef.current) preloadAudioRef.current = new Audio();
      preloadAudioRef.current.src = url;
      preloadAudioRef.current.load();
  };

  useEffect(() => {
    if (!activeSurah || currentAyahIndex === -1) return;

    const ayah = activeSurah.ayahs[currentAyahIndex];
    if (!ayah) return;

    // 1. Highlight & Scroll
    setActiveAyahId(ayah.number);
    if (ayahRefs.current[ayah.number]) {
        ayahRefs.current[ayah.number]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // 2. Play Audio
    if (audioRef.current) {
        audioRef.current.src = getAudioUrl(ayah.number);
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Play error", e));
        }
    }

    // 3. Buffer Next
    preloadNextAyah(currentAyahIndex);

  }, [currentAyahIndex, activeSurah, selectedReciter]);

  const togglePlay = () => {
      if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
      } else {
          setIsPlaying(true);
          if (currentAyahIndex === -1) {
              setCurrentAyahIndex(0); // Start from beginning
          } else {
              audioRef.current?.play();
          }
      }
  };

  const handleAudioEnded = () => {
      if (activeSurah && currentAyahIndex < activeSurah.ayahs.length - 1) {
          setCurrentAyahIndex(prev => prev + 1);
      } else {
          setIsPlaying(false);
          setCurrentAyahIndex(-1);
      }
  };

  // --- INTERACTION ---
  
  const handleAyahTap = (ayah: Ayah, index: number) => {
      // If playing, just jump there
      if (isPlaying) {
          setCurrentAyahIndex(index);
      } else {
          // If paused/stopped, show context menu
          setActiveAyahId(ayah.number); // just visual highlight
          setSelectedAyahForMenu(ayah);
      }
  };

  const playFromMenu = () => {
      if (activeSurah && selectedAyahForMenu) {
          const idx = activeSurah.ayahs.findIndex(a => a.number === selectedAyahForMenu.number);
          if (idx !== -1) {
              setCurrentAyahIndex(idx);
              setIsPlaying(true);
              setSelectedAyahForMenu(null);
          }
      }
  };

  const saveBookmark = () => {
      if (!activeSurah || !selectedAyahForMenu) return;
      const newBookmark: Bookmark = {
          surahNumber: activeSurah.number,
          surahName: activeSurah.name,
          ayahNumber: selectedAyahForMenu.number,
          ayahInSurah: selectedAyahForMenu.numberInSurah,
          timestamp: Date.now()
      };
      setBookmark(newBookmark);
      localStorage.setItem('taha_bookmark', JSON.stringify(newBookmark));
      setSelectedAyahForMenu(null);
  };

  // --- NAVIGATION HELPER ---
  const handleContinueReading = () => {
      if (bookmark) {
          loadSurah(bookmark.surahNumber).then(() => {
              // Short delay to allow render
              setTimeout(() => {
                  const el = document.getElementById(`ayah-${bookmark.ayahNumber}`);
                  el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                  setActiveAyahId(bookmark.ayahNumber);
              }, 600);
          });
      }
  };

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(searchTerm) || s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- SWIPE LOGIC ---
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const setTouchEnd = (val: null) => {
    if (val === null) {
        touchEndX.current = null;
        touchEndY.current = null;
    }
  }

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !activeSurah) return;
    
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = (touchStartY.current || 0) - (touchEndY.current || 0);
    const minSwipeDistance = 50;

    // Check if it's horizontal swipe (X axis dominance)
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
         // Swipe LEFT (Drag finger right to left) -> Go to Next Surah (in RTL context visual)
         // Actually in RTL:
         // Drag Left (x decreases) -> Next Content (Left side)
         if (distanceX > minSwipeDistance) {
            // Next Surah
            if (activeSurah.number < 114) {
                loadSurah(activeSurah.number + 1);
            }
         }
         
         // Swipe RIGHT (Drag finger left to right) -> Prev Surah
         if (distanceX < -minSwipeDistance) {
             // Prev Surah
             if (activeSurah.number > 1) {
                loadSurah(activeSurah.number - 1);
             }
         }
    }
  };


  // === RENDER: SURAH LIST ===
  if (!activeSurah) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7] cream-paper-bg relative">
         {/* Sticky Search Header */}
         <div className="sticky top-0 z-20 px-4 pt-6 pb-4 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#D4B483]/20">
             <div className="flex justify-between items-end mb-4">
                 <div>
                     <h1 className="text-3xl font-bold text-[#3d2b1f] font-kufi drop-shadow-sm">{t('quran')}</h1>
                     <p className="text-xs text-[#8B5E3C] mt-1 opacity-80">{t('greeting')}</p>
                 </div>
                 {bookmark && (
                     <button 
                        onClick={handleContinueReading}
                        className="flex items-center gap-2 bg-[#3d2b1f] text-amber-50 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-slate-800 transition-colors"
                     >
                        <BookOpen size={14} />
                        {t('continueReading')}
                     </button>
                 )}
             </div>
             
             <div className="relative group">
                 <input 
                    type="text" 
                    placeholder={t('searchSurah')}
                    className="w-full bg-white/80 border border-[#D4B483]/50 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:ring-2 focus:ring-[#D4B483] focus:border-transparent transition-all text-[#3d2b1f] placeholder:text-[#3d2b1f]/40 rtl:pr-11 rtl:pl-4 ltr:pl-11 ltr:pr-4 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <Search className="absolute right-4 top-3.5 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto text-[#D4B483] group-focus-within:text-[#8B5E3C] transition-colors" size={20} />
             </div>
         </div>

         {/* List */}
         {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center opacity-50">
               <div className="w-10 h-10 border-4 border-[#D4B483] border-t-transparent rounded-full animate-spin"></div>
           </div>
         ) : (
           <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3 no-scrollbar pt-2">
              {filteredSurahs.map((surah) => (
                  <div 
                      key={surah.number}
                      onClick={() => loadSurah(surah.number)}
                      className="bg-white/60 p-3 rounded-xl border border-[#e8dcc2] shadow-sm flex items-center justify-between cursor-pointer hover:bg-white hover:shadow-md transition-all active:scale-[0.98] group"
                  >
                      <div className="flex items-center gap-4">
                          {/* Geometric Star Number */}
                          <div className="relative w-10 h-10 flex items-center justify-center">
                               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#D4B483] drop-shadow-sm group-hover:text-[#8B5E3C] transition-colors" fill="currentColor">
                                   <path d="M50 0L61 35H98L68 57L79 91L50 70L21 91L32 57L2 35H39L50 0Z" />
                               </svg>
                               <span className="relative z-10 text-xs font-bold text-white pt-1 font-mono">{surah.number}</span>
                          </div>
                          
                          <div>
                              <h3 className="font-bold text-[#3d2b1f] font-kufi text-lg group-hover:text-[#8B5E3C] transition-colors">
                                  {language === 'ar' ? surah.name : surah.englishName}
                              </h3>
                              <div className="flex items-center gap-2 text-[10px] text-[#8B5E3C]/70">
                                  <span>{surah.revelationType === 'Meccan' ? t('meccan') : t('medinan')}</span>
                                  <span className="w-1 h-1 rounded-full bg-[#D4B483]"></span>
                                  <span>{surah.numberOfAyahs} {t('ayahs')}</span>
                              </div>
                          </div>
                      </div>
                      <ChevronRight size={18} className="text-[#D4B483] rtl:rotate-180 opacity-50 group-hover:opacity-100 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-all" />
                  </div>
              ))}
           </div>
         )}
      </div>
    );
  }

  // === RENDER: IMMERSIVE READER ===
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#1a1a1a]">
        
        {/* Dark Navbar for Reading Mode */}
        <div className="bg-[#2d241e] px-4 py-3 flex justify-between items-center z-30 shadow-lg shrink-0 text-[#e8dcc2]">
            <button onClick={() => { setActiveSurah(null); setIsPlaying(false); }} className="p-2 rounded-full hover:bg-white/10 transition-colors rtl:rotate-180">
                <ChevronRight size={24} />
            </button>
            <div className="flex flex-col items-center">
                 <span className="text-sm font-bold font-kufi tracking-wide">{language === 'ar' ? activeSurah.name : activeSurah.englishName}</span>
                 <div className="flex items-center gap-2 text-[10px] opacity-60">
                    <span>{t('juz')} 1</span> {/* Simplified for demo, Juz data needed in API */}
                    <span>•</span>
                    <span>{t('page')} {surahs.indexOf(surahs.find(s=>s.number===activeSurah.number)||surahs[0]) + 1}</span>
                 </div>
            </div>
            <button onClick={() => {/* Open Settings Sheet */}} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <Settings size={20} />
            </button>
        </div>

        {/* Scrollable Reader Area */}
        <div 
            ref={scrollViewRef} 
            className="flex-1 overflow-y-auto bg-[#1a1a1a] p-2 md:p-6 no-scrollbar flex justify-center relative touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ overscrollBehaviorY: 'none' }}
        >
            
            {/* The "Divine Scroll" Page */}
            <div className="cream-paper-bg w-full max-w-[500px] min-h-full rounded-sm relative mushaf-page-shadow flex flex-col transition-transform duration-500">
                
                {/* Golden Border Frame */}
                <div className="golden-border-box m-1 md:m-2 flex-1 flex flex-col">
                    
                    {/* Surah Header */}
                    <div className="px-6">
                        <SurahHeaderDecor surahName={activeSurah.name} type={activeSurah.revelationType} />
                    </div>

                    {/* Basmalah (Only if not Tawbah) */}
                    {activeSurah.number !== 9 && (
                        <Basmalah />
                    )}

                    {/* TEXT BLOCK */}
                    <div className="px-4 md:px-8 pb-10 text-justify" dir="rtl" style={{ textAlignLast: 'center' }}>
                         <p className="leading-[2.5] md:leading-[3] text-[#1a1a1a]">
                            {activeSurah.ayahs.map((ayah, index) => {
                                const isBookmarked = bookmark?.ayahNumber === ayah.number;
                                const isActive = activeAyahId === ayah.number;
                                const isSelected = selectedAyahForMenu?.number === ayah.number;

                                // Strip Basmalah from Ayah 1 text for display (except Fatiha)
                                let displayText = ayah.text;
                                if (activeSurah.number !== 1 && activeSurah.number !== 9 && index === 0) {
                                     displayText = displayText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                                }

                                return (
                                    <React.Fragment key={ayah.number}>
                                        <span 
                                            id={`ayah-${ayah.number}`}
                                            ref={(el) => { ayahRefs.current[ayah.number] = el; }}
                                            onClick={() => handleAyahTap(ayah, index)}
                                            className={`
                                                font-quran-uthmani text-[21px] md:text-[25px] cursor-pointer transition-all duration-300 rounded px-1 relative
                                                ${isActive ? 'bg-[#D4B483]/20 box-decoration-clone text-black' : 'hover:text-[#8B5E3C]'}
                                                ${isSelected ? 'bg-[#D4B483]/30' : ''}
                                            `}
                                        >
                                            {displayText}
                                            {isBookmarked && (
                                                <span className="absolute -top-1 right-0 text-red-500 text-[10px]">
                                                    <BookmarkIcon size={12} fill="currentColor" />
                                                </span>
                                            )}
                                        </span>
                                        <AyahEndSymbol number={ayah.numberInSurah} />
                                    </React.Fragment>
                                );
                            })}
                         </p>
                    </div>

                    {/* Page Footer Navigation */}
                    <div className="mt-auto border-t border-[#D4B483]/50 mx-8 mb-4 pt-4 flex justify-between items-center opacity-70">
                        <span className="text-[#3d2b1f] text-xs font-bold flex items-center gap-1 disabled:opacity-20">
                             {t('next')} <span className="opacity-50 text-[10px]">&lt;&lt;</span>
                        </span>
                        <span className="text-[10px] text-[#8B5E3C] font-mono">{activeSurah.number}</span>
                        <span className="text-[#3d2b1f] text-xs font-bold flex items-center gap-1 disabled:opacity-20">
                            <span className="opacity-50 text-[10px]">&gt;&gt;</span> {t('prev')} 
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- STICKY PLAYER --- */}
        <div className="bg-[#fdfbf7] border-t border-[#D4B483] px-4 py-3 flex items-center justify-between z-40 shrink-0">
             <div className="flex items-center gap-4 w-full">
                 <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-[#3d2b1f] rounded-full flex items-center justify-center text-[#D4B483] shadow-lg hover:bg-[#2d241e] active:scale-95 transition-all shrink-0"
                 >
                    {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                 </button>
                 
                 <div className="flex flex-col flex-1 overflow-hidden">
                     <span className="text-xs font-bold text-[#3d2b1f] truncate">
                         {currentAyahIndex !== -1 
                            ? `${t('ayahs')} ${activeSurah.ayahs[currentAyahIndex].numberInSurah}` 
                            : t('listen')}
                     </span>
                     <div className="flex items-center gap-1 text-[10px] text-[#8B5E3C]">
                        <Volume2 size={10} />
                        <select 
                            className="bg-transparent outline-none cursor-pointer"
                            value={selectedReciter}
                            onChange={(e) => setSelectedReciter(e.target.value as Reciter)}
                        >
                            <option value={Reciter.ALAFASY}>Mishary Alafasy</option>
                            <option value={Reciter.SUDAIS}>Abdul Rahman Al-Sudais</option>
                            <option value={Reciter.HUSARY}>Mahmoud Al-Husary</option>
                        </select>
                     </div>
                 </div>

                 <div className="flex gap-2 text-[#3d2b1f]">
                    <button onClick={() => setCurrentAyahIndex(p => Math.max(0, p - 1))} className="p-2 hover:bg-[#D4B483]/20 rounded-full rtl:rotate-180"><SkipBack size={20} /></button>
                    <button onClick={() => setCurrentAyahIndex(p => p + 1)} className="p-2 hover:bg-[#D4B483]/20 rounded-full rtl:rotate-180"><SkipForward size={20} /></button>
                 </div>
             </div>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} onEnded={handleAudioEnded} hidden />

        {/* --- CONTEXT MENU (BOTTOM SHEET) --- */}
        {selectedAyahForMenu && (
            <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-[2px]" onClick={() => setSelectedAyahForMenu(null)}>
                <div 
                    onClick={e => e.stopPropagation()}
                    className="bg-[#fdfbf7] w-full rounded-t-[2rem] p-6 animate-slide-up shadow-2xl border-t-4 border-[#D4B483] relative"
                >
                    <div className="w-12 h-1 bg-[#D4B483]/40 rounded-full mx-auto mb-6"></div>
                    
                    <div className="mb-6">
                        <span className="text-xs font-bold text-[#D4B483] uppercase tracking-wider block mb-2">{t('ayahs')} {selectedAyahForMenu.numberInSurah}</span>
                        <p className="font-quran-uthmani text-xl text-[#3d2b1f] line-clamp-3 leading-loose" dir="rtl">
                            {selectedAyahForMenu.text}
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <ActionBtn 
                            icon={Play} 
                            label={t('listen')} 
                            onClick={playFromMenu} 
                            highlight 
                        />
                        <ActionBtn 
                            icon={BookmarkIcon} 
                            label={t('bookmark')} 
                            active={bookmark?.ayahNumber === selectedAyahForMenu.number} 
                            onClick={saveBookmark} 
                        />
                        <ActionBtn 
                            icon={MoreHorizontal} 
                            label={t('tafseer')} 
                            onClick={() => {/* Implement Tafseer Fetch */}} 
                        />
                         <ActionBtn 
                            icon={Share2} 
                            label={t('share')} 
                            onClick={() => {/* Share Logic */}} 
                        />
                    </div>
                    
                    {/* Placeholder Tafseer Area */}
                    <div className="mt-6 pt-6 border-t border-[#e8dcc2]">
                        <h4 className="font-bold text-[#3d2b1f] mb-2 text-sm">{t('tafseer')} (الميسر)</h4>
                        <p className="text-xs text-[#5c4a3d] leading-relaxed">
                           {language === 'ar' ? "اضغط زر التفسير لعرض الشرح الكامل للآية." : "Tap Tafseer button to view full explanation."}
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const ActionBtn: React.FC<{ icon: any, label: string, onClick: () => void, highlight?: boolean, active?: boolean }> = ({ icon: Icon, label, onClick, highlight, active }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95
            ${highlight ? 'bg-[#3d2b1f] text-[#fdfbf7] shadow-lg shadow-[#3d2b1f]/20' : 'bg-white border border-[#e8dcc2] text-[#3d2b1f] hover:bg-[#fdfbf7]'}
        `}
    >
        <Icon size={24} fill={active ? "currentColor" : "none"} className={active ? "text-red-500" : ""} />
        <span className="text-[10px] font-bold">{label}</span>
    </button>
);

export default QuranView;