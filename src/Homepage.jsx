import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <div className="intro">
        <h1>Employee Management System</h1>
        <p>
          Employee management is the process by which employers ensure workers perform
          their jobs to the best of their abilities so as to achieve business goals. It typically
          entails building and maintaining healthy relationships with employees, as well as
          monitoring their daily labor and measuring progress.
        </p>
      </div>
      <div className="image-container">
        <img src="your-image-path.jpg" alt="Case study" />
        <div className="image-caption">A Case study of Foundation Polytechnic, Ikot Ekpene</div>
      </div>
    </div>
  );
}

export default HomePage;
