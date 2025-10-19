import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { BarChart3, TrendingUp, Smartphone, Clock, Globe, Sparkles, ArrowUp } from 'lucide-react';
import { getAnalytics, supabase } from '../lib/supabase';
import ShinyText from './ShinyText';

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function Analytics() {
  const [stats, setStats] = useState({
    totalScans: 0,
    todayScans: 0,
    recentScans: [],
    deviceStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();

    // Real-time subscription
    const channel = supabase
      .channel('scans-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scans' }, () => {
        console.log('New scan detected!');
        loadAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await getAnalytics();
    
    console.log('Analytics loaded:', data); // Debug
    
    if (data) {
      setStats({
        totalScans: data.totalScans || 0,
        todayScans: data.todayScans || 0,
        recentScans: Array.isArray(data.recentScans) ? data.recentScans : [],
        deviceStats: Array.isArray(data.deviceStats) ? data.deviceStats : []
      });
    }
    setLoading(false);
  };

  const getWeekScans = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return (stats.recentScans || []).filter(scan => 
      new Date(scan.scanned_at) >= weekAgo
    ).length;
  };

  const getMonthScans = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return (stats.recentScans || []).filter(scan => 
      new Date(scan.scanned_at) >= monthAgo
    ).length;
  };

  const getDeviceBreakdown = () => {
    const breakdown = { iOS: 0, Android: 0, Desktop: 0 };
    
    if (Array.isArray(stats.deviceStats)) {
      stats.deviceStats.forEach(scan => {
        if (scan.device_type && breakdown.hasOwnProperty(scan.device_type)) {
          breakdown[scan.device_type] = (breakdown[scan.device_type] || 0) + 1;
        }
      });
    }
    
    return breakdown;
  };

  const getLast30Days = () => {
    const days = [];
    const scansArray = stats.recentScans || [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = scansArray.filter(scan => {
        const scanDate = new Date(scan.scanned_at);
        return scanDate >= date && scanDate < nextDay;
      }).length;

      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }
    return days;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const deviceBreakdown = getDeviceBreakdown();
  const last30DaysData = getLast30Days();
  const maxScans = Math.max(...last30DaysData.map(d => d.count), 1);

  const deviceIcons = {
    iOS: '📱',
    Android: '🤖',
    Desktop: '💻'
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
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={32} className="text-white/60" />
            <ShinyText text="Analytics Dashboard" className="text-5xl font-bold" speed={4} />
            <Sparkles size={32} className="text-white/60" />
          </div>
          <p className="text-white/60 text-lg">Track QR code scans and user engagement</p>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl">Loading analytics...</div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid lg:grid-cols-4 gap-6">
              {[
                { icon: TrendingUp, label: 'Total Scans', value: stats.totalScans },
                { icon: Clock, label: 'Today', value: stats.todayScans, showArrow: true },
                { icon: BarChart3, label: 'This Week', value: getWeekScans() },
                { icon: Globe, label: 'This Month', value: getMonthScans() }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="rounded-3xl p-6"
                  style={cardStyle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -3, boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                      <stat.icon size={20} className="text-white" />
                    </div>
                    <p className="text-white/60 text-sm">{stat.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-4xl font-bold text-white">
                      <AnimatedNumber value={stat.value} />
                    </h3>
                    {stat.showArrow && stat.value > 0 && <ArrowUp size={20} className="text-green-400" />}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 30 Days Chart */}
            <motion.div
              className="rounded-3xl p-8"
              style={cardStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                  <BarChart3 size={24} className="text-white" />
                </div>
                Last 30 Days
              </h3>
              <div className="flex items-end justify-between gap-2 h-64">
                {last30DaysData.map((day, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.02, duration: 0.3 }}
                  >
                    <motion.div
                      className="w-full rounded-t-lg relative overflow-hidden group cursor-pointer border border-white/20"
                      style={{
                        height: `${(day.count / maxScans) * 100}%`,
                        minHeight: day.count > 0 ? '4px' : '0',
                        background: 'rgba(255, 255, 255, 0.15)'
                      }}
                      whileHover={{ scale: 1.1, zIndex: 10, boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.5 + index * 0.02, duration: 0.5 }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2b2c2c] px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                        {day.count} scans
                      </div>
                    </motion.div>
                    {index % 3 === 0 && (
                      <span className="text-[10px] text-white/40 text-center whitespace-nowrap">
                        {day.date}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Device Breakdown & Recent Scans */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <motion.div
                className="rounded-3xl p-8"
                style={cardStyle}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                    <Smartphone size={24} className="text-white" />
                  </div>
                  Device Breakdown
                </h3>
                <div className="space-y-6">
                  {Object.entries(deviceBreakdown).map(([device, count], index) => {
                    const percentage = stats.totalScans > 0 ? ((count / stats.totalScans) * 100) : 0;
                    return (
                      <motion.div
                        key={device}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{deviceIcons[device]}</span>
                            <span className="text-white/80 font-medium">{device}</span>
                          </div>
                          <span className="text-white font-bold">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recent Scans */}
              <motion.div
                className="rounded-3xl p-8"
                style={cardStyle}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                    <Clock size={24} className="text-white" />
                  </div>
                  Recent Scans
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {(stats.recentScans || []).slice(0, 20).map((scan, index) => (
                    <motion.div
                      key={scan.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                            <Smartphone size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{scan.device_type}</div>
                            <div className="text-white/50 text-xs">{formatDate(scan.scanned_at)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Globe size={14} />
                          <span className="text-sm">{scan.country || 'Unknown'}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {(!stats.recentScans || stats.recentScans.length === 0) && (
                    <div className="text-center text-white/50 py-8">
                      No scans recorded yet. Share your QR code to start tracking!
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}