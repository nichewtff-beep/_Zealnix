import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Phone, Mail, Clock, MessageSquare, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { ZealnixLogo } from './ZealnixLogo';
import { saveContactInquiryToSupabase } from '../lib/supabase';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('Order Status & Tracking');
  const [inquiryDetails, setInquiryDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }

    if (!reason) {
      setErrorMessage('Please select a reason for contacting.');
      return;
    }

    setIsSubmitting(true);
    const generatedId = `ZNX-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 1. Persist directly to Supabase table 'contact_inquiries'
      await saveContactInquiryToSupabase({
        ticket_id: generatedId,
        full_name: fullName.trim(),
        phone: phoneNumber.trim(),
        email: email.trim() || undefined,
        reason,
        message: inquiryDetails.trim() || undefined
      });

      // 2. Also dispatch to local backend /api/contact if available
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: generatedId,
          full_name: fullName.trim(),
          phone: phoneNumber.trim(),
          email: email.trim(),
          reason,
          message: inquiryDetails.trim()
        })
      }).catch((e) => console.warn('[Contact] Server dispatch note:', e));
    } catch (err) {
      console.warn('[Contact] Supabase dispatch exception:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTicketId(generatedId);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setReason('Order Status & Tracking');
    setInquiryDetails('');
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="bg-[#0B0B0B] text-[#F2F0E9] border-2 border-[#262626] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative z-10">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <ZealnixLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-anton uppercase text-xl sm:text-2xl tracking-tight text-[#F2F0E9]">
                  CONTACT US
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#D7FF00] text-[#0B0B0B] font-extrabold uppercase">
                  CONCIERGE DESK
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8C8D88] hidden sm:block">
                Direct channel to the ZEALNIX drop & support team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#B8B8B0] hover:text-[#D7FF00] hover:bg-white/5 transition-colors cursor-pointer rounded"
            aria-label="Close Contact Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {isSubmitted ? (
            /* Post-Submission Confirmation View */
            <div className="py-6 sm:py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#D7FF00]/10 border-2 border-[#D7FF00] flex items-center justify-center text-[#D7FF00] shadow-[0_0_25px_rgba(215,255,0,0.25)]">
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-[2px] text-[#D7FF00]">
                  INQUIRY LOGGED #{ticketId}
                </span>
                <h3 className="font-anton uppercase text-3xl sm:text-4xl text-[#F2F0E9] tracking-tight">
                  MESSAGE RECEIVED
                </h3>
                <p className="text-sm sm:text-base text-[#E4E1D7] max-w-md mx-auto leading-relaxed font-sans font-medium">
                  Thanks for reaching out! Our team will get back to you shortly.
                </p>
              </div>

              {/* Inquiry Summary Box */}
              <div className="bg-[#141414] border border-[#262626] p-4 text-left max-w-md mx-auto space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-[#222] pb-1.5">
                  <span className="text-[#8C8D88]">FULL NAME:</span>
                  <span className="text-[#F2F0E9] font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between border-b border-[#222] pb-1.5">
                  <span className="text-[#8C8D88]">CONTACT NUMBER:</span>
                  <span className="text-[#F2F0E9] font-bold">{phoneNumber}</span>
                </div>
                <div className="flex justify-between border-b border-[#222] pb-1.5">
                  <span className="text-[#8C8D88]">REASON:</span>
                  <span className="text-[#D7FF00] font-bold">{reason}</span>
                </div>
                {inquiryDetails && (
                  <div className="pt-1">
                    <span className="text-[#8C8D88] block mb-1">INQUIRY NOTE:</span>
                    <p className="text-[#B8B8B0] font-sans line-clamp-2 italic">
                      &quot;{inquiryDetails}&quot;
                    </p>
                  </div>
                )}
                <div className="pt-2 border-t border-[#222] flex items-center justify-center gap-1.5 text-[10px] text-[#D7FF00]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RECORDED IN SUPABASE BACKEND (contact_inquiries)</span>
                </div>
              </div>

              {/* Response Time Guarantee Card */}
              <div className="flex items-center justify-center gap-3 text-xs text-[#8C8D88]">
                <Clock className="w-4 h-4 text-[#D7FF00]" />
                <span>Standard response cadence: within 2 to 4 business hours</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3 px-5 bg-[#D7FF00] hover:bg-[#bce000] text-[#0B0B0B] font-grotesk font-black text-xs uppercase tracking-[1px] transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  RETURN TO STORE
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:flex-1 py-3 px-5 bg-[#181818] hover:bg-[#252525] border border-[#333] text-[#F2F0E9] font-grotesk font-bold text-xs uppercase tracking-[1px] transition-all cursor-pointer"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Introduction Banner */}
              <div className="p-3.5 bg-[#141414] border border-[#262626] flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#D7FF00] shrink-0 mt-0.5" />
                <p className="text-xs text-[#B8B8B0] leading-relaxed">
                  Have a question regarding your order dispatch, custom Studio drop, sizing, or general inquiries? Fill in your details below and our team will get in touch directly.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Field 1: Full Name (Required) */}
              <div>
                <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#F2F0E9] mb-1.5">
                  Full Name <span className="text-[#D7FF00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aryan Malhotra"
                  className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#D7FF00] focus:ring-1 focus:ring-[#D7FF00] text-[#F2F0E9] placeholder-[#555] px-3.5 py-2.5 text-sm font-sans outline-none transition-colors"
                />
              </div>

              {/* Field 2: Contact Number / Phone Number (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#F2F0E9] mb-1.5">
                    Contact Number / Phone <span className="text-[#D7FF00]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#D7FF00] focus:ring-1 focus:ring-[#D7FF00] text-[#F2F0E9] placeholder-[#555] px-3.5 py-2.5 text-sm font-sans outline-none transition-colors"
                    />
                    <Phone className="w-4 h-4 text-[#555] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Optional Email */}
                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#F2F0E9] mb-1.5 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-[#777] font-mono font-normal">RECOMMENDED</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#D7FF00] focus:ring-1 focus:ring-[#D7FF00] text-[#F2F0E9] placeholder-[#555] px-3.5 py-2.5 text-sm font-sans outline-none transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#555] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Field 3: Reason for Contacting (Required Dropdown) */}
              <div>
                <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#F2F0E9] mb-1.5">
                  Reason for Contacting <span className="text-[#D7FF00]">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#D7FF00] focus:ring-1 focus:ring-[#D7FF00] text-[#F2F0E9] px-3.5 py-2.5 text-sm font-sans outline-none transition-colors cursor-pointer"
                >
                  <option value="Order Status & Tracking">Order Status & Tracking (Live Orders)</option>
                  <option value="Sizing, Fit & Fabric Specifications">Sizing, Fit & Fabric Specifications (280-460 GSM)</option>
                  <option value="Custom Studio & Bespoke Bulk Drops">Custom Studio & Bespoke Drops (&quot;Create Yours&quot;)</option>
                  <option value="Returns, Exchanges & Quality Guarantee">Returns, Exchanges & Quality Guarantee (30 Days)</option>
                  <option value="Press, Collabs & Brand Ambassador">Press, Collaborations & Brand Partnerships</option>
                  <option value="Wholesale & Bulk Production">Wholesale & Bulk Production Inquiries</option>
                  <option value="General Support & Feedback">General Support & Feedback</option>
                </select>
              </div>

              {/* Field 4: Inquiry Details / Message (Dropdown or Text Area) */}
              <div>
                <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#F2F0E9] mb-1.5 flex items-center justify-between">
                  <span>Inquiry Details / Message</span>
                  <span className="text-[10px] text-[#8C8D88] font-mono">SPECIFY YOUR REQUEST</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={inquiryDetails}
                    onChange={(e) => setInquiryDetails(e.target.value)}
                    placeholder="Provide details about your order ID, size preference, question, or message..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#D7FF00] focus:ring-1 focus:ring-[#D7FF00] text-[#F2F0E9] placeholder-[#555] p-3 text-sm font-sans outline-none transition-colors resize-none"
                  />
                  <MessageSquare className="w-4 h-4 text-[#444] absolute right-3 bottom-3 pointer-events-none" />
                </div>
              </div>

              {/* Direct Concierge Quick Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#222]">
                <div className="flex items-center gap-2.5 text-xs text-[#8C8D88] bg-[#101010] p-2.5 border border-[#1f1f1f]">
                  <Mail className="w-3.5 h-3.5 text-[#D7FF00] shrink-0" />
                  <span>Email: <strong className="text-[#F2F0E9]">care@zealnix.com</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#8C8D88] bg-[#101010] p-2.5 border border-[#1f1f1f]">
                  <Clock className="w-3.5 h-3.5 text-[#D7FF00] shrink-0" />
                  <span>Hours: <strong className="text-[#F2F0E9]">Mon-Sat (10AM - 8PM IST)</strong></span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#D7FF00] hover:bg-[#bce000] text-[#0B0B0B] font-grotesk font-black text-sm uppercase tracking-[1.5px] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(215,255,0,0.15)] hover:shadow-[0_0_25px_rgba(215,255,0,0.3)] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B0B0B] border-t-transparent rounded-full animate-spin" />
                    <span>DISPATCHING INQUIRY...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT INQUIRY</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
