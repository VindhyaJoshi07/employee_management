import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import ActionLogs from './components/ActionLogs';
import HomePage from './Homepage';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employees" element={<EmployeeTable />} />
          <Route path="/add-employee" element={<EmployeeForm />} />
          <Route path="/edit-employee/:id" element={<EmployeeForm />} />
          <Route path="/admin" element={<div>Admin Dashboard Page</div>} />
          <Route path='/login' element={<Login />} />
          <Route path="/accessLogs/:userName" element={<ActionLogs />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;


