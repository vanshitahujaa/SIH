import React from 'react';
import { Bus } from '../../../api/busApi';
import { Route } from '../../../api/routeApi';
import { Clock, Users, MapPin, Signal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BusCardProps {
  bus: Bus;
  route?: Route;
  onClick?: () => void;
  className?: string;
}

export const BusCard: React.FC<BusCardProps> = ({ 
  bus, 
  route, 
  onClick,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoadPercentage = () => {
    return Math.round((bus.currentLoad / bus.capacity) * 100);
  };

  const getLoadColor = () => {
    const percentage = getLoadPercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: route?.color || '#3B82F6' }}
          />
          <div>
            <h3 className="font-semibold text-gray-900">Bus {bus.id}</h3>
            {route && (
              <p className="text-sm text-gray-500">{route.name}</p>
            )}
          </div>
        </div>
        
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bus.status)}`}>
          {bus.status}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Signal className="w-4 h-4" />
          <span>{bus.speed} km/h</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {formatDistanceToNow(new Date(bus.lastUpdated), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Capacity */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Capacity</span>
          </div>
          <span className="font-medium text-gray-900">
            {bus.currentLoad}/{bus.capacity} ({getLoadPercentage()}%)
          </span>
        </div>
        
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getLoadColor()}`}
            style={{ width: `${getLoadPercentage()}%` }}
          />
        </div>
      </div>

      {/* Location hint */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <MapPin className="w-3 h-3" />
        <span>
          {bus.latitude.toFixed(4)}, {bus.longitude.toFixed(4)}
        </span>
      </div>
    </div>
  );
};