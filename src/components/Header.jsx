import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have custom styles for the header

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="path/to/logo.png" alt="Company Logo" /> {/* Replace with your logo path */}
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/employees">Employee Dashboard</Link></li>
          <li><Link to="/add-employee">Employee Registration</Link></li>
          <li><Link to="/admin">Admin Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
