import React, { useState, useCallback } from 'react';
import { CalculatorState } from '../types/calculator';
import { CalculatorEngine } from '../utils/calculator';
import Display from './Display';
import Button from './Button';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Calculator: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    expression: '',
    memory: 0,
    isRadians: true,
    lastResult: 0,
    hasError: false,
  });

  const handleNumber = useCallback((num: string) => {
    setState(prev => {
      if (prev.hasError || prev.display === '0' || prev.display === prev.lastResult.toString()) {
        return { ...prev, display: num, hasError: false };
      }
      return { ...prev, display: prev.display + num };
    });
  }, []);

  const handleOperator = useCallback((op: string) => {
    setState(prev => {
      const newExpression = prev.expression ? prev.expression + prev.display + op : prev.display + op;
      return { 
        ...prev, 
        expression: newExpression, 
        display: '0',
        hasError: false 
      };
    });
  }, []);

  const handleFunction = useCallback((func: string) => {
    setState(prev => {
      let newExpression = prev.expression;
      
      if (func === 'π' || func === 'e') {
        newExpression = prev.expression + func;
        return { ...prev, expression: newExpression, display: func };
      }
      
      if (func === 'x²') {
        newExpression = prev.expression + prev.display + '^2';
      } else if (func === 'x³') {
        newExpression = prev.expression + prev.display + '^3';
      } else if (func === '10^x') {
        newExpression = prev.expression + '10^' + prev.display;
      } else if (func === 'x!') {
        const num = parseFloat(prev.display);
        const result = CalculatorEngine.factorial(num);
        return { ...prev, display: result.toString(), hasError: isNaN(result) };
      } else if (func === '1/x') {
        newExpression = prev.expression + '1/(' + prev.display + ')';
      } else {
        newExpression = prev.expression + func + '(' + prev.display + ')';
      }
      
      return { ...prev, expression: newExpression, display: '0' };
    });
  }, []);

  const handleEquals = useCallback(() => {
    setState(prev => {
      const fullExpression = prev.expression + prev.display;
      const result = CalculatorEngine.evaluateExpression(fullExpression, prev.isRadians);
      
      return {
        ...prev,
        display: result,
        expression: '',
        lastResult: parseFloat(result) || 0,
        hasError: result === 'Error'
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState(prev => ({ ...prev, display: '0', hasError: false }));
  }, []);

  const handleAllClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: '0',
      expression: '',
      lastResult: 0,
      hasError: false
    }));
  }, []);

  const handleMemory = useCallback((action: string) => {
    setState(prev => {
      const currentValue = parseFloat(prev.display) || 0;
      
      switch (action) {
        case 'MC':
          return { ...prev, memory: 0 };
        case 'MR':
          return { ...prev, display: prev.memory.toString() };
        case 'M+':
          return { ...prev, memory: prev.memory + currentValue };
        case 'M-':
          return { ...prev, memory: prev.memory - currentValue };
        default:
          return prev;
      }
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState(prev => {
      if (prev.display.includes('.')) return prev;
      return { ...prev, display: prev.display + '.' };
    });
  }, []);

  const toggleAngleMode = useCallback(() => {
    setState(prev => ({ ...prev, isRadians: !prev.isRadians }));
  }, []);

  return (
    <div className={`
      min-h-screen transition-all duration-500 p-4
      ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }
    `}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`
            text-2xl font-bold
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            Scientific Calculator
          </h1>
          <button
            onClick={toggleTheme}
            className={`
              p-3 rounded-xl transition-all duration-300 transform hover:scale-110
              ${isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg'
              }
            `}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Calculator Body */}
        <div className={`
          p-6 rounded-3xl backdrop-blur-sm border-2
          ${isDark 
            ? 'bg-gray-800/50 border-gray-700 shadow-2xl' 
            : 'bg-white/70 border-gray-200 shadow-2xl shadow-gray-200/50'
          }
        `}>
          <Display value={state.display} expression={state.expression} />
          
          {/* Mode indicators */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <button
              onClick={toggleAngleMode}
              className={`
                px-3 py-1 rounded-lg font-semibold transition-all duration-200
                ${state.isRadians
                  ? 'bg-blue-500 text-white'
                  : 'bg-orange-500 text-white'
                }
              `}
            >
              {state.isRadians ? 'RAD' : 'DEG'}
            </button>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              M: {state.memory !== 0 ? state.memory : 'Empty'}
            </span>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-5 gap-3">
            {/* Row 1 */}
            <Button type="memory" onClick={() => handleMemory('MC')}>MC</Button>
            <Button type="memory" onClick={() => handleMemory('MR')}>MR</Button>
            <Button type="memory" onClick={() => handleMemory('M+')}>M+</Button>
            <Button type="memory" onClick={() => handleMemory('M-')}>M-</Button>
            <Button type="clear" onClick={handleAllClear}>AC</Button>

            {/* Row 2 */}
            <Button type="function" onClick={() => handleFunction('sin')}>sin</Button>
            <Button type="function" onClick={() => handleFunction('cos')}>cos</Button>
            <Button type="function" onClick={() => handleFunction('tan')}>tan</Button>
            <Button type="function" onClick={() => handleFunction('ln')}>ln</Button>
            <Button type="clear" onClick={handleClear}>C</Button>

            {/* Row 3 */}
            <Button type="function" onClick={() => handleFunction('asin')}>asin</Button>
            <Button type="function" onClick={() => handleFunction('acos')}>acos</Button>
            <Button type="function" onClick={() => handleFunction('atan')}>atan</Button>
            <Button type="function" onClick={() => handleFunction('log')}>log</Button>
            <Button type="operator" onClick={() => handleOperator('/')}>÷</Button>

            {/* Row 4 */}
            <Button type="function" onClick={() => handleFunction('x²')}>x²</Button>
            <Button type="function" onClick={() => handleFunction('x³')}>x³</Button>
            <Button type="function" onClick={() => handleFunction('10^x')}>10ˣ</Button>
            <Button type="function" onClick={() => handleFunction('^')}>xʸ</Button>
            <Button type="operator" onClick={() => handleOperator('*')}>×</Button>

            {/* Row 5 */}
            <Button type="function" onClick={() => handleFunction('sqrt')}>√</Button>
            <Button type="function" onClick={() => handleFunction('1/x')}>1/x</Button>
            <Button type="function" onClick={() => handleFunction('abs')}>|x|</Button>
            <Button type="function" onClick={() => handleFunction('x!')}>x!</Button>
            <Button type="operator" onClick={() => handleOperator('-')}>−</Button>

            {/* Row 6 */}
            <Button type="function" onClick={() => handleFunction('π')}>π</Button>
            <Button type="function" onClick={() => handleFunction('e')}>e</Button>
            <Button type="operator" onClick={() => handleOperator('(')}>(</Button>
            <Button type="operator" onClick={() => handleOperator(')')}>)</Button>
            <Button type="operator" onClick={() => handleOperator('+')}>+</Button>

            {/* Row 7-9: Numbers */}
            <Button type="number" onClick={() => handleNumber('7')}>7</Button>
            <Button type="number" onClick={() => handleNumber('8')}>8</Button>
            <Button type="number" onClick={() => handleNumber('9')}>9</Button>
            <Button type="number" onClick={() => handleNumber('4')}>4</Button>
            <Button type="number" onClick={() => handleNumber('5')}>5</Button>

            <Button type="number" onClick={() => handleNumber('6')}>6</Button>
            <Button type="number" onClick={() => handleNumber('1')}>1</Button>
            <Button type="number" onClick={() => handleNumber('2')}>2</Button>
            <Button type="number" onClick={() => handleNumber('3')}>3</Button>
            <Button type="equals" onClick={handleEquals} span={2}>equals</Button>

            <Button type="number" onClick={() => handleNumber('0')} span={2}>0</Button>
            <Button type="number" onClick={handleDecimal}>.</Button>
            <Button type="equals" onClick={handleEquals}>=</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;