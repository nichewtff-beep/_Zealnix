import React, { useState, useMemo } from 'react';
import { ShoppingBag, Eye, Check, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../types';

interface TheDropProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string) => void;
  onViewAllClick: () => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

// 4 Specific Top Priority Products Featured in Exact Order
interface FeaturedDropConfig {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  gsm: string;
  fit: string;
  categoryLabel: string;
  category: Product['category'];
  price: number;
  originalPrice: number;
  status: string;
  sizes: string[];
  description: string;
}

const FEATURED_DROP_CONFIGS: FeaturedDropConfig[] = [
  {
    id: 'archive-wide-cargo-jeans',
    name: 'ARCHIVE WIDE-LEG CARGO JEANS',
    badge: 'NEW',
    tagline: '14oz Ring-Spun Cotton Denim | OVERSIZED',
    gsm: '14oz Ring-Spun Cotton Denim',
    fit: 'OVERSIZED',
    categoryLabel: 'HEAVYWEIGHT DENIM JEANS',
    category: 'jeans',
    price: 1499,
    originalPrice: 1799,
    status: 'READY TO SHIP',
    sizes: ['30', '32', '34', '36'],
    description: 'Washed black wide-leg streetwear denim featuring reinforced cargo utility pockets.'
  },
  {
    id: 'midnight-butterfly-baggy-jeans',
    name: 'MIDNIGHT BUTTERFLY BAGGY JEANS',
    badge: 'Y2K VIBE',
    tagline: '14oz Milled Ring-Spun Denim | OVERSIZED',
    gsm: '14oz Milled Ring-Spun Denim',
    fit: 'OVERSIZED',
    categoryLabel: 'JEANS',
    category: 'jeans',
    price: 1499,
    originalPrice: 1899,
    status: 'READY TO SHIP',
    sizes: ['30', '32', '34', '36'],
    description: 'Baggy fit jeans with rustic butterfly patch detail.'
  },
  {
    id: 'zora-brown-embroidered-shirt',
    name: 'ZORA BROWN',
    badge: 'BEST SELLER',
    tagline: '260 GSM Washed Slub Cotton | OVERSIZED',
    gsm: '260 GSM Washed Slub Cotton',
    fit: 'OVERSIZED',
    categoryLabel: 'SHIRTS',
    category: 'shirts',
    price: 799,
    originalPrice: 999,
    status: 'READY TO SHIP',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Brown relaxed-fit long-sleeve button-down shirt with a embroidered palm tree on the front pocket and sun embroidery on the back.'
  },
  {
    id: 'anchor-zeal',
    name: 'ANCHOR ZEAL',
    badge: 'ESSENTIAL',
    tagline: '320 GSM Ribbed Knit Cotton | OVERSIZED',
    gsm: '320 GSM Ribbed Knit Cotton',
    fit: 'OVERSIZED',
    categoryLabel: 'T-SHIRTS',
    category: 't-shirts',
    price: 799,
    originalPrice: 999,
    status: 'READY TO SHIP',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Cream/beige ribbed knit polo shirt with dark blue collar and anchor chest patch logo.'
  }
];

