import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Task } from '@/store/lineBalancingStore';

interface PrecedenceDiagramProps {
  tasks: Task[];
  stations?: Array<{ id: number; tasks: Task[] }>;
}

export const PrecedenceDiagram = ({ tasks, stations }: PrecedenceDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Crear un mapa de tarea a estación para colorear los nodos
  const taskToStation = useCallback(() => {
    const map = new Map<number, number>();
    if (stations) {
      stations.forEach(station => {
        station.tasks.forEach(task => {
          map.set(task.id, station.id);
        });
      });
    }
    return map;
  }, [stations]);

  // Función para obtener el color según la estación
  const getNodeColor = (taskId: number, stationMap: Map<number, number>) => {
    const stationId = stationMap.get(taskId);
    if (!stationId) return '#6366f1'; // indigo por defecto
    
    const colors = [
      '#ef4444', // red
      '#f59e0b', // amber
      '#10b981', // emerald
      '#3b82f6', // blue
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
    ];
    return colors[(stationId - 1) % colors.length];
  };

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const stationMap = taskToStation();

    // Calcular niveles para el layout jerárquico
    const levels = new Map<number, number>();
    const visited = new Set<number>();
    
    const calculateLevel = (taskId: number): number => {
      if (levels.has(taskId)) return levels.get(taskId)!;
      if (visited.has(taskId)) return 0; // Evitar ciclos
      
      visited.add(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return 0;
      
      if (task.precedences.length === 0) {
        levels.set(taskId, 0);
        return 0;
      }
      
      const maxPrecedenceLevel = Math.max(
        ...task.precedences.map(precId => calculateLevel(precId))
      );
      const level = maxPrecedenceLevel + 1;
      levels.set(taskId, level);
      return level;
    };

    // Calcular niveles para todas las tareas
    tasks.forEach(task => calculateLevel(task.id));

    // Agrupar tareas por nivel
    const tasksByLevel = new Map<number, Task[]>();
    tasks.forEach(task => {
      const level = levels.get(task.id) || 0;
      if (!tasksByLevel.has(level)) {
        tasksByLevel.set(level, []);
      }
      tasksByLevel.get(level)!.push(task);
    });

    // Crear nodos con posiciones calculadas
    const newNodes: Node[] = tasks.map(task => {
      const level = levels.get(task.id) || 0;
      const tasksInLevel = tasksByLevel.get(level) || [];
      const indexInLevel = tasksInLevel.findIndex(t => t.id === task.id);
      
      const verticalSpacing = 150;
      const horizontalSpacing = 200;
      const offsetY = (tasksInLevel.length - 1) * verticalSpacing / 2;
      
      return {
        id: task.id.toString(),
        type: 'default',
        data: { 
          label: (
            <div className="text-center">
              <div className="font-bold">{task.name}</div>
              <div className="text-xs">{task.time}s</div>
              {stations && (
                <div className="text-xs mt-1 opacity-75">
                  E{stationMap.get(task.id) || '?'}
                </div>
              )}
            </div>
          )
        },
        position: { 
          x: level * horizontalSpacing, 
          y: indexInLevel * verticalSpacing - offsetY
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          background: getNodeColor(task.id, stationMap),
          color: 'white',
          border: '2px solid #ffffff',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '100px',
          fontSize: '14px',
        },
      };
    });

    // Crear edges basados en precedencias
    const newEdges: Edge[] = [];
    tasks.forEach(task => {
      task.precedences.forEach(precId => {
        newEdges.push({
          id: `e${precId}-${task.id}`,
          source: precId.toString(),
          target: task.id.toString(),
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
          },
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [tasks, stations, setNodes, setEdges, taskToStation]);

  return (
    <div style={{ width: '100%', height: '500px' }} className="border rounded-lg bg-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.2}
        maxZoom={2}
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};


