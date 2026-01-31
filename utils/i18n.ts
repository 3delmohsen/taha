
// Simple internal I18n class to replace i18n-js and avoid dependency issues
class I18n {
  translations: Record<string, any>;
  locale: string = 'ar';
  defaultLocale: string = 'ar';
  enableFallback: boolean = true;

  constructor(translations: Record<string, any>) {
    this.translations = translations;
  }

  t(key: string, options?: Record<string, any>) {
    let text = this.translations[this.locale]?.[key];
    
    if (!text && this.enableFallback && this.locale !== this.defaultLocale) {
      text = this.translations[this.defaultLocale]?.[key];
    }
    
    if (!text) return key; // Return key if translation missing
    
    // Basic interpolation support if needed (matches i18n-js %{variable} syntax)
    if (options) {
      Object.keys(options).forEach(k => {
        text = text.replace(new RegExp(`%{${k}}`, 'g'), String(options[k]));
      });
    }
    
    return text;
  }
}

// Inline translations
const ar = {
  "home": "الرئيسية",
  "quran": "المصحف",
  "fatwa": "المستشار",
  "more": "المزيد",
  "fajr": "الفجر",
  "sunrise": "الشروق",
  "dhuhr": "الظهر",
  "asr": "العصر",
  "maghrib": "المغرب",
  "isha": "العشاء",
  "nextPrayer": "الصلاة القادمة",
  "timeLeft": "الوقت المتبقي",
  "qibla": "القبلة",
  "location": "جارٍ تحديد الموقع...",
  "greeting": "السلام عليكم",
  "searchSurah": "ابحث باسم السورة...",
  "meccan": "مكية",
  "medinan": "مدنية",
  "ayahs": "آيات",
  "juz": "الجزء",
  "listen": "استماع",
  "stop": "إيقاف",
  "continueReading": "تابع القراءة",
  "fatwaTitle": "المستشار الذكي",
  "welcomeMsg": "مرحباً، أنا طه. كيف يمكنني مساعدتك في أمور دينك اليوم؟",
  "placeholder": "اكتب سؤالك هنا...",
  "settings": "الإعدادات",
  "azkar": "الأذكار",
  "dua": "أدعية",
  "hajj": "الحج والعمرة",
  "azkarDesc": "حصن المسلم اليومي",
  "qiblaDesc": "اتجاه الكعبة المشرفة",
  "language": "اللغة",
  "notifications": "التنبيهات",
  "contactUs": "تواصل معنا",
  "share": "مشاركة التطبيق",
  "rate": "قيم التطبيق",
  "loading": "جارٍ التحميل...",
  "error": "حدث خطأ",
  "networkError": "تأكد من اتصالك بالإنترنت",
  "play": "تشغيل",
  "pause": "إيقاف مؤقت",
  "reciter": "القارئ",
  "ayah": "آية",
  "completed": "اكتمل",
  "times": "مرات",
  "calcMethod": "طريقة الحساب",
  "adhanAlerts": "تنبيهات الأذان",
  "ummAlQura": "أم القرى",
  "egypt": "الهيئة المصرية العامة للمساحة",
  "mwl": "رابطة العالم الإسلامي",
  "karachi": "جامعة العلوم الإسلامية، كراتشي",
  "faq": "الأسئلة الشائعة",
  "faq1_q": "كيف يتم حساب مواقيت الصلاة؟",
  "faq1_a": "يتم الحساب بناءً على الموقع الجغرافي وطريقة الحساب المختارة في الإعدادات.",
  "faq2_q": "هل التطبيق يعمل بدون إنترنت؟",
  "faq2_a": "نعم، معظم الميزات مثل القرآن والأذكار تعمل بدون إنترنت.",
  "msgSent": "تم إرسال رسالتك بنجاح",
  "name": "الاسم",
  "message": "الرسالة",
  "sendMessage": "إرسال الرسالة",
  "hajjHighlight": "رحلة الحج",
  "hajjHighlightDesc": "دليل تفاعلي خطوة بخطوة لمناسك الحج والعمرة",
  "startJourney": "ابدأ الرحلة",
  "todayPrayers": "صلاوات اليوم",
  "morning": "الصباح",
  "evening": "المساء",
  "prayer": "الصلاة",
  "duaDesc": "جوامع الدعاء",
  "quranicDua": "أدعية قرآنية",
  "propheticDua": "أدعية نبوية",
  "hajjDua": "أدعية الحج",
  "copy": "نسخ",
  "copied": "تم النسخ"
};

const en = {
  "home": "Home",
  "quran": "Quran",
  "fatwa": "Ask AI",
  "more": "More",
  "fajr": "Fajr",
  "sunrise": "Sunrise",
  "dhuhr": "Dhuhr",
  "asr": "Asr",
  "maghrib": "Maghrib",
  "isha": "Isha",
  "nextPrayer": "Next Prayer",
  "timeLeft": "Time Left",
  "qibla": "Qibla",
  "location": "Locating...",
  "greeting": "As-salamu alaykum",
  "searchSurah": "Search Surah...",
  "meccan": "Meccan",
  "medinan": "Medinan",
  "ayahs": "Ayahs",
  "juz": "Juz",
  "listen": "Listen",
  "stop": "Stop",
  "continueReading": "Continue",
  "fatwaTitle": "AI Consultant",
  "welcomeMsg": "Hello, I am Taha. How can I assist you today?",
  "placeholder": "Type your question...",
  "settings": "Settings",
  "azkar": "Azkar",
  "dua": "Duas",
  "hajj": "Hajj Guide",
  "azkarDesc": "Daily Fortress",
  "qiblaDesc": "Kaaba Direction",
  "language": "Language",
  "notifications": "Notifications",
  "contactUs": "Contact Us",
  "share": "Share App",
  "rate": "Rate App",
  "loading": "Loading...",
  "error": "Error occurred",
  "networkError": "Check your internet connection",
  "play": "Play",
  "pause": "Pause",
  "reciter": "Reciter",
  "ayah": "Ayah",
  "completed": "Completed",
  "times": "Times",
  "calcMethod": "Calculation Method",
  "adhanAlerts": "Adhan Alerts",
  "ummAlQura": "Umm Al-Qura",
  "egypt": "Egyptian General Authority",
  "mwl": "Muslim World League",
  "karachi": "Univ. of Islamic Sciences, Karachi",
  "faq": "FAQ",
  "faq1_q": "How are prayer times calculated?",
  "faq1_a": "Calculation is based on your geographic location and the selected method in settings.",
  "faq2_q": "Does it work offline?",
  "faq2_a": "Yes, most features like Quran and Azkar work offline.",
  "msgSent": "Message sent successfully",
  "name": "Name",
  "message": "Message",
  "sendMessage": "Send Message",
  "hajjHighlight": "Hajj Journey",
  "hajjHighlightDesc": "Interactive step-by-step guide for Hajj & Umrah",
  "startJourney": "Start Journey",
  "todayPrayers": "Today's Prayers",
  "morning": "Morning",
  "evening": "Evening",
  "prayer": "Prayer",
  "duaDesc": "Supplications",
  "quranicDua": "Quranic Duas",
  "propheticDua": "Prophetic Duas",
  "hajjDua": "Hajj Duas",
  "copy": "Copy",
  "copied": "Copied"
};

const i18n = new I18n({
  ar,
  en,
});

// Set default locale
i18n.defaultLocale = 'ar';
i18n.locale = 'ar';
i18n.enableFallback = true;

export const setAppLanguage = (lang: 'ar' | 'en') => {
  i18n.locale = lang;
};

export default i18n;
