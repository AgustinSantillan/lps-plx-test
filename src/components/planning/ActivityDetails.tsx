import { X, Edit2 } from 'lucide-react';
import type { WeeklyActivity } from './types';

interface ActivityDetailsProps {
  activity: WeeklyActivity;
  onClose: () => void;
  onEdit: () => void;
}

export function ActivityDetails({ activity, onClose, onEdit }: ActivityDetailsProps) {
  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-medium text-gray-900">Detalles de la Actividad</h4>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit2 className="w-4 h-4 mr-1.5" />
            Editar
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center p-1.5 border border-transparent rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Información Básica</h5>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Zona</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.zone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Subzona</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.subZone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Empresa</dt>
              <dd className="mt-1 text-sm text-gray-900">{activity.company}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Horario y Estado</h5>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Horario Semanal</dt>
              <dd className="mt-1">
                <div className="flex space-x-2">
                  {Object.entries(activity.weekDays).map(([day, isScheduled]) => (
                    <div
                      key={day}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${isScheduled
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado PPC</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.ppc === 'S'
                    ? 'bg-green-100 text-green-800'
                    : activity.ppc === 'N'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {activity.ppc === 'S'
                    ? 'Compliant'
                    : activity.ppc === 'N'
                      ? 'Non-compliant'
                      : 'Pending'}
                </span>
              </dd>
            </div>
            {activity.ppc === 'N' && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID de No Conformidad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{activity.ncId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Razón de No Conformidad
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{activity.ncReason}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}