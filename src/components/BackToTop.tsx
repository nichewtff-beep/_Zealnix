import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45))'
      }}
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className="relative w-[58px] h-[44px] flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DED0] transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
      >
        {/* Horizontally stretched hexagon with 6 softly rounded corners */}
        <svg
          viewBox="0 0 58 44"
          className="w-[58px] h-[44px] overflow-visible select-none pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 15 3 L 43 3 Q 46 3 47.8 6.8 L 52.8 17.5 Q 55 22 52.8 26.5 L 47.8 37.2 Q 46 41 43 41 L 15 41 Q 12 41 10.2 37.2 L 5.2 26.5 Q 3 22 5.2 17.5 L 10.2 6.8 Q 12 3 15 3 Z"
            className="fill-[#38271F] group-hover:fill-[#4D362B] transition-colors duration-300"
          />
        </svg>

        {/* Centered minimal beige/off-white upward arrow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ArrowUp className="w-5 h-5 stroke-[2.25] text-[#E8DED0] transition-transform duration-200 group-hover:-translate-y-0.5" />
        </div>
      </button>
    </div>
  );
};
