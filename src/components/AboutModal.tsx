import React from 'react';
import { X, Sparkles, Shield, Leaf, Factory } from 'lucide-react';
import { ZealnixLogo } from './ZealnixLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreDrop?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0B0B] text-[#F2F0E9] border-2 border-[#262626] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        <div className="p-4 sm:p-6 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <ZealnixLogo size="sm" />
            <h2 className="font-anton uppercase text-2xl tracking-tight text-[#F2F0E9]">
              THE ZEALNIX MANIFESTO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#B8B8B0] hover:text-[#D7FF00] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div>
            <span className="font-mono text-xs text-[#D7FF00] uppercase font-bold tracking-widest block mb-1">
              ANTI-MASS PRODUCTION
            </span>
            <h3 className="font-anton text-3xl sm:text-4xl uppercase text-[#F2F0E9] leading-tight">
              WE DON&apos;T MAKE CLOTHES FOR WAREHOUSES. WE MAKE THEM FOR MINDS.
            </h3>
            <p className="text-sm text-[#B8B8B0] mt-3 leading-relaxed">
              ZEALNIX was born from frustration with disposable fast fashion and uninspired corporate streetwear drops. We believe your garment should be an uncompromised billboard for your raw thoughts, creative energy, and rebellious ideas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#3E403D]">
            <div className="p-4 bg-[#202120] border border-[#3E403D]">
              <Factory className="w-5 h-5 text-[#D7FF00] mb-2" />
              <h4 className="font-anton text-base uppercase tracking-tight text-white">ON-DEMAND SILKSCREEN</h4>
              <p className="text-xs text-[#B8B8B0] mt-1 font-sans font-normal leading-relaxed">
                Printed piece-by-piece to order. Zero overstock and zero landfill waste.
              </p>
            </div>

            <div className="p-4 bg-[#202120] border border-[#3E403D]">
              <Shield className="w-5 h-5 text-[#D7FF00] mb-2" />
              <h4 className="font-anton text-base uppercase tracking-tight text-white">460GSM HEAVY TERRY</h4>
              <p className="text-xs text-[#B8B8B0] mt-1 font-sans font-normal leading-relaxed">
                Custom milled combed heavyweight cotton built to last a lifetime of wear.
              </p>
            </div>

            <div className="p-4 bg-[#202120] border border-[#3E403D]">
              <Leaf className="w-5 h-5 text-[#D7FF00] mb-2" />
              <h4 className="font-anton text-base uppercase tracking-tight text-white">SOLVENT-FREE INKS</h4>
              <p className="text-xs text-[#B8B8B0] mt-1 font-sans font-normal leading-relaxed">
                Eco water-based pigments with high tactile puff relief and zero microplastics.
              </p>
            </div>
          </div>

          {/* Bottom section closes cleanly with the manifesto feature cards */}
        </div>
      </div>
    </div>
  );
};
