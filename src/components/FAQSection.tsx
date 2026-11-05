import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQSectionProps {
  onOpenFAQModal: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenFAQModal }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ZEALNIX on-demand production work?',
      a: 'Unlike traditional brands that mass-produce thousands of unsold garments, every ZEALNIX drop item and bespoke order is freshly printed and cured upon receiving your order. This takes 24-48 hours before tracked dispatch.'
    },
    {
      q: 'What is the sizing fit like?',
      a: 'All our tees and hoodies feature our signature boxy, dropped-shoulder oversized cut. If you want a classic street oversized drape, order your true size. If you prefer a closer standard fit, we recommend sizing down one size.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We stand 100% behind our craftsmanship. We offer 30-day hassle-free size exchanges and returns on unworn items with tags intact across India.'
    },
    {
      q: 'Can I print my own custom graphic or brand drop?',
      a: 'Yes! Open our "CREATE YOURS STUDIO" in the top navigation. You can select your garment, base wash, customize slogans, pick graphic emblems, and order your custom drop starting from just a single piece.'
    },
    {
      q: 'Where do you ship and what are delivery timelines?',
      a: 'We provide express tracked delivery to all major pin codes across India. Standard orders arrive within 3-5 business days post-production.'
    }
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="bg-[#241B13] text-[#EAE4DC] py-20 lg:py-28 border-t-2 border-[#D5C3AA]/30 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18110B] border border-[#D5C3AA]/30 mb-3 font-grotesk text-xs text-[#D5C3AA] font-bold uppercase tracking-[1px]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TRANSPARENCY & ORDER POLICIES</span>
          </div>

          <h2 className="font-anton uppercase text-4xl sm:text-5xl lg:text-6xl tracking-[-0.015em] text-[#EAE4DC]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="font-inter text-sm text-[#D5C3AA]/80 mt-3 max-w-xl mx-auto">
            Everything you need to know regarding garment sizing, on-demand dispatch, 30-day exchanges, and custom studio prints.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#1C140E] border border-[#D5C3AA]/25 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#201710] transition-colors"
                >
                  <span className="font-anton uppercase text-lg sm:text-xl tracking-tight text-[#EAE4DC]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D5C3AA] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-inter text-[#B8B8B0] leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to open full legal / FAQ modal */}
        <div className="mt-8 text-center">
          <button
            onClick={onOpenFAQModal}
            className="inline-flex items-center gap-2 text-xs font-grotesk font-bold uppercase tracking-[1.5px] text-[#D5C3AA] hover:text-[#EAE4DC] transition-colors cursor-pointer group"
          >
            <span>VIEW COMPLETE SHIPPING & PRIVACY POLICIES</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
