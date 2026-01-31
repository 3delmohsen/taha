import { Tabs } from 'expo-router';
import { Home, BookOpen, MessageCircle, Menu } from 'lucide-react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { View, Platform } from 'react-native';

export default function TabLayout() {
  const { t, isRTL } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f1f5f9',
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          direction: isRTL ? 'rtl' : 'ltr', // Helps with icon alignment
        },
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontFamily: 'Tajawal-Bold', fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: t('quran'),
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="fatwa"
        options={{
          title: t('fatwa'),
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('more'),
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
