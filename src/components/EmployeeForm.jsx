import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeForm.css'; // Optional: create this CSS file for custom styles
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, fetchEmployees, updateEmployee } from '../redux/employeeSlice';

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
  });

  // Helper function to format date to dd-mm-yyyy
  const formatDateForDisplay = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to parse date back to yyyy-mm-dd for submission
  const parseDateForSubmission = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (existingEmployee) {
      setFormData({
        ...existingEmployee,
        empDOB: formatDateForDisplay(existingEmployee.empDOB), // Format date for display
      });
    }
  }, [existingEmployee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      empDOB: parseDateForSubmission(formData.empDOB), // Parse date for submission
    };

    if (id) {
      // Edit existing employee
      await dispatch(updateEmployee({ id, formData: formattedData }));
      await dispatch(fetchEmployees());
    } else {
      // Add new employee
      await dispatch(addEmployee(formattedData));
    }
    navigate('/employees');
  };

  return (
    <div className="employee-form">
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          {/* Employee Information Section */}
          <div className="employee-info">
            <h3>Employee Information</h3>
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
              Middle Name:
              <input 
                type="text" 
                name="empMiddleName" 
                value={formData.empMiddleName} 
                onChange={handleChange} 
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
              DOB:
              <input 
                type="text" 
                name="empDOB" 
                value={formData.empDOB} 
                onChange={handleChange} 
                required 
              />
            </label>
            <label>
              Job Title:
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
          </div>
  
          {/* Address Section */}
          <div className="employee-address">
            <h3>Address Information</h3>
            <label>
              Address Line 1:
              <input 
                type="text" 
                name="addressLine1" 
                value={formData.addressLine1} 
                onChange={handleChange} 
                required 
              />
            </label>
            <label>
              Address Line 2:
              <input 
                type="text" 
                name="addressLine2" 
                value={formData.addressLine2} 
                onChange={handleChange} 
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
              Emergency Contact:
              <input 
                type="text" 
                name="emContact" 
                value={formData.emContact} 
                onChange={handleChange} 
                required 
              />
            </label>
            <label>
              Emergency Phone:
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
          </div>
        </div>
  
        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/employees')}>Cancel</button>
        </div>
      </form>
    </div>
  );
  
}

export default EmployeeForm;
