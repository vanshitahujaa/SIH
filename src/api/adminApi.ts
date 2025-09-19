import axiosClient from './axiosClient';

export interface DashboardStats {
  totalBuses: number;
  activeBuses: number;
  totalRoutes: number;
  activeRoutes: number;
  avgDelay: number;
  onTimePercentage: number;
}

export interface BusReport {
  busId: string;
  routeName: string;
  totalTrips: number;
  onTimeTrips: number;
  avgDelay: number;
  maintenanceHours: number;
}

export const adminApi = {
  // Dashboard statistics
  fetchDashboardStats: (): Promise<DashboardStats> =>
    axiosClient.get('/admin/dashboard/stats').then(res => res.data),

  // Reports
  fetchBusReports: (startDate: string, endDate: string): Promise<BusReport[]> =>
    axiosClient.get(`/admin/reports/buses?startDate=${startDate}&endDate=${endDate}`).then(res => res.data),

  fetchRouteReports: (startDate: string, endDate: string): Promise<any[]> =>
    axiosClient.get(`/admin/reports/routes?startDate=${startDate}&endDate=${endDate}`).then(res => res.data),

  // System management
  fetchSystemLogs: (limit: number = 100): Promise<any[]> =>
    axiosClient.get(`/admin/logs?limit=${limit}`).then(res => res.data),
};