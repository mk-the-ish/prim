import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Layout from './layout';
import './App.css';
import Students from './students/students';
import NewStudent from './students/NewStudent';
import Levy from './levy/levy';
import StudentView from './students/StudentView';
import Tuition from './tuition/tuition';
import Commissions from './commission/commissions';

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/students" element={<Students />} />
          <Route path="/levy" element={<Levy />} />
          <Route path="/tuition" element={<Tuition />} />
          <Route path="/new-student" element={<NewStudent />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/student-view/:studentId" element={<StudentView />} />
          <Route path="/" element={<Students />} />
        </Routes>
      </Layout>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;