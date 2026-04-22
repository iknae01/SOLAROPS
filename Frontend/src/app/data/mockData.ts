export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'New' | 'Scheduled' | 'In Progress' | 'Resolved' | 'Monitor';
export type DefectType = 'Hotspot' | 'Soiling' | 'Cracking' | 'Shading' | 'Discoloration' | 'Bird Dropping';

export interface Panel {
  id: string;
  defectType: DefectType;
  severity: number;
  kwhLoss: number;
  sarLoss: number;
  priority: Priority;
  status: Status;
  thermalDelta: number;
  coverage: number;
  inspectionDate: string;
  description: string;
  imageUrl?: string;
}

export const panels: Panel[] = [
  {
    id: 'P12',
    defectType: 'Hotspot',
    severity: 95,
    kwhLoss: 8.5,
    sarLoss: 4.25,
    priority: 'High',
    status: 'New',
    thermalDelta: 18.5,
    coverage: 35,
    inspectionDate: '2026-02-20',
    description: 'Critical hotspot detected in junction box area with significant thermal anomaly',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
  },
  {
    id: 'P7',
    defectType: 'Cracking',
    severity: 75,
    kwhLoss: 5.2,
    sarLoss: 2.6,
    priority: 'High',
    status: 'Scheduled',
    thermalDelta: 12.3,
    coverage: 25,
    inspectionDate: '2026-02-19',
    description: 'Multiple cell cracks observed, reduced power output detected',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop'
  },
  {
    id: 'P23',
    defectType: 'Soiling',
    severity: 60,
    kwhLoss: 3.8,
    sarLoss: 1.9,
    priority: 'Medium',
    status: 'New',
    thermalDelta: 8.1,
    coverage: 45,
    inspectionDate: '2026-02-21',
    description: 'Heavy dust accumulation reducing panel efficiency',
    imageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&h=300&fit=crop'
  },
  {
    id: 'P45',
    defectType: 'Bird Dropping',
    severity: 55,
    kwhLoss: 2.9,
    sarLoss: 1.45,
    priority: 'Medium',
    status: 'Monitor',
    thermalDelta: 6.5,
    coverage: 20,
    inspectionDate: '2026-02-18',
    description: 'Bird droppings covering corner cells, partial shading effect',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&h=300&fit=crop'
  },
  {
    id: 'P18',
    defectType: 'Hotspot',
    severity: 88,
    kwhLoss: 7.3,
    sarLoss: 3.65,
    priority: 'High',
    status: 'In Progress',
    thermalDelta: 15.8,
    coverage: 30,
    inspectionDate: '2026-02-17',
    description: 'Hotspot in bypass diode region, temperature elevation detected',
    imageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&h=300&fit=crop'
  },
  {
    id: 'P34',
    defectType: 'Shading',
    severity: 45,
    kwhLoss: 2.1,
    sarLoss: 1.05,
    priority: 'Low',
    status: 'Monitor',
    thermalDelta: 5.2,
    coverage: 15,
    inspectionDate: '2026-02-20',
    description: 'Intermittent shading from nearby structure during morning hours',
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&h=300&fit=crop'
  },
  {
    id: 'P56',
    defectType: 'Discoloration',
    severity: 42,
    kwhLoss: 1.8,
    sarLoss: 0.9,
    priority: 'Low',
    status: 'Monitor',
    thermalDelta: 4.5,
    coverage: 12,
    inspectionDate: '2026-02-19',
    description: 'EVA browning observed, minimal current impact at this stage',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop'
  },
  {
    id: 'P29',
    defectType: 'Cracking',
    severity: 68,
    kwhLoss: 4.5,
    sarLoss: 2.25,
    priority: 'Medium',
    status: 'Scheduled',
    thermalDelta: 9.8,
    coverage: 22,
    inspectionDate: '2026-02-21',
    description: 'Microcracks spreading across cells, performance degradation evident',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
  },
  {
    id: 'P91',
    defectType: 'Hotspot',
    severity: 92,
    kwhLoss: 8.1,
    sarLoss: 4.05,
    priority: 'High',
    status: 'New',
    thermalDelta: 17.2,
    coverage: 32,
    inspectionDate: '2026-02-22',
    description: 'Severe hotspot formation, immediate inspection recommended',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&h=300&fit=crop'
  },
  {
    id: 'P63',
    defectType: 'Soiling',
    severity: 50,
    kwhLoss: 2.5,
    sarLoss: 1.25,
    priority: 'Medium',
    status: 'New',
    thermalDelta: 6.8,
    coverage: 38,
    inspectionDate: '2026-02-20',
    description: 'Dust and debris accumulation requiring cleaning',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&h=300&fit=crop'
  },
  {
    id: 'P78',
    defectType: 'Shading',
    severity: 38,
    kwhLoss: 1.5,
    sarLoss: 0.75,
    priority: 'Low',
    status: 'Resolved',
    thermalDelta: 4.2,
    coverage: 10,
    inspectionDate: '2026-02-15',
    description: 'Temporary shading issue now resolved',
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&h=300&fit=crop'
  },
  {
    id: 'P102',
    defectType: 'Hotspot',
    severity: 85,
    kwhLoss: 6.8,
    sarLoss: 3.4,
    priority: 'High',
    status: 'Scheduled',
    thermalDelta: 14.5,
    coverage: 28,
    inspectionDate: '2026-02-19',
    description: 'Hotspot developing near cell interconnection',
    imageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&h=300&fit=crop'
  }
];

export const kpiData = {
  totalPanels: 1250,
  totalDefective: panels.length,
  highPriority: panels.filter(p => p.priority === 'High').length,
  totalEnergyLoss: panels.reduce((sum, p) => sum + p.kwhLoss, 0),
  totalFinancialLoss: panels.reduce((sum, p) => sum + p.sarLoss, 0)
};

export const priorityDistribution = [
  { id: 'high', name: 'High', value: panels.filter(p => p.priority === 'High').length, color: '#dc2626' },
  { id: 'medium', name: 'Medium', value: panels.filter(p => p.priority === 'Medium').length, color: '#f59e0b' },
  { id: 'low', name: 'Low', value: panels.filter(p => p.priority === 'Low').length, color: '#16a34a' }
];

export const energyLossTrend = [
  { id: '2026-02-15', date: 'Feb 15', kwhLoss: 42.3 },
  { id: '2026-02-16', date: 'Feb 16', kwhLoss: 45.1 },
  { id: '2026-02-17', date: 'Feb 17', kwhLoss: 48.7 },
  { id: '2026-02-18', date: 'Feb 18', kwhLoss: 51.2 },
  { id: '2026-02-19', date: 'Feb 19', kwhLoss: 53.8 },
  { id: '2026-02-20', date: 'Feb 20', kwhLoss: 55.4 },
  { id: '2026-02-21', date: 'Feb 21', kwhLoss: 57.1 },
  { id: '2026-02-22', date: 'Feb 22', kwhLoss: 59.3 }
];

export const maintenanceRecommendations = [
  { panelId: 'P12', priority: 'High', action: 'Clean immediately', dueIn: '1 day' },
  { panelId: 'P91', priority: 'High', action: 'Clean immediately', dueIn: '1 day' },
  { panelId: 'P18', priority: 'High', action: 'Inspect junction box', dueIn: '2 days' },
  { panelId: 'P7', priority: 'High', action: 'Replace panel', dueIn: '3 days' },
  { panelId: 'P23', priority: 'Medium', action: 'Schedule cleaning', dueIn: '5 days' },
  { panelId: 'P29', priority: 'Medium', action: 'Monitor performance', dueIn: '7 days' }
];
