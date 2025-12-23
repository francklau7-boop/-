import React from 'react';

interface VesynAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const VesynAvatar: React.FC<VesynAvatarProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 shadow-sm overflow-hidden ${sizeClasses[size]} ${className}`}>
      {/* Consultant Illustration: Xiao Wei */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full translate-y-[10%]">
        
        {/* Background Circle (Abstract Aura) */}
        <circle cx="50" cy="50" r="50" fill="#EEF2FF" />

        {/* Body/Blazer */}
        <path d="M20 90 C20 75 30 70 50 70 C70 70 80 75 80 90 V100 H20 V90 Z" fill="#312E81" /> {/* Indigo Blazer */}
        <path d="M42 70 L50 85 L58 70" fill="white" /> {/* White Shirt V-neck */}

        {/* Neck */}
        <rect x="42" y="55" width="16" height="20" fill="#FFD1BA" /> 

        {/* Face Shape */}
        <path d="M35 30 C35 30 35 62 50 62 C65 62 65 30 65 30" fill="#FFD1BA" />
        <path d="M35 30 L65 30 L65 35 L35 35 Z" fill="#FFD1BA" /> {/* Forehead fix */}

        {/* Hair (Short Bob, Fashionable) */}
        <path d="M30 35 C25 10 75 10 70 35 C70 55 65 60 62 55" stroke="#1E1B4B" strokeWidth="12" strokeLinecap="round" />
        <path d="M32 30 C32 10 45 10 45 25" stroke="#1E1B4B" strokeWidth="8" strokeLinecap="round" /> {/* Bangs */}

        {/* Glasses (Professional Touch) */}
        <g opacity="0.9">
             <circle cx="42" cy="45" r="7" stroke="#4F46E5" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
             <circle cx="58" cy="45" r="7" stroke="#4F46E5" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
             <line x1="49" y1="45" x2="51" y2="45" stroke="#4F46E5" strokeWidth="1.5" />
        </g>

        {/* Smile (Confident) */}
        <path d="M45 55 Q50 58 55 55" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />

      </svg>
      
      {/* Online Status */}
      <div className="absolute bottom-0 right-0 w-[20%] h-[20%] bg-emerald-500 border-2 border-white rounded-full shadow-sm z-10"></div>
    </div>
  );
};

export default VesynAvatar;