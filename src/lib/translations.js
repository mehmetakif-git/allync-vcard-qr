export const translations = {
  en: {
    title: 'Allync-Ai',
    slogan: 'Beyond human automation',
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
    slogan: 'İnsanın ötesinde otomasyon',
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

// IP'ye göre dil tespiti
export async function detectLanguageByIP() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Türkiye'den geliyorsa TR, değilse EN
    if (data.country_code === 'TR') {
      return 'tr';
    }
    return 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Varsayılan İngilizce
  }
}