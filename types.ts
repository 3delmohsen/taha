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
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  surah?: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      revelationType: string;
      numberOfAyahs: number;
  }; 
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

export interface PageDetail {
    number: number;
    ayahs: Ayah[];
    surahs: { [key: number]: Surah };
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
  HUSARY_MUJAWWAD: 'ar.husarymujawwad',
  MINSHAWI: 'ar.minshawi',
  MINSHAWI_MUJAWWAD: 'ar.minshawimujawwad',
  MAHER: 'ar.mahermuaiqly',
  SHURAIM: 'ar.saoodshuraym',
  AJAMY: 'ar.ahmedajamy',
  ABDU_BASIT: 'ar.abdulbasitmurattal',
  ABDUL_BASIT_MUJAWWAD: 'ar.abdulbasitmujawwad',
  HUDHAIFY: 'ar.hudhaify',
  SHATRI: 'ar.shaatree',
  TABLAWI: 'ar.mohammadaltablawi',
  AAYALLASHI: 'ar.abdulazizazzahrani',
  AFASY_ENG: 'en.mishary', // Note: Some APIs differ, keeping standard ones
  GĦAMDI: 'ar.saadalkhamdi',
  JABR: 'ar.abdullahbasfar',
  SALAH_BUKHATIR: 'ar.salahbukhatir',
  SUDAS: 'ar.aymanswoaid',
} as const;

export type Reciter = typeof Reciter[keyof typeof Reciter];

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahInSurah: number;
  pageNumber: number;
  timestamp: number;
}

export const AppView = {
  HOME: 'home',
  QURAN: 'quran',
  FATWA: 'fatwa',
  MORE: 'more',
  HAJJ: 'hajj',
  AZKAR: 'azkar',
  DUA: 'dua',
  SETTINGS: 'settings',
  SUPPORT: 'support',
  QIBLA: 'qibla',
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