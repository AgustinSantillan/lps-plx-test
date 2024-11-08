import React, { useState } from 'react';
import { Building, MapPin, Calendar, X } from 'lucide-react';
import type { Building as BuildingType } from '../../types';

interface BuildingFormProps {
  onSubmit: (building: Omit<BuildingType, 'id'>) => void;
  onCancel: () => void;
  initialData?: BuildingType;
}

export function BuildingForm({ onSubmit, onCancel, initialData }: BuildingFormProps) {
  const [formData, setFormData] = useState<Omit<BuildingType, 'id'>>({
    name: initialData?.name || '',
    location: initialData?.location || '',
    startDate: initialData?.startDate || '',
    expectedEndDate: initialData?.expectedEndDate || '',
    status: initialData?.status || 'planificación',
    progress: initialData?.progress || 0,
    imageUrl: initialData?.imageUrl || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BuildingType, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BuildingType, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es requerido';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    if (!formData.expectedEndDate) {
      newErrors.expectedEndDate = 'La fecha de finalización esperada es requerida';
    }
    if (formData.startDate && formData.expectedEndDate &&
      new Date(formData.startDate) > new Date(formData.expectedEndDate)) {
      newErrors.expectedEndDate = 'La fecha de finalización debe ser posterior a la fecha de inicio';
    }
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'El progreso debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Proyecto
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el nombre del Proyecto"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese la ubicación"
            />
          </div>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Inicio
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Finalización Estimada
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedEndDate: e.target.value }))}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.expectedEndDate && <p className="mt-1 text-sm text-red-600">{errors.expectedEndDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BuildingType['status'] }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="planificación">Planificación</option>
              <option value="en-progreso">En Progreso</option>
              <option value="completado">Completado</option>
              <option value="en-espera">En Espera</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Progreso (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData(prev => ({ ...prev, progress: Number(e.target.value) }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.progress && <p className="mt-1 text-sm text-red-600">{errors.progress}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL de la Imagen
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese la URL de la imagen"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {initialData ? 'Actualizar Proyecto' : 'Agregar Proyecto'}
          </button>
        </div>
      </form>
    </div>
  );
}