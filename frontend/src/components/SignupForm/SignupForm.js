import React from 'react';

function SignupForm(props) {
  const { onBackdropClick, toggleSignup, onSignedIn, onError } = props;
  const [ errorMessage, setErrorMessage ] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const formData = new FormData(event.target);
    const data = {
      email: formData.get('email'),
      name: formData.get('name'),
      password: formData.get('password')
    };

    try {
      const response = await fetch('https://penny-patrol-api.onrender.com/api/users/signup', {
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
      console.log('Sign up successful:', result);
      onSignedIn();
      onBackdropClick();
    } catch (error) {
      console.error('Sign up failed:', error);
      setErrorMessage(error.message);
      onError();
    }
  };

  return (
    <div className="SignupForm">
      <div className='form-container'>
        <div className="backdrop" onClick={onBackdropClick}></div>
        <div className="form" onSubmit={e => handleSubmit(e)}>
          <div className="close-button" onClick={onBackdropClick}>X</div>
          <h2>Sign Up</h2>
          <div className="form-body">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" id="email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="text" name="password" id="password" />
              </div>
              {errorMessage && <div className="form-error-message">{errorMessage}</div>}
              <div className="form-group">
                <button type="submit">Signup</button>
              </div>
            </form>
          </div>
          <div className="form-footer">
            <p>Already have an account? <span className='link' onClick={toggleSignup}>Log in</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;