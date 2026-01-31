import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Amiri-Regular': 'https://github.com/google/fonts/raw/main/ofl/amiri/Amiri-Regular.ttf',
    'Amiri-Bold': 'https://github.com/google/fonts/raw/main/ofl/amiri/Amiri-Bold.ttf',
    'AmiriQuran': 'https://github.com/google/fonts/raw/main/ofl/amiriquran/AmiriQuran-Regular.ttf',
    'Tajawal-Regular': 'https://github.com/google/fonts/raw/main/ofl/tajawal/Tajawal-Regular.ttf',
    'Tajawal-Bold': 'https://github.com/google/fonts/raw/main/ofl/tajawal/Tajawal-Bold.ttf',
    'ReemKufi': 'https://github.com/google/fonts/raw/main/ofl/reemkufi/ReemKufi-Regular.ttf',
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </LanguageProvider>
  );
}
