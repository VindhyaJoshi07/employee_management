import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/employeeSlice';

import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ user_name: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Dispatch loginUser thunk with the form data (username, password)
     const resultAction = await dispatch(loginUser(formData));

     // Check if login was successful
     if (loginUser.fulfilled.match(resultAction)) {
       // If login was successful, navigate to the employees page
       navigate('/employees');
     } else {
       // Handle login failure (optional)
       console.error('Login failed: ', resultAction.error.message);
     }
   };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <div className="form-buttons">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
