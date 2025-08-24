import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface DisplayProps {
  value: string;
  expression: string;
}

const Display: React.FC<DisplayProps> = ({ value, expression }) => {
  const { isDark } = useTheme();

  return (
    <div className={`
      p-6 rounded-2xl mb-6 backdrop-blur-sm
      ${isDark 
        ? 'bg-gray-800/80 border-gray-700 shadow-2xl' 
        : 'bg-white/90 border-gray-200 shadow-2xl shadow-gray-200/50'
      }
      border-2
    `}>
      {/* Expression display */}
      <div className={`
        text-right text-sm mb-2 h-5 opacity-70
        ${isDark ? 'text-gray-300' : 'text-gray-600'}
      `}>
        {expression && expression !== value ? expression : ''}
      </div>
      
      {/* Main display */}
      <div className={`
        text-right text-4xl font-mono font-bold min-h-[3rem] flex items-center justify-end
        ${isDark ? 'text-white' : 'text-gray-900'}
        ${value === 'Error' ? 'text-red-500' : ''}
      `}>
        {value || '0'}
      </div>
    </div>
  );
};

export default Display;