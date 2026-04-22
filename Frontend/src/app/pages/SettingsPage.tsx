import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { motion } from 'motion/react';

export function SettingsPage() {
  // Card 1: Farm & Workforce (Saudi Arabia defaults)
  const [totalPanels, setTotalPanels] = useState('500');
  const [cleaningCrewSize, setCleaningCrewSize] = useState('5');
  const [repairCrewSize, setRepairCrewSize] = useState('3');

  // Card 2: Hardware Specs (Saudi Arabia common values)
  const [panelManufacturer, setPanelManufacturer] = useState('Longi Solar');
  const [modelNumber, setModelNumber] = useState('LR5-72HPH-540M');
  const [dimensions, setDimensions] = useState('2278 x 1134 x 35 mm');
  const [ratedPower, setRatedPower] = useState('540');
  const [avgSunHours, setAvgSunHours] = useState('6.5'); // Saudi Arabia has high solar irradiation

  // Card 3: Financial & Warranty (Saudi Arabia market values)
  const [purchasePrice, setPurchasePrice] = useState('900'); // SAR per panel
  const [electricityTariff, setElectricityTariff] = useState('0.18'); // SAR/kWh for residential/commercial
  const [cleaningCost, setCleaningCost] = useState('8'); // SAR per panel
  const [repairCost, setRepairCost] = useState('200'); // SAR per panel
  const [warrantyStart, setWarrantyStart] = useState('01/01/2024');
  const [warrantyEnd, setWarrantyEnd] = useState('01/01/2049'); // 25-year warranty

  // Card 4: AI Logic Thresholds
  const [criticalHotspotLimit, setCriticalHotspotLimit] = useState('15');

  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleDimensionsChange = (value: string) => {
    // Allow only numbers, spaces, 'x', and 'mm'
    const regex = /^[\d\s x]+(?:mm)?$/;
    if (value === '' || regex.test(value)) {
      setDimensions(value);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!totalPanels || !cleaningCrewSize || !repairCrewSize || !ratedPower || !avgSunHours ||
        !electricityTariff || !purchasePrice || !cleaningCost || !repairCost || !criticalHotspotLimit) {
      setAlert({ type: 'error', message: 'All fields are required' });
      return;
    }

    // Validate dimensions format
    const dimensionsRegex = /^\d+\s*x\s*\d+\s*x\s*\d+\s*mm$/i;
    if (!dimensionsRegex.test(dimensions.trim())) {
      setAlert({ type: 'error', message: 'Dimensions must be in format: "Length x Width x Height mm" (e.g., 2278 x 1134 x 35 mm)' });
      return;
    }

    // Simulate save
    setAlert({ type: 'success', message: 'Settings saved successfully' });

    // Clear alert after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--solar-bg)]">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-[var(--solar-navy)] mb-2">Settings</h1>
        <p className="text-[var(--solar-text-muted)] mb-8">
          Configure system parameters for accurate loss estimation and maintenance planning
        </p>

        <div className="max-w-3xl">
          {alert && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </motion.div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Card 1: Farm & Workforce */}
            <motion.div
              className="bg-white rounded-lg border border-[var(--solar-border)] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <div className="p-6 border-b border-[var(--solar-border)]">
                <h3 className="font-semibold text-[var(--solar-navy)]">Farm & Workforce</h3>
                <p className="text-sm text-[var(--solar-text-muted)] mt-1">
                  Configure farm size and maintenance crew capacity
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Total Panels in Farm
                  </label>
                  <input
                    type="number"
                    value={totalPanels}
                    onChange={(e) => setTotalPanels(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Cleaning Crew Size
                  </label>
                  <input
                    type="number"
                    value={cleaningCrewSize}
                    onChange={(e) => setCleaningCrewSize(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Repair Crew Size
                  </label>
                  <input
                    type="number"
                    value={repairCrewSize}
                    onChange={(e) => setRepairCrewSize(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 3"
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Hardware Specs */}
            <motion.div
              className="bg-white rounded-lg border border-[var(--solar-border)] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-6 border-b border-[var(--solar-border)]">
                <h3 className="font-semibold text-[var(--solar-navy)]">Hardware Specs</h3>
                <p className="text-sm text-[var(--solar-text-muted)] mt-1">
                  Technical specifications of your solar panels
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Panel Manufacturer
                  </label>
                  <input
                    type="text"
                    value={panelManufacturer}
                    onChange={(e) => setPanelManufacturer(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., Longi Solar, JinkoSolar"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Model Number
                  </label>
                  <input
                    type="text"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., LR5-72HPH-540M"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => handleDimensionsChange(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 2278 x 1134 x 35 mm"
                  />
                  <p className="text-xs text-[var(--solar-text-muted)] mt-1">Format: Length x Width x Height mm</p>
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Rated Power (W)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratedPower}
                    onChange={(e) => setRatedPower(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 540"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Average Sun Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={avgSunHours}
                    onChange={(e) => setAvgSunHours(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 6.5"
                  />
                  <p className="text-xs text-[var(--solar-text-muted)] mt-1">Saudi Arabia average: 6-7 hours/day</p>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Financial & Warranty */}
            <motion.div
              className="bg-white rounded-lg border border-[var(--solar-border)] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6 border-b border-[var(--solar-border)]">
                <h3 className="font-semibold text-[var(--solar-navy)]">Financial & Warranty</h3>
                <p className="text-sm text-[var(--solar-text-muted)] mt-1">
                  Cost parameters and warranty information
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Purchase Price/Panel (SAR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Electricity Tariff (SAR/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={electricityTariff}
                    onChange={(e) => setElectricityTariff(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 0.18"
                  />
                  <p className="text-xs text-[var(--solar-text-muted)] mt-1">Saudi Arabia residential/commercial rate</p>
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Cleaning Cost/Panel (SAR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cleaningCost}
                    onChange={(e) => setCleaningCost(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 8"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Repair Cost/Panel (SAR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={repairCost}
                    onChange={(e) => setRepairCost(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 200"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Warranty Period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-[var(--solar-text-muted)] mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={warrantyStart}
                        onChange={(e) => setWarrantyStart(e.target.value)}
                        className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--solar-text-muted)] mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={warrantyEnd}
                        onChange={(e) => setWarrantyEnd(e.target.value)}
                        className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: AI Logic Thresholds */}
            <motion.div
              className="bg-white rounded-lg border border-[var(--solar-border)] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-6 border-b border-[var(--solar-border)]">
                <h3 className="font-semibold text-[var(--solar-navy)]">AI Logic Thresholds</h3>
                <p className="text-sm text-[var(--solar-text-muted)] mt-1">
                  Configure AI detection parameters
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-medium text-[var(--solar-navy)] mb-2">
                    Critical Hotspot Limit (ΔT)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={criticalHotspotLimit}
                    onChange={(e) => setCriticalHotspotLimit(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--solar-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--solar-navy)] focus:border-transparent"
                    placeholder="e.g., 15"
                  />
                  <p className="text-sm text-[var(--solar-text-muted)] mt-1">
                    Temperature difference that triggers a fire risk warning
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button type="submit">
                Save All Settings
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
