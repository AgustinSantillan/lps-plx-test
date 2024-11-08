import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Save, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useWeeklyPlanning } from '../../context/WeeklyPlanningContext';
import { getWeekNumber, getWeekStartDate, formatDate } from '../../utils/dateUtils';
import { ImageModal } from '../common/ImageModal';
import type { WeeklyActivity } from './types';
import type { Task, WeeklyPlan } from '../../types';

const ZONES = ['BAJO RASANTE -1', 'PASTILLA 5', 'PASTILLA 4', 'PASTILLA 3'];
const SUB_ZONES = ['ZONA A', 'ZONA B', 'ZONA C', 'ZONA D', 'ZONA E'];
const COMPANIES = ['SANCHEZ-BARBANSO', 'DIM', 'TIMPER', 'CONSTRUX'];
const WEEK_DAYS = ['L', 'M', 'X', 'J', 'V', 'S'];

interface AddWeeklyRecordProps {
  onSave: () => void;
  editingPlanId?: string | null;
}

export function AddWeeklyRecord({ onSave, editingPlanId }: AddWeeklyRecordProps) {
  const { addWeeklyPlan, state, updateWeeklyPlan } = useWeeklyPlanning();
  const [activities, setActivities] = useState<WeeklyActivity[]>([]);
  const [reportImage, setReportImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const currentWeek = getWeekNumber(new Date());
  const currentYear = new Date().getFullYear();
  const weekStartDate = getWeekStartDate(new Date());

  useEffect(() => {
    if (editingPlanId) {
      const planToEdit = state.plans.find(plan => plan.id === editingPlanId);
      if (planToEdit) {
        const existingActivities: WeeklyActivity[] = planToEdit.tasks.map((task, index) => ({
          id: index + 1,
          description: task.description,
          zone: task.area,
          subZone: '',
          company: task.team,
          weekDays: {
            L: false,
            M: false,
            X: false,
            J: false,
            V: false,
            S: false
          },
          ppc: task.status === 'completed' ? 'S' : task.status === 'blocked' ? 'N' : '',
          ncId: '',
          ncReason: task.constraints.join(', ')
        }));
        setActivities(existingActivities);
        if (planToEdit.reportImage) {
          setReportImage(planToEdit.reportImage);
        }
      }
    }
  }, [editingPlanId, state.plans]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setReportImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReportImage(null);
  };

  const addNewActivity = () => {
    const newActivity: WeeklyActivity = {
      id: activities.length + 1,
      description: '',
      zone: '',
      subZone: '',
      company: '',
      weekDays: WEEK_DAYS.reduce((acc, day) => ({ ...acc, [day]: false }), {}),
      ppc: '',
      ncId: '',
      ncReason: ''
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (index: number, field: keyof WeeklyActivity, value: any) => {
    setActivities(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const toggleWeekDay = (index: number, day: string) => {
    setActivities(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        weekDays: {
          ...updated[index].weekDays,
          [day]: !updated[index].weekDays[day]
        }
      };
      return updated;
    });
  };

  const removeActivity = (index: number) => {
    setActivities(prev => prev.filter((_, i) => i !== index));
  };

  const calculatePPCPercentage = () => {
    const completedActivities = activities.filter(a => a.ppc === 'S').length;
    return activities.length ? Math.round((completedActivities / activities.length) * 100) : 0;
  };

  const handleSave = () => {
    const tasks: Task[] = activities.map((activity, index) => ({
      id: String(index + 1),
      description: activity.description,
      area: activity.zone,
      team: activity.company,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: activity.ppc === 'S' ? 'completed' : activity.ppc === 'N' ? 'blocked' : 'pending',
      constraints: activity.ncReason ? [activity.ncReason] : [],
      assignedTo: [],
      images: []
    }));

    const ppc = calculatePPCPercentage();
    const now = new Date().toISOString();

    if (editingPlanId) {
      const existingPlan = state.plans.find(plan => plan.id === editingPlanId);
      if (existingPlan) {
        updateWeeklyPlan({
          ...existingPlan,
          tasks,
          ppc,
          updated: now,
          reportImage: reportImage || undefined
        });
      }
    } else {
      const newPlan: Omit<WeeklyPlan, 'id'> = {
        buildingId: '1',
        weekNumber: currentWeek,
        year: currentYear,
        tasks,
        ppc,
        created: now,
        updated: now,
        reportImage: reportImage || undefined
      };
      addWeeklyPlan(newPlan);
    }

    onSave();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {editingPlanId ? 'Editar Planificación Semanal' : 'Nueva Planificación Semanal'}
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">
              Semana {currentWeek} • {formatDate(weekStartDate)}
            </span>
          </div>
          <div className="flex space-x-4">
            <label className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 cursor-pointer">
              <ImageIcon className="w-4 h-4 mr-2" />
              {reportImage ? 'Cambiar Imagen del Reporte' : 'Agregar Imagen al Reporte'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={addNewActivity}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Actividad
            </button>
          </div>
        </div>

        {reportImage && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Report Image</h3>
              <button
                onClick={removeImage}
                className="p-1 text-red-600 hover:text-red-800"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <img
              src={reportImage}
              alt="Weekly report"
              className="w-full max-h-48 object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(reportImage)}
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subzona</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              {WEEK_DAYS.map(day => (
                <th key={day} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</th>
              ))}
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PPC</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID N.C.</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razón de No Conformidad</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <tr key={activity.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{activity.id}</td>
                <td className="px-3 py-4">
                  <input
                    type="text"
                    value={activity.description}
                    onChange={(e) => updateActivity(index, 'description', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description"
                  />
                </td>
                <td className="px-3 py-4">
                  <select
                    value={activity.zone}
                    onChange={(e) => updateActivity(index, 'zone', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    {ZONES.map(zone => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4">
                  <select
                    value={activity.subZone}
                    onChange={(e) => updateActivity(index, 'subZone', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    {SUB_ZONES.map(subZone => (
                      <option key={subZone} value={subZone}>{subZone}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4">
                  <select
                    value={activity.company}
                    onChange={(e) => updateActivity(index, 'company', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    {COMPANIES.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </td>
                {WEEK_DAYS.map(day => (
                  <td key={day} className="px-3 py-4 text-center">
                    <button
                      onClick={() => toggleWeekDay(index, day)}
                      className={`w-6 h-6 rounded ${activity.weekDays[day]
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                      X
                    </button>
                  </td>
                ))}
                <td className="px-3 py-4 text-center">
                  <select
                    value={activity.ppc}
                    onChange={(e) => updateActivity(index, 'ppc', e.target.value)}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                  </select>
                </td>
                <td className="px-3 py-4">
                  <input
                    type="text"
                    value={activity.ncId}
                    onChange={(e) => updateActivity(index, 'ncId', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ID"
                  />
                </td>
                <td className="px-3 py-4">
                  <input
                    type="text"
                    value={activity.ncReason}
                    onChange={(e) => updateActivity(index, 'ncReason', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Reason"
                  />
                </td>
                <td className="px-3 py-4">
                  <button
                    onClick={() => removeActivity(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingPlanId ? 'Actualizar Planificación' : 'Guardar Planificación'}
        </button>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}