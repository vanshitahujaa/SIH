import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { busApi, Bus } from '../../api/busApi';

interface BusState {
  buses: Bus[];
  selectedBus: Bus | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: BusState = {
  buses: [],
  selectedBus: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchLiveBuses = createAsyncThunk(
  'buses/fetchLive',
  async () => {
    return await busApi.fetchLiveBuses();
  }
);

export const fetchBusById = createAsyncThunk(
  'buses/fetchById',
  async (busId: string) => {
    return await busApi.fetchBusById(busId);
  }
);

const busSlice = createSlice({
  name: 'buses',
  initialState,
  reducers: {
    selectBus: (state, action) => {
      state.selectedBus = action.payload;
    },
    clearSelectedBus: (state) => {
      state.selectedBus = null;
    },
    updateBusLocation: (state, action) => {
      const { busId, latitude, longitude, heading } = action.payload;
      const busIndex = state.buses.findIndex(bus => bus.id === busId);
      if (busIndex !== -1) {
        state.buses[busIndex] = {
          ...state.buses[busIndex],
          latitude,
          longitude,
          heading,
          lastUpdated: new Date().toISOString(),
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchLiveBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buses';
      })
      .addCase(fetchBusById.fulfilled, (state, action) => {
        state.selectedBus = action.payload;
      });
  },
});

export const { selectBus, clearSelectedBus, updateBusLocation } = busSlice.actions;
export default busSlice.reducer;