export const TheDrop: React.FC<TheDropProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onViewAllClick,
  wishlist,
  onToggleWishlist
}) => {
  // Track selected size per product directly on the card
  const [cardSelectedSizes, setCardSelectedSizes] = useState<{ [productId: string]: string }>({});
  // Track recently added item for temporary button feedback
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Resolve the 4 featured products in prioritized order
  const featuredProducts = useMemo(() => {
    return FEATURED_DROP_CONFIGS.map((cfg) => {
      const match = products.find(
        (p) =>
          p.id === cfg.id ||
          p.name.toUpperCase().trim() === cfg.name ||
          p.name.toUpperCase().includes(cfg.name)
      );

      if (match) {
        return {
          ...match,
          name: cfg.name,
          label: cfg.badge,
          category: cfg.category,
          categoryLabel: cfg.categoryLabel,
          price: cfg.price,
          originalPrice: cfg.originalPrice,
          sizes: cfg.sizes,
          gsm: cfg.gsm,
          fit: cfg.fit,
          description: cfg.description,
          subtitle: cfg.description
        };
      }

      // Safe fallback if not found in current props
      return {
        id: cfg.id,
        name: cfg.name,
        category: cfg.category,
        categoryLabel: cfg.categoryLabel,
        subtitle: cfg.description,
        price: cfg.price,
        originalPrice: cfg.originalPrice,
        label: cfg.badge,
        image: '/src/assets/images/ChatGPT Image Oct 17, 2026, 03_17_58 PM.png',
        gallery: ['/src/assets/images/ChatGPT Image Oct 17, 2026, 03_17_58 PM.png'],
        colors: [{ name: 'Standard Wash', hex: '#261C14' }],
        sizes: cfg.sizes,
        description: cfg.description,
        gsm: cfg.gsm,
        fit: cfg.fit,
        details: [cfg.description],
        inStock: true
      } as Product;
    });
  }, [products]);

  const getSelectedSize = (product: Product) => {
    return cardSelectedSizes[product.id] || product.sizes[0] || 'L';
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const color = product.colors[0]?.name || 'Standard';
    const size = getSelectedSize(product);
    onAddToCart(product, color, size);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  const getBadgeStyles = (label?: string) => {
    switch (label) {
      case 'NEW':
        return 'bg-[#D7FF00] text-[#0B0B0B] border-[#0B0B0B] shadow-xs';
      case 'Y2K VIBE':
        return 'bg-[#0B0B0B] text-[#D7FF00] border-[#D7FF00] shadow-xs';
      case 'BEST SELLER':
        return 'bg-[#0B0B0B] text-[#F2F0E9] border-[#0B0B0B] shadow-xs';
      case 'ESSENTIAL':
        return 'bg-[#EAE4DC] text-[#261C14] border-[#261C14] shadow-xs';
      default:
        return 'bg-white text-[#0B0B0B] border-[#0B0B0B] shadow-xs';
    }
  };

  return (
    <section id="shop" className="bg-[#F2F0E9] text-[#292A29] py-16 sm:py-20 lg:py-24 border-t-2 border-[#292A29] relative">
      <span id="the-drop" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#292A29]/15">
          <div>
            <div className="flex items-center gap-2 mb-2 font-grotesk">
              <span className="font-bold text-xs uppercase tracking-[1px] text-[#666763]">
                CURATED SELECTION
              </span>
              <span className="text-xs font-mono text-[#292A29]/40">/</span>
              <span className="font-bold text-xs uppercase tracking-[1px] text-[#292A29]">
                LIMITED NUMBERS
              </span>
            </div>

            <div className="relative inline-block">
              <h2 className="font-anton uppercase text-5xl sm:text-6xl lg:text-7xl tracking-[-0.015em] text-[#261C14] leading-[0.92]">
                THE DROPS
              </h2>
              {/* Warm camel signature streetwear underline */}
              <div className="h-2 w-32 bg-[#D5C3AA] -mt-1 sm:-mt-2 -rotate-1 relative z-0 border border-[#3C2A21]" />
            </div>

            <p
              className="text-sm sm:text-base font-inter font-normal text-black !text-black mt-3 max-w-lg leading-relaxed"
              style={{ color: '#000000' }}
            >
              Heavyweight silhouettes and raw graphics. Hand-printed and cut in strictly limited runs.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onViewAllClick}
              className="group px-6 py-3.5 bg-[#3C2A21] text-[#EAE4DC] font-grotesk font-bold text-xs uppercase tracking-[1px] flex items-center gap-2.5 transition-all duration-200 hover:bg-[#523B2F] hover:text-[#D5C3AA] cursor-pointer"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 4-Card Responsive Grid under THE DROPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mt-12">
          {featuredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isJustAdded = recentlyAddedId === product.id;
            const selectedSize = getSelectedSize(product);

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col bg-white border border-[#292A29]/20 hover:border-[#292A29] transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer relative overflow-hidden"
              >
                {/* 1. Image Container with Top Badge, Quick Actions, and Fabric Specification Bar */}
                <div className="relative aspect-[4/5] bg-[#E8E6DF] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Top Badge */}
                  {product.label && (
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`text-[10px] font-grotesk font-bold uppercase tracking-[0.08em] px-2.5 py-1 border ${getBadgeStyles(
                          product.label
                        )}`}
                      >
                        {product.label}
                      </span>
                    </div>
                  )}

                  {/* Quick Action Badges (Wishlist & Quick View) */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      aria-label="Wishlist"
                      className={`p-2 rounded-none border border-[#292A29] transition-colors ${
                        isWishlisted
                          ? 'bg-[#D7FF00] text-[#292A29]'
                          : 'bg-white text-[#292A29] hover:bg-[#D7FF00]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#292A29]' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      aria-label="Quick View"
                      className="p-2 bg-white text-[#292A29] hover:bg-[#D7FF00] border border-[#292A29] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Fabric Specification Bar */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#0B0B0B]/90 backdrop-blur-xs px-3 py-1.5 border-t border-[#292A29]/30 flex items-center justify-between text-[10px] font-mono tracking-wider text-[#EAE4DC]">
                    <span className="font-semibold truncate">{product.gsm}</span>
                    <span className="text-[#D7FF00] font-bold shrink-0 ml-2">OVERSIZED</span>
                  </div>
                </div>

                {/* 2. Card Content & Details */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between font-sans">
                  <div>
                    {/* Category Tags & Ready To Ship Status */}
                    <div className="flex items-center justify-between gap-2 text-[11px] font-grotesk uppercase mb-1.5">
                      <span className="font-bold tracking-[1px] text-[#686964] truncate">
                        {product.categoryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 bg-[#10B981]/10 text-[#047857] border border-[#10B981]/30 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        READY TO SHIP
                      </span>
                    </div>

                    {/* Title & Price Header */}
                    <div className="flex items-start justify-between gap-2 mt-1">
                      <h3 className="font-grotesk font-bold uppercase text-base sm:text-lg text-[#292A29] tracking-tight leading-snug group-hover:text-black line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="text-right shrink-0 font-grotesk">
                        <span className="font-bold text-base sm:text-lg text-[#292A29] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="block text-[11px] text-[#8C8D88] line-through tabular-nums -mt-0.5">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#555652] mt-2 line-clamp-2 leading-relaxed font-normal font-inter">
                      {product.description || product.subtitle}
                    </p>

                    {/* Interactive Size Selectors */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-[#292A29]/10 font-grotesk">
                        <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5 text-[#686964]">
                          <span>
                            SIZE: <strong className="text-[#0B0B0B]">{selectedSize}</strong>
                          </span>
                          <span className="text-[10px] text-[#8C8D88] uppercase">
                            {product.category === 'jeans' ? 'WAIST' : 'OVERSIZED'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.sizes.map((sz) => {
                            const isSelected = selectedSize === sz;
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardSelectedSizes((prev) => ({ ...prev, [product.id]: sz }));
                                }}
                                className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0B0B0B] text-[#D7FF00] border-[#0B0B0B] shadow-xs'
                                    : 'bg-[#F2F0E9] text-[#292A29] border-[#292A29]/20 hover:border-[#292A29] hover:bg-white'
                                }`}
                                aria-label={`Select size ${sz}`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary "ADD TO BAG" Action Button */}
                  <div className="mt-4 pt-3 border-t border-[#292A29]/10">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-3 px-4 font-grotesk font-bold tracking-[1px] text-xs uppercase flex items-center justify-center gap-2 transition-all duration-200 border border-[#292A29] cursor-pointer active:scale-[0.98] ${
                        isJustAdded
                          ? 'bg-[#D7FF00] text-[#0B0B0B]'
                          : 'bg-[#0B0B0B] text-[#F2F0E9] hover:bg-[#D7FF00] hover:text-[#0B0B0B]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>ADDED TO BAG</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 stroke-[2]" />
                          <span>ADD TO BAG</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Streetwear editorial banner tape separator */}
        <div className="mt-14 p-4 bg-[#0B0B0B] text-[#F2F0E9] flex flex-wrap items-center justify-between gap-4 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#D7FF00] animate-ping" />
            <span className="font-anton text-lg uppercase tracking-tight text-[#F2F0E9]">
              WANT TO BRING YOUR OWN VISION TO LIFE?
            </span>
          </div>
          <div className="text-xs font-inter font-normal text-[#B8B8B0]">
            Use our on-demand studio to print bespoke drops from 1 piece up.
          </div>
        </div>
      </div>
    </section>
  );
};
