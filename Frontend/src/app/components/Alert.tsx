import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#dc2626]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-md border ${getStyles()}`}>
      {getIcon()}
      <div className="flex-1 text-sm">{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
