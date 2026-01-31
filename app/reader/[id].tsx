import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { ChevronRight, Play, Pause, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SurahDetail, Reciter, Ayah } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

export default function QuranReader() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isRTL } = useLanguage();
  
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Audio State
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [reciter, setReciter] = useState(Reciter.ALAFASY);

  // Swipe State logic
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
    if(sound) { await sound.unloadAsync(); setSound(null); setIsPlaying(false); }

    try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
        const data = await res.json();
        setSurah(data.data);
    } catch (e) {
        console.error(e);
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
        if (sound) await sound.unloadAsync();
        
        const ayahNumber = surah.ayahs[index].number;
        const uri = `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahNumber}.mp3`;
        
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
        
        setSound(newSound);
        setIsPlaying(true);
        setCurrentAyahIndex(index);

        newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                playAyah(index + 1);
            }
        });
    } catch (error) {
        console.error("Audio Error", error);
        setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying && sound) {
        sound.pauseAsync();
        setIsPlaying(false);
    } else if (!isPlaying && sound) {
        sound.playAsync();
        setIsPlaying(true);
    } else {
        playAyah(currentAyahIndex === -1 ? 0 : currentAyahIndex);
    }
  };

  // --- Swipe Logic ---
  const handleTouchStart = (e: any) => {
      touchStartX.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e: any) => {
      touchEndX.current = e.nativeEvent.pageX;
      handleSwipe();
  };

  const handleSwipe = () => {
      if (!surah) return;
      const minSwipeDistance = 50;
      const distance = touchStartX.current - touchEndX.current; // Positive = Swipe Left, Negative = Swipe Right

      if (Math.abs(distance) < minSwipeDistance) return;

      // Logic for RTL context:
      // Swipe Left (Drag finger right to left) -> Next Content
      if (distance > 0) {
          // Next Surah
          if (surah.number < 114) {
              router.setParams({ id: (surah.number + 1).toString() });
          }
      } else {
          // Prev Surah
          if (surah.number > 1) {
              router.setParams({ id: (surah.number - 1).toString() });
          }
      }
  };

  if (loading) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator color="#D4B483" size="large" />
          </View>
      );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                <X size={24} color="#e8dcc2" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.surahTitle}>{surah?.name}</Text>
                <Text style={styles.pageInfo}>Juz 1 • {surah?.revelationType}</Text>
            </View>
            <View style={{ width: 24 }} />
        </View>

        {/* Reader Area with Swipe Detection */}
        <View 
            style={styles.readerArea}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.paper}>
                    <View style={styles.borderBox}>
                         {/* Header Decoration */}
                        <View style={styles.decorContainer}>
                            <Text style={styles.bismillah}>
                                {surah?.number !== 9 ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" : ""}
                            </Text>
                        </View>

                        <Text style={styles.quranText}>
                            {surah?.ayahs.map((ayah, index) => {
                                let text = ayah.text;
                                if (surah.number !== 1 && surah.number !== 9 && index === 0) {
                                    text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                                }
                                const isActive = index === currentAyahIndex;
                                return (
                                    <Text key={ayah.number} style={[
                                        styles.ayahText, 
                                        isActive && { color: '#D4B483' } // Highlight logic simple for text
                                    ]}>
                                        {text} <Text style={styles.ayahSymbol}>۝{ayah.numberInSurah.toLocaleString('ar-EG')} </Text>
                                    </Text>
                                );
                            })}
                        </Text>
                    </View>
                </View>
                <View style={{ height: 100 }} /> 
            </ScrollView>
        </View>

        {/* Floating Player */}
        <View style={styles.player}>
            <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
                {isPlaying ? <Pause size={24} color="#D4B483" /> : <Play size={24} color="#D4B483" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.playerText}>
                    {currentAyahIndex !== -1 ? `Ayah ${surah?.ayahs[currentAyahIndex].numberInSurah}` : 'Listen'}
                </Text>
                <Text style={styles.reciterName}>Mishary Alafasy</Text>
            </View>
        </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#2d241e' },
  closeBtn: { padding: 4 },
  surahTitle: { color: '#e8dcc2', fontSize: 18, fontFamily: 'ReemKufi' },
  pageInfo: { color: 'rgba(232, 220, 194, 0.6)', fontSize: 10, fontFamily: 'Tajawal-Regular' },
  
  readerArea: { flex: 1 },
  scrollContent: { padding: 10, alignItems: 'center' },
  paper: { backgroundColor: '#FFFBF2', width: width - 20, minHeight: '100%', borderRadius: 4, padding: 4 },
  borderBox: { borderWidth: 2, borderColor: '#1a1a1a', flex: 1, padding: 10, borderStyle: 'solid' },
  decorContainer: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  bismillah: { fontFamily: 'AmiriQuran', fontSize: 24, color: '#3d2b1f' },
  quranText: { textAlign: 'center', lineHeight: 50, paddingHorizontal: 10, writingDirection: 'rtl' },
  ayahText: { fontFamily: 'AmiriQuran', fontSize: 22, color: '#2d241e' },
  ayahSymbol: { color: '#D4B483', fontSize: 18 },

  player: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fdfbf7', padding: 16, flexDirection: 'row', alignItems: 'center', borderTopWidth: 2, borderTopColor: '#D4B483' },
  playBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3d2b1f', alignItems: 'center', justifyContent: 'center' },
  playerText: { fontWeight: 'bold', color: '#3d2b1f' },
  reciterName: { fontSize: 10, color: '#8B5E3C' }
});
