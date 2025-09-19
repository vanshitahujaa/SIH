import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { routeApi, Route, RoutePlan } from '../../api/routeApi';

interface RouteState {
  routes: Route[];
  selectedRoute: Route | null;
  routePlans: RoutePlan[];
  loading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  routes: [],
  selectedRoute: null,
  routePlans: [],
  loading: false,
  error: null,
};

export const fetchRoutes = createAsyncThunk(
  'routes/fetchAll',
  async () => {
    return await routeApi.fetchRoutes();
  }
);

export const planRoute = createAsyncThunk(
  'routes/plan',
  async ({ source, destination }: { source: { lat: number; lng: number }, destination: { lat: number; lng: number } }) => {
    return await routeApi.planRoute(source, destination);
  }
);

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    selectRoute: (state, action) => {
      state.selectedRoute = action.payload;
    },
    clearSelectedRoute: (state) => {
      state.selectedRoute = null;
    },
    clearRoutePlans: (state) => {
      state.routePlans = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch routes';
      })
      .addCase(planRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(planRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.routePlans = action.payload;
      })
      .addCase(planRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to plan route';
      });
  },
});

export const { selectRoute, clearSelectedRoute, clearRoutePlans } = routeSlice.actions;
export default routeSlice.reducer;