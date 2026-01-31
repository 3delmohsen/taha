export type Language = 'ar' | 'en';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  audio?: string;
  tafsir?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export const Reciter = {
  ALAFASY: 'ar.alafasy',
  SUDAIS: 'ar.abdurrahmaansudais',
  HUSARY: 'ar.husary',
} as const;

export type Reciter = typeof Reciter[keyof typeof Reciter];

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahInSurah: number;
  timestamp: number;
}

export const AppView = {
  HOME: 'home',
  QURAN: 'quran',
  FATWA: 'fatwa',
  MORE: 'more',
  HAJJ: 'hajj',
  AZKAR: 'azkar',
  SETTINGS: 'settings',
  SUPPORT: 'support',
} as const;

export type AppView = typeof AppView[keyof typeof AppView];

export interface HajjStep {
  id: number;
  title: string;
  day: string;
  description: string;
  duas: string[];
}

export interface ZikrItem {
  id: number;
  category: 'morning' | 'evening' | 'prayer';
  text: string;
  count: number;
  target: number;
}
