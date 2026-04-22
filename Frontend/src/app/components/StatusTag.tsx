import { Status } from '../data/mockData';

interface StatusTagProps {
  status: Status;
}

export function StatusTag({ status }: StatusTagProps) {
  const getStyles = () => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded';
    
    switch (status) {
      case 'New':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'Scheduled':
        return `${baseClasses} bg-purple-100 text-purple-700`;
      case 'In Progress':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'Resolved':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'Monitor':
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };
  
  return (
    <span className={getStyles()}>
      {status}
    </span>
  );
}
