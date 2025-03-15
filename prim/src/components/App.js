import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import LandingPage from './LandingPage';
import Layout from './layout';
import './App.css';
import Students from './pages/students';
import Levy from './pages/levy';
import StudentView from './pages/StudentView';
import Tuition from './pages/tuition';



function App() {

  const location = useLocation();
  const noLayoutPaths = ['/login', '/signup'];

  return (
    <div className="App">
      {!noLayoutPaths.includes(location.pathname) && <Layout />}
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/landing" element={<LandingPage />} />

        <Route path="/students" element={<Students />} />

        <Route path="/levy" element={<Levy />} />

        <Route path="/tuition" element={<Tuition />} />

        <Route path="/students/:studentId" element={<StudentView />} />

        <Route path="/" element={<Login />} />
      </Routes>
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