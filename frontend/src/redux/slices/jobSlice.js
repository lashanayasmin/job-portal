import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/axios';

const initialState = {
  jobs: [],
  currentJob: null,
  employerJobs: [],
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/jobs', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
  }
});

export const fetchJob = createAsyncThunk('jobs/fetchJob', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/jobs/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch job');
  }
});

export const createJob = createAsyncThunk('jobs/createJob', async (jobData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/jobs', jobData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create job');
  }
});

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, jobData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/jobs/${id}`, jobData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update job');
  }
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/jobs/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
  }
});

export const fetchEmployerJobs = createAsyncThunk('jobs/fetchEmployerJobs', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/jobs/employer');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your jobs');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrentJob: (state) => { state.currentJob = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const loading = (state) => { state.loading = true; state.error = null; };

    builder
      .addCase(fetchJobs.pending, loading)
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJob.pending, loading)
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.job;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJob.pending, loading)
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload.job);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJob.pending, loading)
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex((j) => j._id === action.payload.job._id);
        if (index !== -1) state.jobs[index] = action.payload.job;
        if (state.currentJob?._id === action.payload.job._id) state.currentJob = action.payload.job;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteJob.pending, loading)
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
        state.employerJobs = state.employerJobs.filter((j) => j._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployerJobs.pending, loading)
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.employerJobs = action.payload.jobs;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentJob, clearError } = jobSlice.actions;
export default jobSlice.reducer;
