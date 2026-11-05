import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Filter, 
  SlidersHorizontal, 
  Check, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import { Product } from '../types';

export type CatalogCategoryFilter = 'all' | 'jeans' | 'shirts' | 't-shirts' | 'the-drop';

interface CatalogPageProps {
  products: Product[];
  initialCategory?: CatalogCategoryFilter;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (category: CatalogCategoryFilter) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  initialCategory = 'all',
  onSelectProduct,
  onAddToCart,
  onNavigateHome,
  onNavigateCategory,
  wishlist,
  onToggleWishlist
}) => {
  const [activeCategory, setActiveCategory] = useState<CatalogCategoryFilter>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  
  // Per-product state for size selection right on the card
  const [cardSelectedSizes, setCardSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Sync state if prop changes
  React.useEffect(() => {
    setActiveCategory(initialCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialCategory]);

  const categoriesConfig: { id: CatalogCategoryFilter; name: string; subtitle: string; description: string }[] = [
    {
      id: 'all',
      name: 'ALL PRODUCTS',
      subtitle: 'COMPLETE STREETWEAR ARCHIVE',
      description: 'The entire ZEALNIX universe in one curated lineup. From heavy stacked denim to tactile technical outerwear and boxy graphic tees.'
    },
    {
      id: 'jeans',
      name: 'JEANS',
      subtitle: 'HEAVY DENIM & JAPANESE SELVEDGE',
      description: 'Milled from authentic 13.5oz to 14.5oz ring-spun cotton. Engineered with exaggerated wide-leg skater drape, reinforced cargo pockets, and stacked raw selvedge.'
    },
    {
      id: 'shirts',
      name: 'SHIRTS',
      subtitle: 'TACTICAL WORKWEAR & FLANNELS',
      description: 'Heavyweight 340–380GSM double-brushed cotton twill and canvas overshirts with gunmetal hardware, industrial zip pockets, and boxy streetwear proportions.'
    },
    {
      id: 't-shirts',
      name: 'T-SHIRTS',
      subtitle: '280–300GSM BOXY GRAPHIC TEES',
      description: 'Ultra-dense combed cotton jerseys printed with UV-reactive inks, hand-drawn brutalist geometry, and distressed vintage botanical sunburst motifs.'
    },
    {
      id: 'the-drop',
      name: 'THE DRIP',
      subtitle: 'LIMITED EDITION & FEATURED RELEASES',
      description: 'Exclusively numbered, strictly capped production drops. Heavy 460–480GSM French terry hoodies and 3-layer waterproof ripstop cyber utility shells.'
    }
  ];

  const currentCategoryInfo = useMemo(() => {
    return categoriesConfig.find((c) => c.id === activeCategory) || categoriesConfig[0];
  }, [activeCategory]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      jeans: products.filter((p) => p.category === 'jeans').length,
      shirts: products.filter((p) => p.category === 'shirts').length,
      't-shirts': products.filter((p) => p.category === 't-shirts' || p.category === 'tees').length,
      'the-drop': products.filter((p) => p.category === 'the-drop' || p.category === 'hoodies').length
    };
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category matching
        if (activeCategory === 'jeans' && p.category !== 'jeans') return false;
        if (activeCategory === 'shirts' && p.category !== 'shirts') return false;
        if (activeCategory === 't-shirts' && p.category !== 't-shirts' && p.category !== 'tees') return false;
        if (activeCategory === 'the-drop' && p.category !== 'the-drop' && p.category !== 'hoodies') return false;

        // Search query matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSub = p.subtitle.toLowerCase().includes(q);
          const matchCat = p.categoryLabel.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchSub && !matchCat && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          if (a.label === 'NEW' && b.label !== 'NEW') return -1;
          if (b.label === 'NEW' && a.label !== 'NEW') return 1;
        }
        return 0;
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleCardAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const color = product.colors[0]?.name || 'Standard';
    const size = cardSelectedSizes[product.id] || product.sizes[0] || 'L';
    onAddToCart(product, color, size);
    
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] text-[#292A29] pt-24 sm:pt-28 pb-20">
      {/* Top Breadcrumb & Back Bar */}
      <div className="border-b border-[#292A29]/15 bg-[#EAE7DC]/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between font-sans text-xs">
          <div className="flex items-center gap-2 font-bold tracking-[0.05em] uppercase text-[#61625D]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#0B0B0B] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>HOME</span>
            </button>
            <span className="text-[#292A29]/30">/</span>
            <span className="text-[#61625D]">COLLECTIONS</span>
            <span className="text-[#292A29]/30">/</span>
            <span className="text-[#0B0B0B] font-extrabold">{currentCategoryInfo.name}</span>
          </div>

          <div className="text-[11px] font-mono text-[#61625D]">
            SHOWING <strong>{filteredProducts.length}</strong> ITEM{filteredProducts.length === 1 ? '' : 'S'}
          </div>
        </div>
      </div>

      {/* Main Header Banner */}
      <section className="bg-[#0B0B0B] text-[#F2F0E9] border-b-2 border-[#292A29] py-12 sm:py-16 relative overflow-hidden">
        {/* Subtle background graphic line accents */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D7FF00_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl font-grotesk">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#D7FF00] inline-block animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-[1px] text-[#D7FF00]">
                  {currentCategoryInfo.subtitle}
                </span>
              </div>
              <h1 className="font-anton uppercase text-4xl sm:text-6xl lg:text-7xl tracking-[-0.015em] leading-[0.92] text-[#F2F0E9]">
                {currentCategoryInfo.name}
              </h1>
              <p className="font-inter font-normal text-sm sm:text-base text-[#B8B8B0] mt-4 leading-relaxed">
                {currentCategoryInfo.description}
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="shrink-0 font-mono text-xs border border-[#262626] bg-[#141414] p-4 flex flex-col gap-1.5 self-start md:self-end">
              <div className="flex items-center justify-between gap-6 text-[#8C8D88]">
                <span>RELEASE VOL:</span>
                <span className="text-[#D7FF00] font-bold">2026 DROP SERIES</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-[#8C8D88]">
                <span>AVAILABILITY:</span>
                <span className="text-white font-bold">IN STOCK & NUMBERED</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-[#8C8D88]">
                <span>EST. DISPATCH:</span>
                <span className="text-white">WITHIN 24 HOURS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills & Controls Bar */}
      <div className="sticky top-[60px] sm:top-[68px] z-30 bg-[#F2F0E9]/95 backdrop-blur-md border-b border-[#292A29]/15 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-grotesk text-xs font-bold uppercase tracking-[1px]">
              {categoriesConfig.map((cat) => {
                const count = categoryCounts[cat.id];
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      onNavigateCategory(cat.id);
                    }}
                    className={`px-3.5 py-2 border transition-all duration-150 flex items-center gap-2 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#0B0B0B] text-[#D7FF00] border-[#0B0B0B] shadow-sm'
                        : 'bg-white text-[#292A29] border-[#292A29]/20 hover:border-[#292A29] hover:bg-[#EAE7DC]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono ${
                        isActive ? 'bg-[#D7FF00] text-[#0B0B0B] font-extrabold' : 'bg-[#EAE7DC] text-[#61625D]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Sort controls */}
            <div className="flex items-center gap-3 font-sans text-xs">
              {/* Quick Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#61625D] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="FILTER STYLE / NAME..."
                  className="w-full bg-white border border-[#292A29]/25 pl-8 pr-7 py-2 text-xs font-mono uppercase text-[#292A29] placeholder:text-[#8C8D88] focus:outline-none focus:border-[#0B0B0B]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C8D88] hover:text-[#0B0B0B]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#61625D]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-[#292A29]/25 py-2 px-2.5 text-xs font-mono font-bold uppercase text-[#292A29] focus:outline-none focus:border-[#0B0B0B] cursor-pointer"
                >
                  <option value="featured">SORT: FEATURED</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                  <option value="newest">NEWEST ARRIVALS</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredProducts.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#292A29]/25 p-12 text-center my-8">
            <h3 className="font-anton text-2xl uppercase tracking-[-0.02em] text-[#292A29]">
              NO PIECES FOUND
            </h3>
            <p className="font-sans text-xs text-[#61625D] mt-2 max-w-sm mx-auto">
              No products matched the current search "{searchQuery}" in this category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                onNavigateCategory('all');
              }}
              className="mt-5 px-5 py-2.5 bg-[#0B0B0B] text-[#D7FF00] font-sans font-bold text-xs uppercase cursor-pointer"
            >
              CLEAR FILTERS & SHOW ALL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const selectedSize = cardSelectedSizes[product.id] || product.sizes[0] || 'L';
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group flex flex-col bg-white border border-[#292A29]/20 hover:border-[#292A29] transition-all duration-200 shadow-sm hover:shadow-xl cursor-pointer relative overflow-hidden"
                >
                  {/* Product Image Frame */}
                  <div className="relative aspect-[4/5] bg-[#E8E6DF] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Corner Label */}
                    {product.label && (
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`text-[10px] font-sans font-extrabold uppercase tracking-[0.05em] px-2.5 py-1 border shadow-sm ${
                            product.label === 'NEW'
                              ? 'bg-[#D7FF00] text-[#0B0B0B] border-[#0B0B0B]'
                              : product.label === 'BEST SELLER'
                              ? 'bg-[#0B0B0B] text-[#F2F0E9] border-[#0B0B0B]'
                              : 'bg-white text-[#0B0B0B] border-[#0B0B0B]'
                          }`}
                        >
                          {product.label}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      aria-label="Save to Archive"
                      className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isWishlisted
                          ? 'bg-[#D7FF00] text-[#0B0B0B]'
                          : 'bg-[#0B0B0B]/40 text-white hover:bg-[#0B0B0B] hover:text-[#D7FF00]'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current stroke-current' : 'stroke-[2]'}`}
                      />
                    </button>

                    {/* GSM / Material Pill */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="text-[10px] font-mono bg-[#0B0B0B]/80 text-[#F2F0E9] px-2 py-0.5 backdrop-blur-xs">
                        {product.gsm}
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Interactive Controls */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      {/* Category Label */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#61625D] uppercase tracking-wider mb-1">
                        <span>{product.categoryLabel}</span>
                        <span className="text-[#0B0B0B] font-bold">
                          {product.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-grotesk font-bold uppercase text-lg sm:text-xl text-[#292A29] tracking-tight leading-snug group-hover:text-[#0B0B0B] transition-colors">
                        {product.name}
                      </h3>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-2 mt-1.5 font-grotesk">
                        <span className="font-bold text-lg text-[#292A29] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#8C8D88] line-through tabular-nums">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-[#61625D] uppercase tracking-[1px] ml-auto">
                          READY TO SHIP
                        </span>
                      </div>

                      {/* Interactive Size Pills */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-[#292A29]/10 font-grotesk">
                          <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5 text-[#61625D]">
                            <span>SIZE: <strong className="text-[#0B0B0B]">{selectedSize}</strong></span>
                            <span className="text-[10px] text-[#8C8D88]">
                              {product.category === 'jeans' ? 'WAIST' : 'OVERSIZED'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {product.sizes.map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardSelectedSizes((prev) => ({ ...prev, [product.id]: sz }));
                                }}
                                className={`px-2 py-0.5 text-[10px] font-mono font-bold border transition-colors ${
                                  selectedSize === sz
                                    ? 'bg-[#0B0B0B] text-[#D7FF00] border-[#0B0B0B]'
                                    : 'bg-[#F2F0E9] text-[#292A29] border-[#292A29]/20 hover:border-[#292A29]'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Add To Cart Button */}
                    <div className="mt-4 pt-3 border-t border-[#292A29]/10">
                      <button
                        onClick={(e) => handleCardAddToCart(e, product)}
                        className={`w-full py-2.5 px-4 font-grotesk font-bold text-xs uppercase tracking-[1px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                          isJustAdded
                            ? 'bg-[#D7FF00] text-[#0B0B0B] border border-[#0B0B0B]'
                            : 'bg-[#0B0B0B] text-[#F2F0E9] hover:bg-[#202120] hover:text-[#D7FF00]'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>ADDED TO BAG</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>ADD TO BAG · ₹{product.price.toLocaleString('en-IN')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Category Switcher Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-[#292A29]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0B0B0B] text-[#F2F0E9] p-8 sm:p-10 border-2 border-[#292A29]">
          <div>
            <span className="font-sans font-bold text-xs text-[#D7FF00] uppercase tracking-[0.05em]">
              LOOKING FOR SOMETHING ELSE?
            </span>
            <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-[-0.02em] mt-1">
              EXPLORE ALL ZEALNIX COLLECTIONS
            </h3>
            <p className="text-xs sm:text-sm text-[#B8B8B0] mt-2 max-w-xl">
              Switch freely between our dedicated Denim, Overshirts, Graphic T-Shirts, and Limited Drop archives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {[
              { id: 'all' as const, label: 'ALL PRODUCTS' },
              { id: 'jeans' as const, label: 'JEANS' },
              { id: 'shirts' as const, label: 'SHIRTS' },
              { id: 't-shirts' as const, label: 'T-SHIRTS' },
              { id: 'the-drop' as const, label: 'THE DRIP' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  onNavigateCategory(cat.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-2.5 text-xs font-sans font-extrabold uppercase tracking-[0.03em] border transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#D7FF00] text-[#0B0B0B] border-[#D7FF00]'
                    : 'bg-[#181818] text-[#F2F0E9] border-[#333] hover:border-[#D7FF00] hover:text-[#D7FF00]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
