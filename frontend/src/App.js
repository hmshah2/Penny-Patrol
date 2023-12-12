
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Toast from './components/toast/toast';
import PieChart from './components/PieChart/PieChart';
import Header from './components/Header/Header';
import EmptyPage from './components/EmptyPage/EmptyPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [userId, setUserId] = useState(null); // Assume you will set this upon login
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

  const handleSignedIn = (userId) => {
    setSignedIn(true);
    setUserId(userId); // Set the user ID upon successful login
    setShowToast(true);
    setToastType('success');
    setToastMessage('Login success!');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setSignedIn(false);
    setUserId(null); 
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
                {/* Redirect to a default protected page after login */}
                <Navigate replace to="/purchases" />
              </ProtectedRoute>
              :
              <div>
                <button onClick={() => setShowLogin(true)}>Log In</button>
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
          {signedIn && (
            <>
              <Route 
                path="/purchases" 
                element={<EmptyPage title="Purchases" />}
              />
              <Route 
                path="/spending-log" 
                element={<EmptyPage title="Spending Log" />}
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