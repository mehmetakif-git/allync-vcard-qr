import React from 'react';

const ShinyText = ({ text, className = '', speed = 5 }) => {
  return (
    <div
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animation: `shine ${speed}s linear infinite`,
        paddingLeft: '0.1em',
        paddingRight: '0.1em',
        overflow: 'visible',
        lineHeight: '1.2'
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;