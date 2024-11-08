import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Edit2, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import type { WeeklyActivity } from './types';
import { ActivityDetails } from './ActivityDetails';
import { ImageModal } from '../../common/ImageModal';

interface ActivityListProps {
    activities: WeeklyActivity[];
    onEditActivity: (activity: WeeklyActivity) => void;
    images?: string[];
}

export function ActivityList({ activities, onEditActivity, images = [] }: ActivityListProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const itemsPerPage = 10;

    const filteredActivities = activities.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedActivities = filteredActivities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

    const getStatusColor = (ppc: 'S' | 'N' | '') => {
        switch (ppc) {
            case 'S':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'N':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const renderActivitySummary = (activity: WeeklyActivity) => {
        const isExpanded = expandedId === activity.id;

        return (
            <div
                key={activity.id}
                className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setExpandedId(isExpanded ? null : activity.id);
                        }
                    }}
                    className="p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {activity.description}
                                </h3>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                        activity.ppc
                                    )}`}
                                >
                                    {activity.ppc === 'S' ? (
                                        <div className="flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Cumplido
                                        </div>
                                    ) : activity.ppc === 'N' ? (
                                        <div className="flex items-center">
                                            <XCircle className="w-4 h-4 mr-1" />
                                            No cumplido
                                        </div>
                                    ) : (
                                        'Pending'
                                    )}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Zona:</span> {activity.zone}
                                </div>
                                <div>
                                    <span className="font-medium">Subzona:</span> {activity.subZone}
                                </div>
                                <div>
                                    <span className="font-medium">Empresa:</span> {activity.company}
                                </div>
                            </div>

                            <div className="mt-3 flex space-x-2">
                                {Object.entries(activity.weekDays).map(([day, isScheduled]) => (
                                    <span
                                        key={day}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${isScheduled
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditActivity(activity);
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600"
                                aria-label="Edit activity"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <ActivityDetails
                        activity={activity}
                        onClose={() => setExpandedId(null)}
                        onEdit={() => onEditActivity(activity)}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar actividades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            {images.length > 0 && (
                <div className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{images.length} attached images</span>
                    <button
                        onClick={() => setSelectedImage(images[0])}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        View
                    </button>
                </div>
            )}

            {/* Activity List */}

            <div className="space-y-4">
                {paginatedActivities.map(renderActivitySummary)}
            </div>

            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${currentPage === page
                                ? 'bg-blue-600 text-white'

                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}