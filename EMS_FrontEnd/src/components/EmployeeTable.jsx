import React, { useState, useEffect } from 'react';
import './EmployeeTable.css'; // Optional: create this CSS file for custom styles

function EmployeeTable() {
  // Example state for employees; later you will fetch this from the backend
  const [employees, setEmployees] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', department: 'HR' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', department: 'Finance' },
    { id: 3, firstName: 'Sam', lastName: 'Wilson', email: 'sam.wilson@example.com', department: 'IT' }
  ]);

  // Function to handle deletion (placeholder for now)
  const handleDelete = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <div className="employee-table">
      <h2>Employee Dashboard</h2>
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
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
