import { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { BuildingCard } from './components/buildings/BuildingCard';
import { BuildingForm } from './components/buildings/BuildingForm';
import { WeeklyPlanningBoard } from './components/planning/WeeklyPlanningBoard';
import { WeeklyPlanningProvider } from './context/WeeklyPlanningContext';
import { BuildingProvider, useBuildings } from './context/BuildingContext';
import { Plus, Search } from 'lucide-react';
import type { Building } from './types';

function BuildingList() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Building['status'] | 'all'>('all');
  const { state, addBuilding, updateBuilding, deleteBuilding } = useBuildings();

  const handleLogin = (email: string, password: string) => {
    if (email && password) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setSelectedBuilding(null);
  };

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
  };

  const handleAddBuilding = (buildingData: Omit<Building, 'id'>) => {
    addBuilding(buildingData);
    setShowAddForm(false);
  };

  const handleUpdateBuilding = (buildingData: Omit<Building, 'id'>) => {
    if (editingBuilding) {
      updateBuilding({ ...buildingData, id: editingBuilding.id });
      setEditingBuilding(null);
    }
  };

  const handleDeleteBuilding = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      deleteBuilding(id);
    }
  };

  const filteredBuildings = state.buildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || building.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (!selectedBuilding) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-8">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-3xl font-bold text-gray-900">Proyectos de Construcción</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Proyecto
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Building['status'] | 'all')}
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Todos los proyectos</option>
              <option value="in-progress">En Progreso</option>
              <option value="planning">Planificación</option>
              <option value="completed">Completado</option>
              <option value="on-hold">En Espera</option>
            </select>
          </div>

          {showAddForm && (
            <div className="mb-6">
              <BuildingForm
                onSubmit={handleAddBuilding}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {editingBuilding && (
            <div className="mb-6">
              <BuildingForm
                initialData={editingBuilding}
                onSubmit={handleUpdateBuilding}
                onCancel={() => setEditingBuilding(null)}
              />
            </div>
          )}

          <div className="space-y-4">
            {filteredBuildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                onClick={handleBuildingSelect}
                onEdit={handleUpdateBuilding}
                onDelete={handleDeleteBuilding}
              />
            ))}
            {filteredBuildings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron proyectos que coincidan con tus criterios.</p>
              </div>
            )}
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
                  {state.buildings.find(b => b.id === selectedBuilding)?.name}
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cerrar Sesión
              </button>
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

function App() {
  return (
    <BuildingProvider>
      <BuildingList />
    </BuildingProvider>
  );
}

export default App;