import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../redux/employeeSlice';
import { useNavigate } from 'react-router-dom';
import './EmployeeTable.css';

function EmployeeTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector((state) => state.employees.employees);
  const employeeStatus = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);

  useEffect(() => {
    if (employeeStatus === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [employeeStatus, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

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
          {employees.map(employee => (
            <tr key={employee.empID}>
              <td>{employee.empID}</td>
              <td>{employee.empFirstName}</td>
              <td>{employee.empLastName}</td>
              <td>{employee.empEmail}</td>
              <td>{employee.deptName}</td>
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
