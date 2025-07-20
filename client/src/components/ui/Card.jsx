import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-8 max-w-md w-full mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Card;
