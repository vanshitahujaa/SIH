import axiosClient from './axiosClient';

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface Route {
  id: string;
  name: string;
  code: string;
  color: string;
  stops: Stop[];
  isActive: boolean;
  operatingHours: {
    start: string;
    end: string;
  };
  frequency: number; // minutes
}

export interface RoutePlan {
  id: string;
  routes: Route[];
  totalDuration: number;
  walkingDistance: number;
  transfers: number;
  steps: RoutePlanStep[];
}

export interface RoutePlanStep {
  type: 'walk' | 'bus';
  description: string;
  route?: Route;
  duration: number;
  distance?: number;
}

export const routeApi = {
  // Get all active routes
  fetchRoutes: (): Promise<Route[]> =>
    axiosClient.get('/routes').then(res => res.data),

  // Get route by ID
  fetchRouteById: (routeId: string): Promise<Route> =>
    axiosClient.get(`/routes/${routeId}`).then(res => res.data),

  // Plan route from source to destination
  planRoute: (source: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<RoutePlan[]> =>
    axiosClient.post('/routes/plan', { source, destination }).then(res => res.data),

  // Get nearby stops
  fetchNearbyStops: (latitude: number, longitude: number, radius: number = 500): Promise<Stop[]> =>
    axiosClient.get(`/stops/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`).then(res => res.data),

  // Admin: Create route
  createRoute: (routeData: Omit<Route, 'id'>): Promise<Route> =>
    axiosClient.post('/routes', routeData).then(res => res.data),

  // Admin: Update route
  updateRoute: (routeId: string, routeData: Partial<Route>): Promise<Route> =>
    axiosClient.put(`/routes/${routeId}`, routeData).then(res => res.data),

  // Admin: Delete route
  deleteRoute: (routeId: string): Promise<void> =>
    axiosClient.delete(`/routes/${routeId}`),
};