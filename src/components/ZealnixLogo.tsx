import React from 'react';
import angularWordmarkImage from '../assets/images/Angular ZEALNIX Wordmark.png';
import geminiLogoImage from '../assets/images/Gemini_Generated_Image_r1n20ur1n20ur1n2.png';

interface ZealnixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  monogramColor?: string;
  textColor?: string;
  accentColor?: string;
  useRawImage?: boolean;
}

export const ZealnixMonogram: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 32,
  color = 'currentColor',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
    >
      {/* Outer framing box */}
      <rect
        x="28"
        y="16"
        width="44"
        height="68"
        stroke={color}
        strokeWidth="7"
        strokeLinejoin="miter"
      />
      {/* Interlocking geometric 'Z' */}
      <path
        d="M 16 32 L 62 32 L 22 72 L 68 72"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Interlocking geometric 'N' upright & diagonal crossover */}
      <path
        d="M 68 32 L 68 72 M 38 42 L 84 72 L 84 32"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
};

export const ZealnixLogo: React.FC<ZealnixLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  monogramColor = 'text-[#D7FF00]',
  textColor = 'text-[#F2F0E9]',
  accentColor = 'text-[#D7FF00]',
  useRawImage = true
}) => {
  const wordmarkHeights = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-16'
  };

  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16'
  };

  if (!showWordmark) {
    return (
      <div className={`inline-flex items-center shrink-0 ${iconDimensions[size]} ${className}`}>
        <ZealnixMonogram size={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 56} color="#D7FF00" />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none group ${className}`}>
      <img
        src={angularWordmarkImage}
        alt="ZEALNIX"
        referrerPolicy="no-referrer"
        className={`${wordmarkHeights[size]} w-auto object-contain mix-blend-screen transition-transform duration-200 group-hover:scale-105 filter drop-shadow-[0_0_10px_rgba(215,255,0,0.35)]`}
      />
    </div>
  );
};
