
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Toast from './components/toast/toast';
import PieChart from './components/PieChart/PieChart';
import Header from './components/Header/Header';
// import EmptyPage from './components/EmptyPage/EmptyPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Budget from './components/Budget/Budget';
import Transaction from './components/Transactions/Transaction';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [userId, setUserId] = useState(null); 
  const [activeNav, setActiveNav] = useState('Financial Analysis');

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);
  
  useEffect(() => {
    const isUserSignedIn = localStorage.getItem('signedIn') === 'true';
    const storedUserId = localStorage.getItem('userId');
    if (isUserSignedIn && storedUserId) {
      setSignedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleSignedIn = (userId) => {
    setSignedIn(true);
    setUserId(userId); 
    localStorage.setItem('signedIn', true);
    localStorage.setItem('userId', userId);  
    setShowToast(true);
    setToastType('success');
    setToastMessage('Login success!');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setSignedIn(false);
    setUserId(null); 
    localStorage.removeItem('signedIn');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <div className="App">
        {signedIn && <Header activeNav={activeNav} setActiveNav={setActiveNav} onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={
            signedIn ? 
              <ProtectedRoute signedIn={signedIn}>
                <Navigate replace to="/pie-chart" />
              </ProtectedRoute>
              :
              <div className='landing-page'>
                <h1>Welcome to Penny Patrol</h1>
                <h3>Your BEST financial tracker.</h3>
                <button className='login-button' onClick={() => setShowLogin(true)}>Login</button>
                {showLogin && 
                  (showSignup ? 
                    <SignupForm 
                      onBackdropClick={() => {setShowLogin(false); setShowSignup(false);}} 
                      toggleSignup={() => setShowSignup(false)} 
                      onSignedIn={handleSignedIn}
                      onError={() => {
                        setShowToast(true);
                        setToastType('error');
                        setToastMessage('Sign up failed!');
                      }}
                    /> 
                    : 
                    <LoginForm 
                      onBackdropClick={() => setShowLogin(false)} 
                      toggleSignup={() => setShowSignup(true)} 
                      onSignedIn={handleSignedIn}
                      onError={() => {
                        setShowToast(true);
                        setToastType('error');
                        setToastMessage('Login failed!');
                      }}
                    />
                  )
                }
                <Toast type={toastType} message={toastMessage} isVisible={showToast} />
              </div>
          } />
          {signedIn && (
            <>
              <Route 
                path="/budget" 
                element={<Budget title="Budget" />}
              />
              <Route 
                path="/transactions" 
                element={<Transaction userId={userId} />}
              />
              <Route 
                path="/pie-chart" 
                element={<PieChart userId={userId} />}
              />
            </>
          )}
          {signedIn && <Route path="*" element={<Navigate replace to="/purchases" />} />}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;