import React from 'react';
import { Sparkles, Shirt, Layers, ArrowRight } from 'lucide-react';

interface CreateYoursSectionProps {
  onOpenStudio: () => void;
}

export const CreateYoursSection: React.FC<CreateYoursSectionProps> = ({ onOpenStudio }) => {
  const garments = [
    {
      type: 'Heavyweight Hoodie',
      gsm: '460GSM French Terry',
      price: '₹1,499',
      cut: 'Oversized Boxy Cut',
      image: '/src/assets/images/product_chaos_club_1791889113498.jpg',
      desc: 'Double-layered hood, kangaroo pocket, raw drop-shoulder drape.'
    },
    {
      type: 'Vintage Boxy Tee',
      gsm: '280GSM Combed Cotton',
      price: '₹699',
      cut: 'Dropped Shoulders',
      image: '/src/assets/images/product_good_days_1791889114917.jpg',
      desc: 'Ribbed 1.25" collar, mineral wash finish, tight neck line.'
    },
    {
      type: 'Thermal Long Sleeve',
      gsm: '340GSM Milled Waffle',
      price: '₹899',
      cut: 'Relaxed Streetwear Drape',
      image: '/src/assets/images/brand_editorial_texture_1791889116081.jpg',
      desc: 'Reinforced cuff ribs, textured honeycomb weave, split hem.'
    }
  ];

  return (
    <section id="create-yours" className="bg-[#1B130D] text-[#EAE4DC] py-20 lg:py-28 border-t-2 border-[#D5C3AA]/30 relative overflow-hidden">
      {/* Background grit overlay */}
      <div className="absolute inset-0 bg-noise opacity-25 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D5C3AA]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D5C3AA]/20">
          <div>
            <div className="flex items-center gap-2 mb-3 font-grotesk">
              <span className="font-bold text-xs uppercase tracking-[1px] text-[#D5C3AA]">
                ON-DEMAND BESPOKE SILKSCREEN
              </span>
              <span className="text-xs font-mono text-[#D5C3AA]/40">/</span>
              <span className="font-bold text-xs uppercase tracking-[1px] text-[#EAE4DC]/70">
                0 MINIMUM ORDER QUANTITY
              </span>
            </div>

            <h2 className="font-anton uppercase text-5xl sm:text-6xl lg:text-7xl tracking-[-0.015em] leading-[0.92] text-[#EAE4DC]">
              CREATE YOURS STUDIO
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#D5C3AA]/80 mt-4 max-w-2xl leading-relaxed">
              Design your own 1-of-1 streetwear piece. Choose your heavyweight blank, select washed colorways, customize slogans, and position brutalist graphic art. Hand-printed piece-by-piece.
            </p>
          </div>

          <button
            onClick={onOpenStudio}
            className="group px-7 py-4 bg-[#D5C3AA] hover:bg-[#EAE4DC] text-[#261C14] font-grotesk font-black text-xs uppercase tracking-[1.5px] flex items-center gap-3 transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#261C14]" />
            <span>LAUNCH 3D STUDIO ✦</span>
          </button>
        </div>

        {/* 3 Blank Silhouettes Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {garments.map((g, idx) => (
            <div
              key={idx}
              onClick={onOpenStudio}
              className="bg-[#241B13] border border-[#D5C3AA]/25 hover:border-[#D5C3AA] p-6 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] text-[#D5C3AA] mb-4">
                  <span>BLANK_0{idx + 1}</span>
                  <span className="px-2 py-0.5 bg-[#1B130D] border border-[#D5C3AA]/30">{g.gsm}</span>
                </div>

                <div className="aspect-[4/3] bg-[#140E0A] overflow-hidden mb-5 border border-white/5 relative">
                  <img
                    src={g.image}
                    alt={g.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 right-2 p-1.5 bg-[#1B130D]/80 backdrop-blur-xs text-[#D5C3AA] text-[10px] font-mono">
                    CUSTOMIZABLE
                  </div>
                </div>

                <h3 className="font-anton uppercase text-2xl tracking-tight text-[#EAE4DC] group-hover:text-[#D5C3AA] transition-colors">
                  {g.type}
                </h3>
                <p className="font-inter text-xs text-[#B8B8B0] mt-2 leading-relaxed">
                  {g.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-mono text-[#8C8D88]">STARTING FROM</span>
                  <span className="font-grotesk font-black text-lg text-[#D5C3AA]">{g.price}</span>
                </div>
                <span className="font-grotesk font-bold text-xs uppercase tracking-[1px] text-[#EAE4DC] group-hover:text-[#D5C3AA] flex items-center gap-1">
                  <span>CUSTOMIZE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#D5C3AA]/20 font-grotesk text-xs text-[#D5C3AA]/80">
          <div className="flex items-center gap-2">
            <span className="text-[#D5C3AA] font-bold">✓</span>
            <span>Zero Minimum Order</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#D5C3AA] font-bold">✓</span>
            <span>Real Silkscreen & Discharge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#D5C3AA] font-bold">✓</span>
            <span>Live Interactive Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#D5C3AA] font-bold">✓</span>
            <span>Fast 24-48hr Print Dispatch</span>
          </div>
        </div>
      </div>
    </section>
  );
};
