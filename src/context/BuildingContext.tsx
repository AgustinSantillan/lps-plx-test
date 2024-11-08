import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Building } from '../types';

interface BuildingState {
  buildings: Building[];
  isLoading: boolean;
  error: string | null;
}

type BuildingAction = 
  | { type: 'ADD_BUILDING'; payload: Building }
  | { type: 'UPDATE_BUILDING'; payload: Building }
  | { type: 'DELETE_BUILDING'; payload: string }
  | { type: 'SET_BUILDINGS'; payload: Building[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const BuildingContext = createContext<{
  state: BuildingState;
  addBuilding: (building: Omit<Building, 'id'>) => void;
  updateBuilding: (building: Building) => void;
  deleteBuilding: (id: string) => void;
} | undefined>(undefined);

const STORAGE_KEY = 'buildings';

function buildingReducer(state: BuildingState, action: BuildingAction): BuildingState {
  switch (action.type) {
    case 'ADD_BUILDING':
      return {
        ...state,
        buildings: [action.payload, ...state.buildings]
      };
    case 'UPDATE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.map(building => 
          building.id === action.payload.id ? action.payload : building
        )
      };
    case 'DELETE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.filter(building => building.id !== action.payload)
      };
    case 'SET_BUILDINGS':
      return {
        ...state,
        buildings: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}

export function BuildingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(buildingReducer, {
    buildings: [],
    isLoading: false,
    error: null
  });

  useEffect(() => {
    const loadBuildings = () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const savedBuildings = localStorage.getItem(STORAGE_KEY);
        if (savedBuildings) {
          dispatch({ type: 'SET_BUILDINGS', payload: JSON.parse(savedBuildings) });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load buildings' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadBuildings();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.buildings));
  }, [state.buildings]);

  const addBuilding = (building: Omit<Building, 'id'>) => {
    const newBuilding: Building = {
      ...building,
      id: crypto.randomUUID()
    };
    dispatch({ type: 'ADD_BUILDING', payload: newBuilding });
  };

  const updateBuilding = (building: Building) => {
    dispatch({ type: 'UPDATE_BUILDING', payload: building });
  };

  const deleteBuilding = (id: string) => {
    dispatch({ type: 'DELETE_BUILDING', payload: id });
  };

  return (
    <BuildingContext.Provider value={{ state, addBuilding, updateBuilding, deleteBuilding }}>
      {children}
    </BuildingContext.Provider>
  );
}

export function useBuildings() {
  const context = useContext(BuildingContext);
  if (context === undefined) {
    throw new Error('useBuildings must be used within a BuildingProvider');
  }
  return context;
}