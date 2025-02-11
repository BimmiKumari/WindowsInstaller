import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from './assets/ginger_icon.png'
import InstallationWizard from './InstallationWizard'
import Setup from './Setup';
import ChooseServices from './ChooseServices';
import Installlocation from './Installlocation';
import InstallationProgress from './InstallationProgress';
function App() {
   

  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={<Setup/>}/>
        <Route path="/next" element={<ChooseServices/>} />
        <Route path="/installlocation" element={<Installlocation/>}/>
        <Route path="/progress" element={<InstallationProgress/>}/>
      </Routes>
    </Router>
    
    </>
  )
}

export default App
