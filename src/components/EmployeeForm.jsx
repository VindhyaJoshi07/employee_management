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
    homePhone: '',
    user_name: '',
    password: ''
  });

  const usStates = [
    { label: 'Select a state', value: '' },
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    { label: 'Delaware', value: 'DE' },
    { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' },
    { label: 'Hawaii', value: 'HI' },
    { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' },
    { label: 'Indiana', value: 'IN' },
    { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' },
    { label: 'Louisiana', value: 'LA' },
    { label: 'Maine', value: 'ME' },
    { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' },
    { label: 'Minnesota', value: 'MN' },
    { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' },
    { label: 'Montana', value: 'MT' },
    { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' },
    { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' },
    { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' },
    { label: 'Ohio', value: 'OH' },
    { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' },
    { label: 'Pennsylvania', value: 'PA' },
    { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' },
    { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' },
    { label: 'Washington', value: 'WA' },
    { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' },
    { label: 'Wyoming', value: 'WY' },
  ];
  

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
              Username:
              <input 
                type="text" 
                name="user_name" 
                value={formData.user_name} 
                onChange={handleChange} 
                required 
              />
            </label>
            <label>
              Password:
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </label>
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
              <select 
                name="state" 
                value={formData.state} 
                onChange={handleChange} 
                required
              >
                {usStates.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
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
