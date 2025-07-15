import Calculator from '@/components/Calculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Calculator</h1>
        <p className="text-muted-foreground mb-8">Modern calculator app</p>
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
