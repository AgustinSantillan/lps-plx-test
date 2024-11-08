import { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { BuildingCard } from './components/buildings/BuildingCard';
import { WeeklyPlanningBoard } from './components/planning/WeeklyPlanningBoard';
import { WeeklyPlanningProvider } from './context/WeeklyPlanningContext';
import type { Building } from './types';

// Mock data for demonstration
const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Azure Heights Tower',
    location: 'Downtown Metro',
    startDate: '2024-01-15',
    expectedEndDate: '2025-06-30',
    status: 'en-progreso',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1577587230708-187fdbef4d91?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Emerald Plaza Complex',
    location: 'Business District',
    startDate: '2024-03-01',
    expectedEndDate: '2025-12-31',
    status: 'planeación',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Riverside Residences',
    location: 'Waterfront District',
    startDate: '2023-09-15',
    expectedEndDate: '2024-12-31',
    status: 'completado',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop'
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication logic
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (!selectedBuilding) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Proyectos de Construcción</h1>
            <div className="flex space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Todos los Proyectos</option>
                <option value="in-progress">En progreso</option>
                <option value="planning">Planeación</option>
                <option value="completed">Completado</option>
                <option value="on-hold">En espera</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {mockBuildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                onClick={handleBuildingSelect}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <WeeklyPlanningProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Volver a Proyectos
                </button>
                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                  {mockBuildings.find(b => b.id === selectedBuilding)?.name}
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <WeeklyPlanningBoard />
        </main>
      </div>
    </WeeklyPlanningProvider>
  );
}

export default App;