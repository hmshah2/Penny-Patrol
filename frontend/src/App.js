import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Toast from './components/toast/toast';
import PieChart from './components/PieChart/PieChart';
import Header from './components/Header/Header';
import EmptyPage from './components/EmptyPage/EmptyPage';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [userId] = useState(null);
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

  const handleSignedIn = () => {
    setSignedIn(true);
    setShowToast(true);
    setToastType('success');
    setToastMessage('Login success!');
    setShowLogin(false);  
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Header activeNav={activeNav} setActiveNav={setActiveNav}/>
        <Routes>
          <Route path="/purchases" element={<EmptyPage title="Purchases" />} />
          <Route path="/spending-log" element={<EmptyPage title="Spending Log" />} />
          <Route path="/pie-chart" element={<PieChart userId={userId} />} />
          <Route path="/" element={
            <div>
              {signedIn ? 
                <button onClick={() => setSignedIn(false)}>Log Out</button> :
                <button onClick={() => setShowLogin(true)}>Log In</button>
              }
              {showLogin && 
                (showSignup ? 
                  <SignupForm 
                    onBackdropClick={() => setShowLogin(false)} 
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
          {signedIn && <Route path="*" element={<Navigate replace to="/purchases" />} />}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
