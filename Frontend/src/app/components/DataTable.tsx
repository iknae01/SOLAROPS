import { useState } from 'react';
import { Panel } from '../data/mockData';
import { PriorityBadge } from './PriorityBadge';
import { StatusTag } from './StatusTag';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DataTableProps {
  panels: Panel[];
  expandable?: boolean;
}

export function DataTable({ panels, expandable = false }: DataTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--solar-border)] bg-[#f9fafb]">
            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--solar-text-muted)]">Panel ID</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--solar-text-muted)]">Defect Type</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--solar-text-muted)]">Severity</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--solar-text-muted)]">kWh Loss</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--solar-text-muted)]">SAR Loss</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--solar-text-muted)]">Priority</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--solar-text-muted)]">Status</th>
            {expandable && <th className="w-12"></th>}
          </tr>
        </thead>
        <tbody>
          {panels.flatMap((panel) => {
            const rows = [
              <tr 
                key={panel.id}
                className={`border-b border-[var(--solar-border)] hover:bg-[#f9fafb] transition-colors ${
                  panel.priority === 'High' ? 'bg-[#fef2f2]/30' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium text-[var(--solar-navy)]">{panel.id}</td>
                <td className="px-4 py-3 text-sm">{panel.defectType}</td>
                <td className="px-4 py-3 text-sm">{panel.severity}%</td>
                <td className="px-4 py-3 text-sm">{panel.kwhLoss.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm">{panel.sarLoss.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={panel.priority} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <StatusTag status={panel.status} />
                </td>
                {expandable && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRow(panel.id)}
                      className="text-[var(--solar-text-muted)] hover:text-[var(--solar-navy)]"
                    >
                      {expandedRow === panel.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                )}
              </tr>
            ];
            
            if (expandable && expandedRow === panel.id) {
              rows.push(
                <tr key={`${panel.id}-expanded`} className="border-b border-[var(--solar-border)] bg-[#f9fafb]">
                  <td colSpan={8} className="px-4 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-[var(--solar-navy)] mb-3">Defect Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-[var(--solar-text-muted)]">Description:</span>
                            <p className="mt-1">{panel.description}</p>
                          </div>
                          <div className="flex gap-4 mt-3">
                            <div>
                              <span className="text-[var(--solar-text-muted)]">Thermal ΔT:</span>
                              <p className="font-medium">{panel.thermalDelta}°C</p>
                            </div>
                            <div>
                              <span className="text-[var(--solar-text-muted)]">Coverage:</span>
                              <p className="font-medium">{panel.coverage}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--solar-navy)] mb-3">Performance Impact</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-[var(--solar-text-muted)]">Estimated Power Loss:</span>
                            <p className="font-medium text-[var(--solar-red)]">{panel.kwhLoss} kWh/day</p>
                          </div>
                          <div>
                            <span className="text-[var(--solar-text-muted)]">Estimated Financial Loss:</span>
                            <p className="font-medium text-[var(--solar-red)]">{panel.sarLoss} SAR/day</p>
                          </div>
                          <div className="mt-3">
                            <span className="text-[var(--solar-text-muted)]">Inspection Date:</span>
                            <p className="font-medium">{new Date(panel.inspectionDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }
            
            return rows;
          })}
        </tbody>
      </table>
      {panels.length === 0 && (
        <div className="text-center py-12 text-[var(--solar-text-muted)]">
          No panels found matching your criteria
        </div>
      )}
    </div>
  );
}