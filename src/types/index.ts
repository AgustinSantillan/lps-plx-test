export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'contractor';
}

export interface Building {
  id: string;
  name: string;
  location: string;
  startDate: string;
  expectedEndDate: string;
  status: "planificación" | "en-progreso" | "completado" | "en-espera"
  progress: number;
  imageUrl: string;
}

export interface WeeklyPlan {
  id: string;
  buildingId: string;
  weekNumber: number;
  year: number;
  tasks: Task[];
  ppc: number; // Percent Plan Complete
  created: string;
  updated: string;
  reportImage?: string; // Optional base64 encoded image for the entire report
}

export interface Task {
  id: string;
  description: string;
  area: string;
  team: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  constraints: string[];
  assignedTo: string[];
  images: string[];
}