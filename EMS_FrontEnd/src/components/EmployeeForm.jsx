import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, updateEmployee } from '../redux/employeeSlice';
import './EmployeeForm.css';

function EmployeeForm() {
  const { id } = useParams(); // Capture the employee ID if editing
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingEmployee = useSelector(state =>
    state.employees.employees.find(emp => emp.empID === parseInt(id))
  );

  const [formData, setFormData] = useState({
    empFirstName: '',
    empMiddleName: '',
    empLastName: '',
    empEmail: '',
    deptName: '',
    // Add other fields as necessary
  });

  useEffect(() => {
    if (existingEmployee) {
      setFormData(existingEmployee);
    }
  }, [existingEmployee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      // Edit existing employee
      dispatch(updateEmployee({ id, updatedEmployee: formData }));
    } else {
      // Add new employee
      dispatch(addEmployee(formData));
    }
    navigate('/employees');
  };

  return (
    <div className="employee-form">
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="empFirstName" value={formData.empFirstName} onChange={handleChange} required />
        </label>
        <label>
          Last Name:
          <input type="text" name="empLastName" value={formData.empLastName} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="empEmail" value={formData.empEmail} onChange={handleChange} required />
        </label>
        <label>
          Department:
          <input type="text" name="deptName" value={formData.deptName} onChange={handleChange} required />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate('/employees')}>Cancel</button>
      </form>
    </div>
  );
}

export default EmployeeForm;
