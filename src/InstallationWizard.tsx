import React, { useState } from 'react';
import './assets/css/InstallationWizard.css';
import { Link } from "react-router-dom";
const InstallationWizard = () => {
  const [sendData, setSendData] = useState(false);

  const handleNext = () => {
    alert('Next button clicked! Proceeding with the Ginger Society installation...');
  };

  return (
    <div className="wizard-container">
      <h4>Welcome to the Ginger Society Installation Wizard</h4>

      <div className="section">
        <h2>This wizard guides you through installing the Ginger Society program and all required components.</h2>
        <p>Follow the instructions below to continue with the installation process.</p>
      </div>

      <p> Click Start to continue.</p>
      <div className="footer">
      <Link to="/next">
        <button className="primary-button">Start</button>
       </Link> 
        <button className="primary-button" onClick={handleNext} >Cancel</button>
        <Link to="/">
        <button className="Secondary-button" >Exit</button>
        </Link>
        
      </div>
    </div>
  );
};

export default InstallationWizard;
