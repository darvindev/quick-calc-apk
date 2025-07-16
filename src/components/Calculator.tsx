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
    variant?: 'number' | 'function';
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'function':
          return 'bg-pink-300 hover:bg-pink-400 text-white';
        default:
          return 'bg-purple-300 hover:bg-purple-400 text-white';
      }
    };

    return (
      <Button
        onClick={onClick}
        className={`
          w-16 h-16 rounded-full text-xl font-bold
          transition-all duration-300 ease-out
          active:scale-95 shadow-lg
          border-0 touch-manipulation
          ${getVariantStyles()}
          ${className}
        `}
      >
        {children}
      </Button>
    );
  };

  const OperationButton = ({ 
    onClick, 
    children, 
    variant,
    className = ''
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    variant: 'multiply' | 'divide' | 'subtract' | 'add';
    className?: string;
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'multiply':
          return 'bg-blue-400 hover:bg-blue-500';
        case 'divide':
          return 'bg-yellow-400 hover:bg-yellow-500';
        case 'subtract':
          return 'bg-orange-400 hover:bg-orange-500';
        case 'add':
          return 'bg-green-400 hover:bg-green-500';
      }
    };

    return (
      <Button
        onClick={onClick}
        className={`
          text-white text-2xl font-bold
          transition-all duration-300 ease-out
          active:scale-95 border-0 touch-manipulation
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
      <div className="relative w-96 h-96 mx-auto">
        {/* Central Cross with Operations */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Top segment - Multiply (Blue) */}
            <OperationButton
              onClick={() => performOperation('×')}
              variant="multiply"
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-t-full"
            >
              ×
            </OperationButton>
            
            {/* Right segment - Divide (Yellow) */}
            <OperationButton
              onClick={() => performOperation('÷')}
              variant="divide"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-16 rounded-r-full"
            >
              ÷
            </OperationButton>
            
            {/* Bottom segment - Subtract (Orange) */}
            <OperationButton
              onClick={() => performOperation('-')}
              variant="subtract"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-b-full"
            >
              −
            </OperationButton>
            
            {/* Left segment - Add (Green) */}
            <OperationButton
              onClick={() => performOperation('+')}
              variant="add"
              className="absolute top-1/2 left-0 transform -translate-y-1/2 w-16 h-16 rounded-l-full"
            >
              +
            </OperationButton>
          </div>
        </div>

        {/* Numbers in Circle - Clockwise from top */}
        {/* 0 - Top (12 o'clock) */}
        <CircularButton 
          onClick={() => inputNumber('0')} 
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
        >
          0
        </CircularButton>
        
        {/* 1 - 1 o'clock */}
        <CircularButton 
          onClick={() => inputNumber('1')} 
          className="absolute top-6 right-20"
        >
          1
        </CircularButton>
        
        {/* 2 - 2 o'clock */}
        <CircularButton 
          onClick={() => inputNumber('2')} 
          className="absolute top-20 right-6"
        >
          2
        </CircularButton>
        
        {/* 3 - Right (3 o'clock) */}
        <CircularButton 
          onClick={() => inputNumber('3')} 
          className="absolute top-1/2 right-0 transform -translate-y-1/2"
        >
          3
        </CircularButton>
        
        {/* 4 - 4 o'clock */}
        <CircularButton 
          onClick={() => inputNumber('4')} 
          className="absolute bottom-20 right-6"
        >
          4
        </CircularButton>
        
        {/* 5 - 5 o'clock */}
        <CircularButton 
          onClick={() => inputNumber('5')} 
          className="absolute bottom-6 right-20"
        >
          5
        </CircularButton>
        
        {/* 6 - Bottom (6 o'clock) */}
        <CircularButton 
          onClick={() => inputNumber('6')} 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        >
          6
        </CircularButton>
        
        {/* 7 - 7 o'clock */}
        <CircularButton 
          onClick={() => inputNumber('7')} 
          className="absolute bottom-6 left-20"
        >
          7
        </CircularButton>
        
        {/* 8 - 8 o'clock */}
        <CircularButton 
          onClick={() => inputNumber('8')} 
          className="absolute bottom-20 left-6"
        >
          8
        </CircularButton>
        
        {/* 9 - Left (9 o'clock) */}
        <CircularButton 
          onClick={() => inputNumber('9')} 
          className="absolute top-1/2 left-0 transform -translate-y-1/2"
        >
          9
        </CircularButton>
        
        {/* . - 10 o'clock */}
        <CircularButton 
          onClick={inputDot} 
          className="absolute top-20 left-6 text-2xl"
        >
          .
        </CircularButton>
      </div>
      
      {/* Bottom Corner Buttons */}
      <div className="flex justify-between mt-8 px-8">
        <CircularButton onClick={() => {}} variant="function" className="w-12 h-12 text-base">
          (
        </CircularButton>
        <CircularButton onClick={() => {}} variant="function" className="w-12 h-12 text-base">
          )
        </CircularButton>
      </div>
    </div>
  );
}