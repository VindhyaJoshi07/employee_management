import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await axios.get('http://localhost:5000/api/employees');
  return response.data.employee;
});

// Async thunk to add an employee
export const addEmployee = createAsyncThunk('employees/addEmployee', async (newEmployee) => {
  const response = await axios.post('http://localhost:5000/api/employees', newEmployee);
  return response.data.employee;
});

// Async thunk to update an employee
export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, updatedEmployee }) => {
  const response = await axios.patch(`http://localhost:5000/api/employees/${id}`, updatedEmployee);
  return response.data.employee;
});

// Async thunk to delete an employee
export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id) => {
  await axios.delete(`http://localhost:5000/api/employees/${id}`);
  return id;
});

// Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.employees.findIndex(employee => employee.empID === action.payload.empID);
          if (index !== -1) {
            state.employees[index] = action.payload;
          }
        } else {
          console.error('Update failed: payload is undefined');
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(employee => employee.empID !== action.payload);
      });
  },
});

export default employeeSlice.reducer;