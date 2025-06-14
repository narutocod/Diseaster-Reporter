import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { IncidentPayload, Incident } from "../../types/incident";
import { fetchIncidents, postIncident } from "../../services/incidentService";

interface IncidentState {
  list: Incident[];
  selectedIncidentId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: IncidentState = {
  list: [],
  selectedIncidentId: null,
  loading: false,
  error: null,
};

export const getIncidentsThunk = createAsyncThunk(
  "incidents/getAll",
  async (filters: any = undefined) => {
    return await fetchIncidents(filters);
  }
);

export const addIncidentThunk = createAsyncThunk(
  "incidents/add",
  async (incident: IncidentPayload) => {
    const id = await postIncident(incident);
    return { ...incident, id, timestamp: new Date().toISOString() };
  }
);

const incidentSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    selectIncident: (state, action: PayloadAction<string | null>) => {
      state.selectedIncidentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIncidentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncidentsThunk.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getIncidentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load incidents";
      })
      .addCase(addIncidentThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { selectIncident } = incidentSlice.actions;
export default incidentSlice.reducer;
