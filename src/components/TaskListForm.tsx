import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import { useLineBalancingStore, Task } from '@/store/lineBalancingStore';
import { Badge } from '@/components/ui/badge';

const taskSchema = z.object({
  name: z.string().min(1, 'Requerido').max(50, 'Máximo 50 caracteres'),
  time: z.coerce.number().min(0.1, 'Debe ser mayor a 0').max(10000, 'Valor muy alto'),
  precedences: z.string()
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskListFormProps {
  onComplete: () => void;
  onBack: () => void;
}

export const TaskListForm = ({ onComplete, onBack }: TaskListFormProps) => {
  const setTasks = useLineBalancingStore(state => state.setTasks);
  const [tasks, setTasksLocal] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(1);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      time: 0,
      precedences: ''
    }
  });

  const onSubmit = (data: TaskFormValues) => {
    const precedences = data.precedences
      .split(',')
      .map(p => parseInt(p.trim()))
      .filter(p => !isNaN(p) && p < nextId);

    const newTask: Task = {
      id: nextId,
      name: data.name,
      time: data.time,
      precedences
    };

    setTasksLocal([...tasks, newTask]);
    setNextId(nextId + 1);
    form.reset();
  };

  const removeTask = (id: number) => {
    setTasksLocal(tasks.filter(t => t.id !== id));
  };

  const loadExampleTasks = () => {
    const exampleTasks: Task[] = [
      { id: 1, name: 'Cortar material', time: 45, precedences: [] },
      { id: 2, name: 'Lijar piezas', time: 30, precedences: [1] },
      { id: 3, name: 'Perforar', time: 25, precedences: [1] },
      { id: 4, name: 'Pintar base', time: 40, precedences: [2, 3] },
      { id: 5, name: 'Ensamblar estructura', time: 50, precedences: [4] },
      { id: 6, name: 'Instalar componentes', time: 35, precedences: [5] },
      { id: 7, name: 'Inspección calidad', time: 20, precedences: [6] },
      { id: 8, name: 'Empaquetado', time: 25, precedences: [7] }
    ];
    setTasksLocal(exampleTasks);
    setNextId(9);
  };

  const handleComplete = () => {
    if (tasks.length === 0) return;
    setTasks(tasks);
    onComplete();
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Lista de Tareas</CardTitle>
            <CardDescription>Defina las tareas, tiempos y precedencias</CardDescription>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={loadExampleTasks}
            disabled={tasks.length > 0}
          >
            📋 Cargar Ejemplo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarea</FormLabel>
                    <FormControl>
                      <Input placeholder="A, B, C..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo (seg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precedences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precedencias (IDs)</FormLabel>
                    <FormControl>
                      <Input placeholder="1,2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Tarea
            </Button>
          </form>
        </Form>

        {tasks.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Tarea</TableHead>
                  <TableHead className="font-semibold">Tiempo (s)</TableHead>
                  <TableHead className="font-semibold">Precedencias</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.time}</TableCell>
                    <TableCell>
                      {task.precedences.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {task.precedences.map(p => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Ninguna</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(task.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Volver
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={tasks.length === 0}
            className="flex-1 shadow-md"
            size="lg"
          >
            Continuar a Reglas de Asignación
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
