import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  console.log("inside fetchEmployees..");
  const response = await axios.get('http://localhost:5000/api/employees');
  console.log("response fetch.."+JSON.stringify(response.data.employee))
  return response.data.employee;
});

export const getEmployeeByID = createAsyncThunk('employees/getEmpById', async (id) => {
  const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
  console.log("inside getEmployeesByID.."+JSON.stringify(response.data.employee));
  return response.data.employee;
})

// Async thunk to add an employee
export const addEmployee = createAsyncThunk('employees/addEmployee', async (newEmployee) => {
  const response = await axios.post('http://localhost:5000/api/employees', newEmployee);
  return response.data.employee;
});


// Async thunk to update an employee
export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, formData },  { dispatch }) => {
  console.log("Updated Employee: " + JSON.stringify(formData));
  const response =  await axios.patch(`http://localhost:5000/api/employees/${id}`, formData);
  dispatch(getEmployeeByID(id)); 
  return response.data.employee;
});


// Async thunk to delete an employee
export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id) => {
  await axios.delete(`http://localhost:5000/api/employees/${id}`);
  return id;
});

console.log("fetchEmployees.fulfilled.."+fetchEmployees.fulfilled);
console.log("fetchEmployees.pending"+fetchEmployees.pending);

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
        console.log("Action.."+JSON.stringify(action))
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
        console.log('Action Payload:', action.payload);
        if (!action.payload || !action.payload.empID) {
          console.error('Invalid payload:', action.payload);
          return; // Early return to avoid further errors
        }
        const index = state.employees.findIndex(employee => employee.empID === action.payload.empID);
        if (index !== -1) {
          state.employees[index] = action.payload;
        } else {
          console.warn('Employee not found for update:', action.payload.empID);
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(employee => employee.empID !== action.payload);
      });
  },
});

export default employeeSlice.reducer;