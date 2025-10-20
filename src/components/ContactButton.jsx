import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadVCard } from '../utils/vcard';
import { translations } from '../lib/translations';

export default function ContactButton({ language = 'en' }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = translations[language];
  
  const handleSaveContact = async () => {
    try {
      setIsDownloading(true);
      // vCard'ı fotoğraf ile birlikte indir
      await downloadVCard(language);
    } catch (error) {
      console.error('Error downloading vCard:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      onClick={handleSaveContact}
      disabled={isDownloading}
      className="relative w-full py-6 px-10 rounded-2xl font-bold text-xl text-white overflow-hidden disabled:opacity-50"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
      whileHover={!isDownloading ? { y: -3, boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)' } : {}}
      whileTap={!isDownloading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-3">
        {isDownloading ? (
          <>
            <Loader2 size={26} className="animate-spin" />
            <span>{language === 'en' ? 'Preparing...' : 'Hazırlanıyor...'}</span>
          </>
        ) : (
          <>
            <Download size={26} />
            <span>{t.saveContact}</span>
          </>
        )}
      </div>
    </motion.button>
  );
}