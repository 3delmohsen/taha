import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { ChevronRight, Play, Pause, X, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SurahDetail, Reciter, Ayah } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

export default function QuranReader() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Audio State
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [reciter, setReciter] = useState(Reciter.ALAFASY);

  // Swipe State
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    loadSurah(Number(id));
    return () => {
        if (sound) sound.unloadAsync();
    };
  }, [id]);

  const loadSurah = async (surahNumber: number) => {
    setLoading(true);
    setSurah(null);
    setCurrentAyahIndex(-1);
    setIsPlaying(false);
    if(sound) { await sound.unloadAsync(); setSound(null); }

    try {
        // Fetching Quran text (Uthmani)
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
        const data = await res.json();
        
        // Fetching Audio Data (Alafasy) to ensure we have valid audio references if needed, 
        // though we construct URLs manually for efficiency.
        setSurah(data.data);
    } catch (e) {
        console.error("Failed to load Surah", e);
    } finally {
        setLoading(false);
    }
  };

  // --- Audio Logic ---
  const playAyah = async (index: number) => {
    if (!surah || index >= surah.ayahs.length) {
        setIsPlaying(false);
        setCurrentAyahIndex(-1);
        return;
    }

    try {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
        
        const ayahNumber = surah.ayahs[index].number;
        const uri = `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahNumber}.mp3`;
        
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri }, 
            { shouldPlay: true }
        );
        
        setSound(newSound);
        setIsPlaying(true);
        setCurrentAyahIndex(index);

        newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                // Auto play next
                playAyah(index + 1);
            }
        });
    } catch (error) {
        console.error("Audio Playback Error", error);
        setIsPlaying(false);
    }
  };

  const handleAyahPress = (index: number) => {
      if (currentAyahIndex === index && isPlaying) {
          // Pause if tapping same ayah
          sound?.pauseAsync();
          setIsPlaying(false);
      } else {
          // Play new ayah
          playAyah(index);
      }
  };

  const togglePlayPause = async () => {
    if (!sound) {
        playAyah(currentAyahIndex === -1 ? 0 : currentAyahIndex);
        return;
    }

    if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
    } else {
        await sound.playAsync();
        setIsPlaying(true);
    }
  };

  // --- Swipe / Navigation Logic ---
  const handleTouchStart = (e: any) => {
      touchStartX.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e: any) => {
      touchEndX.current = e.nativeEvent.pageX;
      const minSwipeDistance = 50;
      const distance = touchStartX.current - touchEndX.current;

      if (Math.abs(distance) < minSwipeDistance) return;

      // RTL Logic: Swipe Left (Drag Right -> Left) means go to NEXT page (Next Surah)
      if (distance > 0) {
          if (surah && surah.number < 114) {
              router.setParams({ id: (surah.number + 1).toString() });
          }
      } else {
          if (surah && surah.number > 1) {
              router.setParams({ id: (surah.number - 1).toString() });
          }
      }
  };

  if (loading) {
      return (
          <View style={[styles.container, styles.centerContent]}>
              <ActivityIndicator color="#D4B483" size="large" />
              <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
      );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                <X size={24} color="#3d2b1f" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
                <Text style={styles.surahTitle}>{surah?.name}</Text>
                <Text style={styles.surahSubtitle}>
                     {t('juz')} {surah ? Math.ceil(surah.ayahs[0].juz) : '-'} • {surah?.revelationType === 'Meccan' ? t('meccan') : t('medinan')}
                </Text>
            </View>
            
            <View style={{ width: 40 }} />
        </View>

        {/* Mushaf Reader */}
        <View 
            style={styles.readerArea}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageContainer}>
                    {/* Decorative Border */}
                    <View style={styles.pageBorder}>
                        
                        {/* Surah Ornament Header */}
                        <View style={styles.surahHeader}>
                            <View style={styles.ornamentLine} />
                            <View style={styles.ornamentBox}>
                                <Text style={styles.ornamentText}>{surah?.name.replace('سورة', '').trim()}</Text>
                            </View>
                            <View style={styles.ornamentLine} />
                        </View>

                        {/* Basmalah */}
                        {surah?.number !== 9 && surah?.number !== 1 && (
                            <Text style={styles.basmalah}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
                        )}

                        {/* Quran Text Body - Justified Paragraph */}
                        <Text style={styles.quranParagraph}>
                            {surah?.ayahs.map((ayah, index) => {
                                let text = ayah.text;
                                // Remove Basmalah from start of first ayah if not Al-Fatiha/Tawbah
                                if (surah.number !== 1 && surah.number !== 9 && index === 0) {
                                    text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                                }
                                
                                const isActive = index === currentAyahIndex;

                                return (
                                    <Text 
                                        key={ayah.number}
                                        onPress={() => handleAyahPress(index)}
                                        style={[
                                            styles.ayahText,
                                            isActive && styles.activeAyahText
                                        ]}
                                    >
                                        {text}
                                        <Text style={styles.ayahEndSymbol}>
                                            {` \u06dd${ayah.numberInSurah.toLocaleString('ar-EG')} `}
                                        </Text>
                                    </Text>
                                );
                            })}
                        </Text>

                    </View>
                </View>
                <View style={{ height: 120 }} /> 
            </ScrollView>
        </View>

        {/* Bottom Audio Controls */}
        <View style={styles.bottomControls}>
            <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>
                    {currentAyahIndex !== -1 
                        ? `${t('ayah')} ${surah?.ayahs[currentAyahIndex].numberInSurah}` 
                        : t('listen')}
                </Text>
                <Text style={styles.reciterName}>Mishary Alafasy</Text>
            </View>
            
            <View style={styles.controlsRow}>
                <TouchableOpacity 
                    onPress={() => handleTouchEnd({ nativeEvent: { pageX: -100 } })} // Simulate Swipe Prev
                    style={styles.navBtn}
                >
                    <ChevronLeft size={20} color="#3d2b1f" />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlayPause} style={styles.playBtn}>
                    {isPlaying ? (
                        <Pause size={24} color="#fff" fill="#fff" />
                    ) : (
                        <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => handleTouchEnd({ nativeEvent: { pageX: 100 } })} // Simulate Swipe Next
                    style={styles.navBtn}
                >
                    <ChevronRight size={20} color="#3d2b1f" />
                </TouchableOpacity>
            </View>
        </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7' }, // Cream background
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontFamily: 'Tajawal-Regular', color: '#64748b' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fdfbf7', borderBottomWidth: 1, borderBottomColor: 'rgba(212, 180, 131, 0.2)' },
  iconBtn: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(212, 180, 131, 0.1)' },
  headerTitleContainer: { alignItems: 'center' },
  surahTitle: { fontFamily: 'ReemKufi', fontSize: 20, color: '#3d2b1f' },
  surahSubtitle: { fontFamily: 'Tajawal-Regular', fontSize: 12, color: '#8b5e3c' },

  readerArea: { flex: 1, backgroundColor: '#fdfbf7' },
  scrollContent: { paddingVertical: 10, paddingHorizontal: 0 },
  
  pageContainer: { 
    width: width, 
    paddingHorizontal: 16,
    alignItems: 'center' 
  },
  pageBorder: {
      width: '100%',
      backgroundColor: '#FFFBF2', // Slightly lighter cream for paper
      borderWidth: 1,
      borderColor: '#D4B483', // Gold border
      paddingHorizontal: 14, // Padding inside the border box
      paddingVertical: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },

  surahHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      marginTop: 10,
  },
  ornamentLine: { flex: 1, height: 1, backgroundColor: '#D4B483', opacity: 0.5 },
  ornamentBox: { 
      borderWidth: 2, 
      borderColor: '#D4B483', 
      paddingHorizontal: 20, 
      paddingVertical: 8, 
      backgroundColor: '#fdfbf7',
      transform: [{ rotate: '0deg' }], // Keep box straight
      marginHorizontal: 10
  },
  ornamentText: { 
      fontFamily: 'ReemKufi', 
      fontSize: 18, 
      color: '#3d2b1f',
  },

  basmalah: { 
      fontFamily: 'AmiriQuran', 
      fontSize: 26, 
      color: '#3d2b1f', 
      textAlign: 'center', 
      marginBottom: 20 
  },

  // The Core Mushaf Logic
  quranParagraph: {
      textAlign: 'justify', // Critical for Mushaf feel
      writingDirection: 'rtl',
      lineHeight: 50, // High line height for Arabic diacritics
      color: '#3d2b1f',
      paddingBottom: 20,
  },
  ayahText: {
      fontFamily: 'AmiriQuran',
      fontSize: 24,
      color: '#3d2b1f',
  },
  activeAyahText: {
      color: '#059669', // Emerald highlight text
      backgroundColor: 'rgba(212, 180, 131, 0.15)', // Subtle gold background
  },
  ayahEndSymbol: {
      fontFamily: 'AmiriQuran',
      fontSize: 22,
      color: '#D4B483', // Gold color for end of ayah
  },

  bottomControls: {
      position: 'absolute',
      bottom: 20,
      left: 16,
      right: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 1,
      borderColor: 'rgba(212, 180, 131, 0.3)',
  },
  audioInfo: { flex: 1 },
  audioTitle: { fontFamily: 'Tajawal-Bold', fontSize: 14, color: '#3d2b1f' },
  reciterName: { fontFamily: 'Tajawal-Regular', fontSize: 12, color: '#8b5e3c' },
  
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navBtn: { padding: 8 },
  playBtn: { 
      width: 50, 
      height: 50, 
      borderRadius: 25, 
      backgroundColor: '#059669', 
      alignItems: 'center', 
      justifyContent: 'center',
      shadowColor: '#059669',
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4
  }
});