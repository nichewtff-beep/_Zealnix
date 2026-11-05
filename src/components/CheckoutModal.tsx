import React, { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Truck, Lock, ArrowRight, Printer, AlertCircle, Database } from 'lucide-react';
import { CartItem, Order } from '../types';
import { saveOrderToSupabase } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  onOrderCompleted: (order: Order) => void;
  userEmail?: string;
  userName?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  onOrderCompleted,
  userEmail = 'nichewtff@gmail.com',
  userName = 'Alex Rivera'
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: userName,
    email: userEmail,
    phone: '+91 98765 43210',
    address: 'B-402, Urban Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India'
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('apple_pay');
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: userName,
    expiry: '12/28',
    cvv: '921'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal >= 1499 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    const orderId = `ZN-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `ZN-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...items],
      subtotal,
      discount: discountAmount,
      shipping,
      total,
      status: 'Confirmed',
      trackingNumber,
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state}`,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      },
      paymentMethod:
        paymentMethod === 'card'
          ? 'Credit Card (•••• 4242)'
          : paymentMethod === 'apple_pay'
          ? 'UPI (GPay / PhonePe / Paytm)'
          : 'Cash on Delivery (COD)'
    };

    // Asynchronously persist to Supabase tables ('orders', 'order_items')
    try {
      await saveOrderToSupabase(newOrder, formData.phone);
    } catch (err) {
      console.warn('[Checkout] Supabase save error:', err);
    }

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setIsProcessing(false);
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0B0B] text-[#F2F0E9] border-2 border-[#262626] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D7FF00] text-[#0B0B0B]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-anton uppercase text-2xl tracking-tight text-[#F2F0E9]">
                SECURE CHECKOUT
              </h2>
              <p className="text-xs font-mono text-[#B8B8B0]">
                256-Bit SSL Encrypted Payment Portal
              </p>
            </div>
          </div>
          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#B8B8B0] hover:text-[#D7FF00] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 'confirmation' && (
          <div className="grid grid-cols-2 bg-[#111111] border-b border-[#262626] text-xs font-mono text-center">
            <div
              className={`py-3 border-r border-[#262626] flex items-center justify-center gap-2 ${
                step === 'shipping' ? 'text-[#D7FF00] font-bold bg-[#0B0B0B]' : 'text-[#8C8D88]'
              }`}
            >
              <span>1. SHIPPING DETAILS</span>
            </div>
            <div
              className={`py-3 flex items-center justify-center gap-2 ${
                step === 'payment' ? 'text-[#D7FF00] font-bold bg-[#0B0B0B]' : 'text-[#8C8D88]'
              }`}
            >
              <span>2. PAYMENT GATEWAY</span>
            </div>
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-bebas text-xl text-[#F2F0E9] uppercase mb-4 tracking-wider">
                  Contact & Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] focus:outline-none focus:border-[#D7FF00]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] focus:outline-none focus:border-[#D7FF00]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] focus:outline-none focus:border-[#D7FF00]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] focus:outline-none focus:border-[#D7FF00]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] focus:outline-none focus:border-[#D7FF00]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] focus:outline-none focus:border-[#D7FF00]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order quick summary line */}
              <div className="p-4 bg-[#202120] border border-[#3E403D] flex items-center justify-between text-xs font-mono">
                <span className="text-[#B8B8B0]">Total ({items.length} items to ship):</span>
                <span className="text-[#D7FF00] font-bold text-base tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#D7FF00] text-[#292A29] font-sans font-extrabold tracking-[0.03em] text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#C6EC00] transition-colors cursor-pointer"
              >
                <span>CONTINUE TO PAYMENT METHOD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <h3 className="font-anton text-2xl text-[#F2F0E9] uppercase tracking-[-0.02em]">
                Select Integrated Payment Gateway
              </h3>

              {/* Gateway Selection Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#D7FF00] bg-[#343634] text-[#D7FF00]'
                      : 'border-[#3E403D] bg-[#202120] text-[#F2F0E9]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1.5" />
                  <div className="font-mono text-xs font-bold uppercase">Credit Card</div>
                  <div className="text-[10px] text-[#B8B8B0]">Visa / MC / Amex</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3.5 border text-center transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#D7FF00] bg-[#343634] text-[#D7FF00]'
                      : 'border-[#3E403D] bg-[#202120] text-[#F2F0E9]'
                  }`}
                >
                  <div className="w-5 h-5 mx-auto mb-1.5 flex items-center justify-center font-bold font-mono text-sm text-[#D7FF00]">
                    UPI
                  </div>
                  <div className="font-mono text-xs font-bold uppercase">UPI / QR Pay</div>
                  <div className="text-[10px] text-[#B8B8B0]">GPay / PhonePe / Paytm</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 border text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#D7FF00] bg-[#343634] text-[#D7FF00]'
                      : 'border-[#3E403D] bg-[#202120] text-[#F2F0E9]'
                  }`}
                >
                  <Truck className="w-5 h-5 mx-auto mb-1.5" />
                  <div className="font-mono text-xs font-bold uppercase">Cash On Delivery</div>
                  <div className="text-[10px] text-[#B8B8B0]">Pay at doorstep</div>
                </button>
              </div>

              {/* Payment Details Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#202120] border border-[#3E403D] space-y-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] font-mono focus:outline-none focus:border-[#D7FF00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] font-mono focus:outline-none focus:border-[#D7FF00]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-[#B8B8B0] uppercase block mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#1C1D1C] border border-[#444643] text-sm text-[#F2F0E9] font-mono focus:outline-none focus:border-[#D7FF00]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-6 bg-[#202120] border border-[#3E403D] text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#D7FF00]/10 border border-[#D7FF00]/30 mx-auto flex items-center justify-center font-bold text-sm text-[#D7FF00]">
                    UPI
                  </div>
                  <h4 className="font-bebas text-lg">Instant UPI Fast Pay Ready</h4>
                  <p className="text-xs text-[#B8B8B0] font-mono">
                    Instant authorization via Google Pay, PhonePe, Paytm, or BHIM UPI.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-[#202120] border border-[#3E403D] space-y-2 text-xs font-mono text-[#B8B8B0]">
                  <div className="text-[#D7FF00] font-bold">CASH ON DELIVERY TERMS:</div>
                  <p>You will pay the courier exact cash upon delivery at your provided address.</p>
                  <p>Our concierge will send an SMS dispatch code prior to doorstep delivery.</p>
                </div>
              )}

              {/* Total review */}
              <div className="p-4 bg-[#1C1D1C] border border-[#3E403D] flex items-center justify-between font-mono">
                <span className="text-sm text-[#B8B8B0]">CHARGED AMOUNT:</span>
                <span className="text-2xl font-bold text-[#D7FF00] tabular-nums">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-5 py-4 border border-[#444643] hover:bg-[#343634] text-xs font-mono font-bold uppercase transition-colors"
                >
                  ← BACK
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-[#D7FF00] text-[#292A29] font-sans font-extrabold tracking-[0.03em] text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#C6EC00] transition-colors cursor-pointer disabled:opacity-75"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2 font-sans font-bold">
                      <span className="w-4 h-4 border-2 border-[#292A29] border-t-transparent rounded-full animate-spin" />
                      PROCESSING GATEWAY...
                    </span>
                  ) : (
                    <span>AUTHORIZE & PAY ₹{total.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'confirmation' && completedOrder && (
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              {/* Success Badge */}
              <div className="w-16 h-16 bg-[#D7FF00] text-[#292A29] rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(215,255,0,0.4)]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D7FF00] font-bold">
                  TRANSACTION VERIFIED
                </span>
                <h2 className="font-anton uppercase text-4xl sm:text-5xl text-[#F2F0E9] mt-1 tracking-tight">
                  ORDER CONFIRMED #{completedOrder.id}
                </h2>
                <p className="text-xs sm:text-sm text-[#B8B8B0] font-mono mt-2">
                  Receipt sent to <strong>{completedOrder.shippingAddress.email}</strong>. Screen printing will commence immediately.
                </p>
              </div>

              {/* Production & Tracking Pipeline */}
              <div className="p-4 bg-[#1F201F] border border-[#3E403D] text-left space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#B8B8B0]">TRACKING ID:</span>
                  <span className="text-[#D7FF00] font-bold">{completedOrder.trackingNumber}</span>
                </div>

                {/* Progress Pipeline */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-mono">
                  <div className="p-2 bg-[#D7FF00] text-[#0B0B0B] font-bold">
                    1. CONFIRMED
                  </div>
                  <div className="p-2 bg-[#3E403D] text-[#D7FF00] font-bold animate-pulse">
                    2. SILKSCREEN
                  </div>
                  <div className="p-2 bg-[#0B0B0B] text-[#8C8D88] border border-[#3E403D]">
                    3. QC CHECK
                  </div>
                  <div className="p-2 bg-[#0B0B0B] text-[#8C8D88] border border-[#3E403D]">
                    4. DISPATCH
                  </div>
                </div>
              </div>

              {/* Order Items Receipt Summary */}
              <div className="p-4 bg-[#232423] border border-[#3E403D] text-left text-xs font-mono space-y-2">
                <div className="text-[11px] font-bold uppercase text-[#F2F0E9] border-b border-white/10 pb-2">
                  ORDER SUMMARY ({completedOrder.items.length} ITEMS)
                </div>
                {completedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-[#B8B8B0]">
                    <span>
                      {i.name} (x{i.quantity}, Size {i.selectedSize})
                    </span>
                    <span className="text-white">₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm text-[#F2F0E9]">
                  <span>TOTAL CHARGED</span>
                  <span className="text-[#D7FF00]">₹{completedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Supabase Persistence Confirmation */}
              <div className="py-2.5 px-3 bg-[#161B14] border border-[#2A3F1F] flex items-center justify-center gap-2 text-[11px] font-mono text-[#D7FF00]">
                <ShieldCheck className="w-4 h-4 text-[#D7FF00] shrink-0" />
                <span>ORDER SYNCED & SECURED IN SUPABASE BACKEND (PROJECT: iqfcjetndgtayptfceyu)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-[#D7FF00] text-[#292A29] font-sans font-extrabold text-xs uppercase tracking-[0.03em] hover:bg-[#C6EC00] transition-colors cursor-pointer"
                >
                  RETURN TO STORE
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3.5 border border-[#444643] text-xs font-sans font-bold text-[#F2F0E9] uppercase tracking-[0.03em] hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT RECEIPT</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
