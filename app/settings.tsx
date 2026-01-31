import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

export default function SettingsScreen() {
    const { t, isRTL, language, setLanguage } = useLanguage();
    const router = useRouter();
    const [notifications, setNotifications] = React.useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" style={{ transform: [{ rotate: isRTL ? '0deg' : '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('settings')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                
                {/* Language */}
                <View style={styles.section}>
                    <View style={[styles.row, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Globe size={20} color="#059669" />
                            <Text style={styles.label}>{t('language')}</Text>
                        </View>
                    </View>
                    <View style={styles.langSwitch}>
                        <TouchableOpacity 
                            onPress={() => setLanguage('ar')}
                            style={[styles.langBtn, language === 'ar' && styles.activeLang]}
                        >
                            <Text style={[styles.langText, language === 'ar' && styles.activeLangText]}>العربية</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setLanguage('en')}
                            style={[styles.langBtn, language === 'en' && styles.activeLang]}
                        >
                            <Text style={[styles.langText, language === 'en' && styles.activeLangText]}>English</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notifications */}
                <View style={[styles.section, { flexDirection: isRTL ? 'row' : 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 }]}>
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Bell size={20} color="#059669" />
                        <Text style={styles.label}>{t('notifications')}</Text>
                    </View>
                    <Switch 
                        value={notifications} 
                        onValueChange={setNotifications} 
                        trackColor={{ false: "#e2e8f0", true: "#059669" }}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { padding: 20, alignItems: 'center', justifyContent: 'space-between' },
    backBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    title: { fontSize: 20, fontFamily: 'Tajawal-Bold', color: '#1e293b' },
    content: { padding: 20 },
    section: { backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
    row: { marginBottom: 15, alignItems: 'center' },
    label: { fontSize: 16, fontFamily: 'Tajawal-Bold', color: '#334155' },
    langSwitch: { flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 12 },
    langBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
    activeLang: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    langText: { fontFamily: 'Tajawal-Regular', fontSize: 14, color: '#64748b' },
    activeLangText: { fontFamily: 'Tajawal-Bold', color: '#059669' },
});
