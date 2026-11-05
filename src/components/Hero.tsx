import React from 'react';
import { ArrowRight, ShieldCheck, Printer, Globe, Leaf } from 'lucide-react';
import zealnixSepiaHero from '../assets/images/Gritty Sepia Streetwear Editorial.png';

interface HeroProps {
  onShopClick: () => void;
  onCreateYoursClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onCreateYoursClick }) => {
  return (
    <section id="home" className="relative min-h-[88vh] lg:min-h-[92vh] bg-[#1C1611] text-[#F2F0E9] pt-24 sm:pt-28 pb-12 lg:pb-16 flex flex-col justify-between overflow-hidden">
      {/* =========================================================================
          FULL-WIDTH CINEMATIC BACKGROUND: images/Gritty Sepia Streetwear Editorial.png
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Main Background Image - Set to images/Gritty Sepia Streetwear Editorial.png */}
        <img
          src="/images/Gritty Sepia Streetwear Editorial.png"
          onError={(e) => {
            // fallback to bundled import if needed
            e.currentTarget.src = zealnixSepiaHero;
          }}
          alt="ZEALNIX Gritty Sepia Streetwear Editorial"
          className="w-full h-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-center brightness-[1.02] contrast-[1.04]"
        />

        {/* Ambient warm golden-beige spotlight highlighting the model silhouette */}
        <div className="absolute top-1/4 right-[8%] sm:right-[15%] w-[420px] sm:w-[620px] h-[420px] sm:h-[620px] bg-[radial-gradient(circle,rgba(213,195,170,0.25)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none mix-blend-screen" />

        {/* Left-side soft gradient scrim for crisp headline contrast while preserving the gritty sepia artwork */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#140E0A]/90 via-[#140E0A]/55 sm:via-[#140E0A]/25 to-transparent pointer-events-none" />
        
        {/* Subtle top header blend and bottom ground fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 via-transparent to-[#1C1611]/85 pointer-events-none" />

        {/* Subtle film grain texture */}
        <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />
      </div>

      {/* =========================================================================
          FOREGROUND CONTENT: HEADLINE, DESCRIPTION & BUTTONS
          ========================================================================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex-1 flex flex-col justify-center my-auto">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl py-6 sm:py-10">
          {/* Streetwear graphic kicker with editorial badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-grotesk font-bold text-[11px] tracking-[1px] uppercase text-[#EAE4DC] px-2.5 py-1 bg-[#3C2A21]/90 backdrop-blur-xs border border-[#D5C3AA]/40 shadow-xs">
              DROP VOL. 04 / 2026
            </span>
            <span className="text-[#D5C3AA] font-caveat text-xl sm:text-2xl font-bold -rotate-3 select-none drop-shadow-sm">
              ★ 100% heavy cotton
            </span>
          </div>

          {/* Oversized Ultra-Condensed Streetwear Headline */}
          <div className="relative select-none">
            {/* Crown sketch doodle above headline */}
            <div className="absolute -top-8 left-1 text-[#D5C3AA] opacity-90 -rotate-6 drop-shadow-sm">
              <svg width="42" height="26" viewBox="0 0 42 26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21 L8 6 L18 15 L24 3 L32 15 L39 7 L39 21 Z" />
                <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                <circle cx="24" cy="2" r="1.5" fill="currentColor" />
                <circle cx="39" cy="5" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <h1 className="font-anton uppercase tracking-[-0.02em] leading-[0.92] text-[clamp(44px,7.5vw,115px)] drop-shadow-md">
              <span className="block text-[#EAE4DC]">WEAR</span>
              <span className="relative inline-block my-1.5 z-10">
                {/* Layered background highlight box behind 'YOUR' */}
                <span className="absolute -inset-x-3 sm:-inset-x-4 inset-y-1 sm:inset-y-0.5 bg-[#D5C3AA] -rotate-1 shadow-md -z-10" />
                <span className="relative text-[#261C14] px-1 inline-block">YOUR</span>
                {/* Subtle graffiti stroke under YOUR */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-4 text-[#3C2A21]/80"
                  viewBox="0 0 200 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                >
                  <path d="M3 8 C 50 2, 120 12, 197 5" />
                </svg>
              </span>
              <span className="flex items-baseline text-[#EAE4DC]">
                STYLE.
                <span className="text-[#D5C3AA] text-3xl sm:text-5xl ml-1 font-mono">_</span>
              </span>
            </h1>
          </div>

          {/* Supporting Editorial Copy with Space Grotesk headline & Inter body */}
          <div className="mt-6 sm:mt-8 max-w-xl">
            <p className="font-grotesk text-lg sm:text-xl font-bold text-[#EAE4DC] tracking-normal leading-snug drop-shadow-sm">
              Premium Streetwear. Made for Your Ideas.
            </p>
            <p className="font-inter text-sm sm:text-base text-[#D5C3AA] mt-1.5 font-normal leading-relaxed drop-shadow-xs">
              Redefine your style with bold graphics, oversized fits, and streetwear built for those who dare to stand out.
            </p>
          </div>

          {/* CTA Buttons with Space Grotesk Bold and 1px tracking */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 font-grotesk">
            <button
              onClick={onShopClick}
              className="group px-8 py-4 bg-[#1A1815] text-white border border-white font-grotesk font-bold tracking-[1px] text-sm sm:text-base uppercase flex items-center gap-3 transition-all duration-200 hover:bg-[#25221E] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white shadow-lg cursor-pointer"
            >
              <span>SHOP THE DROP</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onCreateYoursClick}
              className="px-6 py-4 bg-[#0C0907]/70 backdrop-blur-xs hover:bg-[#3C2A21] text-[#EAE4DC] hover:text-[#D5C3AA] border border-[#D5C3AA] font-grotesk font-bold tracking-[1px] text-sm uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>CUSTOM DROP STUDIO</span>
              <span className="text-[10px] font-grotesk font-bold tracking-[1px] px-1.5 py-0.5 bg-[#D5C3AA] text-[#261C14]">
                STUDIO
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL TRUST INDICATORS ROW (INTEGRATED AT BOTTOM)
          ========================================================================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-8 sm:pt-10 border-t border-[#D5C3AA]/25 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 font-grotesk">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#3C2A21]/90 backdrop-blur-xs text-[#D5C3AA] border border-[#D5C3AA]/40 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[1px] text-[#EAE4DC] font-grotesk">
                PREMIUM QUALITY
              </h2>
              <p className="text-[11px] font-normal text-[#D5C3AA] mt-0.5 font-inter">
                460GSM heavy terry & organic cotton
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#3C2A21]/90 backdrop-blur-xs text-[#D5C3AA] border border-[#D5C3AA]/40 shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[1px] text-[#EAE4DC] font-grotesk">
                PRINTED ON DEMAND
              </h2>
              <p className="text-[11px] font-normal text-[#D5C3AA] mt-0.5 font-inter">
                Custom small batch screen printing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#3C2A21]/90 backdrop-blur-xs text-[#D5C3AA] border border-[#D5C3AA]/40 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[1px] text-[#EAE4DC] font-grotesk">
                WORLDWIDE SHIPPING
              </h2>
              <p className="text-[11px] font-normal text-[#D5C3AA] mt-0.5 font-inter">
                Tracked global express dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#3C2A21]/90 backdrop-blur-xs text-[#D5C3AA] border border-[#D5C3AA]/40 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[1px] text-[#EAE4DC] font-grotesk">
                SUSTAINABLE CHOICES
              </h2>
              <p className="text-[11px] font-normal text-[#D5C3AA] mt-0.5 font-inter">
                Zero mass landfill & eco inks
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
