import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeForm.css'; // Optional: create this CSS file for custom styles
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, updateEmployee } from '../redux/employeeSlice';
import './EmployeeForm.css';

function EmployeeForm() {
  const { id } = useParams(); // Capture the employee ID if editing
  const navigate = useNavigate(); // Use this to navigate after form submission
  const dispatch = useDispatch();
  const existingEmployee = useSelector(state =>
    state.employees.employees.find(emp => emp.empID === parseInt(id))
  );

  const [formData, setFormData] = useState({
    empFirstName: '',
    empMiddleName: '',
    empLastName: '',
    empEmail: '',
    empDOB: '',
    empJobTitle: '',
    active: '',
    deptName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    emContact: '',
    emPhone: '',
    homePhone: ''
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
    // Logic to add or update employee will go here
    console.log('Form submitted:', formData);
    // Redirect back to the employee dashboard after submission
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
                <input 
                  type="text" 
                  name="empFirstName" 
                  value={formData.empFirstName} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Last Name:
                <input 
                  type="text" 
                  name="empLastName" 
                  value={formData.empLastName} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Email:
                <input 
                  type="email" 
                  name="empEmail" 
                  value={formData.empEmail} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                DOB :
                <input 
                  type="text" 
                  name="empDOB" 
                  value={formData.empDOB} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Job Title :
                <input 
                  type="text" 
                  name="empJobTitle" 
                  value={formData.empJobTitle} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Department:
                <input 
                  type="text" 
                  name="deptName" 
                  value={formData.deptName} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                AddressLine1:
                <input 
                  type="text" 
                  name="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                AddressLine2:
                <input 
                  type="text" 
                  name="addressLine2" 
                  value={formData.addressLine2} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                City:
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                State:
                <input 
                  type="text" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Zip Code:
                <input 
                  type="text" 
                  name="zip" 
                  value={formData.zip} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Contact:
                <input 
                  type="text" 
                  name="emContact" 
                  value={formData.emContact} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Phone:
                <input 
                  type="text" 
                  name="emPhone" 
                  value={formData.emPhone} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Home Phone:
                <input 
                  type="text" 
                  name="homePhone" 
                  value={formData.homePhone} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => navigate('/employees')}>Cancel</button>
            </form>
          </div>
  );
}
export default EmployeeForm;