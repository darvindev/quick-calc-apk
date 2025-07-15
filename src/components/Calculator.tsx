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

  const CalculatorButton = ({ 
    onClick, 
    className = '', 
    children, 
    variant = 'number' 
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode;
    variant?: 'number' | 'operator' | 'equals' | 'clear';
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'operator':
          return 'bg-calc-operator hover:bg-calc-operator/90 text-white shadow-button';
        case 'equals':
          return 'bg-gradient-accent hover:opacity-90 text-accent-foreground shadow-button';
        case 'clear':
          return 'bg-calc-clear hover:bg-calc-clear/90 text-white shadow-button';
        default:
          return 'bg-calc-number hover:bg-calc-number/80 text-white shadow-button';
      }
    };

    return (
      <Button
        onClick={onClick}
        className={`
          h-16 text-xl font-semibold rounded-xl
          transition-all duration-200 ease-out
          active:scale-95 active:shadow-none
          ${getVariantStyles()}
          ${className}
        `}
      >
        {children}
      </Button>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-card rounded-2xl p-6 shadow-2xl">
      {/* Display */}
      <div className="mb-6">
        <div className="bg-calc-display rounded-xl p-6 shadow-display">
          <div className="text-right">
            <div className="text-muted-foreground text-sm mb-1">
              {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
            </div>
            <div 
              className="text-4xl font-bold text-foreground overflow-hidden"
              style={{ 
                fontSize: display.length > 8 ? '2rem' : '2.5rem',
                lineHeight: '1.2'
              }}
            >
              {display}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* First Row */}
        <CalculatorButton 
          onClick={clear} 
          variant="clear"
          className="col-span-2"
        >
          Clear
        </CalculatorButton>
        <CalculatorButton onClick={() => performOperation('÷')} variant="operator">
          ÷
        </CalculatorButton>
        <CalculatorButton onClick={() => performOperation('×')} variant="operator">
          ×
        </CalculatorButton>

        {/* Second Row */}
        <CalculatorButton onClick={() => inputNumber('7')}>7</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('8')}>8</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('9')}>9</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('-')} variant="operator">
          −
        </CalculatorButton>

        {/* Third Row */}
        <CalculatorButton onClick={() => inputNumber('4')}>4</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('5')}>5</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('6')}>6</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('+')} variant="operator">
          +
        </CalculatorButton>

        {/* Fourth Row */}
        <CalculatorButton onClick={() => inputNumber('1')}>1</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('2')}>2</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('3')}>3</CalculatorButton>
        <CalculatorButton 
          onClick={handleEquals} 
          variant="equals"
          className="row-span-2"
        >
          =
        </CalculatorButton>

        {/* Fifth Row */}
        <CalculatorButton 
          onClick={() => inputNumber('0')} 
          className="col-span-2"
        >
          0
        </CalculatorButton>
        <CalculatorButton onClick={inputDot}>.</CalculatorButton>
      </div>
    </div>
  );
}