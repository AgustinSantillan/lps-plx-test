import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddWeeklyRecord } from './AddWeeklyRecord';
import { ActivityList } from './ActivityList';
import { useWeeklyPlanning } from '../../context/WeeklyPlanningContext';
import { formatDateShort } from '../../utils/dateUtils';
import type { WeeklyActivity } from './types';
import type { Task } from '../../types';

export function WeeklyPlanningBoard() {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const { state, deleteWeeklyPlan } = useWeeklyPlanning();
  const { plans } = state;

  const handleEditActivity = (planId: string) => {
    setEditingPlan(planId);
    setShowAddRecord(true);
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      deleteWeeklyPlan(planId);
    }
  };

  const convertTasksToActivities = (tasks: Task[]): WeeklyActivity[] => {
    return tasks.map((task, index) => ({
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planificación Semanal</h2>
          {plans.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Última actualización: {formatDateShort(new Date(plans[0].updated))}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setShowAddRecord(!showAddRecord);
            setEditingPlan(null);
          }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showAddRecord ? 'Ver planes' : 'Agregar Plan Semanal'}
        </button>
      </div>

      {showAddRecord ? (
        <AddWeeklyRecord
          onSave={() => {
            setShowAddRecord(false);
            setEditingPlan(null);
          }}
          editingPlanId={editingPlan}
        />
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white shadow rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Week {plan.weekNumber}, {plan.year}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {formatDateShort(new Date(plan.created))}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    PPC: {plan.ppc}%
                  </span>
                  <button
                    onClick={() => handleEditActivity(plan.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Edit plan"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                    title="Delete plan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <ActivityList
                activities={convertTasksToActivities(plan.tasks)}
                onEditActivity={() => handleEditActivity(plan.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}