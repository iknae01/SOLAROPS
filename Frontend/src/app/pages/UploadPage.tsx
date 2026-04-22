import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, MapPin, CheckCircle2 } from 'lucide-react';

interface Panel {
  id: string;
  row: number;
  col: number;
  status: 'healthy' | 'medium' | 'critical' | 'unknown';
  area: string;
}

interface Farm {
  name: string;
  grid: Panel[];
  rows: number;
  cols: number;
}

export function UploadPage() {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [panelId, setPanelId] = useState('');
  const [rgbFile, setRgbFile] = useState<File | null>(null);
  const [thermalFile, setThermalFile] = useState<File | null>(null);
  const [rgbDragActive, setRgbDragActive] = useState(false);
  const [thermalDragActive, setThermalDragActive] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load farms from localStorage
  useEffect(() => {
    const savedFarms = localStorage.getItem('solarops_farms');
    if (savedFarms) {
      try {
        const parsedFarms = JSON.parse(savedFarms);
        setFarms(parsedFarms);
      } catch (error) {
        console.error('Failed to load farms:', error);
      }
    }
  }, []);

  // Get the selected farm's dimensions
  const selectedFarm = farms.find(farm => farm.name === selectedArea);
  const rows = selectedFarm ? Array.from({ length: selectedFarm.rows }, (_, i) => (i + 1).toString()) : [];
  const columns = selectedFarm ? Array.from({ length: selectedFarm.cols }, (_, i) => (i + 1).toString()) : [];

  // Handle area change - reset row and column
  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
    setSelectedRow('');
    setSelectedColumn('');
  };

  const handlePanelIdChange = (value: string) => {
    // Format as #P-XXXX
    let formatted = value.replace(/[^0-9]/g, '');
    if (formatted) {
      formatted = `#P-${formatted}`;
    }
    setPanelId(formatted);
  };

  const handleRgbDrag = (e: React.DragEvent, entering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setRgbDragActive(entering);
  };

  const handleThermalDrag = (e: React.DragEvent, entering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setThermalDragActive(entering);
  };

  const handleRgbDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRgbDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setRgbFile(e.dataTransfer.files[0]);
    }
  };

  const handleThermalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThermalDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setThermalFile(e.dataTransfer.files[0]);
    }
  };

  const handleRgbFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRgbFile(e.target.files[0]);
    }
  };

  const handleThermalFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThermalFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!selectedArea || !selectedRow || !selectedColumn || !panelId || !rgbFile || !thermalFile) {
      alert('Please fill in all fields and upload both images');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Run real AI Analysis via backend
      const analysisResult = await runRealAIAnalysis();

      // Convert images to base64 for display
      const rgbBase64 = await fileToBase64(rgbFile);
      const thermalBase64 = await fileToBase64(thermalFile);

      // Update the panel in farms
      const farms = JSON.parse(localStorage.getItem('solarops_farms') || '[]');
      const farmIndex = farms.findIndex((f: Farm) => f.name === selectedArea);

      if (farmIndex !== -1) {
        const panelIndex = farms[farmIndex].grid.findIndex(
          (p: Panel) => p.row === parseInt(selectedRow) && p.col === parseInt(selectedColumn)
        );

        if (panelIndex !== -1) {
          // Update panel with images and analysis results
          farms[farmIndex].grid[panelIndex] = {
            ...farms[farmIndex].grid[panelIndex],
            id: panelId.replace('#', ''),
            rgbImage: rgbBase64,
            thermalImage: thermalBase64,
            status: analysisResult.status,
            defectType: analysisResult.defectType,
            coverage: analysisResult.coverage,
            maxTemp: analysisResult.maxTemp,
            deltaT: analysisResult.deltaT,
            crewType: analysisResult.crewType,
            energyLossPerDay: analysisResult.energyLossPerDay,
            costLossPerDay: analysisResult.costLossPerDay,
            efficiencyLoss: analysisResult.efficiencyLoss,
            peopleRequired: analysisResult.peopleRequired,
            maintenanceDecision: analysisResult.maintenanceDecision,
            priority: analysisResult.priority,
            financialLoss: analysisResult.financialLoss,
          };

          // Save updated farms
          localStorage.setItem('solarops_farms', JSON.stringify(farms));

          // Save inspection to database for persistent history
          try {
            const email = localStorage.getItem('solarops_email') || 'unknown';
            await fetch('http://localhost:5000/inspection', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                area: selectedArea,
                row: parseInt(selectedRow),
                col: parseInt(selectedColumn),
                panel_id: panelId.replace('#', ''),
                defect_class: analysisResult.defectType,
                status: analysisResult.status,
                priority: analysisResult.priority,
                coverage: analysisResult.coverage,
                max_temp: analysisResult.maxTemp,
                delta_t: analysisResult.deltaT,
                efficiency_loss: analysisResult.efficiencyLoss,
                energy_loss_per_day: analysisResult.energyLossPerDay,
                cost_loss_per_day: analysisResult.costLossPerDay,
                crew_type: analysisResult.crewType,
                people_required: analysisResult.peopleRequired,
                maintenance_decision: analysisResult.maintenanceDecision,
                rgb_image: rgbBase64,
                thermal_image: thermalBase64,
              }),
            });
          } catch (e) {
            console.error('Failed to save inspection to DB:', e);
          }

          alert(`✅ AI Analysis Complete!\n\nStatus: ${analysisResult.status.toUpperCase()}\nDefect: ${analysisResult.defectType}\n\nPanel updated in Panel Farm View.`);

          // Reset form
          setSelectedArea('');
          setSelectedRow('');
          setSelectedColumn('');
          setPanelId('');
          setRgbFile(null);
          setThermalFile(null);
        } else {
          alert('Panel not found at the specified row and column.');
        }
      } else {
        alert('Area not found.');
      }
    } catch (error: any) {
      alert('❌ AI Analysis Failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Real AI Analysis - calls backend API
  const runRealAIAnalysis = async () => {
    if (!rgbFile || !thermalFile) {
      throw new Error('Both images are required');
    }

    const formDataNormal = new FormData();
    formDataNormal.append('image', rgbFile);
    formDataNormal.append('uploaded_by', 'unknown');

    const formDataThermal = new FormData();
    formDataThermal.append('image', thermalFile);
    formDataThermal.append('uploaded_by', 'unknown');

    const [normalRes, thermalRes] = await Promise.all([
      fetch('http://localhost:5000/predict/normal', {
        method: 'POST',
        body: formDataNormal,
      }),
      fetch('http://localhost:5000/predict/thermal', {
        method: 'POST',
        body: formDataThermal,
      }),
    ]);

    if (!normalRes.ok) {
      const err = await normalRes.json().catch(() => ({ error: 'Normal analysis failed' }));
      throw new Error(err.error || 'Normal analysis failed');
    }
    if (!thermalRes.ok) {
      const err = await thermalRes.json().catch(() => ({ error: 'Thermal analysis failed' }));
      throw new Error(err.error || 'Thermal analysis failed');
    }

    const normalData = await normalRes.json();
    const thermalData = await thermalRes.json();

    const normalPred = normalData.predictions?.[0];
    const defectClass = normalPred?.defect_class || 'No Defect Detected';
    const thermalResult = thermalData.result;

    // Map raw YOLO class names to human-readable defect types
    const mapDefectType = (rawClass: string, _thermalSev: string): string => {
      const mapping: Record<string, string> = {
        'Bird-drop': 'Bird Droppings',
        'Dusty': 'Dust Accumulation',
        'Electrical-Damage': 'Electrical Damage',
        'Physical-Damage': 'Physical Damage',
        'Non-Defective': 'Non Defective (Clean Panel)',
        'Defective': 'Unspecified Defect',
        'No Defect Detected': 'No Defects Detected',
      };
      return mapping[rawClass] || rawClass;
    };

    // Determine status from both analyses
    let status: 'healthy' | 'medium' | 'critical' = 'healthy';
    let priority: 'low' | 'medium' | 'high' = 'low';

    const hasPhysicalDefect = defectClass !== 'No Defect Detected';
    const thermalSev = thermalResult?.sev || 'NORMAL';

    if (thermalSev === 'HIGH' || defectClass === 'Electrical-Damage' || defectClass === 'Physical-Damage') {
      status = 'critical';
      priority = 'high';
    } else if (thermalSev === 'MEDIUM' || thermalSev === 'LOW' || hasPhysicalDefect) {
      status = 'medium';
      priority = 'medium';
    }

    // Map fields
    const maxTemp = thermalResult?.hot || 0;
    const deltaT = thermalResult?.delta || 0;
    const efficiencyLoss = thermalResult?.ef_loss || 0;
    const energyLossPerDay = thermalResult?.en_loss || 0;
    const costLossPerDay = thermalResult?.riyal || 0;
    const coverage = normalPred?.coverage || 0;

    const defectType = mapDefectType(defectClass, thermalSev);

    let crewType: 'cleaning' | 'repair' | 'none' = 'none';
    let peopleRequired = 0;
    let maintenanceDecision = 'No action required. Panel operating at optimal efficiency.';

    const hasThermalAnomaly = thermalSev !== 'NORMAL';
    const isCleanPanel = defectClass === 'No Defect Detected' || defectClass === 'Non-Defective';

    if (status === 'critical') {
      crewType = 'repair';
      peopleRequired = 3;
      maintenanceDecision = 'URGENT: Schedule repair crew within 24 hours. Panel poses fire risk and significant energy loss.';
    } else if (status === 'medium') {
      const isCleaning = /bird|dust|droppings|soiling/i.test(defectType);
      if (isCleaning) {
        crewType = 'cleaning';
        peopleRequired = 2;
        maintenanceDecision = 'Schedule cleaning crew within 7 days. Moderate efficiency loss detected.';
      } else if (hasThermalAnomaly && isCleanPanel) {
        crewType = 'repair';
        peopleRequired = 2;
        maintenanceDecision = 'Schedule electrical inspection within 3-5 days. Thermal anomaly detected on otherwise clean panel — possible internal cell defect, bypass diode failure, or wiring issue.';
      } else {
        crewType = 'repair';
        peopleRequired = 2;
        maintenanceDecision = 'Schedule repair crew within 3-5 days. Minor structural issue detected.';
      }
    }

    return {
      status,
      defectType,
      coverage,
      maxTemp,
      deltaT,
      crewType,
      energyLossPerDay,
      costLossPerDay,
      efficiencyLoss,
      peopleRequired,
      maintenanceDecision,
      priority,
      financialLoss: Math.round(costLossPerDay * 30),
    };
  };

  const isFormValid = selectedArea && selectedRow && selectedColumn && panelId && rgbFile && thermalFile;

  return (
    <div className="min-h-screen bg-[var(--solar-bg)] relative overflow-hidden">
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
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
            opacity: [0, 0.6, 0],
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

      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-8 relative z-10">
        <motion.h1
          className="text-3xl font-semibold text-[var(--solar-navy)] mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Upload Inspection Data
        </motion.h1>
        <motion.p
          className="text-[var(--solar-text-muted)] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Locate the panel and upload thermal and RGB images for AI-powered defect analysis
        </motion.p>

        <div className="space-y-6">
          {/* Step 1: Locate Panel */}
          <motion.div
            className="bg-white rounded-lg border-2 border-[var(--solar-border)] shadow-sm p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ boxShadow: "0 10px 30px rgba(37, 99, 235, 0.1)", y: -2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-10 h-10 bg-[#2563eb] text-white rounded-full flex items-center justify-center font-bold text-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: 360 }}
              >
                1
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-xl font-bold text-[var(--solar-navy)]">Locate Panel</h2>
                <p className="text-sm text-[var(--solar-text-muted)]">Select the panel location in your farm</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Select Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="block font-medium text-[var(--solar-navy)] mb-2">
                  <motion.div
                    className="inline-block"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MapPin className="w-4 h-4 inline mr-1 text-[#2563eb]" />
                  </motion.div>
                  Select Area
                </label>
                <motion.select
                  value={selectedArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent font-medium"
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ borderColor: '#3b82f6' }}
                >
                  <option value="">Choose Area</option>
                  {farms.length === 0 ? (
                    <option value="" disabled>No farms available - Create one in Panel Farm View</option>
                  ) : (
                    farms.map((farm) => (
                      <option key={farm.name} value={farm.name}>{farm.name}</option>
                    ))
                  )}
                </motion.select>
              </motion.div>

              {/* Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label className="block font-medium text-[var(--solar-navy)] mb-2">
                  Row
                </label>
                <motion.select
                  value={selectedRow}
                  onChange={(e) => setSelectedRow(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent font-medium disabled:opacity-50"
                  disabled={!selectedArea}
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ borderColor: !selectedArea ? undefined : '#3b82f6' }}
                >
                  <option value="">Row</option>
                  {rows.map((row) => (
                    <option key={row} value={row}>{row}</option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="block font-medium text-[var(--solar-navy)] mb-2">
                  Column
                </label>
                <motion.select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent font-medium disabled:opacity-50"
                  disabled={!selectedArea}
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ borderColor: !selectedArea ? undefined : '#3b82f6' }}
                >
                  <option value="">Column</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Panel ID */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label className="block font-medium text-[var(--solar-navy)] mb-2">
                  Panel ID
                </label>
                <motion.input
                  type="text"
                  value={panelId}
                  onChange={(e) => handlePanelIdChange(e.target.value)}
                  placeholder="#P-4020"
                  className="w-full px-4 py-2.5 border-2 border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent font-medium"
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ borderColor: '#3b82f6' }}
                />
                <p className="text-xs text-[var(--solar-text-muted)] mt-1">Format: #P-XXXX</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Step 2: Upload Files */}
          <motion.div
            className="bg-white rounded-lg border-2 border-[var(--solar-border)] shadow-sm p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 100 }}
            whileHover={{ boxShadow: "0 10px 30px rgba(37, 99, 235, 0.1)", y: -2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-10 h-10 bg-[#2563eb] text-white rounded-full flex items-center justify-center font-bold text-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: 360 }}
              >
                2
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <h2 className="text-xl font-bold text-[var(--solar-navy)]">Upload Files</h2>
                <p className="text-sm text-[var(--solar-text-muted)]">Upload RGB and Thermal images of the panel</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RGB Upload Zone */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <label className="block font-semibold text-[var(--solar-navy)] mb-3">
                  Normal (RGB) Image
                </label>
                <motion.div
                  onDragEnter={(e) => handleRgbDrag(e, true)}
                  onDragLeave={(e) => handleRgbDrag(e, false)}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleRgbDrop}
                  className={`border-3 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    rgbDragActive
                      ? 'border-[#3b82f6] bg-[#dbeafe] scale-105'
                      : rgbFile
                      ? 'border-[#16a34a] bg-[#f0fdf4]'
                      : 'border-[#93c5fd] bg-[#eff6ff] hover:border-[#3b82f6]'
                  }`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  animate={rgbDragActive ? { scale: 1.05 } : {}}
                >
                  <input
                    type="file"
                    id="rgb-upload"
                    className="hidden"
                    onChange={handleRgbFileInput}
                    accept=".jpg,.jpeg,.png,.tif,.tiff"
                  />
                  <label htmlFor="rgb-upload" className="cursor-pointer">
                    {rgbFile ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto mb-3" />
                        </motion.div>
                        <p className="font-semibold text-[#16a34a] mb-1">{rgbFile.name}</p>
                        <p className="text-sm text-[#15803d]">Click to change</p>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ImageIcon className="w-12 h-12 text-[#3b82f6] mx-auto mb-3" />
                        </motion.div>
                        <p className="font-semibold text-[var(--solar-navy)] mb-1">Drop RGB image here</p>
                        <p className="text-sm text-[var(--solar-text-muted)]">or click to browse</p>
                      </>
                    )}
                  </label>
                </motion.div>
              </motion.div>

              {/* Thermal Upload Zone */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <label className="block font-semibold text-[var(--solar-navy)] mb-3">
                  Thermal (IR) Image
                </label>
                <motion.div
                  onDragEnter={(e) => handleThermalDrag(e, true)}
                  onDragLeave={(e) => handleThermalDrag(e, false)}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleThermalDrop}
                  className={`border-3 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    thermalDragActive
                      ? 'border-[#dc2626] bg-[#fee2e2] scale-105'
                      : thermalFile
                      ? 'border-[#16a34a] bg-[#f0fdf4]'
                      : 'border-[#fca5a5] bg-[#fef2f2] hover:border-[#dc2626]'
                  }`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  animate={thermalDragActive ? { scale: 1.05 } : {}}
                >
                  <input
                    type="file"
                    id="thermal-upload"
                    className="hidden"
                    onChange={handleThermalFileInput}
                    accept=".jpg,.jpeg,.png,.tif,.tiff"
                  />
                  <label htmlFor="thermal-upload" className="cursor-pointer">
                    {thermalFile ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto mb-3" />
                        </motion.div>
                        <p className="font-semibold text-[#16a34a] mb-1">{thermalFile.name}</p>
                        <p className="text-sm text-[#15803d]">Click to change</p>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ImageIcon className="w-12 h-12 text-[#991b1b] mx-auto mb-3" />
                        </motion.div>
                        <p className="font-semibold text-[var(--solar-navy)] mb-1">Drop thermal image here</p>
                        <p className="text-sm text-[var(--solar-text-muted)]">or click to browse</p>
                      </>
                    )}
                  </label>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.6, type: "spring", stiffness: 100 }}
          >
            <motion.button
              onClick={handleSubmit}
              disabled={!isFormValid || isAnalyzing}
              className={`w-full py-5 rounded-xl font-bold text-lg transition-all relative overflow-hidden ${
                isFormValid && !isAnalyzing
                  ? 'bg-[#2563eb] text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={isFormValid && !isAnalyzing ? { scale: 1.02, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)" } : {}}
              whileTap={isFormValid && !isAnalyzing ? { scale: 0.98 } : {}}
              animate={isFormValid && !isAnalyzing ? {
                boxShadow: [
                  "0 10px 20px rgba(37, 99, 235, 0.2)",
                  "0 15px 30px rgba(37, 99, 235, 0.3)",
                  "0 10px 20px rgba(37, 99, 235, 0.2)"
                ]
              } : {}}
              transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            >
              {isFormValid && !isAnalyzing && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAnalyzing ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Run AI Analysis & Update Panel Farm View
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
