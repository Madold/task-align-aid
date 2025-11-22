import { useState, useEffect } from 'react';
import { ProjectConfigForm } from '@/components/ProjectConfigForm';
import { TaskListForm } from '@/components/TaskListForm';
import { AssignmentRulesForm } from '@/components/AssignmentRulesForm';
import { ResultsView } from '@/components/ResultsView';
import { ProgressStepper } from '@/components/ProgressStepper';
import { useLineBalancingStore } from '@/store/lineBalancingStore';
import { Factory } from 'lucide-react';

type Step = 'config' | 'tasks' | 'rules' | 'results';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('config');
  const calculateBalancing = useLineBalancingStore(state => state.calculateBalancing);
  const reset = useLineBalancingStore(state => state.reset);

  const handleConfigComplete = () => {
    setCurrentStep('tasks');
  };

  const handleTasksComplete = () => {
    setCurrentStep('rules');
  };

  const handleRulesComplete = () => {
    const success = calculateBalancing();
    if (success) {
      setCurrentStep('results');
    }
    // Si no fue exitoso, se queda en la pantalla de reglas
  };

  const handleReset = () => {
    reset();
    setCurrentStep('config');
  };

  const handleBackFromTasks = () => {
    setCurrentStep('config');
  };

  const handleBackFromRules = () => {
    setCurrentStep('tasks');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Factory className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sistema de Balanceo de Línea</h1>
              <p className="text-sm text-muted-foreground">Optimización de Procesos Productivos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Stepper */}
      {currentStep !== 'results' && <ProgressStepper currentStep={currentStep} />}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {currentStep === 'config' && (
          <div className="max-w-2xl mx-auto">
            <ProjectConfigForm onComplete={handleConfigComplete} />
          </div>
        )}
        
        {currentStep === 'tasks' && (
          <div className="max-w-4xl mx-auto">
            <TaskListForm onComplete={handleTasksComplete} onBack={handleBackFromTasks} />
          </div>
        )}
        
        {currentStep === 'rules' && (
          <div className="max-w-3xl mx-auto">
            <AssignmentRulesForm onComplete={handleRulesComplete} onBack={handleBackFromRules} />
          </div>
        )}
        
        {currentStep === 'results' && (
          <ResultsView onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Sistema de Balanceo de Línea - Metodología de 6 Pasos</p>
          <p className="mt-1">Optimización de Procesos Productivos con Algoritmo Heurístico</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
