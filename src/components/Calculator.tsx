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
        w-14 h-14 rounded-full text-white font-bold text-lg
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
        w-16 h-16 rounded-full text-white font-bold text-xl
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
    className = ''
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    variant: 'multiply' | 'divide' | 'subtract' | 'add';
    className?: string;
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
          text-white text-3xl font-bold
          transition-all duration-300 ease-out
          active:scale-95 hover:scale-105
          border-2 border-white/20
          ${className}
        `}
        style={{ 
          backgroundColor: getColor(),
          boxShadow: 'var(--shadow-neumorphism)'
        }}
      >
        {children}
      </Button>
    );
  };

  // Equals Button Component (Pink, Floating)
  const EqualsButton = () => (
    <Button
      onClick={handleEquals}
      className="
        w-16 h-16 rounded-full text-white font-bold text-2xl
        transition-all duration-300 ease-out
        active:scale-95 hover:scale-110
        animate-float shadow-float
        absolute right-8 bottom-32
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
      <div className="w-full max-w-sm mx-auto px-6 py-8 relative">
        
        {/* Large Display at Top */}
        <div className="mb-12 mt-8">
          <div className="bg-calc-display rounded-3xl p-8 neumorphism">
            <div className="text-right">
              <div 
                className="font-bold drop-shadow-sm"
                style={{ 
                  fontSize: display.length > 8 ? '2.5rem' : display.length > 5 ? '3.5rem' : '4.5rem',
                  lineHeight: '1.1',
                  color: 'hsl(var(--calc-display-text))'
                }}
              >
                {display}
              </div>
              {previousValue !== null && operation && (
                <div className="text-lg opacity-60 mt-2">
                  {previousValue} {operation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Function Buttons Row */}
        <div className="flex justify-center gap-4 mb-12">
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

        {/* Circular Number Pad with Central Operations */}
        <div className="relative w-80 h-80 mx-auto mb-16">
          
          {/* Central Cross with Four Operations */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              
              {/* Top-left: Multiply (Blue) */}
              <OperationButton
                onClick={() => performOperation('×')}
                variant="multiply"
                className="absolute top-0 left-0 w-16 h-16 rounded-tl-full"
              >
                ×
              </OperationButton>
              
              {/* Top-right: Divide (Yellow) */}
              <OperationButton
                onClick={() => performOperation('÷')}
                variant="divide"
                className="absolute top-0 right-0 w-16 h-16 rounded-tr-full"
              >
                ÷
              </OperationButton>
              
              {/* Bottom-left: Subtract (Orange) */}
              <OperationButton
                onClick={() => performOperation('-')}
                variant="subtract"
                className="absolute bottom-0 left-0 w-16 h-16 rounded-bl-full"
              >
                −
              </OperationButton>
              
              {/* Bottom-right: Add (Green) */}
              <OperationButton
                onClick={() => performOperation('+')}
                variant="add"
                className="absolute bottom-0 right-0 w-16 h-16 rounded-br-full"
              >
                +
              </OperationButton>
              
            </div>
          </div>

          {/* Numbers arranged in perfect circle with equal angular spacing */}
          {Array.from({ length: 10 }, (_, i) => {
            const number = i; // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
            // Start with 0 at top (-90 degrees) and go clockwise
            const angle = (i * 36 - 90) * (Math.PI / 180); // 36 degrees between each number
            const radius = 140; // Distance from center
            const centerX = 160; // Half of container width (320px / 2)
            const centerY = 160; // Half of container height (320px / 2)
            
            // Calculate position using trigonometry
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            return (
              <div
                key={number}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
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
        <div className="flex justify-center gap-8 mb-8">
          <FunctionButton onClick={() => {}}>
            (
          </FunctionButton>
          <NumberButton onClick={inputDot} className="text-3xl">
            .
          </NumberButton>
          <FunctionButton onClick={() => {}}>
            )
          </FunctionButton>
        </div>

        {/* Clear button at bottom */}
        <div className="flex justify-center">
          <FunctionButton onClick={clear} className="w-20 h-14">
            CLEAR
          </FunctionButton>
        </div>

        {/* Floating Equals Button */}
        <EqualsButton />
        
      </div>
    </div>
  );
}