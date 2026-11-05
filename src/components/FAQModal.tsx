import React, { useState, useEffect } from 'react';
import { X, ChevronDown, FileText, Shield, HelpCircle } from 'lucide-react';
import { ZealnixLogo } from './ZealnixLogo';

export type LegalModalTab = 'faq' | 'terms' | 'privacy';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalModalTab;
}

export const FAQModal: React.FC<FAQModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'faq'
}) => {
  const [activeTab, setActiveTab] = useState<LegalModalTab>(initialTab);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-[#241B13] text-[#EAE4DC] border-2 border-[#D5C3AA]/30 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-[#D5C3AA]/20 flex items-center justify-between bg-[#1C140E]">
          <div className="flex items-center gap-3">
            <ZealnixLogo size="sm" />
            <span className="font-grotesk text-xs uppercase tracking-[1.5px] font-bold text-[#D5C3AA]">
              CUSTOMER CONCIERGE & CARE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#E8DED0] hover:text-[#FFFFFF] hover:bg-white/10 transition-colors cursor-pointer rounded"
            aria-label="Close FAQ dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation for FAQs & Legal */}
        <div className="flex border-b border-[#D5C3AA]/20 bg-[#18110B] font-grotesk text-xs font-bold uppercase tracking-[1px]">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'faq'
                ? 'border-[#D5C3AA] text-[#D5C3AA] bg-[#241B13]'
                : 'border-transparent text-[#EAE4DC]/60 hover:text-[#EAE4DC]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#D5C3AA] text-[#D5C3AA] bg-[#241B13]'
                : 'border-transparent text-[#EAE4DC]/60 hover:text-[#EAE4DC]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#D5C3AA] text-[#D5C3AA] bg-[#241B13]'
                : 'border-transparent text-[#EAE4DC]/60 hover:text-[#EAE4DC]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {activeTab === 'faq' && (
            <div>
              {/* Header inside FAQ tab matching original FAQ design */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18110B] border border-[#D5C3AA]/30 mb-3 font-grotesk text-xs text-[#D5C3AA] font-bold uppercase tracking-[1px]">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>TRANSPARENCY & ORDER POLICIES</span>
                </div>

                <h2 className="font-anton uppercase text-3xl sm:text-4xl lg:text-5xl tracking-[-0.015em] text-[#EAE4DC]">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
                <p className="font-inter text-xs sm:text-sm text-[#D5C3AA]/80 mt-2.5 max-w-lg mx-auto leading-relaxed">
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
                      className="bg-[#1C140E] border border-[#D5C3AA]/25 hover:border-[#D5C3AA]/50 transition-colors overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFAQ(idx)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#201710] transition-colors"
                      >
                        <span className="font-anton uppercase text-base sm:text-lg tracking-tight text-[#EAE4DC]">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#D5C3AA] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm font-inter text-[#B8B8B0] leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5 font-inter text-xs text-[#B8B8B0] leading-relaxed">
              <div className="border border-[#D5C3AA]/30 bg-[#1C140E] p-5">
                <span className="font-grotesk text-[11px] font-bold text-[#D5C3AA] uppercase tracking-wider block mb-1">
                  EFFECTIVE DATE: OCTOBER 2026 · ZEALNIX INC.
                </span>
                <h3 className="font-anton text-xl uppercase text-[#EAE4DC] tracking-wide mb-2">
                  TERMS OF SALE & USE
                </h3>
                <p>
                  Welcome to ZEALNIX. By browsing our catalog, placing orders for standard collections, or commissioning custom apparel via the Create Yours Studio, you agree to these legally binding Terms & Conditions.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    1. On-Demand Production & Fulfillment
                  </h4>
                  <p>
                    All ZEALNIX garments are produced on-demand using small-batch screen printing and heavy combed loopback cotton. Production queue processing commences within 2 to 4 hours of payment authorization. Once printing commences, orders cannot be cancelled.
                  </p>
                </div>

                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    2. Pricing, Taxes & Pan-India Deliveries
                  </h4>
                  <p>
                    All prices are denominated in Indian Rupees (INR ₹) inclusive of applicable Goods and Services Tax (GST). Tracked express delivery is provided across India via verified courier partners. Delivery timelines range from 3 to 6 business days from dispatch.
                  </p>
                </div>

                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    3. 30-Day Hassle-Free Exchange Policy
                  </h4>
                  <p>
                    We provide a 30-day exchange window for sizing adjustments on unworn, unwashed items bearing original tags. Bespoke custom print items created with individualized graphics cannot be refunded unless a physical garment manufacturing defect is verified upon delivery.
                  </p>
                </div>

                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    4. Intellectual Property
                  </h4>
                  <p>
                    All brand assets, graphic illustrations, typography layouts, and website code remain the exclusive intellectual property of ZEALNIX Inc. Unauthorized reproduction or resale is prohibited.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-5 font-inter text-xs text-[#B8B8B0] leading-relaxed">
              <div className="border border-[#D5C3AA]/30 bg-[#1C140E] p-5">
                <span className="font-grotesk text-[11px] font-bold text-[#D5C3AA] uppercase tracking-wider block mb-1">
                  LAST UPDATED: OCTOBER 2026 · PAN-INDIA & GLOBAL COMPLIANCE
                </span>
                <h3 className="font-anton text-xl uppercase text-[#EAE4DC] tracking-wide mb-2">
                  ZEALNIX PRIVACY CHARTER
                </h3>
                <p>
                  At ZEALNIX, your personal privacy and creative expression are fiercely respected. We never sell, rent, or trade your personal information to third-party data brokers or marketing aggregators.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    1. Information We Collect
                  </h4>
                  <p>
                    We collect essential information necessary to process your drop orders: full name, contact telephone number, shipping and delivery address, and email for dispatch notifications and order tracking receipts.
                  </p>
                </div>

                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    2. Payment Gateway Security
                  </h4>
                  <p>
                    Payment transactions are encrypted using TLS 1.3 / 256-bit AES protocols and handled directly by PCI-DSS Level 1 compliant processors (UPI, credit/debit cards, net banking). ZEALNIX servers never receive, log, or store your raw card numbers or payment credentials.
                  </p>
                </div>

                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    3. Local Storage & Cookies
                  </h4>
                  <p>
                    We use strictly functional browser storage to maintain your shopping bag items, custom drop studio configurations, and saved wishlist archives across sessions.
                  </p>
                </div>

                <div>
                  <h4 className="font-grotesk text-sm font-bold text-[#EAE4DC] uppercase tracking-wider mb-1">
                    4. Data Erasure & Contact
                  </h4>
                  <p>
                    You retain the right to inspect, correct, or completely erase your account records and order history at any time. For privacy inquiries or data removal, contact our data concierge at concierge@zealnix.com.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
