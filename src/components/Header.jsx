import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have custom styles for the header

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img className= "logo-style" src="https://acore.ca/wp-content/uploads/2020/12/Employee-Management-Systems-Development.png" alt="Company Logo" />
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/employees">Employee Dashboard</Link></li>
          <li><Link to="/add-employee">Employee Registration</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
