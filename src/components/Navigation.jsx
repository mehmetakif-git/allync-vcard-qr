import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, QrCode, Home } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/admin', icon: QrCode, label: 'Generator' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' }
  ];

  return (
    <motion.nav
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="rounded-2xl p-1"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex gap-2 p-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link key={link.path} to={link.path}>
                <motion.div
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                  style={isActive ? { boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' } : {}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                  <span className="font-semibold text-sm">{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
