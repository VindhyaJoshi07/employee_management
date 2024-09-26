import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchActionLogs = createAsyncThunk('logs/fetchActionLogs', async (userName) => {
    const response = await axios.get(`http://localhost:5000/api/employees/getLogsByUsername/${userName}`);
    console.log("inside fetchActionLogs.."+JSON.stringify(response.data.logs));
    return response.data.logs;
});


const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    logs: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActionLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActionLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchActionLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default logsSlice.reducer;
