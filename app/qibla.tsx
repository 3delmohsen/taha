import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Compass as CompassIcon, MapPin } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

export default function QiblaScreen() {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const [qibla, setQibla] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Qibla Calculation
            const kaabaLat = 21.4225;
            const kaabaLng = 39.8262;
            const y = Math.sin(kaabaLng - longitude) * Math.cos(kaabaLat);
            const x = Math.cos(latitude) * Math.sin(kaabaLat) -
                      Math.sin(latitude) * Math.cos(kaabaLat) * Math.cos(kaabaLng - longitude);
            let qiblaDir = Math.atan2(y, x);
            qiblaDir = (qiblaDir * 180 / Math.PI + 360) % 360;
            
            setQibla(qiblaDir);
            setLoading(false);
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
             <View style={[styles.header, { flexDirection: isRTL ? 'row' : 'row-reverse' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" style={{ transform: [{ rotate: isRTL ? '0deg' : '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('qibla')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.compassContainer}>
                    <View style={[styles.compassRing, { transform: [{ rotate: `${-qibla}deg` }] }]}>
                         <View style={styles.northMark} />
                         <View style={styles.eastMark} />
                         <View style={styles.southMark} />
                         <View style={styles.westMark} />
                         
                         {/* Kaaba Icon Indicator */}
                         <View style={[styles.kaabaPointer, { transform: [{ rotate: `${qibla}deg` }] }]}>
                             <MapPin size={40} color="#059669" fill="#059669" />
                         </View>
                    </View>
                    <View style={styles.centerDot} />
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.degreeText}>{Math.round(qibla)}°</Text>
                    <Text style={styles.subText}>from North</Text>
                    <Text style={styles.hint}>
                        ضع هاتفك على سطح مستوٍ للحصول على أفضل دقة
                    </Text>
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
    content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    
    compassContainer: { width: width * 0.8, height: width * 0.8, alignItems: 'center', justifyContent: 'center', marginBottom: 50 },
    compassRing: { width: '100%', height: '100%', borderRadius: width, borderWidth: 2, borderColor: '#e2e8f0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
    centerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1e293b', position: 'absolute' },
    
    northMark: { position: 'absolute', top: 10, width: 4, height: 20, backgroundColor: '#ef4444' },
    southMark: { position: 'absolute', bottom: 10, width: 4, height: 20, backgroundColor: '#cbd5e1' },
    eastMark: { position: 'absolute', right: 10, width: 20, height: 4, backgroundColor: '#cbd5e1' },
    westMark: { position: 'absolute', left: 10, width: 20, height: 4, backgroundColor: '#cbd5e1' },
    
    kaabaPointer: { position: 'absolute', top: -30, alignItems: 'center' },
    
    infoBox: { alignItems: 'center' },
    degreeText: { fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold', color: '#1e293b' },
    subText: { fontSize: 14, color: '#94a3b8', marginBottom: 10 },
    hint: { fontSize: 12, fontFamily: 'Tajawal-Regular', color: '#64748b', textAlign: 'center', maxWidth: 200 }
});
