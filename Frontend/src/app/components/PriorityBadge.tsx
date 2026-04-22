import { Priority } from '../data/mockData';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const getStyles = () => {
    const baseClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
    const fontClasses = 'font-medium rounded';
    
    switch (priority) {
      case 'High':
        return `${baseClasses} ${fontClasses} bg-red-100 text-[var(--solar-red)]`;
      case 'Medium':
        return `${baseClasses} ${fontClasses} bg-orange-100 text-[var(--solar-orange)]`;
      case 'Low':
        return `${baseClasses} ${fontClasses} bg-green-100 text-[var(--solar-green)]`;
    }
  };
  
  return (
    <span className={getStyles()}>
      {priority}
    </span>
  );
}
