import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: 'config' | 'tasks' | 'rules' | 'results';
}

interface Step {
  id: 'config' | 'tasks' | 'rules' | 'results';
  label: string;
  number: number;
}

const steps: Step[] = [
  { id: 'config', label: 'Configuración', number: 1 },
  { id: 'tasks', label: 'Tareas', number: 2 },
  { id: 'rules', label: 'Reglas', number: 3 },
  { id: 'results', label: 'Resultados', number: 4 },
];

export const ProgressStepper = ({ currentStep }: ProgressStepperProps) => {
  const currentStepNumber = steps.find(s => s.id === currentStep)?.number || 1;

  return (
    <div className="w-full py-6 px-4 bg-card border-b">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStepNumber;
            const isCurrent = step.id === currentStep;
            const isUpcoming = step.number > currentStepNumber;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all
                      ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                      ${isCurrent ? 'bg-primary border-primary text-primary-foreground scale-110' : ''}
                      ${isUpcoming ? 'bg-muted border-muted-foreground/30 text-muted-foreground' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`
                      text-sm mt-2 font-medium text-center
                      ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-0.5 flex-1 mx-2 transition-all
                      ${step.number < currentStepNumber ? 'bg-primary' : 'bg-muted'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


