import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLineBalancingStore, ProjectConfig } from '@/store/lineBalancingStore';

const projectConfigSchema = z.object({
  projectName: z.string().min(1, 'El nombre del proyecto es requerido').max(100, 'Máximo 100 caracteres'),
  productionTimePerDay: z.coerce.number().min(1, 'Debe ser mayor a 0').max(1440, 'Máximo 1440 minutos (24 horas)'),
  requiredProductionPerDay: z.coerce.number().min(1, 'Debe ser mayor a 0').max(100000, 'Valor muy alto')
});

type ProjectConfigFormValues = z.infer<typeof projectConfigSchema>;

interface ProjectConfigFormProps {
  onComplete: () => void;
}

export const ProjectConfigForm = ({ onComplete }: ProjectConfigFormProps) => {
  const setProjectConfig = useLineBalancingStore(state => state.setProjectConfig);

  const form = useForm<ProjectConfigFormValues>({
    resolver: zodResolver(projectConfigSchema),
    defaultValues: {
      projectName: '',
      productionTimePerDay: 480,
      requiredProductionPerDay: 100
    }
  });

  const onSubmit = (data: ProjectConfigFormValues) => {
    const config: ProjectConfig = {
      projectName: data.projectName,
      productionTimePerDay: data.productionTimePerDay,
      requiredProductionPerDay: data.requiredProductionPerDay
    };
    setProjectConfig(config);
    onComplete();
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <CardTitle className="text-2xl">Configuración del Proyecto</CardTitle>
        <CardDescription>Ingrese los parámetros básicos de producción</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Línea de Ensamble A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productionTimePerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo de Producción por Día (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="480" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tiempo disponible para producción (ej: 480 min = 8 horas)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredProductionPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producción Requerida por Día (unidades)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número de unidades a producir por día
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full shadow-md" size="lg">
              Continuar a Lista de Tareas
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
