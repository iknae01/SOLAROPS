import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sun, Mail, MapPin, ArrowRight, Target, Eye } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1770068511771-7c146210a55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/60 via-[#0c4a6e]/55 to-[#164e63]/60"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#172554]/40 to-transparent"
          animate={{
            opacity: [0.4, 0.5, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className="p-6"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-[#fde68a] to-[#d97706] rounded-full flex items-center justify-center shadow-xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">SolarOps</h1>
                <p className="text-xs text-[#bfdbfe]">AI-Powered Solar Inspection</p>
              </div>
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                onClick={() => navigate('/signup')}
                className="px-6 py-3 bg-white text-[#1e40af] rounded-xl font-bold hover:bg-[#e0e7ff] transition-all shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
              </motion.button>
              <motion.button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-white text-[#1e40af] rounded-xl font-bold hover:bg-[#e0e7ff] transition-all flex items-center gap-2 shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Main Content */}
              <div>
                <motion.h2
                  className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Smart Solar Panel
                  <motion.span
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-[#14b8a6] via-[#5eead4] to-[#d97706] font-extrabold"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    Inspection Platform
                  </motion.span>
                </motion.h2>

                <motion.p
                  className="text-2xl font-bold text-[#dbeafe] mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Harness the power of AI to detect defects, analyze performance, and optimize your solar energy systems with data-driven insights.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-[#d97706] text-white rounded-xl font-bold shadow-2xl hover:shadow-[#d97706]/40 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 25px 50px -12px rgba(217, 119, 6, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                  >
                    Get Started
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </div>

              {/* Right Side - Feature Cards */}
              <div className="space-y-4">
                {/* Vision Card */}
                <motion.div
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-2xl"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)', y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Eye className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-extrabold text-white mb-3">Our Vision</h3>
                      <p className="text-lg font-bold text-[#e0f2fe] leading-relaxed">
                        To revolutionize solar energy maintenance by making it smarter, faster, and data-driven through the power of artificial intelligence.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Mission Card */}
                <motion.div
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-2xl"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)', y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-[#0891b2] to-[#0e7490] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Target className="w-7 h-7 text-white rotate-45" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-extrabold text-white mb-3">Our Mission</h3>
                      <p className="text-lg font-bold text-[#e0f2fe] leading-relaxed">
                        To provide an intelligent platform that detects solar panel defects, analyzes performance impact, and helps users make better maintenance decisions with clear and actionable insights.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <motion.footer
          className="py-8 px-6 bg-gradient-to-t from-[#0c4a6e]/40 to-transparent backdrop-blur-sm border-t border-white/20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Contact Us</h3>
                <p className="text-base font-bold text-[#dbeafe]">
                  Have questions or need support? We're happy to help you improve your solar system performance.
                </p>
              </div>

              <motion.div
                className="flex items-center gap-3 p-4 bg-white/15 backdrop-blur-md rounded-xl border border-white/25"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)', y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-lg flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Mail className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-xs text-[#bfdbfe]">Email</p>
                  <p className="text-white font-semibold">solarops@gmail.com</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 p-4 bg-white/15 backdrop-blur-md rounded-xl border border-white/25"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)', y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-lg flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-xs text-[#bfdbfe]">Location</p>
                  <p className="text-white font-semibold">Riyadh, Saudi Arabia</p>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <p className="text-[#bfdbfe] text-sm">
                © 2026 SolarOps. Empowering solar energy through intelligent maintenance.
              </p>
            </div>
          </div>
        </motion.footer>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#0891b2' : '#14b8a6',
            }}
            animate={{
              y: [0, -100 - Math.random() * 50, 0],
              x: [0, (Math.random() - 0.5) * 50, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}
