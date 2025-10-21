export const translations = {
  en: {
    title: 'Allync-Ai',
    slogan: 'beyond human automation',
    location: 'Doha, Qatar (HQ)',
    phoneMain: 'Qatar (Main)',
    phoneTurkey: 'Turkey',
    websites: 'Websites',
    instagram: 'Follow on Instagram',
    saveContact: 'Save to Contacts',
    copyright: '© 2025 Allync-Ai. All rights reserved.',
    loading: 'Loading...'
  },
  tr: {
    title: 'Allync-Ai',
    slogan: 'insanın ötesinde otomasyon',
    location: 'Doha, Katar (Merkez)',
    phoneMain: 'Katar (Ana)',
    phoneTurkey: 'Türkiye',
    websites: 'Web Siteleri',
    instagram: 'Instagram\'da Takip Et',
    saveContact: 'Kişilere Kaydet',
    copyright: '© 2025 Allync-Ai. Tüm hakları saklıdır.',
    loading: 'Yükleniyor...'
  }
};

// Sadece browser dilini kullan - %100 güvenilir!
export function getInitialLanguage() {
  // 1. LocalStorage'dan oku (kullanıcı daha önce seçtiyse)
  try {
    const saved = localStorage.getItem('allync_language');
    if (saved === 'tr' || saved === 'en') {
      return saved;
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // 2. Browser dilini kontrol et
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  // TR, TR-tr, tr-TR gibi tüm türkçe varyantları yakala
  if (browserLang === 'tr') {
    return 'tr';
  }
  
  // Varsayılan İngilizce
  return 'en';
}

// Dil seçimini kaydet
export function saveLanguagePreference(lang) {
  try {
    localStorage.setItem('allync_language', lang);
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
}