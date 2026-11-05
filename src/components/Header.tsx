import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingBag, Menu, X, Sparkles, ChevronDown, ChevronRight, Layers, Flame } from 'lucide-react';
import { ZealnixLogo } from './ZealnixLogo';

export type CollectionCategoryType = 'all' | 'jeans' | 'shirts' | 't-shirts' | 'the-drop';
export type NavSectionId = 'home' | 'shop' | 'collections' | 'create-yours' | 'about' | 'faq' | 'contact';

interface HeaderProps {
  cartCount: number;
  activeView?: string;
  activeCategory?: CollectionCategoryType;
  activeSection?: NavSectionId;
  onSelectSection?: (sectionId: NavSectionId) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenCreateYours: () => void;
  onOpenAbout: () => void;
  onOpenFAQ: () => void;
  onOpenContact?: () => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateCategory?: (category: CollectionCategoryType) => void;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  activeView = 'home',
  activeCategory = 'all',
  activeSection = 'home',
  onSelectSection,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onOpenCreateYours,
  onOpenAbout,
  onOpenFAQ,
  onOpenContact,
  onNavigateSection,
  onNavigateCategory,
  onNavigateHome
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [mobileCollectionsExpanded, setMobileCollectionsExpanded] = useState(true);
  
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnterCollections = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setCollectionsDropdownOpen(true);
  };

  const handleMouseLeaveCollections = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCollectionsDropdownOpen(false);
    }, 250);
  };

  const handleCategoryClick = (category: CollectionCategoryType) => {
    setCollectionsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onNavigateCategory) {
      onNavigateCategory(category);
    } else {
      onNavigateSection('collections');
    }
  };

  const handleHomeClick = () => {
    setCollectionsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectSection) {
      onSelectSection('home');
    } else if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId: NavSectionId) => {
    setCollectionsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectSection) {
      onSelectSection(sectionId);
    } else if (sectionId === 'home' && onNavigateHome) {
      onNavigateHome();
    } else {
      onNavigateSection(sectionId === 'shop' ? 'the-drop' : sectionId);
    }
  };

  const categories = [
    {
      id: 'jeans' as const,
      label: 'Jeans',
      count: 7,
      badge: '7 ITEMS',
      desc: 'Raw selvedge & wide-leg cargo silhouettes'
    },
    {
      id: 'shirts' as const,
      label: 'Shirts',
      count: 7,
      badge: '7 ITEMS',
      desc: 'Heavy flannels & tactical zip workshirts'
    },
    {
      id: 't-shirts' as const,
      label: 'T-Shirts',
      count: 11,
      badge: '11 ITEMS',
      desc: '280–300GSM boxy graphic & brutalist cuts'
    },
    {
      id: 'the-drop' as const,
      label: 'The Drip',
      count: 13,
      badge: '13 ITEMS',
      desc: 'Exclusive numbered hoodies & technical shells'
    }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 header-jetblack ${
          isScrolled
            ? 'bg-[#000000]/95 backdrop-blur-md py-3.5 border-b border-white/10 shadow-lg'
            : 'bg-[#000000] py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <button
                onClick={handleHomeClick}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7FF00] rounded transition-transform active:scale-95 text-left cursor-pointer"
                aria-label="ZEALNIX Home"
              >
                <ZealnixLogo size="md" />
              </button>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 font-grotesk font-bold text-[12px] tracking-[1px] uppercase text-[#F2F0E9]">
              {/* HOME */}
              <button
                onClick={() => handleNavClick('home')}
                className={`group relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  activeSection === 'home' ? 'text-[#D5C3AA]' : 'text-[#E4E1D7]/90 hover:text-[#D5C3AA]'
                }`}
              >
                <span>HOME</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#D5C3AA] transition-all duration-200 ${
                    activeSection === 'home' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* SHOP */}
              <button
                onClick={() => handleNavClick('shop')}
                className={`group relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  activeSection === 'shop' ? 'text-[#D5C3AA]' : 'text-[#E4E1D7]/90 hover:text-[#D5C3AA]'
                }`}
              >
                <span>SHOP</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#D5C3AA] transition-all duration-200 ${
                    activeSection === 'shop' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* COLLECTIONS WITH DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnterCollections}
                onMouseLeave={handleMouseLeaveCollections}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleNavClick('collections');
                    setCollectionsDropdownOpen(!collectionsDropdownOpen);
                  }}
                  className={`group relative py-1 flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                    activeSection === 'collections' || collectionsDropdownOpen
                      ? 'text-[#D5C3AA]'
                      : 'text-[#E4E1D7]/90 hover:text-[#D5C3AA]'
                  }`}
                  aria-expanded={collectionsDropdownOpen}
                >
                  <span>COLLECTIONS</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      collectionsDropdownOpen ? 'rotate-180 text-[#D5C3AA]' : 'text-[#8C8D88] group-hover:text-[#D5C3AA]'
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#D5C3AA] transition-all duration-200 ${
                      activeSection === 'collections' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {collectionsDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-72 bg-[#000000] border-2 border-[#262626] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={handleMouseEnterCollections}
                    onMouseLeave={handleMouseLeaveCollections}
                  >
                    <div className="px-3.5 py-1.5 border-b border-[#262626] mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#8C8D88]">
                        ZEALNIX COLLECTIONS
                      </span>
                      <span className="text-[10px] font-mono text-[#D5C3AA]">VOL. 2026</span>
                    </div>

                    <div className="py-1">
                      {categories.map((cat) => {
                        const isCurrentActive = activeView === 'catalog' && activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between gap-3 transition-colors cursor-pointer group hover:bg-[#181818] ${
                              isCurrentActive ? 'bg-[#141414] border-l-2 border-[#D5C3AA]' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-anton uppercase tracking-normal text-sm transition-colors ${
                                    isCurrentActive
                                      ? 'text-[#D5C3AA]'
                                      : 'text-[#F2F0E9] group-hover:text-[#D5C3AA]'
                                  }`}
                                >
                                  {cat.label}
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#222] text-[#B8B8B0] border border-[#333] group-hover:border-[#D5C3AA]/50 group-hover:text-[#D5C3AA]">
                                  {cat.badge}
                                </span>
                              </div>
                              <p className="text-[10px] font-sans font-normal text-[#8C8D88] mt-0.5 group-hover:text-[#B8B8B0] line-clamp-1">
                                {cat.desc}
                              </p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-[#555] group-hover:text-[#D5C3AA] group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                          </button>
                        );
                      })}
                    </div>

                    {/* View All Products shortcut row */}
                    <div className="mt-1 pt-1.5 border-t border-[#262626] px-2 pb-1">
                      <button
                        type="button"
                        onClick={() => handleCategoryClick('all')}
                        className="w-full px-3 py-2 bg-[#181818] hover:bg-[#D5C3AA] text-[#F2F0E9] hover:text-[#0B0B0B] text-xs font-grotesk font-bold uppercase tracking-[1px] flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <span>VIEW ALL PRODUCTS (38)</span>
                        <span className="font-mono text-xs group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ✦ CREATE YOURS */}
              <button
                type="button"
                onClick={() => {
                  setCollectionsDropdownOpen(false);
                  setMobileMenuOpen(false);
                  onOpenCreateYours();
                }}
                className="group relative py-1 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer text-[#E4E1D7]/90 hover:text-[#D5C3AA]"
              >
                <span className="select-none text-xs">✦</span>
                <span>CREATE YOURS</span>
                <span className="absolute bottom-0 left-0 h-[2px] bg-[#D5C3AA] transition-all duration-200 w-0 group-hover:w-full" />
              </button>

              {/* ABOUT */}
              <button
                type="button"
                onClick={() => handleNavClick('about')}
                className={`group relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  activeSection === 'about' ? 'text-[#D5C3AA]' : 'text-[#E4E1D7]/90 hover:text-[#D5C3AA]'
                }`}
              >
                <span>ABOUT</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#D5C3AA] transition-all duration-200 ${
                    activeSection === 'about' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* FAQ */}
              <button
                type="button"
                onClick={() => {
                  setCollectionsDropdownOpen(false);
                  setMobileMenuOpen(false);
                  onOpenFAQ();
                }}
                className="group relative py-1 transition-colors whitespace-nowrap cursor-pointer text-[#E4E1D7]/90 hover:text-[#D5C3AA]"
              >
                <span>FAQ</span>
                <span className="absolute bottom-0 left-0 h-[2px] bg-[#D5C3AA] transition-all duration-200 w-0 group-hover:w-full" />
              </button>

              {/* CONTACT US */}
              <button
                onClick={() => handleNavClick('contact')}
                className={`group relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  activeSection === 'contact' ? 'text-[#D5C3AA]' : 'text-[#E4E1D7]/90 hover:text-[#D5C3AA]'
                }`}
              >
                <span>CONTACT US</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#D5C3AA] transition-all duration-200 ${
                    activeSection === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            </nav>

            {/* Right: Actions (Search, Account, Cart) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Icon */}
              <button
                onClick={onOpenSearch}
                aria-label="Search Catalog"
                className="p-2 text-[#F2F0E9] hover:text-[#D7FF00] transition-colors rounded-lg hover:bg-white/5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D7FF00] cursor-pointer"
                title="Search (Cmd+K)"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Account Icon */}
              <button
                onClick={onOpenAccount}
                aria-label="User Account"
                className="p-2 text-[#F2F0E9] hover:text-[#D7FF00] transition-colors rounded-lg hover:bg-white/5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D7FF00] cursor-pointer"
                title="Account"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Shopping Bag Icon with Live Count */}
              <button
                onClick={onOpenCart}
                aria-label={`Shopping Bag, ${cartCount} items`}
                className="relative p-2 text-[#F2F0E9] hover:text-[#D7FF00] transition-colors rounded-lg hover:bg-white/5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D7FF00] cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] bg-[#D7FF00] text-[#0B0B0B] text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none shadow-md tabular-nums animate-in zoom-in-50 duration-200">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#F2F0E9] hover:text-[#D7FF00] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#000000]/98 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#262626]">
              <button onClick={handleHomeClick}>
                <ZealnixLogo size="md" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#F2F0E9] hover:text-[#D7FF00] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              {/* Home */}
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left text-2xl font-bebas tracking-wide py-2.5 transition-colors flex items-center justify-between border-b border-white/5 ${
                  activeSection === 'home' ? 'text-[#D5C3AA]' : 'text-[#F2F0E9] hover:text-[#D5C3AA]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>HOME</span>
                  {activeSection === 'home' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5C3AA]" />
                  )}
                </span>
                <span className="text-xs font-mono text-[#B8B8B0]">→</span>
              </button>

              {/* Shop */}
              <button
                onClick={() => handleNavClick('shop')}
                className={`text-left text-2xl font-bebas tracking-wide py-2.5 transition-colors flex items-center justify-between border-b border-white/5 ${
                  activeSection === 'shop' ? 'text-[#D5C3AA]' : 'text-[#F2F0E9] hover:text-[#D5C3AA]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>SHOP</span>
                  {activeSection === 'shop' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5C3AA]" />
                  )}
                </span>
                <span className="text-xs font-mono text-[#B8B8B0]">→</span>
              </button>

              {/* Collections Accordion */}
              <div className="border-b border-white/5 py-2">
                <button
                  type="button"
                  onClick={() => {
                    handleNavClick('collections');
                    setMobileCollectionsExpanded(!mobileCollectionsExpanded);
                  }}
                  className={`w-full text-left text-2xl font-bebas tracking-wide transition-colors flex items-center justify-between py-1 ${
                    activeSection === 'collections' ? 'text-[#D5C3AA]' : 'text-[#F2F0E9] hover:text-[#D5C3AA]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>COLLECTIONS</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#D5C3AA] text-[#0B0B0B] font-black">
                      4 CATEGORIES
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      mobileCollectionsExpanded ? 'rotate-180 text-[#D5C3AA]' : 'text-[#8C8D88]'
                    }`}
                  />
                </button>

                {mobileCollectionsExpanded && (
                  <div className="pl-3 pr-1 pt-2 pb-1 space-y-1.5 animate-in fade-in duration-150">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full text-left py-2 px-3 bg-[#141414] hover:bg-[#202020] border border-[#262626] flex items-center justify-between transition-colors group cursor-pointer"
                      >
                        <div>
                          <div className="font-anton text-base uppercase text-[#F2F0E9] group-hover:text-[#D5C3AA]">
                            {cat.label}
                          </div>
                          <div className="text-[10px] font-sans text-[#8C8D88]">
                            {cat.desc}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#222] text-[#D5C3AA] border border-[#333]">
                          {cat.badge}
                        </span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleCategoryClick('all')}
                      className="w-full text-center py-2.5 bg-[#D5C3AA] text-[#0B0B0B] font-sans font-extrabold text-xs uppercase tracking-wider mt-2 cursor-pointer"
                    >
                      VIEW ALL PRODUCTS (38) →
                    </button>
                  </div>
                )}
              </div>

              {/* Create Yours */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateYours();
                }}
                className="text-left text-2xl font-bebas tracking-wide py-2.5 transition-colors flex items-center justify-between border-b border-white/5 text-[#F2F0E9] hover:text-[#D5C3AA] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D5C3AA]" />
                  <span>CREATE YOURS</span>
                </span>
                <span className="text-xs font-mono text-[#D5C3AA]">STUDIO</span>
              </button>

              {/* About */}
              <button
                type="button"
                onClick={() => handleNavClick('about')}
                className={`text-left text-2xl font-bebas tracking-wide py-2.5 transition-colors flex items-center justify-between border-b border-white/5 ${
                  activeSection === 'about' ? 'text-[#D5C3AA]' : 'text-[#F2F0E9] hover:text-[#D5C3AA]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>ABOUT</span>
                  {activeSection === 'about' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5C3AA]" />
                  )}
                </span>
                <span className="text-xs font-mono text-[#B8B8B0]">→</span>
              </button>

              {/* FAQ */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFAQ();
                }}
                className="text-left text-2xl font-bebas tracking-wide py-2.5 transition-colors flex items-center justify-between border-b border-white/5 text-[#F2F0E9] hover:text-[#D5C3AA] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>FAQ</span>
                </span>
                <span className="text-xs font-mono text-[#B8B8B0]">→</span>
              </button>

              {/* CONTACT US */}
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-left text-2xl font-bebas tracking-wide py-2.5 transition-colors flex items-center justify-between border-b border-white/5 ${
                  activeSection === 'contact' ? 'text-[#D5C3AA]' : 'text-[#F2F0E9] hover:text-[#D5C3AA]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>CONTACT US</span>
                  {activeSection === 'contact' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5C3AA]" />
                  )}
                </span>
                <span className="text-xs font-mono text-[#B8B8B0]">→</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#262626] space-y-3 mt-6">
            <button
              onClick={() => {
                onOpenCreateYours();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 bg-[#D7FF00] text-[#0B0B0B] font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>CUSTOM DROP STUDIO</span>
            </button>
            <p className="text-center text-xs text-[#B8B8B0]">
              ZEALNIX · WEAR YOUR IDEA · EST. 2024
            </p>
          </div>
        </div>
      )}
    </>
  );
};
