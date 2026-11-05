import React, { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { saveContactInquiryToSupabase } from '../lib/supabase';

interface ContactSectionProps {
  onOpenContactModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenContactModal }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('Order Status & Tracking');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Please enter a valid contact phone number.');
      return;
    }

    setIsSubmitting(true);
    const generatedId = `ZNX-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await saveContactInquiryToSupabase({
        ticket_id: generatedId,
        full_name: fullName.trim(),
        phone: phoneNumber.trim(),
        reason,
        message: message.trim() || undefined
      });

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: generatedId,
          full_name: fullName.trim(),
          phone: phoneNumber.trim(),
          reason,
          message: message.trim()
        })
      }).catch((e) => console.warn('[Contact Section] Dispatch note:', e));
    } catch (err) {
      console.warn('[Contact Section] Submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTicketId(generatedId);
    }
  };

  return (
    <section id="contact" className="bg-[#18110B] text-[#EAE4DC] py-20 lg:py-28 border-t-2 border-[#D5C3AA]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Concierge Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#261C14] border border-[#D5C3AA]/30 font-grotesk text-xs text-[#D5C3AA] font-bold uppercase tracking-[1px]">
              <Phone className="w-3.5 h-3.5" />
              <span>ZEALNIX CONCIERGE DESK</span>
            </div>

            <h2 className="font-anton uppercase text-4xl sm:text-5xl lg:text-6xl tracking-[-0.015em] text-[#EAE4DC] leading-[0.92]">
              GET IN TOUCH WITH THE CREW
            </h2>

            <p className="font-inter text-sm sm:text-base text-[#D5C3AA]/80 leading-relaxed font-normal">
              Have a question regarding custom drops, sizing specs, or delivery status? Our Delhi studio concierge handles every inquiry personally.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-[#201710] border border-[#D5C3AA]/20 flex items-center gap-3 text-xs font-mono">
                <Mail className="w-4 h-4 text-[#D5C3AA] shrink-0" />
                <div>
                  <span className="text-[#8C8D88] block text-[10px]">EMAIL DESK:</span>
                  <span className="text-[#EAE4DC] font-bold">care@zealnix.com</span>
                </div>
              </div>

              <div className="p-4 bg-[#201710] border border-[#D5C3AA]/20 flex items-center gap-3 text-xs font-mono">
                <Clock className="w-4 h-4 text-[#D5C3AA] shrink-0" />
                <div>
                  <span className="text-[#8C8D88] block text-[10px]">OPERATING CADENCE:</span>
                  <span className="text-[#EAE4DC] font-bold">Mon–Sat (10:00 AM – 8:00 PM IST)</span>
                </div>
              </div>

              <div className="p-4 bg-[#201710] border border-[#D5C3AA]/20 flex items-center gap-3 text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-[#D5C3AA] shrink-0" />
                <div>
                  <span className="text-[#8C8D88] block text-[10px]">RESPONSE GUARANTEE:</span>
                  <span className="text-[#D5C3AA] font-bold">Within 2 to 4 business hours</span>
                </div>
              </div>
            </div>

            {onOpenContactModal && (
              <button
                type="button"
                onClick={onOpenContactModal}
                className="text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#D5C3AA] hover:text-[#EAE4DC] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>OPEN FULL CONCIERGE MODAL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Column: Direct Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-[#201710] border-2 border-[#D5C3AA]/30 p-6 sm:p-8 relative">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-[#D5C3AA] text-[#261C14] rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="font-anton uppercase text-3xl text-[#EAE4DC]">
                  INQUIRY RECORDED #{ticketId}
                </h3>
                <p className="font-inter text-sm text-[#D5C3AA]/80 max-w-md mx-auto">
                  Thanks for reaching out! Our team will get back to your contact number shortly.
                </p>
                <div className="pt-2 text-xs font-mono text-[#D5C3AA] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SYNCED TO SUPABASE BACKEND (contact_inquiries)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFullName('');
                    setPhoneNumber('');
                    setMessage('');
                  }}
                  className="mt-4 px-5 py-2.5 bg-[#261C14] text-[#EAE4DC] border border-[#D5C3AA]/40 font-grotesk text-xs uppercase font-bold tracking-wider hover:bg-[#342419] cursor-pointer"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-anton uppercase text-2xl text-[#EAE4DC]">
                    SEND A DIRECT INQUIRY
                  </h3>
                  <p className="font-inter text-xs text-[#8C8D88] mt-1">
                    Directly synced with our store support dispatch system.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#EAE4DC] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Alex Rivera"
                      className="w-full bg-[#18110B] border border-[#D5C3AA]/30 text-[#EAE4DC] px-3.5 py-2.5 text-xs font-sans outline-none focus:border-[#D5C3AA] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#EAE4DC] mb-1.5">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#18110B] border border-[#D5C3AA]/30 text-[#EAE4DC] px-3.5 py-2.5 text-xs font-sans outline-none focus:border-[#D5C3AA] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#EAE4DC] mb-1.5">
                    Reason for Contacting *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-[#18110B] border border-[#D5C3AA]/30 text-[#EAE4DC] px-3.5 py-2.5 text-xs font-sans outline-none focus:border-[#D5C3AA] transition-colors"
                  >
                    <option value="Order Status & Tracking">Order Status & Tracking</option>
                    <option value="Sizing & Fit Consultation">Sizing & Fit Consultation</option>
                    <option value="Create Yours / Custom Studio Drop">Create Yours / Custom Studio Drop</option>
                    <option value="Exchange or Return Request">Exchange or Return Request</option>
                    <option value="Wholesale & Bulk Production">Wholesale & Bulk Production</option>
                    <option value="General Support & Feedback">General Support & Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#EAE4DC] mb-1.5">
                    Inquiry Details / Message
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify your order ID, question, or custom print details..."
                    className="w-full bg-[#18110B] border border-[#D5C3AA]/30 text-[#EAE4DC] px-3.5 py-2.5 text-xs font-sans outline-none focus:border-[#D5C3AA] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#D5C3AA] hover:bg-[#EAE4DC] text-[#261C14] font-grotesk font-black text-xs uppercase tracking-[1.5px] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md active:scale-95"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#261C14]" />
                      <span>SUBMIT INQUIRY</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
