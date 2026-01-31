import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sun, Moon, CheckCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { ZikrItem } from '../types';

const AZKAR_DATA: ZikrItem[] = [
    { id: 1, category: 'morning', text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 0, target: 100 },
    { id: 2, category: 'morning', text: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", count: 0, target: 100 },
    { id: 3, category: 'evening', text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا", count: 0, target: 1 },
    { id: 4, category: 'prayer', text: "سُبْحَانَ اللهِ", count: 0, target: 33 },
    { id: 5, category: 'prayer', text: "الْحَمْدُ لِلَّهِ", count: 0, target: 33 },
    { id: 6, category: 'prayer', text: "اللهُ أَكْبَرُ", count: 0, target: 33 },
];

export default function AzkarScreen() {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'prayer'>('morning');
    const [items, setItems] = useState<ZikrItem[]>(AZKAR_DATA);

    const handleIncrement = (id: number) => {
        // Vibrate on tap for feedback
        Vibration.vibrate(10);
        
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                if (item.count >= item.target) return item;
                return { ...item, count: item.count + 1 };
            }
            return item;
        }));
    };

    const filteredItems = items.filter(i => i.category === activeTab);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" style={{ transform: [{ rotate: isRTL ? '0deg' : '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('azkar')}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <View style={[styles.tabContainer, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                {[
                    { key: 'morning', label: t('morning'), icon: Sun },
                    { key: 'evening', label: t('evening'), icon: Moon },
                    { key: 'prayer', label: t('prayer'), icon: CheckCircle },
                ].map((tab: any) => (
                    <TouchableOpacity 
                        key={tab.key} 
                        onPress={() => setActiveTab(tab.key)}
                        style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                    >
                        <tab.icon size={16} color={activeTab === tab.key ? '#059669' : '#64748b'} />
                        <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {filteredItems.map(item => {
                    const progress = (item.count / item.target) * 100;
                    const isCompleted = item.count >= item.target;

                    return (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.progressBg}>
                                <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: isCompleted ? '#10b981' : '#059669' }]} />
                            </View>
                            
                            <View style={{ padding: 20 }}>
                                <View style={{ flexDirection: isRTL ? 'row' : 'row-reverse', justifyContent: 'space-between', marginBottom: 15 }}>
                                    <View style={styles.targetBadge}>
                                        <Text style={styles.targetText}>{item.target} {t('times')}</Text>
                                    </View>
                                </View>

                                <Text style={styles.dhikrText}>{item.text}</Text>

                                <TouchableOpacity 
                                    onPress={() => handleIncrement(item.id)}
                                    activeOpacity={0.7}
                                    style={[styles.counterBtn, isCompleted && styles.completedBtn]}
                                >
                                    <Text style={[styles.counterText, isCompleted && { color: '#064e3b' }]}>
                                        {isCompleted ? t('completed') : item.count}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { padding: 20, alignItems: 'center', justifyContent: 'space-between' },
    backBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    title: { fontSize: 20, fontFamily: 'Tajawal-Bold', color: '#1e293b' },
    
    tabContainer: { marginHorizontal: 20, backgroundColor: '#fff', padding: 4, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 6, borderRadius: 12 },
    activeTab: { backgroundColor: '#ecfdf5' },
    tabText: { fontFamily: 'Tajawal-Bold', fontSize: 12, color: '#64748b' },
    activeTabText: { color: '#059669' },

    card: { backgroundColor: '#fff', borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
    progressBg: { height: 4, backgroundColor: '#f1f5f9', width: '100%' },
    progressBar: { height: '100%' },
    targetBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    targetText: { fontSize: 12, fontFamily: 'Tajawal-Bold', color: '#64748b' },
    dhikrText: { fontSize: 24, fontFamily: 'AmiriQuran', color: '#1e293b', textAlign: 'center', lineHeight: 45, marginBottom: 20 },
    counterBtn: { backgroundColor: '#1e293b', paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
    completedBtn: { backgroundColor: '#d1fae5' },
    counterText: { fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold', color: '#fff' },
});
