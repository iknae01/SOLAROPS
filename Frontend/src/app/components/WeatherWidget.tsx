import { useState, useEffect } from 'react';
import { Sun, Wind, Droplets, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function WeatherWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock weather data for Saudi Arabia (Riyadh)
  const weatherData = {
    location: 'Riyadh, Saudi Arabia',
    temperature: 28,
    condition: 'Sunny',
    humidity: 25,
    windSpeed: 12,
    icon: Sun
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const WeatherIcon = weatherData.icon;

  return (
    <motion.div
      className="bg-gradient-to-br from-[#eff6ff] to-white rounded-xl border border-[var(--solar-border)] p-6 shadow-lg overflow-hidden relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
    >
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="flex items-start justify-between relative z-10">
        {/* Left Side - Date & Time */}
        <div className="flex-1">
          <motion.div
            className="flex items-center gap-2 text-[var(--solar-text-muted)] mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <Clock className="w-5 h-5 text-[var(--solar-navy)]" />
            </motion.div>
            <span className="text-2xl font-semibold text-[var(--solar-navy)]">{formatTime(currentTime)}</span>
          </motion.div>
          <p className="text-xs text-[var(--solar-text-muted)]">Arabia Standard Time (AST)</p>
        </div>

        {/* Right Side - Weather */}
        <div className="flex items-center gap-6 border-l border-[var(--solar-border)] pl-6">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-full flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <WeatherIcon className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.div
                className="text-3xl font-semibold text-[var(--solar-navy)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {weatherData.temperature}°C
              </motion.div>
              <div className="text-sm text-[var(--solar-text-muted)]">{weatherData.condition}</div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-[#3b82f6]" />
              <span className="text-[var(--solar-text)]">{weatherData.humidity}% Humidity</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-[#64748b]" />
              <span className="text-[var(--solar-text)]">{weatherData.windSpeed} km/h Wind</span>
            </div>
            <div className="text-xs text-[var(--solar-text-muted)] mt-1">{weatherData.location}</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
