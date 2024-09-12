import React, { useState, useEffect } from 'react';
import './EmployeeTable.css'; // Add custom styles here
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../redux/employeeSlice';
import { useNavigate } from 'react-router-dom';

function EmployeeTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const employees = useSelector((state) => state.employees.employees);
  const employeeStatus = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);

  useEffect(() => {
    if (employeeStatus === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [employeeStatus, dispatch]);

  // Show modal and store the employee ID to delete
  const handleDelete = (id) => {
    setEmployeeToDelete(id);
    setShowModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    dispatch(deleteEmployee(employeeToDelete));
    setShowModal(false);
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowModal(false);
    setEmployeeToDelete(null);
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this employee?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable;
