export const generateVCardData = () => {
  return `BEGIN:VCARD
VERSION:3.0
FN:Allync-Ai
ORG:Allync-Ai
TITLE:beyond human automation
TEL;TYPE=WORK,VOICE:+90533 494 04 16
TEL;TYPE=WORK,VOICE:+974 5107 9565
URL:https://www.allyncai.com
URL:https://www.allync.com.tr
ADR;TYPE=WORK:;;Doha;;Qatar
X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/allyncai/
END:VCARD`;
};

export const downloadVCard = () => {
  const vCardData = generateVCardData();
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
