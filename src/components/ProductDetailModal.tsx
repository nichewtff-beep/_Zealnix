import React, { useState } from 'react';
import { X, Check, Heart, Shield, RefreshCw, Truck, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const defaultColor = product.colors?.[0]?.name || 'Standard';
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'L');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAddToCart = () => {
    onAddToCart(product, defaultColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#F2F0E9] text-[#292A29] border-2 border-[#292A29] w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top bar */}
        <div className="p-4 px-6 border-b border-[#292A29]/15 flex items-center justify-between bg-[#EAE7DC]">
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-xs uppercase tracking-wider text-[#666763]">
              ZEALNIX DROP ARCHIVE
            </span>
            <span className="text-xs font-mono text-[#292A29]/40">/</span>
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#292A29]">
              {product.category.toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#292A29] hover:text-[#D7FF00] hover:bg-[#0B0B0B] transition-colors rounded-none cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#292A29]/15">
          {/* Gallery Viewport (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#E5E2D6]/40">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] bg-white border border-[#292A29]/20 overflow-hidden shadow-inner">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {product.label && (
                <div className="absolute top-3 left-3 bg-[#D7FF00] text-[#292A29] border border-[#292A29] font-sans text-[10px] font-bold uppercase tracking-[0.05em] px-2.5 py-1">
                  {product.label}
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-[#292A29]/20 px-2.5 py-1 text-[11px] font-sans font-bold tracking-[0.03em]">
                {product.gsm}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-square border-2 overflow-hidden transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#292A29] ring-2 ring-[#D7FF00]'
                        : 'border-[#292A29]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Module (5 cols) */}
          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#F2F0E9] space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="font-sans font-semibold text-xs uppercase tracking-wider text-[#666763]">
                  {product.categoryLabel}
                </span>
                <span className="text-[11px] font-sans text-emerald-800 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  IN STOCK · READY TO PRINT
                </span>
              </div>

              {/* Title & Price */}
              <h1 className="font-grotesk uppercase text-2xl sm:text-3xl text-[#292A29] font-bold tracking-tight mt-1 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-3 font-grotesk">
                <span className="font-bold text-2xl text-[#292A29] tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#8C8D88] line-through tabular-nums font-medium">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-bold px-2 py-0.5 bg-[#0B0B0B] text-[#D7FF00] tracking-[0.03em]">
                  TAX INCLUDED
                </span>
              </div>

              {/* Description */}
              <p className="font-inter text-sm text-[#555652] mt-4 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mt-6 pt-5 border-t border-[#292A29]/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-grotesk uppercase font-bold text-[#292A29] tracking-[0.5px]">
                    {product.category === 'jeans' ? 'WAIST SIZE:' : 'SIZE (OVERSIZED FIT):'}
                  </span>
                  <span className="text-[11px] font-inter text-[#666763] font-medium">
                    {product.category === 'jeans' ? 'Raw denim relaxed cut' : 'Runs relaxed & boxy'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-center text-xs font-inter font-bold border transition-all ${
                        selectedSize === sz
                          ? 'border-[#0B0B0B] bg-[#0B0B0B] text-[#D7FF00]'
                          : 'border-[#292A29]/30 bg-white text-[#292A29] hover:border-[#292A29]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-sans uppercase font-bold text-[#292A29]">
                  QUANTITY:
                </span>
                <div className="flex items-center border border-[#292A29] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-sans font-bold text-[#292A29] hover:bg-[#EAE7DC]"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-sans font-bold text-[#292A29] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-sans font-bold text-[#292A29] hover:bg-[#EAE7DC]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Details & Specifications list */}
              <div className="mt-6 pt-5 border-t border-[#292A29]/15">
                <div className="text-xs font-sans uppercase font-bold text-[#292A29] mb-2">
                  GARMENT SPECIFICATIONS
                </div>
                <ul className="text-xs text-[#555652] space-y-1.5 font-sans">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#292A29] font-bold">·</span>
                      <span className="font-normal">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions: Add to Cart & Wishlist */}
            <div className="pt-4 border-t border-[#292A29]/15 space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 py-4 font-sans font-extrabold tracking-[0.03em] text-xs sm:text-sm uppercase flex items-center justify-center gap-2 border border-[#292A29] transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-[#D7FF00] text-[#0B0B0B]'
                      : 'bg-[#0B0B0B] text-[#F2F0E9] hover:bg-[#D7FF00] hover:text-[#0B0B0B]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>ADDED TO BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>ADD TO BAG · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`p-4 border border-[#292A29] transition-colors ${
                    isWishlisted
                      ? 'bg-[#D7FF00] text-[#292A29]'
                      : 'bg-white text-[#292A29] hover:bg-[#EAE7DC]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#292A29]' : ''}`} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#666763] pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#292A29]" />
                  FAST TRACKED COURIER
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#292A29]" />
                  30-DAY FIT GUARANTEE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
