import { create } from 'zustand';

export interface Task {
  id: number;
  name: string;
  time: number;
  precedences: number[];
}

export interface ProjectConfig {
  projectName: string;
  productionTimePerDay: number; // in minutes
  requiredProductionPerDay: number;
}

export interface Station {
  id: number;
  tasks: Task[];
  totalTime: number;
  remainingTime: number;
}

export interface AssignmentStep {
  stationId: number;
  taskId: number;
  taskName: string;
  taskTime: number;
  remainingTime: number;
  justification: string;
}

export interface CalculatedResults {
  totalTaskTime: number;
  cycleTime: number;
  theoreticalStations: number;
  actualStations: number;
  efficiency: number;
  efficiencyClassification: 'Insatisfactoria' | 'Satisfactoria' | 'Sobresaliente';
}

interface LineBalancingState {
  projectConfig: ProjectConfig | null;
  tasks: Task[];
  assignmentSteps: AssignmentStep[];
  stations: Station[];
  results: CalculatedResults | null;
  
  setProjectConfig: (config: ProjectConfig) => void;
  setTasks: (tasks: Task[]) => void;
  calculateBalancing: () => void;
  reset: () => void;
}

export const useLineBalancingStore = create<LineBalancingState>((set, get) => ({
  projectConfig: null,
  tasks: [],
  assignmentSteps: [],
  stations: [],
  results: null,

  setProjectConfig: (config) => set({ projectConfig: config }),
  
  setTasks: (tasks) => set({ tasks }),

  calculateBalancing: () => {
    const { projectConfig, tasks } = get();
    if (!projectConfig || tasks.length === 0) return;

    // Step 1: Calculate total task time
    const totalTaskTime = tasks.reduce((sum, task) => sum + task.time, 0);

    // Step 2: Calculate Cycle Time (C) - convert production time to seconds
    const cycleTime = (projectConfig.productionTimePerDay * 60) / projectConfig.requiredProductionPerDay;

    // Step 3: Calculate Theoretical Number of Stations (WT) - round up
    const theoreticalStations = Math.ceil(totalTaskTime / cycleTime);

    // Steps 4/5: Assignment Algorithm
    const stations: Station[] = [];
    const assignmentSteps: AssignmentStep[] = [];
    const assignedTasks = new Set<number>();
    let currentStation: Station = {
      id: 1,
      tasks: [],
      totalTime: 0,
      remainingTime: cycleTime
    };

    const getAvailableTasks = () => {
      return tasks.filter(task => {
        if (assignedTasks.has(task.id)) return false;
        const precedencesMet = task.precedences.every(precId => assignedTasks.has(precId));
        const fitsInStation = task.time <= currentStation.remainingTime;
        return precedencesMet && fitsInStation;
      });
    };

    const countFollowingTasks = (taskId: number): number => {
      return tasks.filter(t => t.precedences.includes(taskId)).length;
    };

    const selectTask = (availableTasks: Task[]): { task: Task; justification: string } => {
      if (availableTasks.length === 0) throw new Error('No available tasks');
      if (availableTasks.length === 1) {
        return { task: availableTasks[0], justification: 'Única tarea disponible' };
      }

      // Rule 1: Most following tasks
      const maxFollowing = Math.max(...availableTasks.map(t => countFollowingTasks(t.id)));
      let candidates = availableTasks.filter(t => countFollowingTasks(t.id) === maxFollowing);
      
      if (candidates.length === 1) {
        return { task: candidates[0], justification: `Mayor número de tareas siguientes (${maxFollowing})` };
      }

      // Rule 2: Longest time
      const maxTime = Math.max(...candidates.map(t => t.time));
      candidates = candidates.filter(t => t.time === maxTime);

      if (candidates.length === 1) {
        return { task: candidates[0], justification: `Mayor tiempo de ejecución (${maxTime}s) tras empate en tareas siguientes` };
      }

      // Random selection
      const selectedTask = candidates[Math.floor(Math.random() * candidates.length)];
      return { task: selectedTask, justification: 'Selección aleatoria tras empate múltiple' };
    };

    // Assign tasks
    while (assignedTasks.size < tasks.length) {
      const availableTasks = getAvailableTasks();
      
      if (availableTasks.length === 0) {
        // Close current station and open new one
        stations.push({ ...currentStation });
        currentStation = {
          id: stations.length + 1,
          tasks: [],
          totalTime: 0,
          remainingTime: cycleTime
        };
        continue;
      }

      const { task, justification } = selectTask(availableTasks);
      
      // Assign task to station
      currentStation.tasks.push(task);
      currentStation.totalTime += task.time;
      currentStation.remainingTime -= task.time;
      assignedTasks.add(task.id);

      assignmentSteps.push({
        stationId: currentStation.id,
        taskId: task.id,
        taskName: task.name,
        taskTime: task.time,
        remainingTime: currentStation.remainingTime,
        justification
      });
    }

    // Add last station
    if (currentStation.tasks.length > 0) {
      stations.push(currentStation);
    }

    // Step 6: Calculate Efficiency
    const actualStations = stations.length;
    const efficiency = (totalTaskTime / (actualStations * cycleTime)) * 100;
    
    let efficiencyClassification: 'Insatisfactoria' | 'Satisfactoria' | 'Sobresaliente';
    if (efficiency < 60) {
      efficiencyClassification = 'Insatisfactoria';
    } else if (efficiency <= 90) {
      efficiencyClassification = 'Satisfactoria';
    } else {
      efficiencyClassification = 'Sobresaliente';
    }

    set({
      stations,
      assignmentSteps,
      results: {
        totalTaskTime,
        cycleTime,
        theoreticalStations,
        actualStations,
        efficiency,
        efficiencyClassification
      }
    });
  },

  reset: () => set({
    projectConfig: null,
    tasks: [],
    assignmentSteps: [],
    stations: [],
    results: null
  })
}));
