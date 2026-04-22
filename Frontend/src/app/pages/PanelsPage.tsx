import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchInput } from '../components/SearchInput';
import { FilterDropdown } from '../components/FilterDropdown';
import { PriorityBadge } from '../components/PriorityBadge';
import { Priority } from '../data/mockData';
import { AlertCircle, Zap, Coins, MapPin, CheckCircle, Thermometer, Users, Droplets, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface Panel {
  id: string;
  row: number;
  col: number;
  status: 'healthy' | 'medium' | 'critical' | 'unknown';
  area: string;
  defectType?: string;
  coverage?: number;
  maxTemp?: number;
  deltaT?: number;
  financialLoss?: number;
  crewType?: 'cleaning' | 'repair' | 'none';
  energyLossPerDay?: number;
  costLossPerDay?: number;
  efficiencyLoss?: number;
  maintenanceDecision?: string;
  peopleRequired?: number;
  priority?: 'low' | 'medium' | 'high';
  rgbImage?: string;
  thermalImage?: string;
}

interface Farm {
  name: string;
  grid: Panel[];
  rows: number;
  cols: number;
}

export function PanelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [allPanels, setAllPanels] = useState<Panel[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  // Calculate severity based on panel status and efficiency loss
  const calculateSeverity = (panel: Panel): number => {
    if (panel.efficiencyLoss) return panel.efficiencyLoss;
    if (panel.status === 'critical') return Math.floor(Math.random() * 30) + 70; // 70-100%
    if (panel.status === 'medium') return Math.floor(Math.random() * 40) + 30; // 30-70%
    return Math.floor(Math.random() * 20) + 10; // 10-30%
  };

  // Get recommended action based on actual YOLO defect type
  const getRecommendedAction = (panel: Panel): string => {
    if (!panel.defectType) return 'Monitor performance';
    if (panel.defectType.includes('Bird Droppings')) return 'Schedule cleaning crew — remove bird droppings to restore efficiency';
    if (panel.defectType.includes('Dust')) return 'Schedule cleaning crew — wash panel surface to remove dust buildup';
    if (panel.defectType.includes('Physical Damage')) return 'Replace panel or repair structural damage immediately';
    if (panel.defectType.includes('Electrical Damage')) return 'Inspect junction box and electrical connections immediately';
    if (panel.defectType.includes('Thermal Anomaly')) return 'Inspect for hidden electrical faults and hot spots';
    if (panel.defectType.includes('Unspecified Defect')) return 'Schedule repair crew for detailed inspection';
    if (panel.defectType.includes('Non Defective')) return 'No action required — panel is operating normally';
    return panel.maintenanceDecision || 'Monitor performance';
  };

  // Get next maintenance date based on priority
  const getNextMaintenanceDate = (panel: Panel): string => {
    const today = new Date();
    const daysToAdd = panel.priority === 'high' ? 2 : panel.priority === 'medium' ? 7 : 14;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Load panels from farms and auto-save to history
  useEffect(() => {
    const savedFarms = localStorage.getItem('solarops_farms');

    if (savedFarms) {
      try {
        const farms: Farm[] = JSON.parse(savedFarms);
        const panels: Panel[] = [];
        const areaNames: string[] = [];

        farms.forEach(farm => {
          areaNames.push(farm.name);
          // Only include panels with issues (not healthy)
          const defectivePanels = farm.grid.filter(panel => panel.status !== 'healthy' && panel.status !== 'unknown');
          panels.push(...defectivePanels);
        });

        setAllPanels(panels);
        setAreas(areaNames);

        // Auto-save defective panels to history (only essential fields)
        if (panels.length > 0) {
          const history = JSON.parse(localStorage.getItem('solarops_history') || '[]');

          panels.forEach(panel => {
            // Check if this panel is already in history (avoid duplicates)
            const alreadyExists = history.some((h: any) =>
              h.panelId === panel.id && h.area === panel.area
            );

            if (!alreadyExists) {
              const historyEntry = {
                panelId: panel.id,
                area: panel.area,
                row: panel.row,
                col: panel.col,
                severity: calculateSeverity(panel),
                recommendedAction: getRecommendedAction(panel),
                nextMaintenance: getNextMaintenanceDate(panel),
                defectType: panel.defectType,
                priority: panel.priority,
                rgbImage: panel.rgbImage || null,
                thermalImage: panel.thermalImage || null,
                status: panel.status,
                coverage: panel.coverage,
                maxTemp: panel.maxTemp,
                deltaT: panel.deltaT,
                crewType: panel.crewType,
                energyLossPerDay: panel.energyLossPerDay,
                costLossPerDay: panel.costLossPerDay,
                efficiencyLoss: panel.efficiencyLoss,
                maintenanceDecision: panel.maintenanceDecision,
                peopleRequired: panel.peopleRequired
              };

              history.push(historyEntry);
            }
          });

          localStorage.setItem('solarops_history', JSON.stringify(history));
        }
      } catch (error) {
        console.error('Failed to load panels:', error);
      }
    }
  }, []);

  const filteredPanels = allPanels.filter(panel => {
    const matchesSearch =
      (panel.area?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (panel.defectType?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (panel.id?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'All' ||
      (priorityFilter === 'High' && panel.priority === 'high') ||
      (priorityFilter === 'Medium' && panel.priority === 'medium') ||
      (priorityFilter === 'Low' && panel.priority === 'low');

    const matchesArea = areaFilter === 'All' || panel.area === areaFilter;

    return matchesSearch && matchesPriority && matchesArea;
  }).sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return (priorityOrder[a.priority || 'low'] || 2) - (priorityOrder[b.priority || 'low'] || 2);
  });

  const highPriorityCount = allPanels.filter(p => p.priority === 'high').length;
  const mediumPriorityCount = allPanels.filter(p => p.priority === 'medium').length;
  const lowPriorityCount = allPanels.filter(p => p.priority === 'low').length;


  return (
    <div className="min-h-screen bg-[var(--solar-bg)]">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.h1
          className="text-3xl font-semibold text-[var(--solar-navy)] mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Panels & Defects
        </motion.h1>
        <motion.p
          className="text-[var(--solar-text-muted)] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Detailed view of all detected panel defects with inspection history
        </motion.p>

        {/* Priority Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] rounded-xl p-8 text-white shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -8, boxShadow: "0 25px 50px -12px rgba(153, 27, 27, 0.4)" }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-10"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              }}
            />
            <motion.div
              className="text-6xl font-bold mb-3 relative z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 200 }}
            >
              {highPriorityCount}
            </motion.div>
            <div className="text-[#fca5a5]/80 font-semibold text-lg">High Priority</div>
            <div className="text-sm text-[#dc2626]/70 mt-2">Immediate attention required</div>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-[#b45309] to-[#92400e] rounded-xl p-8 text-white shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -8, boxShadow: "0 25px 50px -12px rgba(180, 83, 9, 0.4)" }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-10"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: 1
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              }}
            />
            <motion.div
              className="text-6xl font-bold mb-3 relative z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {mediumPriorityCount}
            </motion.div>
            <div className="text-[#fde68a]/80 font-semibold text-lg">Medium Priority</div>
            <div className="text-sm text-[#f59e0b]/70 mt-2">Schedule within this week</div>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-[#047857] to-[#065f46] rounded-xl p-8 text-white shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -8, boxShadow: "0 25px 50px -12px rgba(4, 120, 87, 0.4)" }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-10"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: 2
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              }}
            />
            <motion.div
              className="text-6xl font-bold mb-3 relative z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 200 }}
            >
              {lowPriorityCount}
            </motion.div>
            <div className="text-[#86efac]/80 font-semibold text-lg">Low Priority</div>
            <div className="text-sm text-[#6ee7b7]/70 mt-2">Monitor and maintain</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          className="flex gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.01 }}
          >
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Area Name, Panel ID, or Defect Type..."
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FilterDropdown
              label="Area"
              value={areaFilter}
              onChange={setAreaFilter}
              options={['All', ...areas]}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FilterDropdown
              label="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={['All', 'High', 'Medium', 'Low']}
            />
          </motion.div>
        </motion.div>

        {/* Panel Cards */}
        <div className="space-y-6">
          {filteredPanels.map((panel, index) => (
            <motion.div
              key={panel.id}
              className="bg-gradient-to-b from-white to-[#f8fafc] rounded-2xl border-2 border-[var(--solar-border)] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                scale: 1.01,
                y: -6,
                transition: { duration: 0.3 }
              }}
            >
              {/* Header Section */}
              <div className="bg-white border-b-2 border-[var(--solar-border)] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--solar-navy)] mb-2">
                      {panel.area}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--solar-text-muted)]">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">
                        Row {panel.row}, Col {panel.col} • ID: #{panel.id}
                      </span>
                    </div>
                  </div>

                  {/* Status & Priority Badges */}
                  <div className="flex gap-2 items-center">
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
                        panel.status === 'critical'
                          ? 'bg-[#991b1b] text-white'
                          : panel.status === 'medium'
                          ? 'bg-[#b45309] text-white'
                          : 'bg-[#047857] text-white'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.08 + 0.2, type: "spring" }}
                    >
                      {panel.status === 'critical' || panel.status === 'medium' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      {panel.status === 'critical' ? 'CRITICAL' : panel.status === 'medium' ? 'WARNING' : 'HEALTHY'}
                    </motion.div>
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
                        panel.priority === 'high'
                          ? 'bg-[#991b1b] text-white'
                          : panel.priority === 'medium'
                          ? 'bg-[#b45309] text-white'
                          : 'bg-[#047857] text-white'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.08 + 0.25, type: "spring" }}
                    >
                      {panel.priority === 'high' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : panel.priority === 'medium' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      {panel.priority === 'high' ? 'HIGH' : panel.priority === 'medium' ? 'MEDIUM' : 'LOW'}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column - Images */}
                  <div className="col-span-3 space-y-3">
                    <h4 className="font-bold text-[var(--solar-navy)] mb-3 flex items-center gap-2 text-sm">
                      <span className="w-1 h-4 bg-[#3b82f6] rounded-full"></span>
                      Captured Images
                    </h4>
                    <motion.div
                      className="border-2 border-[var(--solar-border)] rounded-xl p-2 bg-gradient-to-br from-[#eff6ff] to-white shadow-sm"
                      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }}
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {panel.rgbImage ? (
                          <img
                            src={panel.rgbImage}
                            alt="RGB"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xs text-[var(--solar-navy)] font-semibold">RGB Image</span>
                        )}
                      </div>
                    </motion.div>
                    <motion.div
                      className="border-2 border-[var(--solar-border)] rounded-xl p-2 bg-gradient-to-br from-[#fef2f2] to-white shadow-sm"
                      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(220, 38, 38, 0.2)" }}
                    >
                      <div className="aspect-video bg-gradient-to-br from-red-200 to-orange-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {panel.thermalImage ? (
                          <img
                            src={panel.thermalImage}
                            alt="Thermal"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xs text-[var(--solar-navy)] font-semibold">Thermal Image</span>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Middle Column - Analysis Details */}
                  <div className="col-span-6 space-y-3">
                    <h4 className="font-bold text-[var(--solar-navy)] flex items-center gap-2 text-sm mb-3">
                      <span className="w-1 h-4 bg-[#3b82f6] rounded-full"></span>
                      AI Analysis Output
                    </h4>

                    {/* Defect Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="bg-gradient-to-br from-[#fef2f2] to-white border-2 border-[#fecaca] rounded-xl p-3 shadow-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-1">Defect Type</p>
                        <p className="font-bold text-[var(--solar-navy)] text-sm">
                          {panel.defectType || 'Unknown'}
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#eff6ff] to-white border-2 border-[#bfdbfe] rounded-xl p-3 shadow-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-1">Coverage</p>
                        <p className="font-bold text-[var(--solar-navy)] text-sm">
                          {panel.coverage || 0}%
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#fef2f2] to-white border-2 border-[#fed7aa] rounded-xl p-3 shadow-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Thermometer className="w-3 h-3 text-[var(--solar-text-muted)]" />
                          <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide">Max Temperature</p>
                        </div>
                        <p className="font-bold text-[var(--solar-navy)] text-sm">
                          {panel.maxTemp || 0}°C
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#fefce8] to-white border-2 border-[#fde047] rounded-xl p-3 shadow-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-1">Delta T</p>
                        <p className="font-bold text-[var(--solar-navy)] text-sm">
                          {panel.deltaT || 0}°C
                        </p>
                      </motion.div>
                    </div>

                    {/* Crew & People Section */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className={`border-2 rounded-xl p-3 shadow-sm ${
                          panel.crewType === 'repair'
                            ? 'bg-gradient-to-br from-[#fef2f2] to-white border-[#fecaca]'
                            : panel.crewType === 'cleaning'
                            ? 'bg-gradient-to-br from-[#fefce8] to-white border-[#fde047]'
                            : 'bg-gradient-to-br from-[#f0fdf4] to-white border-[#86efac]'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-1">Crew Type</p>
                        <p className="font-bold text-[var(--solar-navy)] text-sm capitalize">
                          {panel.crewType === 'repair' ? '🔧 Repair Crew' : panel.crewType === 'cleaning' ? '🧹 Cleaning Crew' : '✓ No Action'}
                        </p>
                      </motion.div>

                      {panel.crewType !== 'none' && (
                        <motion.div
                          className="bg-gradient-to-br from-[#eff6ff] to-white border-2 border-[#bfdbfe] rounded-xl p-3 shadow-sm"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Users className="w-3 h-3 text-[var(--solar-text-muted)]" />
                            <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide">People Required</p>
                          </div>
                          <p className="font-bold text-[var(--solar-navy)] text-sm">
                            {panel.peopleRequired || 0} {panel.peopleRequired === 1 ? 'Person' : 'People'}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* AI Maintenance Decision */}
                    <motion.div
                      className="bg-gradient-to-r from-[#eff6ff] via-[#f0f9ff] to-[#ecfeff] border-2 border-[#bfdbfe] rounded-xl p-4 shadow-sm"
                      whileHover={{ scale: 1.01 }}
                    >
                      <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">AI Maintenance Decision</p>
                      <p className="text-[var(--solar-navy)] text-sm leading-relaxed">
                        {panel.maintenanceDecision || 'No action required. Panel operating at optimal efficiency.'}
                      </p>
                    </motion.div>
                  </div>

                  {/* Right Column - Performance Metrics */}
                  <div className="col-span-3 space-y-3">
                    <h4 className="font-bold text-[var(--solar-navy)] flex items-center gap-2 text-sm mb-3">
                      <span className="w-1 h-4 bg-[#3b82f6] rounded-full"></span>
                      Impact Metrics
                    </h4>

                    <motion.div
                      className="bg-gradient-to-br from-[#cbd5e1] to-[#e2e8f0] border-2 border-[#94a3b8] rounded-xl p-4 shadow-sm"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-[#475569]" />
                        <p className="text-xs font-semibold text-[#334155] uppercase tracking-wide">Energy Loss</p>
                      </div>
                      <p className="text-2xl font-bold text-[#1e293b]">
                        {(panel.energyLossPerDay || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-[#64748b] font-medium">kWh/day</p>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-[#bfdbfe] to-[#dbeafe] border-2 border-[#93c5fd] rounded-xl p-4 shadow-sm"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-5 h-5 text-[#1e40af]" />
                        <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wide">Cost Loss</p>
                      </div>
                      <p className="text-2xl font-bold text-[#172554]">
                        {(panel.costLossPerDay || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-[#3b82f6] font-medium">SAR/day</p>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-[#99f6e4] to-[#ccfbf1] border-2 border-[#5eead4] rounded-xl p-4 shadow-sm"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-5 h-5 text-[#0f766e]" />
                        <p className="text-xs font-semibold text-[#115e59] uppercase tracking-wide">Efficiency Loss</p>
                      </div>
                      <p className="text-2xl font-bold text-[#134e4a]">
                        {(panel.efficiencyLoss || 0).toFixed(1)}%
                      </p>
                      <p className="text-sm text-[#14b8a6] font-medium">of capacity</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPanels.length === 0 && (
          <motion.div
            className="text-center py-20 text-[var(--solar-text-muted)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#93c5fd]" />
            </motion.div>
            <p className="text-lg">No panels found matching your filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
