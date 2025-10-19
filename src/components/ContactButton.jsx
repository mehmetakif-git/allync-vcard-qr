import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { detectDevice } from '../lib/supabase';
import { downloadVCard } from '../utils/vcard';

export default function ContactButton() {
  const handleSaveContact = () => {
    const device = detectDevice();

    if (device === 'iOS') {
      window.location.href = 'tel:+97451079565';
    } else {
      downloadVCard();
    }
  };

  return (
    <motion.button
      onClick={handleSaveContact}
      className="relative w-full py-6 px-10 rounded-2xl font-bold text-xl text-white overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
      whileHover={{ y: -3, boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-3">
        <Download size={26} />
        <span>Save to Contacts</span>
      </div>
    </motion.button>
  );
}
