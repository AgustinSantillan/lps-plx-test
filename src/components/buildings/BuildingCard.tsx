import React from 'react';
import { Calendar, MapPin, Clock, Edit2, Trash2 } from 'lucide-react';
import type { Building as BuildingType } from '../../types';

interface BuildingCardProps {
  building: BuildingType;
  onClick: (id: string) => void;
  onEdit: (building: BuildingType) => void;
  onDelete: (id: string) => void;
}

export function BuildingCard({ building, onClick, onEdit, onDelete }: BuildingCardProps) {
  const getStatusColor = (status: BuildingType['status']) => {
    const colors = {
      'en-progreso': 'bg-amber-50 text-amber-700 border-amber-200',
      'planificación': 'bg-blue-50 text-blue-700 border-blue-200',
      'completado': 'bg-green-50 text-green-700 border-green-200',
      'en-espera': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Datos no disponibles';
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(building);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(building.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(building.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(building.id);
        }
      }}
      className="w-full bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mb-4 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      aria-label={`Building: ${building.name}`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 h-48 md:h-auto">
          <img
            src={building.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop'}
            alt={building.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {building.name}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    {building.location || 'Ubicación no disponible'}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    Fecha de Inicio: {formatDate(building.startDate)}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    Fecha de Finalización Estimada: {formatDate(building.expectedEndDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start">
              <div className="flex items-center space-x-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(building.status)}`}>
                  {building.status.replace('-', ' ').charAt(0).toUpperCase() + building.status.slice(1)}
                </span>
                <button
                  onClick={handleEdit}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  aria-label="Editar Proyecto"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-400 hover:text-red-600"
                  aria-label="Eliminar Proyecto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 w-full max-w-[200px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Progreso</span>
                  <span className="text-xs font-medium text-gray-700">{building.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${building.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}