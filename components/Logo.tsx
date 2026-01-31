import React from 'react';

const Logo: React.FC<{ size?: number, className?: string }> = ({ size = 40, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Artistic background shape */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-lg rounded-full"></div>
        
        {/* SVG Calligraphy for "Taha" */}
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                d="M45 65C45 65 35 65 30 55C25 45 35 30 50 30C65 30 70 40 70 55V75M70 55C70 55 80 55 85 45M50 30V15" 
                stroke="url(#grad1)" 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient id="grad1" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#059669" />
                    <stop offset="1" stopColor="#D97706" />
                </linearGradient>
            </defs>
        </svg>
      </div>
      <span className="font-kufi font-bold text-2xl text-emerald-900 tracking-wide">طـه</span>
    </div>
  );
};

export default Logo;
