import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLineBalancingStore } from '@/store/lineBalancingStore';
import { BarChart3, Clock, Target, TrendingUp, RotateCcw, Network } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PrecedenceDiagram } from '@/components/PrecedenceDiagram';

interface ResultsViewProps {
  onReset: () => void;
}

export const ResultsView = ({ onReset }: ResultsViewProps) => {
  const { results, assignmentSteps, stations, projectConfig, tasks } = useLineBalancingStore();

  if (!results || !projectConfig) return null;

  const getEfficiencyColor = () => {
    if (results.efficiency < 60) return 'bg-destructive';
    if (results.efficiency <= 90) return 'bg-warning';
    return 'bg-success';
  };

  const getEfficiencyBadgeVariant = () => {
    if (results.efficiency < 60) return 'destructive';
    if (results.efficiency <= 90) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{projectConfig.projectName}</CardTitle>
              <CardDescription className="text-base">
                Análisis de Balanceo de Línea Completado
              </CardDescription>
            </div>
            <Button onClick={onReset} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Precedence Diagram */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <CardTitle>Diagrama de Precedencia</CardTitle>
          </div>
          <CardDescription>
            Visualización gráfica de las relaciones de precedencia entre tareas. Los colores indican la estación asignada.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PrecedenceDiagram tasks={tasks} stations={stations} />
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiempo de Ciclo</p>
                <p className="text-2xl font-bold">{results.cycleTime.toFixed(2)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-accent/30">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estaciones Teóricas</p>
                <p className="text-2xl font-bold">{results.theoreticalStations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estaciones Reales</p>
                <p className="text-2xl font-bold">{results.actualStations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-2 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${getEfficiencyColor()}/20`}>
                <TrendingUp className={`h-6 w-6 ${getEfficiencyColor().replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eficiencia</p>
                <p className="text-2xl font-bold">{results.efficiency.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Classification */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Clasificación de Eficiencia</h3>
                <Badge variant={getEfficiencyBadgeVariant()} className="mt-2 text-sm px-3 py-1">
                  {results.efficiencyClassification}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{results.efficiency.toFixed(2)}%</p>
              </div>
            </div>
            <Progress value={results.efficiency} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0% - Insatisfactoria</span>
              <span>60% - Satisfactoria</span>
              <span>90% - Sobresaliente</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Steps Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
          <CardTitle>Proceso de Asignación Secuencial</CardTitle>
          <CardDescription>
            Detalle paso a paso de la asignación de tareas a estaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Estación</TableHead>
                  <TableHead className="font-semibold">Tarea</TableHead>
                  <TableHead className="font-semibold">Tiempo Tarea (s)</TableHead>
                  <TableHead className="font-semibold">Tiempo Restante (s)</TableHead>
                  <TableHead className="font-semibold">Justificación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentSteps.map((step, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <Badge variant="outline">E{step.stationId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{step.taskName}</TableCell>
                    <TableCell>{step.taskTime.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={step.remainingTime < results.cycleTime * 0.2 ? 'text-warning font-semibold' : ''}>
                        {step.remainingTime.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md">
                      {step.justification}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stations Summary */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
          <CardTitle>Conformación Final de Estaciones</CardTitle>
          <CardDescription>
            Distribución de tareas y carga de trabajo por estación
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map(station => {
              const utilizationPercent = (station.totalTime / results.cycleTime) * 100;
              return (
                <Card key={station.id} className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Estación {station.id}</span>
                      <Badge variant={utilizationPercent > 90 ? 'default' : 'secondary'}>
                        {utilizationPercent.toFixed(1)}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tiempo Total:</span>
                        <span className="font-semibold">{station.totalTime.toFixed(2)}s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tiempo Ocioso:</span>
                        <span className="font-semibold">{station.remainingTime.toFixed(2)}s</span>
                      </div>
                    </div>
                    <Progress value={utilizationPercent} className="h-2" />
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Tareas asignadas:</p>
                      <div className="flex flex-wrap gap-1">
                        {station.tasks.map(task => (
                          <Badge key={task.id} variant="outline" className="text-xs">
                            {task.name} ({task.time}s)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
