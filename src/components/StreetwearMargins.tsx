import React, { useState, useEffect } from 'react';

/**
 * StreetwearMargins
 * Gen Z Brutalist & Y2K-inspired decorative side margins for ZEALNIX:
 * - Left: Fixed vertical brutalist typography bar ("ZEALNIX /// DROP 04 /// 100% HEAVYWEIGHT COTTON /// NO REPRINTS")
 * - Right: Sleek vertical scroll-progress bar with live dynamic percentage fill and Y2K tech metadata stamps
 * - Automatically hidden on mobile/tablet (hidden xl:flex) and non-blocking (pointer-events-none).
 */
export const StreetwearMargins: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const scrolled = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrolled / scrollHeight) * 100));
      setScrollProgress(Math.round(progress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* =========================================================================
          LEFT MARGIN: Fixed Vertical Brutalist Streetwear Text Bar
          ========================================================================= */}
      <aside
        aria-hidden="true"
        className="fixed left-0 top-0 bottom-0 z-30 w-12 2xl:w-16 hidden xl:flex flex-col items-center justify-between py-8 select-none pointer-events-none"
      >
        {/* Subtle decorative hairline border on right of left rail */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#261C14]/10 to-transparent" />

        {/* Top Technical Brand Stamp */}
        <div className="flex flex-col items-center gap-1.5 opacity-45">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#261C14]/40" />
            <span className="font-mono text-[9px] font-bold text-[#261C14] tracking-widest">
              ZN // 04
            </span>
          </div>
          <div className="w-4 h-[1px] bg-[#261C14]/25" />
          <span className="font-mono text-[8px] text-[#261C14]/60 tracking-wider">
            [SYS_OK]
          </span>
        </div>

        {/* Center: Vertical Brutalist Running Text */}
        <div className="flex items-center justify-center my-auto py-6">
          <div className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180">
            <span className="font-anton text-xs uppercase tracking-[0.3em] text-[#261C14]/30 hover:text-[#261C14]/60 transition-colors">
              ZEALNIX /// DROP 04 /// 100% HEAVYWEIGHT COTTON /// NO REPRINTS
            </span>
          </div>
        </div>

        {/* Bottom Editorial Stamp */}
        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-[8px] text-[#261C14] tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
            RAW ARCHIVE // 460GSM
          </span>
          <div className="w-1.5 h-1.5 border border-[#261C14]/60" />
        </div>
      </aside>

      {/* =========================================================================
          RIGHT MARGIN: Fixed Vertical Scroll-Progress & Y2K Tech Metadata
          ========================================================================= */}
      <aside
        aria-hidden="true"
        className="fixed right-0 top-0 bottom-0 z-30 w-12 2xl:w-16 hidden xl:flex flex-col items-center justify-between pt-8 pb-24 select-none pointer-events-none"
      >
        {/* Subtle decorative hairline border on left of right rail */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#261C14]/10 to-transparent" />

        {/* Top Y2K Tech Metadata Stamp */}
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="font-mono text-[9px] font-bold text-[#261C14] tracking-wider">
            [LAT 28.61° N]
          </div>
          <div className="font-mono text-[8px] text-[#261C14]/75 tracking-widest">
            // DROP_04
          </div>
          <div className="w-3 h-[1px] bg-[#261C14]/25 mt-0.5" />
        </div>

        {/* Center: Sleek Vertical Scroll Progress Rail & Indicator */}
        <div className="flex flex-col items-center gap-2.5 my-auto">
          {/* Micro Tech Label & Live Numeric Readout */}
          <span className="font-mono text-[8px] text-[#261C14]/40 tracking-wider">
            POS
          </span>
          <span className="font-mono text-[9px] font-bold text-[#261C14]/60 tabular-nums tracking-widest">
            {String(scrollProgress).padStart(3, '0')}%
          </span>

          {/* Vertical Progress Rail */}
          <div className="relative w-[3px] h-48 2xl:h-56 bg-[#261C14]/15 rounded-full overflow-hidden">
            {/* Dynamic Fill Indicator Line */}
            <div
              className="w-full bg-[#261C14] rounded-full transition-[height] duration-100 ease-out relative"
              style={{ height: `${scrollProgress}%` }}
            >
              {/* Subtle Warm Camel Accent Tip */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#D5C3AA] rounded-full shadow-[0_0_6px_rgba(213,195,170,0.9)]" />
            </div>
          </div>

          {/* Micro Tech Scale Ticks */}
          <div className="flex flex-col items-center gap-1 opacity-35 pt-1">
            <div className="w-2 h-[1px] bg-[#261C14]" />
            <div className="w-1 h-[1px] bg-[#261C14]" />
            <div className="w-1.5 h-[1px] bg-[#261C14]" />
          </div>
        </div>

        {/* Bottom Technical Status Stamp (positioned above BackToTop button) */}
        <div className="flex flex-col items-center gap-1.5 opacity-45">
          <span className="font-mono text-[8px] text-[#261C14] tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
            28.6139° N, 77.2090° E
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#261C14]/60 animate-pulse" />
            <span className="font-mono text-[7px] text-[#261C14]/70 uppercase tracking-widest">
              LIVE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
