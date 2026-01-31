import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Share2, Star, Moon, Compass, Sun, MapPin, ChevronRight, MessageCircle } from 'lucide-react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
    const { t, isRTL } = useLanguage();
    const router = useRouter();

    const onShare = async () => {
        try {
            await Share.share({
                message: 'تطبيق طه - رفيقك الإسلامي اليومي. حمل التطبيق الآن!',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const MenuItem = ({ icon: Icon, label, color, onPress, subLabel }: any) => (
        <TouchableOpacity 
            style={[styles.menuItem, { flexDirection: isRTL ? 'row' : 'row-reverse' }]} 
            onPress={onPress}
        >
            <View style={{ flexDirection: isRTL ? 'row' : 'row-reverse', alignItems: 'center', gap: 15 }}>
                <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                    <Icon size={22} color={color} />
                </View>
                <View>
                    <Text style={styles.menuLabel}>{label}</Text>
                    {subLabel && <Text style={styles.menuSubLabel}>{subLabel}</Text>}
                </View>
            </View>
            <ChevronRight size={20} color="#cbd5e1" style={{ transform: [{ rotate: isRTL ? '0deg' : '180deg' }] }} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.headerTitle}>{t('more')}</Text>

                {/* Features Section */}
                <Text style={styles.sectionTitle}>{t('home')}</Text>
                <View style={styles.section}>
                    <MenuItem 
                        icon={Sun} 
                        label={t('azkar')} 
                        subLabel={t('azkarDesc')}
                        color="#059669" 
                        onPress={() => router.push('/azkar')} 
                    />
                    <View style={styles.divider} />
                    <MenuItem 
                        icon={Compass} 
                        label={t('qibla')} 
                        subLabel={t('qiblaDesc')}
                        color="#d97706" 
                        onPress={() => router.push('/qibla')} 
                    />
                    <View style={styles.divider} />
                     <MenuItem 
                        icon={MapPin} 
                        label={t('hajj')} 
                        subLabel="دليل الحج والعمرة (قريباً)"
                        color="#2563eb" 
                        onPress={() => {}} 
                    />
                </View>

                {/* General Section */}
                <Text style={styles.sectionTitle}>{t('settings')}</Text>
                <View style={styles.section}>
                    <MenuItem 
                        icon={Settings} 
                        label={t('settings')} 
                        color="#475569" 
                        onPress={() => router.push('/settings')} 
                    />
                     <View style={styles.divider} />
                     <MenuItem 
                        icon={MessageCircle} 
                        label={t('contactUs')} 
                        color="#475569" 
                        onPress={() => {}} 
                    />
                </View>

                 {/* Support Section */}
                 <Text style={styles.sectionTitle}>دعم التطبيق</Text>
                 <View style={styles.section}>
                    <MenuItem 
                        icon={Share2} 
                        label={t('share')} 
                        color="#db2777" 
                        onPress={onShare} 
                    />
                     <View style={styles.divider} />
                     <MenuItem 
                        icon={Star} 
                        label={t('rate')} 
                        color="#eab308" 
                        onPress={() => {}} 
                    />
                </View>
                
                <Text style={styles.version}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdfbf7' },
    headerTitle: { fontSize: 28, fontFamily: 'ReemKufi', color: '#1e293b', marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontFamily: 'Tajawal-Bold', color: '#64748b', marginBottom: 10, marginTop: 10 },
    section: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 5, borderWidth: 1, borderColor: '#f1f5f9' },
    menuItem: { padding: 15, justifyContent: 'space-between', alignItems: 'center' },
    iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { fontSize: 16, fontFamily: 'Tajawal-Bold', color: '#1e293b', textAlign: 'left' },
    menuSubLabel: { fontSize: 12, fontFamily: 'Tajawal-Regular', color: '#94a3b8', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 60 },
    version: { textAlign: 'center', color: '#cbd5e1', marginTop: 30, fontFamily: 'Inter' }
});
