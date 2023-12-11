import React from 'react';

function LoginForm(props) {
  const { onBackdropClick, toggleSignup, onSignedIn, onError } = props;
  const [ errorMessage, setErrorMessage ] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const formData = new FormData(event.target);
    const data = {
      nameOrEmail: formData.get('nameOrEmail'),
      password: formData.get('password')
    };

    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.data);
      }

      const result = await response.json();
      console.log('Login successful:', result);
      onSignedIn();
      onBackdropClick();
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.message);
      onError();
    }
  };

  return (
    <div className="LoginForm">
      <div className='form-container'>
        <div className="backdrop" onClick={onBackdropClick}></div>
        <div className="form" onSubmit={e => handleSubmit(e)}>
          <div className="close-button" onClick={onBackdropClick}>X</div>
          <h1>Login</h1>
          <div className="form-body">
            <form>
              <div className="form-group">
                <label htmlFor="nameOrEmail">Name or Email</label>
                <input type="text" name="nameOrEmail" id="nameOrEmail" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
              </div>
              {errorMessage && <div className="form-error-message">{errorMessage}</div>}
              <div className="form-group">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
          <div className="form-footer">
            <p>Don't have an account? <span className='link' onClick={toggleSignup}>Sign up</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;