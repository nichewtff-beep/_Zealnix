import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Instagram, Youtube } from 'lucide-react';
import { ZealnixLogo } from './ZealnixLogo';

interface FooterProps {
  onCreateYoursClick: () => void;
  onOpenFAQ: () => void;
  onOpenAbout: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onCreateYoursClick,
  onOpenFAQ,
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin
}) => {

  const handleOpenPrivacy = () => {
    if (onOpenPrivacy) {
      onOpenPrivacy();
    } else {
      onOpenFAQ();
    }
  };

  const handleOpenTerms = () => {
    if (onOpenTerms) {
      onOpenTerms();
    } else {
      onOpenFAQ();
    }
  };

  return (
    <footer className="bg-[#000000] text-[#F2F0E9] border-t-2 border-white/10 relative overflow-hidden footer-jetblack">
      {/* 4 Benefit Groups Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Benefit 1: CREATE YOUR OWN */}
            <div
              onClick={onCreateYoursClick}
              className="flex items-start gap-4 group cursor-pointer"
            >
              <div className="p-2.5 bg-[#343634] text-[#F2F0E9] group-hover:text-[#D7FF00] group-hover:border-[#D7FF00] border border-[#444643] transition-colors shrink-0">
                <Sparkles className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="font-anton text-lg tracking-tight uppercase text-[#F2F0E9] group-hover:text-[#D7FF00] transition-colors">
                  CREATE YOUR OWN
                </h3>
                <p className="font-inter text-xs text-[#B8B8B0] mt-1 font-normal leading-relaxed">
                  Personalize your design in a few easy steps. Zero minimum order.
                </p>
              </div>
            </div>

            {/* Benefit 2: SECURE PAYMENTS */}
            <div className="flex items-start gap-4 group">
              <div className="p-2.5 bg-[#343634] text-[#F2F0E9] group-hover:text-[#D7FF00] group-hover:border-[#D7FF00] border border-[#444643] transition-colors shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="font-anton text-lg tracking-tight uppercase text-[#F2F0E9]">
                  SECURE PAYMENTS
                </h3>
                <p className="font-inter text-xs text-[#B8B8B0] mt-1 font-normal leading-relaxed">
                  Safe, fast, and trusted checkout via 256-bit encrypted gateways.
                </p>
              </div>
            </div>

            {/* Benefit 3: HAPPINESS GUARANTEED */}
            <div className="flex items-start gap-4 group">
              <div className="p-2.5 bg-[#343634] text-[#F2F0E9] group-hover:text-[#D7FF00] group-hover:border-[#D7FF00] border border-[#444643] transition-colors shrink-0">
                <HeartHandshake className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="font-anton text-lg tracking-tight uppercase text-[#F2F0E9]">
                  HAPPINESS GUARANTEED
                </h3>
                <p className="font-inter text-xs text-[#B8B8B0] mt-1 font-normal leading-relaxed">
                  Love it, or we&apos;ll help make it right with easy 30-day exchanges.
                </p>
              </div>
            </div>

            {/* Benefit 4: FOLLOW US */}
            <div className="flex items-start gap-4 group">
              <div className="p-2.5 bg-[#343634] text-[#F2F0E9] group-hover:text-[#D7FF00] group-hover:border-[#D7FF00] border border-[#444643] transition-colors shrink-0">
                <Instagram className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="font-anton text-lg tracking-tight uppercase text-[#F2F0E9]">
                  FOLLOW US
                </h3>
                <p className="font-inter text-xs text-[#B8B8B0] mt-1 font-normal leading-relaxed">
                  Join our global underground drop network:
                </p>
                <div className="flex items-center gap-3 mt-2 text-[#B8B8B0] font-grotesk font-bold text-xs tracking-[0.03em]">
                  <a
                    href="#instagram"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[#D7FF00] transition-colors"
                    title="Instagram @zealnix"
                  >
                    IG
                  </a>
                  <span>·</span>
                  <a
                    href="#tiktok"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[#D7FF00] transition-colors"
                    title="TikTok @zealnix"
                  >
                    TIKTOK
                  </a>
                  <span>·</span>
                  <a
                    href="#youtube"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[#D7FF00] transition-colors"
                    title="YouTube @zealnix"
                  >
                    YT
                  </a>
                  <span>·</span>
                  <a
                    href="#pinterest"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[#D7FF00] transition-colors"
                    title="Pinterest @zealnix"
                  >
                    PINTEREST
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <ZealnixLogo size="lg" />
            <p className="font-inter text-xs sm:text-sm text-[#B8B8B0] max-w-sm font-normal leading-relaxed">
              Expressive, rebellious Gen-Z streetwear. Designed to wear your ideas without corporate compromise. Heavyweight bespoke drops made for you, not the masses.
            </p>
            <div className="font-grotesk font-bold text-xs text-[#D7FF00] tracking-[1px] uppercase">
              PAN INDIA AVAILABLE
            </div>
          </div>

          {/* Nav & Info Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-inter text-xs">
            <div>
              <h4 className="font-grotesk text-[#F2F0E9] font-bold uppercase tracking-[1px] mb-3">
                COLLECTIONS
              </h4>
              <ul className="space-y-2 text-[#B8B8B0] font-normal">
                <li><a href="#the-drop" className="hover:text-[#D7FF00] transition-colors">THE DROP VOL. 04</a></li>
                <li><button onClick={onCreateYoursClick} className="hover:text-[#D7FF00] transition-colors text-left cursor-pointer">CUSTOM STUDIO</button></li>
                <li><a href="#the-drop" className="hover:text-[#D7FF00] transition-colors">HEAVY HOODIES</a></li>
                <li><a href="#the-drop" className="hover:text-[#D7FF00] transition-colors">GRAPHIC TEES</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-grotesk text-[#F2F0E9] font-bold uppercase tracking-[1px] mb-3">
                CUSTOMER CARE
              </h4>
              <ul className="space-y-2 text-[#B8B8B0] font-normal">
                <li><button onClick={onOpenFAQ} className="hover:text-[#D7FF00] transition-colors text-left cursor-pointer">ORDER FAQ</button></li>
                <li><button onClick={onOpenFAQ} className="hover:text-[#D7FF00] transition-colors text-left cursor-pointer">SHIPPING & DISPATCH</button></li>
                <li><button onClick={onOpenFAQ} className="hover:text-[#D7FF00] transition-colors text-left cursor-pointer">RETURNS & SIZING</button></li>
                <li><button onClick={() => { if (onOpenContact) { onOpenContact(); } else { onOpenAbout(); } }} className="hover:text-[#D7FF00] transition-colors text-left cursor-pointer uppercase">CONTACT US / CONCIERGE</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-grotesk text-[#F2F0E9] font-bold uppercase tracking-[1px] mb-3">
                LEGAL & ETHICS
              </h4>
              <ul className="space-y-2 text-[#B8B8B0] font-normal">
                <li><button onClick={handleOpenTerms} className="hover:text-[#D7FF00] transition-colors text-left cursor-pointer uppercase">TERMS OF SERVICE</button></li>
                <li><button onClick={handleOpenPrivacy} className="hover:text-[#D7FF00] transition-colors text-left cursor-pointer uppercase">PRIVACY POLICY</button></li>
                <li><a href="#sustainability" onClick={(e) => { e.preventDefault(); onOpenAbout(); }} className="hover:text-[#D7FF00] transition-colors">ZERO-WASTE CHARTER</a></li>
                <li>
                  <a
                    href="#/admin/login"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onOpenAdmin) {
                        onOpenAdmin();
                      } else {
                        window.location.hash = '#/admin/login';
                      }
                    }}
                    className="hover:text-[#D7FF00] transition-colors cursor-pointer uppercase font-medium"
                  >
                    ADMIN
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Navigation Row */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-grotesk">
            {/* Left: Copyright notice */}
            <div className="text-center sm:text-left text-[#8C8D88] font-normal tracking-wide">
              © {new Date().getFullYear()} ZEALNIX INC. ALL RIGHTS RESERVED. WEAR YOUR IDEA.
            </div>

            {/* Legal & region navigation */}
            <nav
              aria-label="Footer legal and region navigation"
              className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 text-xs tracking-wider font-medium"
            >
              <button
                type="button"
                onClick={handleOpenPrivacy}
                className="text-[#D5C3AA] hover:text-[#EAE4DC] transition-colors cursor-pointer py-1 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D5C3AA]"
              >
                Privacy Policy
              </button>
              <span className="text-white/20 select-none font-light" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={handleOpenTerms}
                className="text-[#D5C3AA] hover:text-[#EAE4DC] transition-colors cursor-pointer py-1 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D5C3AA]"
              >
                Terms & Conditions
              </button>
              <span className="text-white/20 select-none font-light" aria-hidden="true">|</span>
              <span className="text-[#D5C3AA] select-none py-1">
                India
              </span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
