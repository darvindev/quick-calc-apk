import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CalculatorProps {}

export default function Calculator({}: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(`${parseFloat(newValue.toFixed(7))}`);
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    }
  };

  const CircularButton = ({ 
    onClick, 
    className = '', 
    children, 
    variant = 'number' 
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode;
    variant?: 'number' | 'multiply' | 'divide' | 'subtract' | 'add' | 'function';
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'multiply':
          return 'bg-calc-operator-multiply hover:bg-calc-operator-multiply/90 text-white';
        case 'divide':
          return 'bg-calc-operator-divide hover:bg-calc-operator-divide/90 text-white';
        case 'subtract':
          return 'bg-calc-operator-subtract hover:bg-calc-operator-subtract/90 text-white';
        case 'add':
          return 'bg-calc-operator-add hover:bg-calc-operator-add/90 text-white';
        case 'function':
          return 'bg-calc-function hover:bg-calc-function/90 text-white';
        default:
          return 'bg-calc-number hover:bg-calc-number/90 text-white';
      }
    };

    return (
      <Button
        onClick={onClick}
        className={`
          w-16 h-16 rounded-full text-xl font-bold
          transition-all duration-300 ease-out
          active:scale-95 shadow-button hover:shadow-lg
          border-0 touch-manipulation backdrop-blur-sm
          ${getVariantStyles()}
          ${className}
        `}
      >
        {children}
      </Button>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Display */}
      <div className="mb-8">
        <div className="bg-gradient-display rounded-3xl p-6 shadow-display backdrop-blur-sm border border-white/20">
          <div className="text-center">
            <div 
              className="font-bold text-foreground drop-shadow-sm"
              style={{ 
                fontSize: display.length > 10 ? '2.5rem' : display.length > 6 ? '3.5rem' : '4rem',
                lineHeight: '1.1'
              }}
            >
              {display}
            </div>
          </div>
        </div>
        <div className="text-right mt-2 mr-2">
          <div className="text-muted-foreground text-sm bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
            {previousValue !== null && operation ? `${previousValue} ${operation}` : display}
          </div>
        </div>
      </div>

      {/* Function Buttons Row */}
      <div className="flex justify-center gap-4 mb-6">
        <CircularButton onClick={clear} variant="function" className="w-12 h-12 text-base">
          +/-
        </CircularButton>
        <CircularButton onClick={() => {}} variant="function" className="w-12 h-12 text-base">
          %
        </CircularButton>
        <CircularButton onClick={() => {}} variant="function" className="w-12 h-12 text-base">
          √
        </CircularButton>
        <CircularButton onClick={() => {}} variant="function" className="w-12 h-12 text-base">
          x²
        </CircularButton>
      </div>

      {/* Circular Layout */}
      <div className="relative w-80 h-80 mx-auto">
        {/* Central Operation Buttons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Multiply */}
            <CircularButton 
              onClick={() => performOperation('×')} 
              variant="multiply"
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-14"
            >
              ×
            </CircularButton>
            
            {/* Divide */}
            <CircularButton 
              onClick={() => performOperation('÷')} 
              variant="divide"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 w-14 h-14"
            >
              ÷
            </CircularButton>
            
            {/* Subtract */}
            <CircularButton 
              onClick={() => performOperation('-')} 
              variant="subtract"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-14"
            >
              −
            </CircularButton>
            
            {/* Add */}
            <CircularButton 
              onClick={() => performOperation('+')} 
              variant="add"
              className="absolute top-1/2 left-0 transform -translate-y-1/2 w-14 h-14"
            >
              +
            </CircularButton>
          </div>
        </div>

        {/* Number Buttons in Circle */}
        {/* 0 - Top */}
        <CircularButton 
          onClick={() => inputNumber('0')} 
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
        >
          0
        </CircularButton>
        
        {/* 1 - Top Right */}
        <CircularButton 
          onClick={() => inputNumber('1')} 
          className="absolute top-8 right-8"
        >
          1
        </CircularButton>
        
        {/* 2 - Right */}
        <CircularButton 
          onClick={() => inputNumber('2')} 
          className="absolute top-1/2 right-0 transform -translate-y-1/2"
        >
          2
        </CircularButton>
        
        {/* 3 - Bottom Right */}
        <CircularButton 
          onClick={() => inputNumber('3')} 
          className="absolute bottom-8 right-8"
        >
          3
        </CircularButton>
        
        {/* 4 - Bottom Right 2 */}
        <CircularButton 
          onClick={() => inputNumber('4')} 
          className="absolute bottom-2 right-20"
        >
          4
        </CircularButton>
        
        {/* 5 - Bottom */}
        <CircularButton 
          onClick={() => inputNumber('5')} 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        >
          5
        </CircularButton>
        
        {/* 6 - Bottom Left 2 */}
        <CircularButton 
          onClick={() => inputNumber('6')} 
          className="absolute bottom-2 left-20"
        >
          6
        </CircularButton>
        
        {/* 7 - Bottom Left */}
        <CircularButton 
          onClick={() => inputNumber('7')} 
          className="absolute bottom-8 left-8"
        >
          7
        </CircularButton>
        
        {/* 8 - Left */}
        <CircularButton 
          onClick={() => inputNumber('8')} 
          className="absolute top-1/2 left-0 transform -translate-y-1/2"
        >
          8
        </CircularButton>
        
        {/* 9 - Top Left */}
        <CircularButton 
          onClick={() => inputNumber('9')} 
          className="absolute top-8 left-8"
        >
          9
        </CircularButton>
        
        {/* Dot - Top Right outer */}
        <CircularButton 
          onClick={inputDot} 
          className="absolute top-2 right-20 w-12 h-12 text-2xl"
        >
          .
        </CircularButton>
        
        {/* Equals - Top Left outer */}
        <CircularButton 
          onClick={handleEquals} 
          variant="function"
          className="absolute top-2 left-20 w-12 h-12 text-xl"
        >
          =
        </CircularButton>
      </div>
    </div>
  );
}