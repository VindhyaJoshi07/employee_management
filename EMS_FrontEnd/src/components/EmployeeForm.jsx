import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeForm.css'; // Optional: create this CSS file for custom styles

function EmployeeForm() {
  const { id } = useParams(); // Capture the employee ID if editing
  const navigate = useNavigate(); // Use this to navigate after form submission

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });

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
    navigate('/employees');
  };

  return (
    <div className="employee-form">
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Department:
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate('/employees')}>Cancel</button>
      </form>
    </div>
  );
}

export default EmployeeForm;
