import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../api/adminApi';
import { busApi } from '../../../api/busApi';
import { routeApi } from '../../../api/routeApi';
import { StatsCard } from '../components/StatsCard';
import MapView from '../../../components/MapView';
import { BusTable } from '../components/BusTable';
import { 
  Bus as BusIcon, 
  Route, 
  Activity, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Users 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminApi.fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: buses } = useQuery({
    queryKey: ['buses'],
    queryFn: busApi.fetchLiveBuses,
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const { data: routes } = useQuery({
    queryKey: ['routes'],
    queryFn: routeApi.fetchRoutes,
  });

  const activeBuses = buses?.filter(bus => bus.status === 'active') || [];
  const inactiveBuses = buses?.filter(bus => bus.status === 'inactive') || [];
  const maintenanceBuses = buses?.filter(bus => bus.status === 'maintenance') || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your bus fleet in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Buses"
          value={stats?.totalBuses || 0}
          icon={BusIcon}
          color="blue"
          change={{ value: 5, type: 'increase' }}
          subtitle="Fleet size"
        />
        
        <StatsCard
          title="Active Buses"
          value={stats?.activeBuses || activeBuses.length}
          icon={CheckCircle}
          color="green"
          change={{ value: 12, type: 'increase' }}
          subtitle="Currently running"
        />
        
        <StatsCard
          title="Active Routes"
          value={stats?.activeRoutes || routes?.filter(r => r.isActive).length || 0}
          icon={Route}
          color="purple"
          change={{ value: 2, type: 'increase' }}
          subtitle="In operation"
        />
        
        <StatsCard
          title="On-Time Rate"
          value={`${stats?.onTimePercentage || 89}%`}
          icon={Clock}
          color="orange"
          change={{ value: 3, type: 'increase' }}
          subtitle="Last 24 hours"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Average Delay</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.avgDelay || 2.5} min</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            2% improvement from last week
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Maintenance Required</h3>
              <p className="text-2xl font-bold text-gray-900">{maintenanceBuses.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {maintenanceBuses.length > 0 ? 'Requires attention' : 'All buses operational'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Passengers</h3>
              <p className="text-2xl font-bold text-gray-900">
                {buses?.reduce((sum, bus) => sum + bus.currentLoad, 0) || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Current system load
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Map */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Fleet Tracking</h3>
            <p className="text-sm text-gray-600">Real-time positions of all buses</p>
          </div>
          <MapView height="400px" showRoutes={false} />
        </div>

        {/* Bus Status Summary */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Fleet Status</h3>
            <p className="text-sm text-gray-600">Current status of all buses</p>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Status breakdown */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{activeBuses.length}</div>
                <div className="text-sm text-green-700">Active</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{inactiveBuses.length}</div>
                <div className="text-sm text-gray-700">Inactive</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{maintenanceBuses.length}</div>
                <div className="text-sm text-yellow-700">Maintenance</div>
              </div>
            </div>

            {/* Recent activities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Activities</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Bus 101 completed Route A</span>
                  <span className="text-gray-400 ml-auto">2m ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Bus 205 started Route C</span>
                  <span className="text-gray-400 ml-auto">5m ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Bus 153 entered maintenance</span>
                  <span className="text-gray-400 ml-auto">12m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bus Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Bus Fleet Overview</h3>
          <p className="text-sm text-gray-600">Detailed view of all buses and their current status</p>
        </div>
        <BusTable buses={buses || []} routes={routes || []} />
      </div>
    </div>
  );
};

export default Dashboard;