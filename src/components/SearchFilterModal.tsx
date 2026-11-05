import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  if (!isOpen) return null;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat =
          selectedCategory === 'all' ||
          (selectedCategory === 'jeans' && p.category === 'jeans') ||
          (selectedCategory === 'shirts' && p.category === 'shirts') ||
          (selectedCategory === 't-shirts' && (p.category === 't-shirts' || p.category === 'tees')) ||
          (selectedCategory === 'the-drop' && (p.category === 'the-drop' || p.category === 'hoodies'));

        return matchesQuery && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0B0B] text-[#F2F0E9] border-2 border-[#262626] w-full max-w-3xl max-h-[82vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#141414] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D7FF00] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS, JEANS, SHIRTS, TEES, DROPS..."
            className="flex-1 bg-transparent text-sm sm:text-base font-mono uppercase text-[#F2F0E9] placeholder:text-[#888] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-[#B8B8B0] hover:text-[#D7FF00] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div className="px-5 py-3 border-b border-[#262626] bg-[#111111] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[#8C8D88]">CATEGORY:</span>
            {[
              { id: 'all', label: 'ALL' },
              { id: 'jeans', label: 'JEANS' },
              { id: 'shirts', label: 'SHIRTS' },
              { id: 't-shirts', label: 'T-SHIRTS' },
              { id: 'the-drop', label: 'THE DRIP' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#D7FF00] text-[#0B0B0B] font-bold'
                    : 'text-[#B8B8B0] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8C8D88]">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B0B0B] border border-[#2e2e2e] text-xs font-mono text-[#F2F0E9] px-2 py-1 focus:outline-none focus:border-[#D7FF00]"
            >
              <option value="featured">FEATURED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-[#B8B8B0] font-mono text-xs">
              No matching drop apparel found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 bg-[#202120] border border-[#3E403D] hover:border-[#D7FF00] transition-colors cursor-pointer group"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 aspect-square object-cover bg-black border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-grotesk text-sm font-bold uppercase tracking-tight text-[#F2F0E9] group-hover:text-[#D7FF00] transition-colors truncate">
                      {p.name}
                    </h4>
                    {p.label && (
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 bg-[#D7FF00] text-[#292A29]">
                        {p.label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#B8B8B0] font-sans font-normal truncate mt-0.5">{p.categoryLabel}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-sans text-base font-bold text-[#F2F0E9] group-hover:text-[#D7FF00] tabular-nums">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <div className="text-[10px] font-sans font-bold uppercase tracking-[0.03em] text-[#8C8D88] flex items-center justify-end gap-1 mt-0.5">
                    <span>VIEW</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
