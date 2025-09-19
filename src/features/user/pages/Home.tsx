import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store';
import { fetchLiveBuses } from '../../../store/slices/busSlice';
import { fetchRoutes } from '../../../store/slices/routeSlice';
import MapView from '../../../components/MapView';
import ETAWidget from '../../../components/ETAWidget';
import { BusCard } from '../components/BusCard';
import { Search, MapPin, Clock, Bus as BusIcon } from 'lucide-react';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { buses } = useAppSelector((state) => state.buses);
  const { routes } = useAppSelector((state) => state.routes);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyBuses, setNearbyBuses] = useState(buses.slice(0, 3));

  useEffect(() => {
    dispatch(fetchLiveBuses());
    dispatch(fetchRoutes());
  }, [dispatch]);

  useEffect(() => {
    // Simulate nearby buses (in real app, this would use user's location)
    setNearbyBuses(buses.filter(bus => bus.status === 'active').slice(0, 3));
  }, [buses]);

  const activeBuses = buses.filter(bus => bus.status === 'active');
  const totalRoutes = routes.length;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to BusTracker</h1>
        <p className="text-blue-100">Track buses in real-time and plan your journey</p>
        
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <BusIcon className="w-6 h-6 mx-auto mb-1" />
            <div className="text-lg font-semibold">{activeBuses.length}</div>
            <div className="text-xs text-blue-100">Active Buses</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-1" />
            <div className="text-lg font-semibold">{totalRoutes}</div>
            <div className="text-xs text-blue-100">Routes</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <Clock className="w-6 h-6 mx-auto mb-1" />
            <div className="text-lg font-semibold">24/7</div>
            <div className="text-xs text-blue-100">Service</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <Search className="w-6 h-6 mx-auto mb-1" />
            <div className="text-lg font-semibold">Live</div>
            <div className="text-xs text-blue-100">Tracking</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for routes, stops, or destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Live Bus Tracking</h2>
              <p className="text-sm text-gray-600">Real-time positions of all active buses</p>
            </div>
            <MapView height="500px" showRoutes={true} />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Nearby Buses */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Buses</h3>
            {nearbyBuses.length > 0 ? (
              <div className="space-y-3">
                {nearbyBuses.map((bus) => (
                  <ETAWidget
                    key={bus.id}
                    busId={bus.id}
                    routeName={routes.find(r => r.id === bus.routeId)?.name}
                    eta={Math.floor(Math.random() * 10) + 1} // Mock ETA
                    distance={Math.floor(Math.random() * 1000) + 100} // Mock distance
                    stopName="Main Street Station" // Mock stop name
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <BusIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No buses nearby</p>
                <p className="text-sm">Try refreshing or check back later</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Plan Route</div>
                  <div className="text-sm text-gray-500">Find the best route to your destination</div>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Set Reminder</div>
                  <div className="text-sm text-gray-500">Get notified when your bus arrives</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Bus 101 arrived at Central Station</span>
                <span className="text-xs text-gray-400 ml-auto">2m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Route A is running on time</span>
                <span className="text-xs text-gray-400 ml-auto">5m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Bus 205 delayed by 3 minutes</span>
                <span className="text-xs text-gray-400 ml-auto">8m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;