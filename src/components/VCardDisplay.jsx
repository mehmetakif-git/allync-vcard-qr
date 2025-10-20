import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Globe, MapPin, Instagram, Sparkles } from 'lucide-react';
import ContactButton from './ContactButton';
import ShinyText from './ShinyText';
import { trackScan } from '../lib/supabase';

export default function VCardDisplay() {
  useEffect(() => {
    trackScan();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  return (
    <div
      className="min-h-screen py-16 px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
          #2b2c2c
        `
      }}
    >
      <motion.div
        className="max-w-2xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="relative w-40 h-40 mx-auto mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-white" />
            <motion.div
              className="absolute inset-1 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(43, 44, 44, 0.9)',
                backdropFilter: 'blur(20px)'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/profile.png"
                alt="Allync-Ai Profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Eğer fotoğraf yoksa fallback
                  e.target.outerHTML = '<div class="text-white text-5xl font-bold flex items-center justify-center w-full h-full">A</div>';
                }}
              />
            </motion.div>
          </motion.div>

          {/* Ana başlık */}
          <div className="mb-6">
            <ShinyText text="Allync-Ai" className="text-5xl font-bold" speed={4} />
          </div>

          {/* Slogan - Sparkles ile birlikte */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={20} className="text-white" />
            <ShinyText text="beyond human automation" className="text-2xl italic" speed={6} />
          </div>

          <motion.div
            className="flex items-center justify-center gap-2 text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <MapPin size={18} className="text-white/60" />
            <span className="text-sm">Doha, Qatar (HQ)</span>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 mb-10">
          <motion.div
            className="rounded-2xl p-5 group cursor-pointer"
            style={cardStyle}
            whileHover={{
              y: -3,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)'
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Qatar (Main)</div>
                <a href="tel:+97451079565" className="text-lg font-semibold hover:text-white/80 transition-colors">
                  🇶🇦 +974 5107 9565
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl p-5 group cursor-pointer"
            style={cardStyle}
            whileHover={{
              y: -3,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)'
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Turkey</div>
                <a href="tel:+905334940416" className="text-lg font-semibold hover:text-white/80 transition-colors">
                  🇹🇷 +90 533 494 04 16
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl p-5 group cursor-pointer"
            style={cardStyle}
            whileHover={{
              y: -3,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)'
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <Globe size={20} />
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.allyncai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold hover:text-white/80 transition-colors"
                >
                  www.allyncai.com
                </a>
                <a
                  href="https://www.allync.com.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold hover:text-white/80 transition-colors"
                >
                  www.allync.com.tr
                </a>
              </div>
            </div>
          </motion.div>

          <motion.a
            href="https://www.instagram.com/allyncai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-semibold text-white overflow-hidden group"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            whileHover={{
              y: -3,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <Instagram size={24} />
            <span>Follow on Instagram</span>
          </motion.a>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ContactButton />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center text-white/30 mt-8 text-sm"
        >
          © 2025 Allync-Ai. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}