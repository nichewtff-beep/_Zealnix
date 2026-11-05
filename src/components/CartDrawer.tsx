import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: (appliedDiscountPercent: number) => void;
  onExploreDrop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreDrop
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const freeShippingThreshold = 1499;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shipping = subtotal === 0 ? 0 : distanceToFreeShipping === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const clean = couponInput.trim().toUpperCase();
    if (clean === 'ZEAL15' || clean === 'GENZ15' || clean === 'DROP15') {
      setDiscountPercent(15);
      setCouponSuccess('15% OFF VIP APPLIED!');
    } else if (clean === 'ZEAL20') {
      setDiscountPercent(20);
      setCouponSuccess('20% STREETWEAR PASS APPLIED!');
    } else {
      setCouponError('Invalid promo code. Try ZEAL15');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B0B0B] text-[#F2F0E9] border-l-2 border-[#262626] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D7FF00]" />
              <h2 className="font-anton uppercase text-2xl tracking-tight text-[#F2F0E9] leading-none">
                SHOPPING BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#B8B8B0] hover:text-[#D7FF00] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3.5 bg-[#1F201F] border-b border-[#3E403D]">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              {distanceToFreeShipping > 0 ? (
                <span>
                  ADD <strong className="text-[#D7FF00]">₹{distanceToFreeShipping.toLocaleString('en-IN')}</strong> MORE FOR FREE EXPRESS DELIVERY
                </span>
              ) : (
                <span className="text-[#D7FF00] font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  FREE EXPRESS DELIVERY UNLOCKED!
                </span>
              )}
              <span className="text-[10px] text-[#B8B8B0]">
                ₹{subtotal.toLocaleString('en-IN')} / ₹{freeShippingThreshold.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#343634] overflow-hidden">
              <div
                className="h-full bg-[#D7FF00] transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Item List / Empty State */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#525450] flex items-center justify-center text-[#B8B8B0]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="font-anton uppercase text-2xl text-[#F2F0E9]">
                    YOUR BAG IS EMPTY
                  </h3>
                  <p className="text-xs text-[#B8B8B0] mt-1 font-mono max-w-xs">
                    Nothing selected yet. Explore our latest drop or create your custom bespoke design.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExploreDrop();
                  }}
                  className="px-6 py-3 bg-[#D7FF00] text-[#0B0B0B] font-bold tracking-wider text-xs uppercase hover:bg-[#C6EC00] transition-colors cursor-pointer"
                >
                  EXPLORE THE DROP →
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#202120] border border-[#3E403D] relative group hover:border-[#525450] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 aspect-square bg-black border border-white/10 shrink-0 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {item.isCustom && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#D7FF00] text-[#0B0B0B] text-[8px] font-sans font-extrabold uppercase tracking-[0.05em] text-center py-0.5">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-grotesk text-sm font-bold leading-tight uppercase tracking-tight text-[#F2F0E9] truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#8C8D88] hover:text-red-400 p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-inter text-[#B8B8B0] mt-1 font-medium">
                        {item.isCustom && item.selectedColor && (
                          <>
                            <span>Base: {item.selectedColor}</span>
                            <span>·</span>
                          </>
                        )}
                        <span>Size: <strong className="text-white font-bold">{item.selectedSize}</strong></span>
                      </div>

                      {item.isCustom && item.customDetails && (
                        <div className="text-[10px] font-sans font-medium text-[#D7FF00] mt-0.5">
                          Slogan: &ldquo;{item.customDetails.text}&rdquo; ({item.customDetails.placement})
                        </div>
                      )}
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                      <div className="flex items-center border border-[#444643] bg-[#1A1B1A]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-0.5 text-xs text-[#B8B8B0] hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-mono font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-[#B8B8B0] hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono font-bold text-sm text-[#F2F0E9] tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#212221] border-t border-[#3E403D] space-y-4">
              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#B8B8B0]" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="PROMO CODE (USE ZEAL15)"
                    className="w-full pl-9 pr-3 py-2 bg-[#1A1B1A] border border-[#444643] text-xs font-mono uppercase text-[#F2F0E9] placeholder:text-[#666] focus:outline-none focus:border-[#D7FF00]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3E403D] hover:bg-[#D7FF00] hover:text-[#0B0B0B] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                >
                  APPLY
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] font-mono text-[#D7FF00]">{couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-[11px] font-mono text-red-400">{couponError}</p>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs font-mono border-t border-white/5 pt-3">
                <div className="flex justify-between text-[#B8B8B0]">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D7FF00]">
                    <span>VIP Discount ({discountPercent}%)</span>
                    <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#B8B8B0]">
                  <span>Shipping</span>
                  <span className="tabular-nums text-white">
                    {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#F2F0E9] pt-2 border-t border-white/10">
                  <span>TOTAL AMOUNT</span>
                  <span className="text-[#D7FF00] tabular-nums font-mono text-lg">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary Buy CTA */}
              <button
                onClick={() => {
                  onProceedToCheckout(discountPercent);
                }}
                className="w-full py-4 bg-[#D7FF00] text-[#0B0B0B] font-sans font-extrabold tracking-[0.03em] text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#C6EC00] active:scale-[0.98] shadow-lg cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] font-mono text-[#8C8D88]">
                256-BIT ENCRYPTED SSL CHECKOUT · APPLE PAY & CARDS ACCEPTED
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
