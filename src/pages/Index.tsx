import Calculator from '@/components/Calculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1 text-foreground">Calculator</h1>
          <p className="text-muted-foreground text-sm">Modern calculator app</p>
        </div>
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
