import React, { useState } from 'react';
import { X, User, Package, Heart, MapPin, LogOut, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserAccount, Product, CartItem } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  allProducts,
  onAddToCart,
  onRemoveFromWishlist
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>('orders');

  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter((p) => user.wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0B0B] text-[#F2F0E9] border-2 border-[#262626] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D7FF00] text-[#0B0B0B] flex items-center justify-center font-bold text-lg font-bebas">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-anton uppercase text-2xl tracking-tight text-[#F2F0E9] leading-none">
                {user.name}
              </h2>
              <p className="text-xs font-mono text-[#B8B8B0] mt-0.5">
                {user.email} · Member since {user.joinedDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#B8B8B0] hover:text-[#D7FF00] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Account"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#262626] bg-[#111111] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3.5 flex items-center gap-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#D7FF00] text-[#D7FF00] bg-[#0B0B0B]'
                : 'border-transparent text-[#B8B8B0] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>ORDERS & DROPS ({user.orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-6 py-3.5 flex items-center gap-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'wishlist'
                ? 'border-[#D7FF00] text-[#D7FF00] bg-[#0B0B0B]'
                : 'border-transparent text-[#B8B8B0] hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>SAVED ARCHIVE ({user.wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-6 py-3.5 flex items-center gap-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-[#D7FF00] text-[#D7FF00] bg-[#0B0B0B]'
                : 'border-transparent text-[#B8B8B0] hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>ADDRESS BOOK ({user.savedAddresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3.5 flex items-center gap-2 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#D7FF00] text-[#D7FF00] bg-[#0B0B0B]'
                : 'border-transparent text-[#B8B8B0] hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>PREFERENCES</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {user.orders.length === 0 ? (
                <div className="text-center py-12 text-[#B8B8B0] font-mono text-xs">
                  No orders placed yet. Explore THE DROP to claim your apparel.
                </div>
              ) : (
                user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-[#202120] border border-[#3E403D] hover:border-[#525450] transition-colors space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-anton text-lg text-[#F2F0E9] tracking-wider">
                            ORDER #{order.id}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#D7FF00] text-[#0B0B0B] uppercase">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#8C8D88] mt-0.5">
                          Placed on {order.date} · Paid via {order.paymentMethod}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs text-[#8C8D88] block">TRACKING ID:</span>
                        <span className="font-mono text-xs text-[#D7FF00] font-bold">
                          {order.trackingNumber}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover border border-white/10"
                            />
                            <div>
                              <div className="text-[#F2F0E9] font-bold">{item.name}</div>
                              <div className="text-[10px] text-[#8C8D88]">
                                Qty: {item.quantity} · Size: {item.selectedSize}
                              </div>
                            </div>
                          </div>
                          <span className="text-white font-bold tabular-nums">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 font-mono text-xs">
                      <span className="text-[#8C8D88]">TOTAL PAID</span>
                      <span className="text-base font-bold text-[#D7FF00] tabular-nums">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12 text-[#B8B8B0] font-mono text-xs">
                  Your saved archive is empty. Tap the heart icon on any drop product to bookmark it.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 bg-[#202120] border border-[#3E403D] flex gap-4 items-center"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-20 aspect-square object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-anton text-base uppercase tracking-tight text-[#F2F0E9] truncate">{prod.name}</h4>
                        <div className="font-sans text-xs text-[#D7FF00] font-bold tabular-nums mt-0.5">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => onAddToCart(prod)}
                            className="px-3 py-1.5 bg-[#D7FF00] text-[#0B0B0B] font-sans font-extrabold text-[10px] tracking-[0.03em] uppercase hover:bg-[#C6EC00] cursor-pointer"
                          >
                            ADD TO BAG
                          </button>
                          <button
                            onClick={() => onRemoveFromWishlist(prod.id)}
                            className="px-2 py-1.5 border border-[#444643] text-[#8C8D88] hover:text-white text-[10px] font-sans font-bold tracking-[0.03em] uppercase cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESS BOOK TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              {user.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 bg-[#202120] border border-[#3E403D] flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#F2F0E9]">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#343634] text-[#D7FF00] border border-[#444643]">
                          DEFAULT SHIPPING
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-[#B8B8B0]">{addr.address}</p>
                    <p className="text-xs font-mono text-[#B8B8B0]">
                      {addr.city}, {addr.postalCode}, {addr.country}
                    </p>
                  </div>
                  <button className="text-xs font-mono text-[#D7FF00] hover:underline">
                    Edit
                  </button>
                </div>
              ))}

              <button className="w-full py-3 border border-dashed border-[#525450] hover:border-[#D7FF00] text-xs font-mono text-[#B8B8B0] hover:text-[#D7FF00] transition-colors uppercase">
                + ADD NEW DELIVERY ADDRESS
              </button>
            </div>
          )}

          {/* PROFILE PREFERENCES */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-lg">
              <div className="p-4 bg-[#202120] border border-[#3E403D] space-y-3 font-mono text-xs">
                <div className="text-[#D7FF00] font-bold">ZEALNIX VIP PERKS</div>
                <p className="text-[#B8B8B0]">
                  Early drop access notifications, automated free shipping on orders over ₹1,499, and invitations to custom print workshops.
                </p>
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Account Verified</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono text-[#B8B8B0] uppercase block">
                  Communication Frequency
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    id="dropAlerts"
                    className="accent-[#D7FF00]"
                  />
                  <label htmlFor="dropAlerts" className="text-xs font-mono text-white">
                    Drop Alerts (SMS & Email 1 hour prior to drop release)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
