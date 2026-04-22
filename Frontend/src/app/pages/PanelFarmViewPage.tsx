import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, MapPin, Info, Plus, Minus, Save, Trash2, Edit2, X } from 'lucide-react';

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

export function PanelFarmViewPage() {
  const [areaName, setAreaName] = useState('Area 1');
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(12);
  const [allAreas, setAllAreas] = useState<{ name: string; grid: Panel[]; rows: number; cols: number }[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingAreaIndex, setEditingAreaIndex] = useState<number | null>(null);
  const [editedAreaName, setEditedAreaName] = useState('');

  // Load saved farms from localStorage on mount
  useEffect(() => {
    const savedFarms = localStorage.getItem('solarops_farms');
    if (savedFarms) {
      try {
        const parsedFarms = JSON.parse(savedFarms);
        setAllAreas(parsedFarms);
      } catch (error) {
        console.error('Failed to load saved farms:', error);
      }
    }
  }, []);

  // Save farms to localStorage
  const saveFarms = () => {
    try {
      localStorage.setItem('solarops_farms', JSON.stringify(allAreas));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save farms:', error);
    }
  };

  // Delete a specific area
  const deleteArea = (index: number) => {
    const updatedAreas = allAreas.filter((_, i) => i !== index);
    setAllAreas(updatedAreas);

    // Update current area index if needed
    if (currentAreaIndex >= updatedAreas.length && updatedAreas.length > 0) {
      setCurrentAreaIndex(updatedAreas.length - 1);
    } else if (updatedAreas.length === 0) {
      setCurrentAreaIndex(0);
      setSelectedPanel(null);
    }

    // Auto-save after deletion
    localStorage.setItem('solarops_farms', JSON.stringify(updatedAreas));
  };

  // Clear all farms
  const clearAllFarms = () => {
    if (window.confirm('Are you sure you want to delete all farms? This action cannot be undone.')) {
      setAllAreas([]);
      setCurrentAreaIndex(0);
      setSelectedPanel(null);
      localStorage.removeItem('solarops_farms');
    }
  };

  // Start editing area name
  const startEditingArea = (index: number) => {
    setEditingAreaIndex(index);
    setEditedAreaName(allAreas[index].name);
  };

  // Save edited area name
  const saveEditedAreaName = () => {
    if (editingAreaIndex !== null && editedAreaName.trim()) {
      const updatedAreas = [...allAreas];
      const oldName = updatedAreas[editingAreaIndex].name;
      updatedAreas[editingAreaIndex] = {
        ...updatedAreas[editingAreaIndex],
        name: editedAreaName.trim()
      };

      // Update panel area names
      updatedAreas[editingAreaIndex].grid = updatedAreas[editingAreaIndex].grid.map(panel => ({
        ...panel,
        area: editedAreaName.trim()
      }));

      setAllAreas(updatedAreas);
      setEditingAreaIndex(null);

      // Auto-save after editing
      localStorage.setItem('solarops_farms', JSON.stringify(updatedAreas));
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingAreaIndex(null);
    setEditedAreaName('');
  };

  const generateGrid = () => {
    const newGrid: Panel[] = [];
    let panelId = 4000 + (allAreas.reduce((sum, area) => sum + area.grid.length, 0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const panel: Panel = {
          id: `P-${panelId++}`,
          row: r + 1,
          col: c + 1,
          status: 'unknown',
          area: areaName,
        };
        newGrid.push(panel);
      }
    }

    const newAreas = [...allAreas, { name: areaName, grid: newGrid, rows, cols }];
    setAllAreas(newAreas);
    setCurrentAreaIndex(newAreas.length - 1);
    setSelectedPanel(null);
  };

  const getPanelColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-[#991b1b] hover:bg-[#7f1d1d]';
      case 'medium':
        return 'bg-[#b45309] hover:bg-[#92400e]';
      case 'healthy':
        return 'bg-[#047857] hover:bg-[#065f46]';
      case 'unknown':
        return 'bg-gray-300 hover:bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--solar-bg)]">
      <style>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: #eff6ff;
          border-radius: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
        /* Hide default number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-[var(--solar-navy)] mb-2">Panel Farm View</h1>
        <p className="text-[var(--solar-text-muted)] mb-8">
          Interactive grid visualization of your solar panel farm with real-time health monitoring
        </p>

        {/* Top Bar */}
        <motion.div
          className="bg-white rounded-lg border border-[var(--solar-border)] shadow-sm p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <label className="block font-medium text-[var(--solar-navy)]">
                  Area Name
                </label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-[#3b82f6] cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-72 bg-[#1e3a8a] text-white text-xs rounded-lg p-3 shadow-lg z-10">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Create Multiple Areas</p>
                        <p>You can generate multiple areas with different configurations. Change the area name to what you desire, adjust rows and columns, then click "Generate Farm" again to add more areas!</p>
                      </div>
                    </div>
                    <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1e3a8a]"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                placeholder="e.g., Area 1"
              />
            </div>

            <div className="w-32">
              <label className="block font-medium text-[var(--solar-navy)] mb-2">
                Rows
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRows(Math.max(1, rows - 1))}
                  className="w-8 h-10 bg-[#3b82f6] text-white rounded-md hover:bg-[#1e40af] transition-colors flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="flex-1 px-3 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent text-center font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setRows(Math.min(20, rows + 1))}
                  className="w-8 h-10 bg-[#3b82f6] text-white rounded-md hover:bg-[#1e40af] transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-32">
              <label className="block font-medium text-[var(--solar-navy)] mb-2">
                Columns
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCols(Math.max(1, cols - 1))}
                  className="w-8 h-10 bg-[#3b82f6] text-white rounded-md hover:bg-[#1e40af] transition-colors flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="flex-1 px-3 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent text-center font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setCols(Math.min(20, cols + 1))}
                  className="w-8 h-10 bg-[#3b82f6] text-white rounded-md hover:bg-[#1e40af] transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateGrid}
                className="px-6 py-2 bg-[#1e40af] text-white rounded-md font-medium hover:bg-[#1d4ed8] transition-colors"
              >
                Generate Farm
              </button>

              {allAreas.length > 0 && (
                <>
                  <motion.button
                    onClick={saveFarms}
                    className="px-6 py-2 bg-[#16a34a] text-white rounded-md font-medium hover:bg-[#15803d] transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4" />
                    Save Farms
                  </motion.button>

                  <motion.button
                    onClick={clearAllFarms}
                    className="px-6 py-2 bg-[#dc2626] text-white rounded-md font-medium hover:bg-[#b91c1c] transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Save Success Message */}
          {saveSuccess && (
            <motion.div
              className="mt-4 bg-[#f0fdf4] border-2 border-[#6ee7b7] text-[#16a34a] px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Farms saved successfully! Your data is safe.</span>
            </motion.div>
          )}

          {allAreas.length > 0 && (
            <div className="mt-4 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#16a34a] rounded"></div>
                <span className="text-[var(--solar-text-muted)]">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#b45309] rounded"></div>
                <span className="text-[var(--solar-text-muted)]">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#991b1b] rounded"></div>
                <span className="text-[var(--solar-text-muted)]">Critical</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Area Tabs */}
        {allAreas.length > 0 && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex gap-2 flex-wrap">
              {allAreas.map((area, idx) => (
                <div
                  key={idx}
                  className={`relative group rounded-lg ${
                    currentAreaIndex === idx
                      ? 'bg-[#1e40af] text-white shadow-md'
                      : 'bg-white text-[var(--solar-navy)] border border-[var(--solar-border)]'
                  }`}
                >
                  {editingAreaIndex === idx ? (
                    <div className="flex items-center gap-2 p-3">
                      <input
                        type="text"
                        value={editedAreaName}
                        onChange={(e) => setEditedAreaName(e.target.value)}
                        className="px-3 py-1 border-2 border-[#3b82f6] rounded text-[var(--solar-navy)] font-medium focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditedAreaName();
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <button
                        onClick={saveEditedAreaName}
                        className="p-1 bg-[#16a34a] text-white rounded hover:bg-[#15803d] transition-colors"
                        title="Save"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 bg-[#dc2626] text-white rounded hover:bg-[#b91c1c] transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCurrentAreaIndex(idx);
                          setSelectedPanel(null);
                        }}
                        className="px-6 py-3 font-medium transition-all"
                      >
                        {area.name}
                      </button>

                      {/* Edit and Delete buttons - show on hover */}
                      <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingArea(idx);
                          }}
                          className="p-1 bg-[#3b82f6] text-white rounded hover:bg-[#1e40af] transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit area name"
                        >
                          <Edit2 className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${area.name}"? This cannot be undone.`)) {
                              deleteArea(idx);
                            }
                          }}
                          className="p-1 bg-[#dc2626] text-white rounded hover:bg-[#b91c1c] transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete area"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main View - Grid and Sidebar */}
        <div className="flex gap-6">
          {/* Left Side - Current Area Grid */}
          <motion.div
            className="flex-1 bg-white rounded-lg border border-[var(--solar-border)] shadow-sm p-8 overflow-y-auto sidebar-scrollbar"
            style={{ maxHeight: 'calc(100vh - 360px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {allAreas.length === 0 ? (
              <div className="text-center py-20 text-[var(--solar-text-muted)]">
                Click "Generate Farm" to visualize your solar panel farm
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-[var(--solar-navy)] mb-6">
                  {allAreas[currentAreaIndex].name}
                </h3>
                <div
                  className="grid gap-2 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${allAreas[currentAreaIndex].cols}, minmax(0, 1fr))`,
                    maxWidth: `${allAreas[currentAreaIndex].cols * 50}px`,
                  }}
                >
                  {allAreas[currentAreaIndex].grid.map((panel, idx) => (
                    <motion.div
                      key={idx}
                      className={`aspect-square rounded cursor-pointer transition-all ${getPanelColor(panel.status)} ${
                        selectedPanel?.id === panel.id ? 'ring-4 ring-[var(--solar-navy)]' : ''
                      }`}
                      onClick={() => setSelectedPanel(panel)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.01 }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Sidebar - Inspection Details (Always Visible) */}
          <motion.div
            className="w-full max-w-md bg-gradient-to-b from-white to-[#f8fafc] rounded-lg border-2 border-[var(--solar-border)] shadow-xl overflow-hidden sidebar-scrollbar"
            style={{ maxHeight: 'calc(100vh - 360px)' }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!selectedPanel ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <motion.div
                  className="w-20 h-20 bg-[#eff6ff] rounded-full flex items-center justify-center mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <AlertTriangle className="w-10 h-10 text-[#3b82f6]" />
                </motion.div>
                <p className="text-[var(--solar-text-muted)] text-lg">
                  Click on any panel to view detailed inspection information
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto sidebar-scrollbar" style={{ maxHeight: 'calc(100vh - 360px)' }}>
                {/* Header */}
                <div className="bg-white border-b-2 border-[var(--solar-border)] p-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">Panel Information</p>
                    <h3 className="text-2xl font-bold text-[var(--solar-navy)] mb-3">
                      {selectedPanel.area}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--solar-text-muted)] mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">
                        Row {selectedPanel.row}, Col {selectedPanel.col} • ID: #{selectedPanel.id}
                      </span>
                    </div>

                    {/* Severity Badge */}
                    <motion.div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
                        selectedPanel.status === 'critical'
                          ? 'bg-[#991b1b] text-white'
                          : selectedPanel.status === 'medium'
                          ? 'bg-[#b45309] text-white'
                          : selectedPanel.status === 'healthy'
                          ? 'bg-[#047857] text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      {selectedPanel.status === 'critical' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : selectedPanel.status === 'medium' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : selectedPanel.status === 'healthy' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                      {selectedPanel.status === 'critical' ? 'CRITICAL' : selectedPanel.status === 'medium' ? 'WARNING' : selectedPanel.status === 'healthy' ? 'HEALTHY' : 'NOT ANALYZED'}
                    </motion.div>
                  </motion.div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Image Thumbnails */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="font-bold text-[var(--solar-navy)] mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-[#3b82f6] rounded-full"></span>
                      Captured Images
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="border-2 border-[var(--solar-border)] rounded-xl p-3 bg-gradient-to-br from-[#eff6ff] to-white shadow-sm"
                        whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="aspect-video bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {selectedPanel.rgbImage ? (
                            <img
                              src={selectedPanel.rgbImage}
                              alt="RGB"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xs text-[var(--solar-navy)] font-semibold">RGB Image</span>
                          )}
                        </div>
                      </motion.div>
                      <motion.div
                        className="border-2 border-[var(--solar-border)] rounded-xl p-3 bg-gradient-to-br from-[#fef2f2] to-white shadow-sm"
                        whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(220, 38, 38, 0.2)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="aspect-video bg-gradient-to-br from-red-200 to-orange-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {selectedPanel.thermalImage ? (
                            <img
                              src={selectedPanel.thermalImage}
                              alt="Thermal"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xs text-[var(--solar-navy)] font-semibold">Thermal Image</span>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* AI Output Details */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-bold text-[var(--solar-navy)] flex items-center gap-2">
                      <span className="w-1 h-5 bg-[#3b82f6] rounded-full"></span>
                      AI Analysis Output
                    </h4>

                    {/* Priority */}
                    <motion.div
                      className={`border-2 rounded-xl p-4 shadow-sm ${
                        selectedPanel.priority === 'high'
                          ? 'bg-gradient-to-br from-[#fef2f2] to-white border-[#fecaca]'
                          : selectedPanel.priority === 'medium'
                          ? 'bg-gradient-to-br from-[#fefce8] to-white border-[#fde047]'
                          : 'bg-gradient-to-br from-[#f0fdf4] to-white border-[#6ee7b7]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">Priority Level</p>
                      <p className="font-bold text-[var(--solar-navy)] text-lg uppercase">
                        {selectedPanel.priority === 'high' ? '🔴 High Priority' : selectedPanel.priority === 'medium' ? '🟡 Medium Priority' : '🟢 Low Priority'}
                      </p>
                    </motion.div>

                    {/* Crew Type Required */}
                    <motion.div
                      className={`border-2 rounded-xl p-4 shadow-sm ${
                        selectedPanel.crewType === 'repair'
                          ? 'bg-gradient-to-br from-[#fef2f2] to-white border-[#fecaca]'
                          : selectedPanel.crewType === 'cleaning'
                          ? 'bg-gradient-to-br from-[#fefce8] to-white border-[#fde047]'
                          : 'bg-gradient-to-br from-[#f0fdf4] to-white border-[#6ee7b7]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">Crew Type Required</p>
                      <p className="font-bold text-[var(--solar-navy)] text-lg capitalize">
                        {selectedPanel.crewType === 'repair' ? '🔧 Repair Crew' : selectedPanel.crewType === 'cleaning' ? '🧹 Cleaning Crew' : '✓ No Action Needed'}
                      </p>
                    </motion.div>

                    {/* People Required */}
                    {selectedPanel.crewType !== 'none' && (
                      <motion.div
                        className="bg-gradient-to-br from-[#eff6ff] to-white border-2 border-[#bfdbfe] rounded-xl p-4 shadow-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">People Required</p>
                        <p className="font-bold text-[var(--solar-navy)] text-lg">
                          {selectedPanel.peopleRequired} {selectedPanel.peopleRequired === 1 ? 'person' : 'people'}
                        </p>
                      </motion.div>
                    )}

                    {/* Defect Type */}
                    <motion.div
                      className="bg-gradient-to-br from-[#eff6ff] to-white border-2 border-[#bfdbfe] rounded-xl p-4 shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">Defect Type</p>
                      <p className="font-bold text-[var(--solar-navy)]">{selectedPanel.defectType}</p>
                    </motion.div>

                    {/* Coverage & Temperature Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="bg-gradient-to-br from-[#eff6ff] to-white border-2 border-[#bfdbfe] rounded-xl p-4 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">Coverage</p>
                        <p className="font-bold text-[var(--solar-navy)] text-xl">{selectedPanel.coverage}%</p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-[#eff6ff] to-white border-2 border-[#bfdbfe] rounded-xl p-4 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">Max Temp</p>
                        <p className="font-bold text-[var(--solar-navy)] text-xl">{selectedPanel.maxTemp}°C</p>
                      </motion.div>
                    </div>

                    {/* Efficiency Loss Bar with Animation */}
                    <motion.div
                      className="bg-gradient-to-br from-white to-[#f8fafc] border-2 border-[#cbd5e1] rounded-xl p-5 shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-xs font-bold text-[var(--solar-text-muted)] uppercase tracking-wide mb-3">Efficiency Loss</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                          <motion.div
                            className={`h-full rounded-full shadow-lg ${
                              selectedPanel.efficiencyLoss! > 40
                                ? 'bg-gradient-to-r from-[#991b1b] to-[#b91c1c]'
                                : selectedPanel.efficiencyLoss! > 15
                                ? 'bg-gradient-to-r from-[#b45309] to-[#d97706]'
                                : 'bg-gradient-to-r from-[#047857] to-[#059669]'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedPanel.efficiencyLoss}%` }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                          />
                        </div>
                        <motion.span
                          className="font-black text-[var(--solar-navy)] text-2xl min-w-[60px] text-right"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        >
                          {selectedPanel.efficiencyLoss}%
                        </motion.span>
                      </div>
                    </motion.div>

                    {/* Energy & Cost Loss Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="bg-gradient-to-br from-[#eff6ff] to-white border-2 border-[#bfdbfe] rounded-xl p-4 shadow-sm"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-xs font-semibold text-[var(--solar-text-muted)] uppercase tracking-wide mb-2">Energy Loss</p>
                        <p className="font-bold text-[var(--solar-navy)] text-lg">
                          {selectedPanel.energyLossPerDay?.toFixed(1)}
                        </p>
                        <p className="text-xs text-[var(--solar-text-muted)] mt-1">kWh/day</p>
                      </motion.div>

                      <motion.div
                        className={`border-2 rounded-xl p-4 shadow-sm ${
                          selectedPanel.status === 'healthy'
                            ? 'bg-gradient-to-br from-[#f0fdf4] to-white border-[#6ee7b7]'
                            : 'bg-gradient-to-br from-[#fef2f2] to-white border-[#fecaca]'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                          selectedPanel.status === 'healthy' ? 'text-[#15803d]' : 'text-[#b91c1c]'
                        }`}>Cost Loss</p>
                        <p className={`font-bold text-lg ${
                          selectedPanel.status === 'healthy' ? 'text-[#047857]' : 'text-[#991b1b]'
                        }`}>
                          {selectedPanel.costLossPerDay?.toFixed(2)}
                        </p>
                        <p className="text-xs text-[var(--solar-text-muted)] mt-1">SAR/day</p>
                      </motion.div>
                    </div>

                    {/* Financial Loss Monthly */}
                    <motion.div
                      className={`border-2 rounded-xl p-5 shadow-md ${
                        selectedPanel.status === 'healthy'
                          ? 'bg-gradient-to-br from-[#f0fdf4] to-white border-[#6ee7b7]'
                          : 'bg-gradient-to-br from-[#fef2f2] to-white border-[#fecaca]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${
                        selectedPanel.status === 'healthy' ? 'text-[#065f46]' : 'text-[#7f1d1d]'
                      }`}>Monthly Financial Loss</p>
                      <p className={`font-black text-3xl ${
                        selectedPanel.status === 'healthy' ? 'text-[#047857]' : 'text-[#991b1b]'
                      }`}>
                        {selectedPanel.financialLoss}
                      </p>
                      <p className="text-sm text-[var(--solar-text-muted)] mt-1">SAR/month</p>
                    </motion.div>

                    {/* AI Maintenance & Scheduling Decision */}
                    <motion.div
                      className={`border-2 rounded-xl p-5 shadow-lg ${
                        selectedPanel.status === 'critical'
                          ? 'bg-gradient-to-br from-[#fef2f2] to-white border-[#fecaca]'
                          : selectedPanel.status === 'medium'
                          ? 'bg-gradient-to-br from-[#fefce8] to-white border-[#fde047]'
                          : 'bg-gradient-to-br from-[#f0fdf4] to-white border-[#6ee7b7]'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${
                        selectedPanel.status === 'critical'
                          ? 'text-[#b91c1c]'
                          : selectedPanel.status === 'medium'
                          ? 'text-[#a16207]'
                          : 'text-[#15803d]'
                      }`}>⚡ AI Maintenance Decision</p>
                      <p className="text-sm text-[var(--solar-navy)] font-semibold leading-relaxed">{selectedPanel.maintenanceDecision}</p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
