import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/axios';

const initialState = {
  myApplications: [],
  jobApplications: [],
  loading: false,
  error: null,
};

export const applyJob = createAsyncThunk(
  'applications/apply',
  async ({ jobId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/applications/${jobId}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to apply');
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/applications/mine');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/fetchForJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/applications/${jobId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/applications/${id}/status`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const loading = (state) => { state.loading = true; state.error = null; };

    builder
      .addCase(applyJob.pending, loading)
      .addCase(applyJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyApplications.pending, loading)
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload.applications;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobApplications.pending, loading)
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.jobApplications = action.payload.applications;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateApplicationStatus.pending, loading)
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobApplications.findIndex(
          (a) => a._id === action.payload.application._id
        );
        if (index !== -1) state.jobApplications[index] = action.payload.application;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
