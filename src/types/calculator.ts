export interface CalculatorState {
  display: string;
  expression: string;
  memory: number;
  isRadians: boolean;
  lastResult: number;
  hasError: boolean;
}

export type ButtonType = 'number' | 'operator' | 'function' | 'clear' | 'equals' | 'memory';