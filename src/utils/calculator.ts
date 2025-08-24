import { CalculatorState } from '../types/calculator';

export class CalculatorEngine {
  private static formatNumber(num: number): string {
    if (isNaN(num) || !isFinite(num)) {
      return 'Error';
    }
    
    if (Math.abs(num) < 1e-10 && num !== 0) {
      return '0';
    }
    
    const str = num.toString();
    if (str.includes('e')) {
      return num.toExponential(6);
    }
    
    return parseFloat(num.toPrecision(12)).toString();
  }

  static evaluateExpression(expression: string, isRadians: boolean = true): string {
    try {
      // Replace mathematical functions and constants
      let processedExpression = expression
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/sin\(/g, isRadians ? 'Math.sin(' : '(Math.sin(Math.PI/180*')
        .replace(/cos\(/g, isRadians ? 'Math.cos(' : '(Math.cos(Math.PI/180*')
        .replace(/tan\(/g, isRadians ? 'Math.tan(' : '(Math.tan(Math.PI/180*')
        .replace(/asin\(/g, isRadians ? 'Math.asin(' : '(180/Math.PI*Math.asin(')
        .replace(/acos\(/g, isRadians ? 'Math.acos(' : '(180/Math.PI*Math.acos(')
        .replace(/atan\(/g, isRadians ? 'Math.atan(' : '(180/Math.PI*Math.atan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/\^/g, '**');

      // Handle degree mode closing parentheses
      if (!isRadians) {
        processedExpression = processedExpression
          .replace(/(Math\.sin\(Math\.PI\/180\*[^)]+)\)/g, '$1))')
          .replace(/(Math\.cos\(Math\.PI\/180\*[^)]+)\)/g, '$1))')
          .replace(/(Math\.tan\(Math\.PI\/180\*[^)]+)\)/g, '$1))')
          .replace(/(180\/Math\.PI\*Math\.asin\([^)]+)\)/g, '$1))')
          .replace(/(180\/Math\.PI\*Math\.acos\([^)]+)\)/g, '$1))')
          .replace(/(180\/Math\.PI\*Math\.atan\([^)]+)\)/g, '$1))');
      }

      const result = eval(processedExpression);
      return this.formatNumber(result);
    } catch (error) {
      return 'Error';
    }
  }

  static factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}