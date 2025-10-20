export const generateVCardData = (language = 'en') => {
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

  return `BEGIN:VCARD
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
NOTE:Allync-Ai - ${t.title}
END:VCARD`;
};

export const downloadVCard = (language = 'en') => {
  const vCardData = generateVCardData(language);
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