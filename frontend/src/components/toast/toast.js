import React from 'react';

const Toast = ({ type, message, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  if (type === 'error') {
    return (
      <div className="toast-error">
        {message}
      </div>
    );
  }
  
  return (
    <div className="toast-success">
      {message}
    </div>
  );
};

export default Toast;
