import React, { useEffect } from 'react';
import './EmployeeTable.css'; // Optional: create this CSS file for custom styles
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../redux/employeeSlice';
import { useNavigate } from 'react-router-dom';

function EmployeeTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Fetching employees from Redux store
  const employees = useSelector((state) => state.employees.employees);
  const employeeStatus = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);

  
  // Fetch employees if status is idle
  useEffect(() => {
    if (employeeStatus === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [employeeStatus, dispatch]);

  // Handle delete action
  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
  };

  // Handle edit action
  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  // Determine content based on the status of fetching employees
  let content;

  if (employeeStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (employeeStatus === 'succeeded') {
    content = (
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.empID}>
              <td data-label="Employee ID">{employee.empID}</td>
              <td data-label="First Name">{employee.empFirstName}</td>
              <td data-label="Last Name">{employee.empLastName}</td>
              <td data-label="Email">{employee.empEmail}</td>
              <td data-label="Department">{employee.deptName}</td>
              <td>
                <button onClick={() => handleEdit(employee.empID)}>Edit</button>
                <button onClick={() => handleDelete(employee.empID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (employeeStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
          <div className="employee-table">
            <h2>Employee Dashboard</h2>
            {content}
          </div>
  );
}

export default EmployeeTable;
