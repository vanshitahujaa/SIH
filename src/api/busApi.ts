import axiosClient from './axiosClient';

export interface Bus {
  id: string;
  routeId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdated: string;
  capacity: number;
  currentLoad: number;
}

export interface BusLocation {
  busId: string;
  latitude: number;
  longitude: number;
  heading: number;
  timestamp: string;
}

export const busApi = {
  // Get all buses with real-time locations
  fetchLiveBuses: (): Promise<Bus[]> =>
    axiosClient.get('/buses/live').then(res => res.data),

  // Get specific bus details
  fetchBusById: (busId: string): Promise<Bus> =>
    axiosClient.get(`/buses/${busId}`).then(res => res.data),

  // Get ETA for a specific bus to a stop
  fetchETA: (busId: string, stopId: string): Promise<{ eta: number; distance: number }> =>
    axiosClient.get(`/buses/${busId}/eta/${stopId}`).then(res => res.data),

  // Admin: Create new bus
  createBus: (busData: Partial<Bus>): Promise<Bus> =>
    axiosClient.post('/buses', busData).then(res => res.data),

  // Admin: Update bus
  updateBus: (busId: string, busData: Partial<Bus>): Promise<Bus> =>
    axiosClient.put(`/buses/${busId}`, busData).then(res => res.data),

  // Admin: Delete bus
  deleteBus: (busId: string): Promise<void> =>
    axiosClient.delete(`/buses/${busId}`),

  // Get buses by route
  fetchBusesByRoute: (routeId: string): Promise<Bus[]> =>
    axiosClient.get(`/routes/${routeId}/buses`).then(res => res.data),
};