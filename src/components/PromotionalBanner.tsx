import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import chaosAdImage from '../assets/images/Chaos Oversized Fit Streetwear Ad.png';
import weaveFabricImage from '../assets/images/Gemini_Generated_Image_bzqkm8bzqkm8bzqk.png';
import puffScreenprintImage from '../assets/images/Gemini_Generated_Image_eou17peou17peou1.png';

interface PromotionalBannerProps {
  onExploreClick: () => void;
  onCreateYoursClick: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  onExploreClick,
  onCreateYoursClick
}) => {
  return (
    <section className="relative bg-[#0B0B0B] text-[#F2F0E9] py-20 lg:py-28 overflow-hidden torn-edge-top border-b-2 border-[#1a1a1a]">
      {/* Texture background */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D7FF00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical 3-zone editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left: Streetwear photo with taped corners & distressed vibe (4 cols) */}
          <div className="lg:col-span-4 relative order-2 lg:order-1">
            <div className="relative p-2 bg-[#141414] border border-[#333333] shadow-2xl -rotate-2 group">
              {/* Masking tape on top-left and top-right */}
              <div className="absolute -top-3.5 left-6 w-16 h-7 bg-[#E5E0D0]/80 border border-[#B8B8B0]/50 -rotate-6 shadow-sm z-20 pointer-events-none" />
              <div className="absolute -bottom-3 right-6 w-14 h-6 bg-[#E5E0D0]/80 border border-[#B8B8B0]/50 rotate-3 shadow-sm z-20 pointer-events-none" />

              <div className="aspect-[3/4] overflow-hidden bg-black">
                <img
                  src={chaosAdImage}
                  alt="Chaos Oversized Fit Streetwear Ad"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Streetwear stamp label */}
              <div className="p-3 bg-[#0B0B0B] border-t border-[#2a2a2a] flex items-center justify-between font-sans">
                <span className="font-sans font-bold text-[10px] uppercase text-[#B8B8B0] tracking-[0.05em]">
                  ARCHIVE // 04
                </span>
                <span className="font-anton text-sm text-[#D5C3AA] tracking-tight uppercase">
                  CHAOS OVERSIZED FIT
                </span>
              </div>
            </div>
          </div>

          {/* Center: Main Headline, Supporting Copy & Primary CTA (5 cols) */}
          <div className="lg:col-span-5 text-center lg:text-left z-10 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3C2A21] border border-[#D5C3AA]/40 mb-5 font-grotesk">
              <Sparkles className="w-3.5 h-3.5 text-[#D5C3AA]" />
              <span className="font-bold text-[11px] uppercase tracking-[1px] text-[#D5C3AA]">
                ZERO WASTE ON-DEMAND PRODUCTION
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-anton uppercase tracking-[-0.015em] text-5xl sm:text-6xl lg:text-7xl leading-[0.92] text-[#EAE4DC]">
              MADE FOR YOU.
              <span className="block mt-1">
                <span className="text-[#D5C3AA] inline-block relative">
                  PRINTED
                  {/* Imperfect marker underline */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#D5C3AA]"
                    viewBox="0 0 100 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M2 6 Q 50 1, 98 5" />
                  </svg>
                </span>{' '}
                ON DEMAND.
              </span>
            </h2>

            {/* Supporting Copy */}
            <div className="mt-6 space-y-2">
              <p className="font-grotesk text-xl font-bold text-[#EAE4DC] tracking-normal">
                “Your idea. Your style. Your way.”
              </p>
              <p className="font-inter text-base text-[#D5C3AA] font-normal leading-relaxed">
                “No limits. Just your imagination.” Every single piece is freshly custom-printed on demand in our studio using toxic-free water-based inks and industrial cure dryers.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 font-grotesk">
              <button
                onClick={onExploreClick}
                className="group px-8 py-4 bg-[#D5C3AA] text-[#261C14] font-bold tracking-[1px] text-sm uppercase flex items-center gap-3 transition-all duration-200 hover:bg-[#C5B095] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#D5C3AA] shadow-[0_0_20px_rgba(213,195,170,0.2)] cursor-pointer"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onCreateYoursClick}
                className="px-6 py-4 bg-transparent border border-[#D5C3AA]/50 hover:border-[#D5C3AA] text-[#EAE4DC] hover:text-[#D5C3AA] font-bold text-sm uppercase tracking-[1px] transition-colors cursor-pointer"
              >
                CUSTOMIZE NOW
              </button>
            </div>
          </div>

          {/* Right: Two Overlapping Close-Up Photographs & Handwritten Annotation (3 cols) */}
          <div className="lg:col-span-3 relative order-3 mt-6 lg:mt-0 font-grotesk">
            <div className="relative min-h-[380px] flex items-center justify-center">
              {/* Back photo: Macro fabric label */}
              <div className="absolute top-0 right-2 w-48 sm:w-56 aspect-square bg-[#111111] border border-[#3E403D] p-1.5 shadow-xl rotate-4 transition-transform duration-300 hover:rotate-2 z-10">
                <img
                  src={weaveFabricImage}
                  alt="Woven garment fabric and stitching detail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[1px] text-white">
                  460GSM WEAVE
                </div>
              </div>

              {/* Front overlapping photo: Silkscreen ink closeup */}
              <div className="absolute bottom-2 left-0 w-52 sm:w-60 aspect-[4/3] bg-[#111111] border-2 border-[#D7FF00] p-1.5 shadow-2xl -rotate-6 transition-transform duration-300 hover:-rotate-3 z-20">
                {/* Yellow tape sticker */}
                <div className="absolute -top-3 right-8 w-12 h-5 bg-[#D7FF00] text-[#0B0B0B] font-bold text-[9px] uppercase tracking-[1px] flex items-center justify-center -rotate-3 shadow-sm">
                  TACTILE
                </div>
                <img
                  src={puffScreenprintImage}
                  alt="Screen printing ink texture on heavy fabric"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-[#0B0B0B]/90 px-2 py-0.5 text-[9px] font-mono text-[#D7FF00]">
                  PUFF SCREENPRINT
                </div>
              </div>

              {/* Hand-drawn arrow & handwritten annotation */}
              <div className="absolute -bottom-10 right-4 z-30 flex items-center gap-2 text-[#D5C3AA] select-none pointer-events-none">
                <svg width="45" height="30" viewBox="0 0 50 35" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M42 28 C 30 15, 15 15, 6 12" />
                  <path d="M14 6 L 4 11 L 10 20" />
                </svg>
                <span className="font-caveat font-bold text-sm sm:text-base text-[#D5C3AA] tracking-wider rotate-3">
                  QUALITY YOU CAN FEEL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
