import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { getPrayerTimes, getNextPrayer } from '../../services/prayerService';
import { PrayerTimings } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { t, isRTL } = useLanguage();
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diffMs: number } | null>(null);
  const [locationName, setLocationName] = useState(t('location'));
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocationAndPrayers = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationName('Permission denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const times = await getPrayerTimes(location.coords.latitude, location.coords.longitude);
    setTimings(times);
    
    // Reverse geocode
    let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    });
    
    if (address && address.length > 0) {
        setLocationName(`${address[0].city || address[0].region}, ${address[0].isoCountryCode}`);
    }
  };

  useEffect(() => {
    fetchLocationAndPrayers();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchLocationAndPrayers} />}
      >
        {/* Header */}
        <View style={[styles.header, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
            <View style={styles.dateBadge}>
                <Calendar size={14} color="#059669" />
                <Text style={styles.dateText}>{format(new Date(), 'd MMM yyyy')}</Text>
            </View>
            <View>
                <Text style={styles.greeting}>{t('greeting')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} color="#059669" />
                    <Text style={styles.location}>{locationName}</Text>
                </View>
            </View>
        </View>

        {/* Hero Card */}
        <LinearGradient
            colors={['#059669', '#0f172a']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={{ flexDirection: isRTL ? 'row' : 'row-reverse', justifyContent: 'space-between', marginBottom: 20 }}>
                <View style={styles.nextTag}>
                    <Clock size={12} color="#a7f3d0" />
                    <Text style={styles.nextTagText}>{t('nextPrayer')}</Text>
                </View>
            </View>
            
            <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                <Text style={styles.prayerName}>{nextPrayer ? t(nextPrayer.name.toLowerCase()) : '--'}</Text>
                <Text style={styles.prayerTime}>{nextPrayer?.time}</Text>
            </View>

            <View style={styles.divider} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.timeLeftLabel}>{t('timeLeft')}</Text>
                <Text style={styles.timeLeftValue}>{nextPrayer ? formatTimeLeft(nextPrayer.diffMs) : "00:00:00"}</Text>
            </View>
        </LinearGradient>

        {/* Prayer List */}
        <View style={styles.listContainer}>
             {timings && ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((key) => {
                 const isNext = nextPrayer?.name === key;
                 return (
                     <View key={key} style={[styles.prayerRow, { flexDirection: isRTL ? 'row' : 'row-reverse' }, isNext && styles.activePrayerRow]}>
                         <View style={{ flexDirection: isRTL ? 'row' : 'row-reverse', alignItems: 'center', gap: 10 }}>
                             <View style={[styles.dot, isNext && styles.activeDot]} />
                             <Text style={[styles.prayerRowName, isNext && styles.activeText]}>{t(key.toLowerCase())}</Text>
                         </View>
                         <Text style={[styles.prayerRowTime, isNext && styles.activeText]}>{timings[key as keyof PrayerTimings]}</Text>
                     </View>
                 );
             })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7' },
  scrollContent: { padding: 20 },
  header: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontFamily: 'Tajawal-Bold', fontSize: 16, color: '#1e293b' },
  location: { fontFamily: 'Tajawal-Regular', fontSize: 12, color: '#64748b' },
  dateBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  dateText: { fontFamily: 'Inter', fontSize: 12, fontWeight: 'bold', color: '#334155' },
  
  heroCard: { padding: 24, borderRadius: 24, marginBottom: 20, shadowColor: '#059669', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  nextTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  nextTagText: { color: '#a7f3d0', fontSize: 10, fontFamily: 'Tajawal-Bold' },
  prayerName: { fontSize: 40, color: '#fff', fontFamily: 'ReemKufi', marginBottom: 4 },
  prayerTime: { fontSize: 24, color: '#6ee7b7', fontFamily: 'Inter' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  timeLeftLabel: { color: '#cbd5e1', fontSize: 12, fontFamily: 'Tajawal-Regular' },
  timeLeftValue: { color: '#fff', fontSize: 20, fontFamily: 'Inter', fontWeight: '300' },

  listContainer: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  prayerRow: { justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  activePrayerRow: { backgroundColor: '#f0fdf4', marginHorizontal: -10, paddingHorizontal: 10, borderRadius: 12, borderBottomWidth: 0 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e2e8f0' },
  activeDot: { backgroundColor: '#059669' },
  prayerRowName: { fontSize: 16, fontFamily: 'Tajawal-Regular', color: '#64748b' },
  prayerRowTime: { fontSize: 16, fontFamily: 'Inter', color: '#94a3b8' },
  activeText: { color: '#059669', fontFamily: 'Tajawal-Bold' },
});
