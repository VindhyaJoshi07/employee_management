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

// ********************* Login Thunks **********************

// Async thunk to handle login
export const loginUser = createAsyncThunk('auth/loginUser', async ({ user_name, password }) => {
  console.log("inside login thunk...");
  const response = await axios.post('http://localhost:5000/api/employees/login', { user_name, password });
  console.log("response.data..." +JSON.stringify(response.data));
  return response.data; 
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
    // ********************* Employee actions **********************
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
        if (!action.payload || !action.payload.empID) {
          return;
        }
        const index = state.employees.findIndex(employee => employee.empID === action.payload.empID);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(employee => employee.empID !== action.payload);
      });
  },
});


export default employeeSlice.reducer;

// ********************* Login Slice **********************

const loginSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;   
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = loginSlice.actions;
export const { reducer: loginReducer } = loginSlice;