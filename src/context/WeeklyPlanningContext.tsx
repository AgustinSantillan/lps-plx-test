import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getWeekNumber } from '../utils/dateUtils';
import type { WeeklyPlan } from '../types';

interface WeeklyPlanningState {
  plans: WeeklyPlan[];
}

type WeeklyPlanningAction = 
  | { type: 'ADD_PLAN'; payload: WeeklyPlan }
  | { type: 'UPDATE_PLAN'; payload: WeeklyPlan }
  | { type: 'DELETE_PLAN'; payload: string }
  | { type: 'LOAD_PLANS'; payload: WeeklyPlan[] };

const WeeklyPlanningContext = createContext<{
  state: WeeklyPlanningState;
  addWeeklyPlan: (plan: Omit<WeeklyPlan, 'id'>) => void;
  updateWeeklyPlan: (plan: WeeklyPlan) => void;
  deleteWeeklyPlan: (id: string) => void;
} | undefined>(undefined);

const STORAGE_KEY = 'weeklyPlans';

function weeklyPlanningReducer(state: WeeklyPlanningState, action: WeeklyPlanningAction): WeeklyPlanningState {
  let newState: WeeklyPlanningState;

  switch (action.type) {
    case 'ADD_PLAN':
      newState = {
        ...state,
        plans: [action.payload, ...state.plans]
      };
      break;
    case 'UPDATE_PLAN':
      newState = {
        ...state,
        plans: state.plans.map(plan => 
          plan.id === action.payload.id ? action.payload : plan
        )
      };
      break;
    case 'DELETE_PLAN':
      newState = {
        ...state,
        plans: state.plans.filter(plan => plan.id !== action.payload)
      };
      break;
    case 'LOAD_PLANS':
      newState = {
        ...state,
        plans: action.payload
      };
      break;
    default:
      return state;
  }

  // Persist to localStorage after each state change
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState.plans));
  return newState;
}

export function WeeklyPlanningProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(weeklyPlanningReducer, { plans: [] });

  // Load plans from localStorage on initial mount
  useEffect(() => {
    const savedPlans = localStorage.getItem(STORAGE_KEY);
    if (savedPlans) {
      dispatch({ type: 'LOAD_PLANS', payload: JSON.parse(savedPlans) });
    }
  }, []);

  const addWeeklyPlan = (plan: Omit<WeeklyPlan, 'id'>) => {
    const currentDate = new Date();
    const newPlan: WeeklyPlan = {
      ...plan,
      id: crypto.randomUUID(),
      weekNumber: getWeekNumber(currentDate),
      year: currentDate.getFullYear(),
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    dispatch({ type: 'ADD_PLAN', payload: newPlan });
  };

  const updateWeeklyPlan = (plan: WeeklyPlan) => {
    dispatch({ type: 'UPDATE_PLAN', payload: { ...plan, updated: new Date().toISOString() } });
  };

  const deleteWeeklyPlan = (id: string) => {
    dispatch({ type: 'DELETE_PLAN', payload: id });
  };

  return (
    <WeeklyPlanningContext.Provider value={{ state, addWeeklyPlan, updateWeeklyPlan, deleteWeeklyPlan }}>
      {children}
    </WeeklyPlanningContext.Provider>
  );
}

export function useWeeklyPlanning() {
  const context = useContext(WeeklyPlanningContext);
  if (context === undefined) {
    throw new Error('useWeeklyPlanning must be used within a WeeklyPlanningProvider');
  }
  return context;
}