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
import CommIN from './commission/commIN';
import NewCommIn from './commission/newCommIN';
import NewCommOut from './commission/newCommOut';
import CommOUT from './commission/commOUT';
import Commission from './commission/commission';

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
          <Route path="/commission" element={<Commission />} />
          <Route path="/commIN" element={<CommIN />} />
          <Route path="/newCommIn" element={<NewCommIn />} />
          <Route path="/newCommOut" element={<NewCommOut />} />
          <Route path="/commOUT" element={<CommOUT />} />
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