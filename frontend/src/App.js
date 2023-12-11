import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Toast from './components/toast/toast';

function App() {
  const [showLogin, setShowLogin] = React.useState(false);
  const [showSignup, setShowSignup] = React.useState(false);
  const [signedIn, setSignedIn] = React.useState(false);
  // toasts
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState('');

  React.useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div className="App">
      {signedIn ? 
        <button onClick={() => setSignedIn(false)}>Log Out</button> :
        <button onClick={() => setShowLogin(true)}>Log In</button>
      }
      {showLogin && 
        (showSignup ? 
          <SignupForm 
            onBackdropClick={() => {setShowLogin(false); setShowSignup(false)}} 
            toggleSignup={() => setShowSignup(false)} 
            onSignedIn={() => {
              setSignedIn(true);
              setShowToast(true);
              setToastType('success');
              setToastMessage('Sign up success!');
            }} 
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
            onSignedIn={() => {
              setSignedIn(true);
              setShowToast(true);
              setToastType('success');
              setToastMessage('Login success!');
            }} 
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
  );
}

export default App;
