import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({ children, variant = 'primary', onClick, type = 'button', disabled }: ButtonProps) {
  const getStyles = () => {
    const baseClasses = 'px-6 py-3 rounded-md font-medium transition-colors';

    if (disabled) {
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }

    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-gradient-to-r from-[#08306b] to-[#334155] text-white shadow-md`;
      case 'secondary':
        return `${baseClasses} bg-white text-[#08306b] border-2 border-[#08306b]`;
    }
  };

  const getHoverStyles = () => {
    if (disabled) return {};

    switch (variant) {
      case 'primary':
        return { scale: 1.05, backgroundImage: 'linear-gradient(to right, #0c1d3a, #1e293b)' };
      case 'secondary':
        return { scale: 1.05, backgroundColor: '#eff6ff' };
      default:
        return { scale: 1.05 };
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getStyles()}
      whileHover={getHoverStyles()}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}
