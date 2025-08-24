import React from 'react';
import { ButtonType } from '../types/calculator';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: ButtonType;
  className?: string;
  span?: number;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'number', 
  className = '',
  span = 1 
}) => {
  const { isDark } = useTheme();

  const getButtonStyles = () => {
    const baseStyles = `
      h-14 rounded-xl font-semibold text-lg transition-all duration-200 
      transform active:scale-95 active:translate-y-1
      shadow-lg hover:shadow-xl
      border-2 border-opacity-20
    `;

    const spanClass = span > 1 ? `col-span-${span}` : '';

    if (isDark) {
      switch (type) {
        case 'number':
          return `${baseStyles} ${spanClass} bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500`;
        case 'operator':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white border-orange-400`;
        case 'function':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border-blue-400`;
        case 'clear':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-400`;
        case 'equals':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white border-green-400`;
        case 'memory':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-purple-400`;
        default:
          return `${baseStyles} ${spanClass} bg-gray-700 hover:bg-gray-600 text-white border-gray-600`;
      }
    } else {
      switch (type) {
        case 'number':
          return `${baseStyles} ${spanClass} bg-white hover:bg-gray-50 text-gray-800 border-gray-300 hover:border-gray-400 shadow-gray-200 hover:shadow-gray-300`;
        case 'operator':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white border-orange-300 shadow-orange-200`;
        case 'function':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white border-blue-300 shadow-blue-200`;
        case 'clear':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-red-300 shadow-red-200`;
        case 'equals':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white border-green-300 shadow-green-200`;
        case 'memory':
          return `${baseStyles} ${spanClass} bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white border-purple-300 shadow-purple-200`;
        default:
          return `${baseStyles} ${spanClass} bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-gray-200`;
      }
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getButtonStyles()} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;