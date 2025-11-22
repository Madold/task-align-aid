import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings2, Info, ArrowRight } from 'lucide-react';
import { useLineBalancingStore, SecondaryRule } from '@/store/lineBalancingStore';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AssignmentRulesFormProps {
  onComplete: () => void;
  onBack: () => void;
}

interface RuleOption {
  id: SecondaryRule;
  label: string;
  description: string;
  icon: string;
}

const ruleOptions: RuleOption[] = [
  {
    id: 'mostFollowingTasks',
    label: 'Mayor número de tareas siguientes',
    description: 'Prioriza tareas que tienen más tareas dependientes. Útil para mantener el flujo del proceso.',
    icon: '🔗'
  },
  {
    id: 'longestTime',
    label: 'Mayor tiempo de ejecución',
    description: 'Prioriza tareas con mayor duración. Ayuda a evitar cuellos de botella en estaciones.',
    icon: '⏱️'
  }
];

export const AssignmentRulesForm = ({ onComplete, onBack }: AssignmentRulesFormProps) => {
  const { assignmentRulesConfig, setAssignmentRulesConfig } = useLineBalancingStore();
  const [enabledRules, setEnabledRules] = useState<SecondaryRule[]>(
    assignmentRulesConfig.enabledRules
  );

  const handleToggleRule = (ruleId: SecondaryRule) => {
    setEnabledRules(prev => {
      if (prev.includes(ruleId)) {
        return prev.filter(r => r !== ruleId);
      } else {
        return [...prev, ruleId];
      }
    });
  };

  const handleContinue = () => {
    setAssignmentRulesConfig({ enabledRules });
    onComplete();
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Configuración de Reglas de Asignación</CardTitle>
            <CardDescription>
              Seleccione las reglas secundarias para resolver empates en la asignación de tareas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Las <strong>reglas obligatorias</strong> (precedencia y tiempo de ciclo) siempre se aplican. 
            Las reglas secundarias se utilizan para resolver empates cuando múltiples tareas están disponibles.
            Si no selecciona ninguna regla secundaria, la asignación será completamente aleatoria cuando haya empates.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Reglas Secundarias</h3>
            <Badge variant="outline" className="text-sm">
              {enabledRules.length} de {ruleOptions.length} activas
            </Badge>
          </div>

          <div className="space-y-4">
            {ruleOptions.map((rule, index) => {
              const isEnabled = enabledRules.includes(rule.id);
              const position = enabledRules.indexOf(rule.id);
              
              return (
                <Card 
                  key={rule.id} 
                  className={`transition-all ${isEnabled ? 'border-primary/50 bg-primary/5' : 'border-muted'}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Checkbox
                          id={rule.id}
                          checked={isEnabled}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Label htmlFor={rule.id} className="text-base font-semibold cursor-pointer">
                            {rule.icon} {rule.label}
                          </Label>
                          {isEnabled && (
                            <Badge variant="default" className="text-xs">
                              Orden: {position + 1}°
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {enabledRules.length > 1 && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Orden de aplicación:</strong> Las reglas se aplicarán en el orden en que fueron seleccionadas.
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {enabledRules.map((ruleId, idx) => {
                  const rule = ruleOptions.find(r => r.id === ruleId);
                  return (
                    <div key={ruleId} className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {idx + 1}. {rule?.icon} {rule?.label}
                      </Badge>
                      {idx < enabledRules.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {enabledRules.length === 0 && (
          <Alert variant="destructive" className="bg-yellow-50 border-yellow-300">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-yellow-900">
              <strong>Advertencia:</strong> Sin reglas secundarias activas, todas las decisiones con empate se resolverán aleatoriamente.
              Esto puede resultar en diferentes balanceos en cada ejecución.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Volver
          </Button>
          <Button 
            onClick={handleContinue}
            className="flex-1 shadow-md"
            size="lg"
          >
            Calcular Balanceo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


