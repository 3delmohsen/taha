import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ChevronLeft } from 'lucide-react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Surah } from '../../../types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuranList() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(search) || s.englishName.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity 
        style={[styles.card, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}
        onPress={() => router.push({ pathname: '/reader/[id]', params: { id: item.number, name: item.name } })}
    >
        <View style={{ flexDirection: isRTL ? 'row' : 'row-reverse', alignItems: 'center', gap: 15 }}>
            <View style={styles.numberBox}>
                <Text style={styles.numberText}>{item.number}</Text>
            </View>
            <View>
                <Text style={styles.surahName}>{isRTL ? item.name : item.englishName}</Text>
                <Text style={styles.surahInfo}>
                    {item.revelationType === 'Meccan' ? t('meccan') : t('medinan')} • {item.numberOfAyahs} {t('ayahs')}
                </Text>
            </View>
        </View>
        <ChevronLeft size={20} color="#cbd5e1" style={{ transform: [{ rotate: isRTL ? '0deg' : '180deg' }] }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>{t('quran')}</Text>
            <View style={[styles.searchBox, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                <Search size={20} color="#D4B483" />
                <TextInput 
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    placeholder={t('searchSurah')}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#059669" style={{ marginTop: 50 }} />
        ) : (
            <FlatList
                data={filteredSurahs}
                keyExtractor={item => item.number.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
            />
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf7' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  title: { fontFamily: 'ReemKufi', fontSize: 28, color: '#3d2b1f', marginBottom: 15, textAlign: 'center' },
  searchBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { flex: 1, fontFamily: 'Tajawal-Regular', fontSize: 16, color: '#334155' },
  
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 10, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  numberBox: { width: 36, height: 36, backgroundColor: '#f0fdf4', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#dcfce7' },
  numberText: { fontFamily: 'Inter', fontSize: 14, fontWeight: 'bold', color: '#059669' },
  surahName: { fontFamily: 'ReemKufi', fontSize: 18, color: '#1e293b' },
  surahInfo: { fontFamily: 'Tajawal-Regular', fontSize: 12, color: '#94a3b8', marginTop: 2 },
});
