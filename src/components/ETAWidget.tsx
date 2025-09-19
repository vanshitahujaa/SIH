import React from 'react';
import { Clock, MapPin, Bus as BusIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ETAWidgetProps {
  busId: string;
  routeName?: string;
  eta: number; // minutes
  distance: number; // meters
  stopName?: string;
  className?: string;
}

const ETAWidget: React.FC<ETAWidgetProps> = ({
  busId,
  routeName,
  eta,
  distance,
  stopName,
  className = '',
}) => {
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getETAColor = (minutes: number) => {
    if (minutes <= 2) return 'text-green-600 bg-green-50';
    if (minutes <= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getETAText = (minutes: number) => {
    if (minutes < 1) return 'Arriving';
    if (minutes === 1) return '1 min';
    return `${Math.round(minutes)} mins`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BusIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bus {busId}</h3>
            {routeName && (
              <p className="text-xs text-gray-500">{routeName}</p>
            )}
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getETAColor(eta)}`}>
          {getETAText(eta)}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {stopName && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{stopName}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Distance: {formatDistance(distance)}</span>
          </div>
          
          {eta > 0 && (
            <div className="text-xs text-gray-500">
              ETA: {new Date(Date.now() + eta * 60000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {eta > 0 && (
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.max(10, Math.min(100, (10 - eta) * 10))}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ETAWidget;