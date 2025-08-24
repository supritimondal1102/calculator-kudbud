import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Calculator from './components/Calculator';

function App() {
  return (
    <ThemeProvider>
      <Calculator />
    </ThemeProvider>
  );
}

export default App;