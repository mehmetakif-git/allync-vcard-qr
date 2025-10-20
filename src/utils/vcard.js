// Profile fotoğrafını Base64'e çevirme fonksiyonu
const getBase64Image = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // "data:image/png;base64," kısmını kaldır, sadece base64 data
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

export const generateVCardData = async (language = 'en') => {
  const content = {
    en: {
      title: 'beyond human automation',
      location: 'Doha, Qatar'
    },
    tr: {
      title: 'insanın ötesinde otomasyon',
      location: 'Doha, Katar'
    }
  };

  const t = content[language];

  // Profil fotoğrafını base64'e çevir
  const photoBase64 = await getBase64Image('/profile.png');

  // vCard oluştur - hem URL hem Base64 ile
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:Allync-Ai
ORG:Allync-Ai
TITLE:${t.title}
TEL;TYPE=WORK,VOICE:+974 5107 9565
TEL;TYPE=WORK,VOICE:+90 533 494 04 16
URL:https://www.allyncai.com
URL:https://www.allync.com.tr
ADR;TYPE=WORK:;;${t.location};;;
X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/allyncai/
NOTE:Allync-Ai - ${t.title}`;

  // Eğer base64 başarılı olursa fotoğrafı ekle
  if (photoBase64) {
    vcard += `\nPHOTO;ENCODING=b;TYPE=PNG:${photoBase64}`;
  } else {
    // Base64 başarısız olursa URL kullan (fallback)
    vcard += `\nPHOTO;VALUE=uri:https://qr.allyncai.com/profile.png`;
  }

  vcard += `\nEND:VCARD`;

  return vcard;
};

export const downloadVCard = async (language = 'en') => {
  const vCardData = await generateVCardData(language);
  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Allync-Ai.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};