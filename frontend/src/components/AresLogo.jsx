import React from 'react';

const AresLogo = ({ className = "", animated = false }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Radar Ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeOpacity="0.2"
        className={animated ? "animate-[spin_4s_linear_infinite] origin-center" : ""}
        strokeDasharray={animated ? "70 200" : "none"}
      />
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeOpacity="0.1"
      />
      
      {/* Crosshairs */}
      <line x1="50" y1="5" x2="50" y2="15" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="50" y1="85" x2="50" y2="95" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="5" y1="50" x2="15" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="85" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />

      {/* Geometric 'A' */}
      <path 
        d="M50 25 L25 75 L35 75 L42.5 55 L57.5 55 L65 75 L75 75 Z" 
        fill="currentColor"
        className={animated ? "animate-pulse" : ""}
      />
      {/* Inner triangle of 'A' */}
      <path 
        d="M50 35 L45 48 L55 48 Z" 
        fill="#0a0f1c" 
      />
    </svg>
  );
};

export default AresLogo;
