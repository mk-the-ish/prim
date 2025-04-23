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
import Financials from './Financials/financials.js';
import LIView from './Academic/txn/levy_txn/levyIN/view.js';
import LIusd from './Academic/txn/levy_txn/levyIN/usd.js';
import LIzwg from './Academic/txn/levy_txn/levyIN/zwg.js';
import LIpay from './Academic/txn/levy_txn/levyIN/revenue.js';
import LIVusd from './Academic/txn/levy_txn/levyIN/viewUSD.js';
import LIVzwg from './Academic/txn/levy_txn/levyIN/viewZWG.js';
import LOView from './Academic/txn/levy_txn/levyOUT/view.js';
import LOusd from './Academic/txn/levy_txn/levyOUT/usd.js';
import LOzwg from './Academic/txn/levy_txn/levyOUT/zwg.js';
import LOpay from './Academic/txn/levy_txn/levyOUT/payment.js';
import LOVusd from './Academic/txn/levy_txn/levyOUT/viewUSD.js';
import LOVzwg from './Academic/txn/levy_txn/levyOUT/viewZWG.js';
import TIView from './Academic/txn/tuition_txn/tuitionIN/view.js';
import TIusd from './Academic/txn/tuition_txn/tuitionIN/usd.js';
import TIzwg from './Academic/txn/tuition_txn/tuitionIN/zwg.js';
import TIpay from './Academic/txn/tuition_txn/tuitionIN/revenue.js';
import TIVusd from './Academic/txn/tuition_txn/tuitionIN/viewUSD.js';
import TIVzwg from './Academic/txn/tuition_txn/tuitionIN/viewZWG.js';
import TOView from './Academic/txn/tuition_txn/tuitionOUT/view.js';
import TOusd from './Academic/txn/tuition_txn/tuitionOUT/usd.js';
import TOzwg from './Academic/txn/tuition_txn/tuitionOUT/zwg.js';
import TOpay from './Academic/txn/tuition_txn/tuitionOUT/payment.js';
import TOVusd from './Academic/txn/tuition_txn/tuitionOUT/viewUSD.js';
import TOVzwg from './Academic/txn/tuition_txn/tuitionOUT/viewZWG.js';
import DailyReport from './Academic/reports/daily.js';
import MonthlyReport from './Academic/reports/monthly.js';
import Report from './Academic/reports/report.js';
import Invoice from './Academic/reports/invoice.js';
import AdminDashboard from './Academic/Dashboard/dashboard.js';
import BulkInvoicing from './Academic/Dashboard/bulkInvoicing.js';
import HR from './Financials/HR/HR.js';
import Statements from './Financials/Statements/statements.js';
import Budget from './Financials/Budget/budget.js';
import CSLevy from './Financials/Cashbooks/levy/levy.js';
import CSTuition from './Financials/Cashbooks/tuition/tuition.js';
import CSLusd from './Financials/Cashbooks/levy/levyUSD.js';
import CSLzwg from './Financials/Cashbooks/levy/levyZWG.js';
import CSTusd from './Financials/Cashbooks/tuition/usd.js';
import CSTzwg from './Financials/Cashbooks/tuition/zwg.js';
import PreviousCS from './Financials/Cashbooks/previousCS.js';
import FinancialLayout from './Financials/FinancialLayout.js';
import ViewInvoices from './Academic/txn/levy_txn/levyOUT/viewInvoices.js';
import TopBar from './Academic/txn/topbar.js';

function App() {
  return (

    <div className="App">
      <Layout>
        <Routes>
          {/* Landing Page */}32;
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<Students />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/bulk-invoicing" element={<BulkInvoicing />} />

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
          <Route path='/viewInvoices' element={<ViewInvoices />} />
          <Route path='/txnTopBar' element={<TopBar/>} />
          <Route path="/levyIN" element={<LIView />} />
          <Route path="/levyIN/usd" element={<LIusd />} />
          <Route path="/levyIN/zwg" element={<LIzwg />} />
          <Route path="/levyIN/revenue" element={<LIpay />} />
          <Route path="/levyIN/viewUSD" element={<LIVusd />} />
          <Route path="/levyIN/viewZWG" element={<LIVzwg />} />

          <Route path="/levyOUT" element={<LOView />} />
          <Route path="/levyOUT/usd" element={<LOusd />} />
          <Route path="/levyOUT/zwg" element={<LOzwg />} />
          <Route path="/levyOUT/payment" element={<LOpay />} />
          <Route path="/levyOUT/viewUSD" element={<LOVusd />} />
          <Route path="/levyOUT/viewZWG" element={<LOVzwg />} />

          {/* Tuition Transactions */}
          <Route path="/tuitionIN" element={<TIView />} />
          <Route path="/tuitionIN/usd" element={<TIusd />} />
          <Route path="/tuitionIN/zwg" element={<TIzwg />} />
          <Route path="/tuitionIN/revenue" element={<TIpay />} />
          <Route path="/tuitionIN/viewUSD" element={<TIVusd />} />
          <Route path="/tuitionIN/viewZWG" element={<TIVzwg />} />

          <Route path="/tuitionOUT" element={<TOView />} />
          <Route path="/tuitionOUT/usd" element={<TOusd />} />
          <Route path="/tuitionOUT/zwg" element={<TOzwg />} />
          <Route path="/tuitionOUT/payment" element={<TOpay />} />
          <Route path="/tuitionOUT/viewUSD" element={<TOVusd />} />
          <Route path="/tuitionOUT/viewZWG" element={<TOVzwg />} />

          {/*Invoices*/}
          <Route path='/levyOUT/viewInvoices' element={<ViewInvoices/>}/> 


          {/*Reports*/}
          <Route path="/reports/daily" element={<DailyReport />} />
          <Route path="/reports/monthly" element={<MonthlyReport />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/invoice/:studentId" element={<Invoice />} />

          {/* Financials */}
          <Route path="/financials" element={<FinancialLayout />}>
            <Route index element={<Financials/>}/>
            <Route path="/financials/Statements" element={<Statements />} />
            <Route path="/financials/Budget" element={<Budget />} />
            <Route path="/financials/HR" element={<HR />} />

            {/* Cashbooks */}
            <Route path="/financials/Cashbooks" element={<CSLevy />} />

            <Route path="/financials/Cashbooks/levy" element={<CSLevy />} />
            <Route path="/financials/Cashbooks/levyUSD" element={<CSLusd />} />
            <Route path="/financials/Cashbooks/levyZWG" element={<CSLzwg />} />
            <Route path="/financials/Cashbooks/previousCS" element={<PreviousCS />} />
            
            <Route path="/financials/Cashbooks/tuition" element={<CSTuition />} />
            <Route path="/financials/Cashbooks/tuitionUSD" element={<CSTusd />} />
            <Route path="/financials/Cashbooks/tuitionZWG" element={<CSTzwg />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />
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