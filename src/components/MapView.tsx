import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchLiveBuses } from '../store/slices/busSlice';
import { Bus } from '../api/busApi';
import { Route } from '../api/routeApi';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  height?: string;
  showRoutes?: boolean;
  className?: string;
}

const busIcon = new DivIcon({
  className: 'custom-bus-marker',
  html: `
    <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
      <div class="w-2 h-2 bg-white rounded-full"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const stopIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzEwYjk4MSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const MapView: React.FC<MapViewProps> = ({ 
  height = '400px', 
  showRoutes = false,
  className = ''
}) => {
  const dispatch = useAppDispatch();
  const { buses } = useAppSelector((state) => state.buses);
  const { routes, selectedRoute } = useAppSelector((state) => state.routes);
  const { mapCenter, mapZoom } = useAppSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchLiveBuses());
    const interval = setInterval(() => {
      dispatch(fetchLiveBuses());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const getRouteColor = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.color || '#3B82F6';
  };

  const getBusMarkerColor = (bus: Bus) => {
    switch (bus.status) {
      case 'active':
        return '#10B981';
      case 'inactive':
        return '#6B7280';
      case 'maintenance':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const createBusIcon = (bus: Bus) => {
    const color = getBusMarkerColor(bus);
    return new DivIcon({
      className: 'custom-bus-marker',
      html: `
        <div class="relative">
          <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background-color: ${color}">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
          ${bus.heading ? `
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-gray-300 flex items-center justify-center">
              <div class="w-1 h-1 bg-gray-600 rounded-full transform rotate-${Math.round(bus.heading / 45) * 45}"></div>
            </div>
          ` : ''}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={[mapCenter.latitude, mapCenter.longitude]}
        zoom={mapZoom}
        className="w-full h-full rounded-lg shadow-lg"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Bus markers */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.latitude, bus.longitude]}
            icon={createBusIcon(bus)}
          >
            <Popup>
              <div className="p-2 min-w-48">
                <h3 className="font-semibold text-gray-800">Bus {bus.id}</h3>
                <p className="text-sm text-gray-600">Status: {bus.status}</p>
                <p className="text-sm text-gray-600">Speed: {bus.speed} km/h</p>
                <p className="text-sm text-gray-600">Load: {bus.currentLoad}/{bus.capacity}</p>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(bus.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polylines */}
        {showRoutes && selectedRoute && (
          <>
            {/* Route stops */}
            {selectedRoute.stops.map((stop) => (
              <Marker
                key={stop.id}
                position={[stop.latitude, stop.longitude]}
                icon={stopIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-800">{stop.name}</h3>
                    <p className="text-sm text-gray-600">Stop #{stop.order}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Route line */}
            <Polyline
              positions={selectedRoute.stops.map(stop => [stop.latitude, stop.longitude])}
              color={selectedRoute.color}
              weight={4}
              opacity={0.7}
            />
          </>
        )}
      </MapContainer>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => dispatch(fetchLiveBuses())}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Refresh buses"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapView;