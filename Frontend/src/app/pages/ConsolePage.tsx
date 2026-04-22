import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { WeatherWidget } from '../components/WeatherWidget';
import { Upload, Search, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

export function ConsolePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--solar-bg)]">
      <Navbar />

      {/* Weather & Date/Time Widget */}
      <motion.div
        className="max-w-[1440px] mx-auto px-6 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WeatherWidget />
      </motion.div>

      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-5xl font-semibold text-[var(--solar-navy)] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            From inspection to action. Instantly.
          </motion.h1>
          <motion.p
            className="text-lg text-[var(--solar-text-muted)] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            SolarOps transforms UAV inspection data into actionable intelligence.
            Our AI-powered platform detects defects, estimates energy and financial losses,
            generates priority scores, and creates optimized maintenance plans — all in real-time.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Button onClick={() => navigate('/panels')}>
              View Panels
            </Button>
            <Button variant="secondary" onClick={() => navigate('/upload')}>
              Upload Inspection
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <motion.h2
          className="text-center text-3xl font-semibold text-[var(--solar-navy)] mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-3 gap-8">
          <motion.div
            className="bg-white rounded-lg border border-[var(--solar-border)] p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'linear-gradient(to bottom right, #deebf7, #c6dbef)'
              }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Upload className="w-8 h-8 text-[#08519c]" />
            </motion.div>
            <h3 className="text-xl font-semibold text-[var(--solar-navy)] mb-3">
              1. Upload Inspection
            </h3>
            <p className="text-[var(--solar-text-muted)]">
              Upload thermal and RGB imagery from UAV inspections or load demonstration data to explore the platform.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg border border-[var(--solar-border)] p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'linear-gradient(to bottom right, #9ecae1, #6baed6)'
              }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Search className="w-8 h-8 text-[#08519c]" />
            </motion.div>
            <h3 className="text-xl font-semibold text-[var(--solar-navy)] mb-3">
              2. Analyze Defects & Loss
            </h3>
            <p className="text-[var(--solar-text-muted)]">
              AI algorithms detect defects, calculate thermal anomalies, and estimate daily energy and financial losses.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg border border-[var(--solar-border)] p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'linear-gradient(to bottom right, #4292c6, #2171b5)'
              }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Wrench className="w-8 h-8 text-[#f7fbff]" />
            </motion.div>
            <h3 className="text-xl font-semibold text-[var(--solar-navy)] mb-3">
              3. Act with Prioritized Maintenance
            </h3>
            <p className="text-[var(--solar-text-muted)]">
              Review priority-ranked maintenance recommendations and deploy resources to maximize ROI and uptime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
