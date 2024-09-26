import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';
import logReducer from './actionLogsSlice';
import { loginReducer } from './employeeSlice';


const store = configureStore({
  reducer: {
    employees: employeeReducer,
    logs: logReducer,
    auth: loginReducer,
  },
});

export default store;