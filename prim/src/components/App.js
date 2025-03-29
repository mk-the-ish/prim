import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Academic/LandingPage.js';
import Layout from './Academic/layout.js';
import Students from './Academic/students/students.js';
import NewStudent from './Academic/students/NewStudent.js';
import Levy from './Academic/levy/levy.js';
import StudentView from './Academic/students/StudentView.js';
import Tuition from './Academic/tuition/tuition.js';
import CommIN from './Academic/commission/commIN.js';
import NewCommIn from './Academic/commission/newCommIN.js';
import NewCommOut from './Academic/commission/newCommOut.js';
import CommOUT from './Academic/commission/commOUT.js';
import Commission from './Academic/commission/commission.js';
import TuitionUSD from './Academic/tuition/tuition_usd.js';
import TuitionZWG from './Academic/tuition/tuition_zwg.js';
import LevyUSD from './Academic/levy/levy_usd.js';
import LevyZWG from './Academic/levy/levy_zwg.js';
import StudentUpdate from './Academic/students/student_update.js';
import NewLevyUSD from './Academic/levy/newLevyUSD.js';
import NewLevyZWG from './Academic/levy/newLevyZWG.js';
import NewTuitionUSD from './Academic/tuition/newTuitionUSD.js';
import NewTuitionZWG from './Academic/tuition/newTuitionZWG.js';
import LevyTxn from './Academic/levy_txn/levy_txn.js';
import TuitionTxn from './Academic/tuition_txn/tuition_txn.js';
import Financials from './Financials/financials.js';
import LIView from './Academic/levy_txn/levyIN/view.js';
import LIusd from './Academic/levy_txn/levyIN/usd.js';
import LIzwg from './Academic/levy_txn/levyIN/zwg.js';
import LIpay from './Academic/levy_txn/levyIN/revenue.js';
import LIVusd from './Academic/levy_txn/levyIN/viewUSD.js';
import LIVzwg from './Academic/levy_txn/levyIN/viewZWG.js';
import LOView from './Academic/levy_txn/levyOUT/view.js';
import LOusd from './Academic/levy_txn/levyOUT/usd.js';
import LOzwg from './Academic/levy_txn/levyOUT/zwg.js';
import LOpay from './Academic/levy_txn/levyOUT/revenue.js';
import LOVusd from './Academic/levy_txn/levyOUT/viewUSD.js';
import LOVzwg from './Academic/levy_txn/levyOUT/viewZWG.js';
import TIView from './Academic/tuition_txn/tuitionIN/view.js';
import TIusd from './Academic/tuition_txn/tuitionIN/usd.js';
import TIzwg from './Academic/tuition_txn/tuitionIN/zwg.js';
import TIpay from './Academic/tuition_txn/tuitionIN/revenue.js';
import TIVusd from './Academic/tuition_txn/tuitionIN/viewUSD.js';
import TIVzwg from './Academic/tuition_txn/tuitionIN/viewZWG.js';
import TOView from './Academic/tuition_txn/tuitionOUT/view.js';
import TOusd from './Academic/tuition_txn/tuitionOUT/usd.js';
import TOzwg from './Academic/tuition_txn/tuitionOUT/zwg.js';
import TOpay from './Academic/tuition_txn/tuitionOUT/payment.js';
import TOVusd from './Academic/tuition_txn/tuitionOUT/viewUSD.js';
import TOVzwg from './Academic/tuition_txn/tuitionOUT/viewZWG.js';


function App() {
  return (

    <div className="App">
      <Layout>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />

          {/* Students */}
          <Route path="/students" element={<Students />} />
          <Route path="/new-student" element={<NewStudent />} />
          <Route path="/student-view/:studentId" element={<StudentView />} />
          <Route path="/student_update/:studentId" element={<StudentUpdate />} />

          {/* Levy */}
          <Route path="/levy" element={<Levy />} />
          <Route path="/levyUSD" element={<LevyUSD />} />
          <Route path="/levyZWG" element={<LevyZWG />} />
          <Route path="/newLevyUSD/:studentId" element={<NewLevyUSD />} />
          <Route path="/newLevyZWG/:studentId" element={<NewLevyZWG />} />
          
          {/* Tuition */}
          <Route path="/tuition" element={<Tuition />} />
          <Route path="/tuitionUSD" element={<TuitionUSD />} />
          <Route path="/tuitionZWG" element={<TuitionZWG />} />
          <Route path="/newTuitionUSD/:studentId" element={<NewTuitionUSD />} />
          <Route path="/newTuitionZWG/:studentId" element={<NewTuitionZWG />} />

          {/* Commission */}
          <Route path="/commission" element={<Commission />} />
          <Route path="/commIN" element={<CommIN />} />
          <Route path="/newCommIn" element={<NewCommIn />} />
          <Route path="/newCommOut" element={<NewCommOut />} />
          <Route path="/commOUT" element={<CommOUT />} />

          {/* Levy Transactions */}
          <Route path="/levy_txn" element={<LevyTxn />} />
          <Route path="/levyIN" element={<LIView />} />
          <Route path="/levyIN/usd" element={<LIusd />} />
          <Route path="/levyIN/zwg" element={<LIzwg />} />
          <Route path="/levyIN/payment" element={<LIpay />} />
          <Route path="/levyIN/viewUSD" element={<LIVusd />} />
          <Route path="/levyIN/viewZWG" element={<LIVzwg />} />

          <Route path="/levyOUT" element={<LOView />} />
          <Route path="/levyOUT/usd" element={<LOusd />} />
          <Route path="/levyOUT/zwg" element={<LOzwg />} />
          <Route path="/levyOUT/revenue" element={<LOpay />} />
          <Route path="/levyOUT/viewUSD" element={<LOVusd />} />
          <Route path="/levyOUT/viewZWG" element={<LOVzwg />} />

          {/* Tuition Transactions */}
          <Route path="/tuition_txn" element={<TuitionTxn />} />
          <Route path="/tuitionIN" element={<TIView />} />
          <Route path="/tuitionIN/usd" element={<TIusd />} />
          <Route path="/tuitionIN/zwg" element={<TIzwg />} />
          <Route path="/tuitionIN/payment" element={<TIpay />} />
          <Route path="/tuitionIN/viewUSD" element={<TIVusd />} />
          <Route path="/tuitionIN/viewZWG" element={<TIVzwg />} />

          <Route path="/tuitionOUT" element={<TOView />} />
          <Route path="/tuitionOUT/usd" element={<TOusd />} />
          <Route path="/tuitionOUT/zwg" element={<TOzwg />} />
          <Route path="/tuitionOUT/revenue" element={<TOpay />} />
          <Route path="/tuitionOUT/viewUSD" element={<TOVusd />} />
          <Route path="/tuitionOUT/viewZWG" element={<TOVzwg />} />

          {/* Financials */}
          <Route path="/financials" element={<Financials />} />
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