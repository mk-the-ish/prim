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
import TuitionUSD from './tuition/tuition_usd';
import TuitionZWG from './tuition/tuition_zwg';
import LevyUSD from './levy/levy_usd';
import LevyZWG from './levy/levy_zwg';
import StudentUpdate from './students/student_update';
import NewLevyUSD from './levy/newLevyUSD';
import NewLevyZWG from './levy/newLevyZWG';
import NewTuitionUSD from './tuition/newTuitionUSD.js';
import NewTuitionZWG from './tuition/newTuitionZWG.js';

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/students" element={<Students />} />
          <Route path="/new-student" element={<NewStudent />} />
          <Route path="/student-view/:studentId" element={<StudentView />} />
          <Route path="/student_update/:studentId" element={<StudentUpdate />} />
          <Route path="/levy" element={<Levy />} />
          <Route path="/levyUSD" element={<LevyUSD />} />
          <Route path="/levyZWG" element={<LevyZWG />} />
          <Route path="/newLevyUSD/:studentId" element={<NewLevyUSD />} />
          <Route path="/newLevyZWG/:studentId" element={<NewLevyZWG />} />
          <Route path="/newTuitionUSD/:studentId" element={<NewTuitionUSD />} />
          <Route path="/newTuitionZWG/:studentId" element={<NewTuitionZWG />} />
          <Route path="/tuition" element={<Tuition />} />
          <Route path="/tuitionUSD" element={<TuitionUSD />} />
          <Route path="/tuitionZWG" element={<TuitionZWG />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/commIN" element={<CommIN />} />
          <Route path="/newCommIn" element={<NewCommIn />} />
          <Route path="/newCommOut" element={<NewCommOut />} />
          <Route path="/commOUT" element={<CommOUT />} />
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