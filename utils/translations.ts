import { Language } from '../types';

type Translations = Record<string, Record<Language, string>>;

export const translations: Translations = {
  home: { ar: 'الرئيسية', en: 'Home' },
  quran: { ar: 'المصحف', en: 'Quran' },
  fatwa: { ar: 'المستشار', en: 'Ask AI' },
  more: { ar: 'المزيد', en: 'More' },
  fajr: { ar: 'الفجر', en: 'Fajr' },
  sunrise: { ar: 'الشروق', en: 'Sunrise' },
  dhuhr: { ar: 'الظهر', en: 'Dhuhr' },
  asr: { ar: 'العصر', en: 'Asr' },
  maghrib: { ar: 'المغرب', en: 'Maghrib' },
  isha: { ar: 'العشاء', en: 'Isha' },
  nextPrayer: { ar: 'الصلاة القادمة', en: 'Next Prayer' },
  qibla: { ar: 'القبلة', en: 'Qibla' },
  location: { ar: 'تحديد الموقع...', en: 'Locating...' },
  greeting: { ar: 'السلام عليكم', en: 'As-salamu alaykum' },
  searchSurah: { ar: 'ابحث باسم السورة...', en: 'Search Surah...' },
  meccan: { ar: 'مكية', en: 'Meccan' },
  medinan: { ar: 'مدنية', en: 'Medinan' },
  ayahs: { ar: 'آيات', en: 'Ayahs' },
  listen: { ar: 'استماع', en: 'Listen' },
  continueReading: { ar: 'تابع القراءة', en: 'Continue' },
  fatwaTitle: { ar: 'المستشار الذكي', en: 'AI Consultant' },
  welcomeMsg: { ar: 'مرحباً، أنا طه، مساعدك الإسلامي. كيف يمكنني مساعدتك؟', en: 'Hello, I am Taha. How can I help you?' },
  placeholder: { ar: 'اكتب سؤالك هنا...', en: 'Type your question...' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  azkar: { ar: 'الأذكار', en: 'Azkar' },
  hajj: { ar: 'مناسك الحج', en: 'Hajj Guide' },
};
