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

  // Function Button Component (Pink)
  const FunctionButton = ({ 
    onClick, 
    children,
    className = ''
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    className?: string;
  }) => (
    <Button
      onClick={onClick}
      className={`
        w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white font-bold text-sm sm:text-lg
        transition-all duration-300 ease-out
        active:scale-95 hover:scale-105
        neumorphism hover:shadow-float
        ${className}
      `}
      style={{ 
        backgroundColor: 'hsl(var(--calc-function))',
        boxShadow: 'var(--shadow-neumorphism)'
      }}
    >
      {children}
    </Button>
  );

  // Number Button Component (Purple)
  const NumberButton = ({ 
    onClick, 
    children,
    className = ''
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    className?: string;
  }) => (
    <Button
      onClick={onClick}
      className={`
        w-12 h-12 sm:w-16 sm:h-16 rounded-full text-white font-bold text-lg sm:text-xl
        transition-all duration-300 ease-out
        active:scale-95 hover:scale-105
        neumorphism hover:shadow-float
        ${className}
      `}
      style={{ 
        backgroundColor: 'hsl(var(--calc-number))',
        boxShadow: 'var(--shadow-neumorphism)'
      }}
    >
      {children}
    </Button>
  );

  // Operation Button Component (Colored Segments)
  const OperationButton = ({ 
    onClick, 
    children, 
    variant,
    className = '',
    style = {}
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    variant: 'multiply' | 'divide' | 'subtract' | 'add';
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const getColor = () => {
      switch (variant) {
        case 'multiply': return 'hsl(var(--calc-multiply))';    // Blue
        case 'divide': return 'hsl(var(--calc-divide))';       // Yellow
        case 'subtract': return 'hsl(var(--calc-subtract))';   // Orange
        case 'add': return 'hsl(var(--calc-add))';             // Green
      }
    };

    return (
      <Button
        onClick={onClick}
        className={`
          text-white text-xl sm:text-3xl font-bold
          transition-all duration-300 ease-out
          active:scale-95 hover:scale-105
          border-2 border-white/20
          ${className}
        `}
        style={{ 
          backgroundColor: getColor(),
          boxShadow: 'var(--shadow-neumorphism)',
          ...style
        }}
      >
        {children}
      </Button>
    );
  };

  // Equals Button Component (Pink, Emphasized)
  const EqualsButton = () => (
    <Button
      onClick={handleEquals}
      className="
        w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white font-bold text-2xl sm:text-3xl
        transition-all duration-300 ease-out
        active:scale-95 hover:scale-110
        animate-float shadow-float
        mx-auto block
      "
      style={{ 
        backgroundColor: 'hsl(var(--calc-equals))',
        boxShadow: 'var(--shadow-float)'
      }}
    >
      =
    </Button>
  );

  return (
    <div className="min-h-screen bg-calc-gradient relative overflow-hidden">
      <div className="w-full max-w-xs sm:max-w-sm mx-auto px-3 sm:px-6 py-4 sm:py-8 relative">
        
        {/* Large Display at Top */}
        <div className="mb-8 sm:mb-12 mt-4 sm:mt-8">
          <div className="bg-calc-display rounded-2xl sm:rounded-3xl p-4 sm:p-8 neumorphism">
            <div className="text-right">
              <div 
                className="font-bold drop-shadow-sm"
                style={{ 
                  fontSize: display.length > 8 ? '1.8rem' : display.length > 5 ? '2.5rem' : '3.2rem',
                  lineHeight: '1.1',
                  color: 'hsl(var(--calc-display-text))'
                }}
              >
                {display}
              </div>
              {previousValue !== null && operation && (
                <div className="text-sm sm:text-lg opacity-60 mt-2">
                  {previousValue} {operation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Function Buttons Row */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          <FunctionButton onClick={() => setDisplay(prev => (parseFloat(prev) * -1).toString())}>
            +/-
          </FunctionButton>
          <FunctionButton onClick={() => setDisplay(prev => (parseFloat(prev) / 100).toString())}>
            %
          </FunctionButton>
          <FunctionButton onClick={() => setDisplay(prev => Math.sqrt(parseFloat(prev)).toString())}>
            √
          </FunctionButton>
          <FunctionButton onClick={() => setDisplay(prev => Math.pow(parseFloat(prev), 2).toString())}>
            x²
          </FunctionButton>
        </div>

        {/* Circular Number Pad with Central Operations - Responsive */}
        <div className="relative mx-auto mb-8 sm:mb-16" style={{ width: 'min(280px, 80vw)', height: 'min(280px, 80vw)' }}>
          
          {/* Central Cross with Four Operations */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative rounded-full overflow-hidden" style={{ width: 'min(100px, 25vw)', height: 'min(100px, 25vw)' }}>
              
              {/* Top-left: Multiply (Blue) */}
              <OperationButton
                onClick={() => performOperation('×')}
                variant="multiply"
                className="absolute top-0 left-0 rounded-tl-full"
                style={{ width: 'min(50px, 12.5vw)', height: 'min(50px, 12.5vw)' }}
              >
                ×
              </OperationButton>
              
              {/* Top-right: Divide (Yellow) */}
              <OperationButton
                onClick={() => performOperation('÷')}
                variant="divide"
                className="absolute top-0 right-0 rounded-tr-full"
                style={{ width: 'min(50px, 12.5vw)', height: 'min(50px, 12.5vw)' }}
              >
                ÷
              </OperationButton>
              
              {/* Bottom-left: Subtract (Orange) */}
              <OperationButton
                onClick={() => performOperation('-')}
                variant="subtract"
                className="absolute bottom-0 left-0 rounded-bl-full"
                style={{ width: 'min(50px, 12.5vw)', height: 'min(50px, 12.5vw)' }}
              >
                −
              </OperationButton>
              
              {/* Bottom-right: Add (Green) */}
              <OperationButton
                onClick={() => performOperation('+')}
                variant="add"
                className="absolute bottom-0 right-0 rounded-br-full"
                style={{ width: 'min(50px, 12.5vw)', height: 'min(50px, 12.5vw)' }}
              >
                +
              </OperationButton>
              
            </div>
          </div>

          {/* Numbers arranged in perfect circle with equal angular spacing */}
          {Array.from({ length: 10 }, (_, i) => {
            const number = i;
            const angle = (i * 36 - 90) * (Math.PI / 180);
            const containerSize = Math.min(280, window.innerWidth * 0.8);
            const radius = containerSize * 0.42; // 42% of container size for radius
            const centerX = containerSize / 2;
            const centerY = containerSize / 2;
            
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            return (
              <div
                key={number}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(x / containerSize) * 100}%`,
                  top: `${(y / containerSize) * 100}%`,
                }}
              >
                <NumberButton onClick={() => inputNumber(number.toString())}>
                  {number}
                </NumberButton>
              </div>
            );
          })}
          
        </div>

        {/* Bottom Row - Decimal Point and Parentheses */}
        <div className="flex justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
          <FunctionButton onClick={() => {}}>
            (
          </FunctionButton>
          <NumberButton onClick={inputDot} className="text-2xl sm:text-3xl">
            .
          </NumberButton>
          <FunctionButton onClick={() => {}}>
            )
          </FunctionButton>
        </div>

        {/* Centered Equals Button with proper spacing */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <EqualsButton />
        </div>

        {/* Clear button at bottom */}
        <div className="flex justify-center">
          <FunctionButton onClick={clear} className="w-16 sm:w-20 h-12 sm:h-14 text-sm sm:text-base">
            CLEAR
          </FunctionButton>
        </div>
        
      </div>
    </div>
  );
}