/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header, CollectionCategoryType, NavSectionId } from './components/Header';
import { Hero } from './components/Hero';
import { TheDrop } from './components/TheDrop';
import { PromotionalBanner } from './components/PromotionalBanner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { StreetwearMargins } from './components/StreetwearMargins';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CreateYoursStudio } from './components/CreateYoursStudio';
import { AccountModal } from './components/AccountModal';
import { SearchFilterModal } from './components/SearchFilterModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { FAQModal, LegalModalTab } from './components/FAQModal';
import { CatalogPage, CatalogCategoryFilter } from './components/CatalogPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PRODUCTS, INITIAL_USER } from './data/products';
import { Product, CartItem, Order, UserAccount } from './types';
import { Sparkles, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  
  // Page routing and navigation state
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'admin-login' | 'admin-dashboard'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategoryFilter>('all');
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // Programmatic scroll lock and debounce timer
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zealnix_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          const match = PRODUCTS.find((p) => p.id === item.productId);
          if (match && item.price < 200) {
            return { ...item, price: match.price };
          }
          return item;
        });
      }
      return [
        {
          id: 'initial-1',
          productId: 'chaos-club-hoodie',
          name: 'CHAOS CLUB',
          price: 1399,
          image: '/src/assets/images/product_chaos_club_1791889113498.jpg',
          selectedColor: 'Deep Graphite',
          selectedSize: 'L',
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  // User account state persisted to localStorage
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('zealnix_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Modals & Panels state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateYoursOpen, setIsCreateYoursOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalModalTab>('faq');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);

  // Quick toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenLegal = (tab: LegalModalTab) => {
    setLegalModalTab(tab);
    setIsFAQOpen(true);
  };

  // Sync products with server database
  const fetchLiveProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (e) {
      // fallback remains current products
    }
  };

  // Verify server-side admin authentication session
  const checkAdminSession = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('zealnix_admin_token');
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          return true;
        }
      }
    } catch (e) {
      // not authenticated
    }
    setAdminUser(null);
    return false;
  };

  // Parse location routing safely
  const parseRouteFromLocation = (): {
    view: 'home' | 'catalog' | 'admin-login' | 'admin-dashboard';
    category: CatalogCategoryFilter;
  } => {
    try {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash.includes('admin/dashboard') || path.includes('/admin/dashboard')) {
        return { view: 'admin-dashboard', category: 'all' };
      }
      if (hash.includes('admin/login') || hash.includes('admin') || path.includes('/admin/login') || path.includes('/admin')) {
        return { view: 'admin-login', category: 'all' };
      }

      if (hash.includes('faq')) {
        setLegalModalTab('faq');
        setIsFAQOpen(true);
      } else if (hash.includes('terms')) {
        setLegalModalTab('terms');
        setIsFAQOpen(true);
      } else if (hash.includes('privacy')) {
        setLegalModalTab('privacy');
        setIsFAQOpen(true);
      } else if (hash.includes('contact') || path.includes('/contact')) {
        setIsContactOpen(true);
      }

      if (hash.includes('jeans') || path.includes('/jeans')) {
        return { view: 'catalog', category: 'jeans' };
      }
      if (hash.includes('shirts') || path.includes('/shirts')) {
        return { view: 'catalog', category: 'shirts' };
      }
      if (hash.includes('t-shirts') || hash.includes('tees') || path.includes('/t-shirts') || path.includes('/tees')) {
        return { view: 'catalog', category: 't-shirts' };
      }
      if (hash.includes('the-drop') || hash.includes('/drop') || path.includes('/the-drop')) {
        return { view: 'catalog', category: 'the-drop' };
      }
      if (
        hash.includes('all-products') || 
        hash.includes('products') || 
        path.includes('/all-products') || 
        path.includes('/products') ||
        hash === '#/collections' ||
        path === '/collections'
      ) {
        return { view: 'catalog', category: 'all' };
      }
      return { view: 'home', category: 'all' };
    } catch {
      return { view: 'home', category: 'all' };
    }
  };

  // Sync route on mount and on browser navigation events
  useEffect(() => {
    fetchLiveProducts();

    const route = parseRouteFromLocation();
    if (route.view === 'admin-dashboard') {
      checkAdminSession().then((isAuth) => {
        if (isAuth) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
          window.location.hash = '#/admin/login';
        }
      });
    } else if (route.view === 'admin-login') {
      checkAdminSession().then((isAuth) => {
        if (isAuth) {
          setCurrentView('admin-dashboard');
          window.location.hash = '#/admin/dashboard';
        } else {
          setCurrentView('admin-login');
        }
      });
    } else if (route.view === 'catalog') {
      setCurrentView('catalog');
      setSelectedCategory(route.category);
    }

    const handlePopState = async () => {
      const currentRoute = parseRouteFromLocation();
      if (currentRoute.view === 'admin-dashboard') {
        const isAuth = await checkAdminSession();
        if (isAuth) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
          window.location.hash = '#/admin/login';
        }
      } else {
        setCurrentView(currentRoute.view);
      }
      setSelectedCategory(currentRoute.category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zealnix_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zealnix_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Navigation handlers
  const handleNavigateCategory = (category: CatalogCategoryFilter) => {
    setCurrentView('catalog');
    setSelectedCategory(category);
    const targetHash = category === 'all' ? '#/all-products' : `#/collections/${category}`;
    try {
      window.history.pushState(null, '', targetHash);
    } catch {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSection = (sectionId: NavSectionId) => {
    // 1. Immediate visual active state update on navbar
    setActiveSection(sectionId);

    if (sectionId === 'about') {
      setIsAboutOpen(true);
      return;
    }

    // 2. Lock observer to prevent scroll fighting during animation
    isProgrammaticScrollRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const performScroll = () => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const elem = document.getElementById(sectionId) || (sectionId === 'shop' ? document.getElementById('the-drop') : null);
        if (elem) {
          const headerOffset = 80;
          const elementPosition = elem.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      }

      try {
        window.history.pushState(null, '', `#${sectionId}`);
      } catch {
        window.location.hash = `#${sectionId}`;
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        setActiveSection(sectionId);
      }, 850);
    };

    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(performScroll, 120);
    } else {
      performScroll();
    }
  };

  const handleNavigateHome = () => {
    handleSelectSection('home');
  };

  const handleNavigateSection = (sectionId: string) => {
    const validNavIds: NavSectionId[] = ['home', 'shop', 'collections', 'create-yours', 'about', 'faq', 'contact'];
    const mappedId = (sectionId === 'the-drop' ? 'shop' : sectionId) as NavSectionId;
    if (validNavIds.includes(mappedId)) {
      handleSelectSection(mappedId);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IntersectionObserver & Bi-directional Scroll-Aware Active Navigation
  useEffect(() => {
    if (currentView !== 'home') return;

    const sectionIds: NavSectionId[] = [
      'home',
      'shop',
      'collections',
      'contact'
    ];

    const evaluateActiveSection = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Top of page edge case
      if (scrollY < 100) {
        setActiveSection('home');
        return;
      }

      // 2. Near bottom of page edge case (Contact is the final section)
      if (windowHeight + scrollY >= documentHeight - 80) {
        setActiveSection('contact');
        return;
      }

      // 3. Focal line detection (below sticky header)
      const focalLine = 150;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const elem = document.getElementById(id) || (id === 'shop' ? document.getElementById('the-drop') : null);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          if (rect.top <= focalLine) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    // IntersectionObserver with header margin offset
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort((a, b) => {
            return Math.abs(a.boundingClientRect.top - 80) - Math.abs(b.boundingClientRect.top - 80);
          });
          const id = intersecting[0].target.id as NavSectionId;
          const mappedId = (id === ('the-drop' as any) ? 'shop' : id) as NavSectionId;
          if (sectionIds.includes(mappedId)) {
            setActiveSection(mappedId);
          }
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.2, 0.5]
      }
    );

    sectionIds.forEach((id) => {
      const elem = document.getElementById(id) || (id === 'shop' ? document.getElementById('the-drop') : null);
      if (elem) observer.observe(elem);
    });

    // Throttled scroll listener with requestAnimationFrame for smooth bi-directional tracking
    let isTicking = false;
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          evaluateActiveSection();
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    evaluateActiveSection();

    // Check direct anchor landing
    const currentHash = window.location.hash.replace('#', '').replace('/', '');
    if (currentHash && sectionIds.includes(currentHash as NavSectionId)) {
      setTimeout(() => {
        handleSelectSection(currentHash as NavSectionId);
      }, 150);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentView]);

  // Add standard product to cart
  const handleAddToCart = (
    product: Product,
    selectedColor?: string,
    selectedSize: string = 'L',
    quantity: number = 1
  ) => {
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedColor === color &&
        item.selectedSize === selectedSize &&
        !item.isCustom
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedColor: color,
        selectedSize,
        quantity
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    showToast(`Added "${product.name}" (Size ${selectedSize}) to Bag`);
  };

  // Add custom studio drop item to cart
  const handleAddCustomItem = (customItem: CartItem) => {
    setCartItems((prev) => [...prev, customItem]);
    showToast(`Added custom drop "${customItem.name}" to Bag`);
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Remove item
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from Bag');
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    const exists = user.wishlist.includes(productId);
    let newWishlist: string[];
    if (exists) {
      newWishlist = user.wishlist.filter((id) => id !== productId);
      showToast('Removed item from Saved Archive');
    } else {
      newWishlist = [...user.wishlist, productId];
      showToast('Saved to your Archive');
    }
    setUser((prev) => ({ ...prev, wishlist: newWishlist }));
  };

  // Checkout actions
  const handleProceedToCheckout = (discountPercent: number) => {
    setCheckoutDiscount(discountPercent);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Admin portal handlers
  const handleNavigateAdmin = async () => {
    const isAuth = await checkAdminSession();
    if (isAuth) {
      setCurrentView('admin-dashboard');
      try {
        window.history.pushState(null, '', '#/admin/dashboard');
      } catch {
        window.location.hash = '#/admin/dashboard';
      }
    } else {
      setCurrentView('admin-login');
      try {
        window.history.pushState(null, '', '#/admin/login');
      } catch {
        window.location.hash = '#/admin/login';
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (loggedInUser: { email: string; name: string; role: string }) => {
    setAdminUser(loggedInUser);
    setCurrentView('admin-dashboard');
    try {
      window.history.pushState(null, '', '#/admin/dashboard');
    } catch {
      window.location.hash = '#/admin/dashboard';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Admin authorization verified. Welcome to Admin Portal.');
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('zealnix_admin_token');
    } catch (e) {
      console.warn(e);
    }
    setAdminUser(null);
    setCurrentView('admin-login');
    try {
      window.history.pushState(null, '', '#/admin/login');
    } catch {
      window.location.hash = '#/admin/login';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Signed out of Admin Portal.');
  };

  const handleOrderCompleted = async (order: Order) => {
    setUser((prev) => ({
      ...prev,
      orders: [order, ...prev.orders]
    }));
    setCartItems([]);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      fetchLiveProducts();
    } catch (err) {
      console.error('Error saving order to backend:', err);
    }
  };

  // Render Admin Portal Views
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onReturnToStore={handleNavigateHome}
      />
    );
  }

  if (currentView === 'admin-dashboard') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onReturnToStore={handleNavigateHome}
        />
      );
    }
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={handleAdminLogout}
        onReturnToStore={handleNavigateHome}
        onProductsUpdated={fetchLiveProducts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE4DC] text-[#261C14] flex flex-col font-sans selection:bg-[#3C2A21] selection:text-[#EAE4DC]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3C2A21] text-[#EAE4DC] px-4 py-3 font-sans text-xs font-extrabold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-200 border-2 border-[#D5C3AA]">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5] text-[#D5C3AA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Navigation & Collections Dropdown */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        activeView={currentView}
        activeCategory={selectedCategory}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCreateYours={() => setIsCreateYoursOpen(true)}
        onOpenAbout={() => handleSelectSection('about')}
        onOpenFAQ={() => setIsFAQOpen(true)}
        onOpenContact={() => handleSelectSection('contact')}
        onNavigateSection={handleNavigateSection}
        onNavigateCategory={handleNavigateCategory}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'catalog' ? (
          /* Dedicated Category & All Products Shopping Page */
          <CatalogPage
            products={products}
            initialCategory={selectedCategory}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p, color, size) => handleAddToCart(p, color, size, 1)}
            onNavigateHome={handleNavigateHome}
            onNavigateCategory={handleNavigateCategory}
            wishlist={user.wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : (
          /* Home Page Sections */
          <>
            {/* Hero Section */}
            <Hero
              onShopClick={() => handleNavigateSection('the-drop')}
              onCreateYoursClick={() => setIsCreateYoursOpen(true)}
            />

            {/* Product Collection Section — THE DROP (Warm Ivory) */}
            <TheDrop
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p, color, size) => handleAddToCart(p, color, size, 1)}
              onViewAllClick={() => handleNavigateCategory('all')}
              wishlist={user.wishlist}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* Promotional Brand Story */}
            <PromotionalBanner
              onExploreClick={() => handleNavigateSection('the-drop')}
              onCreateYoursClick={() => setIsCreateYoursOpen(true)}
            />

            {/* Streetwear Drop Schedule / Collections Teaser (#collections) */}
            <section id="collections" className="bg-[#3C2A21] text-[#EAE4DC] py-16 border-t border-[#D5C3AA]/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="font-grotesk font-semibold text-xs text-[#D5C3AA] uppercase tracking-[1px]">
                      DROP SCHEDULE & ARCHIVES
                    </span>
                    <h3 className="font-anton uppercase text-4xl sm:text-5xl tracking-[-0.015em] leading-[0.9] text-[#EAE4DC] mt-1">
                      LIMITED RELEASE CADENCE
                    </h3>
                  </div>
                  <div className="font-inter font-normal text-xs text-[#D5C3AA]/80">
                    Strictly capped production. No re-issues.
                  </div>
                </div>

                {/* Direct category quick jumps */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <span className="text-xs font-mono text-[#D5C3AA]/70 mr-2">BROWSE BY CATEGORY:</span>
                  {[
                    { id: 'jeans' as const, label: 'JEANS' },
                    { id: 'shirts' as const, label: 'SHIRTS' },
                    { id: 't-shirts' as const, label: 'T-SHIRTS' },
                    { id: 'the-drop' as const, label: 'THE DRIP' },
                    { id: 'all' as const, label: 'ALL PRODUCTS →' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleNavigateCategory(cat.id)}
                      className="px-3 py-1.5 bg-[#261C14] hover:bg-[#D5C3AA] text-[#EAE4DC] hover:text-[#261C14] border border-[#D5C3AA]/30 font-grotesk text-xs font-bold uppercase tracking-[1px] transition-colors cursor-pointer"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-[#261C14] border border-[#D5C3AA]/30 hover:border-[#D5C3AA] transition-colors group">
                    <div className="flex items-center justify-between text-xs mb-3 font-semibold font-grotesk">
                      <span className="text-[#D5C3AA]">VOL. 04 · LIVE NOW</span>
                      <span className="text-[#D5C3AA]/70">OCTOBER 2026</span>
                    </div>
                    <h4 className="font-grotesk text-xl font-bold uppercase tracking-tight text-[#EAE4DC] group-hover:text-[#D5C3AA] transition-colors leading-tight">
                      CHAOS & MINDSET
                    </h4>
                    <p className="font-inter text-xs text-[#D5C3AA]/80 mt-2 font-normal leading-relaxed">
                      Featuring 460GSM heavy loopback hoodies and vintage washed botanical boxy tees.
                    </p>
                    <button
                      onClick={() => handleNavigateCategory('the-drop')}
                      className="mt-4 text-xs font-grotesk font-bold text-[#D5C3AA] uppercase tracking-[1px] flex items-center gap-1 group-hover:underline cursor-pointer"
                    >
                      SHOP THIS DROP →
                    </button>
                  </div>

                  <div className="p-6 bg-[#261C14] border border-[#D5C3AA]/30 hover:border-[#D5C3AA] transition-colors group">
                    <div className="flex items-center justify-between text-xs mb-3 font-semibold font-grotesk">
                      <span className="text-[#EAE4DC]/60">VOL. 05 · UPCOMING</span>
                      <span className="text-[#D5C3AA]/70">NOVEMBER 2026</span>
                    </div>
                    <h4 className="font-grotesk text-xl font-bold uppercase tracking-tight text-[#EAE4DC] leading-tight">
                      ANARCHY ARCHIVE & NYLON
                    </h4>
                    <p className="font-inter text-xs text-[#D5C3AA]/80 mt-2 font-normal leading-relaxed">
                      Technical cargo trousers, oversized thermal pullovers, and tactile puff screenprints.
                    </p>
                    <button
                      onClick={() => setIsAccountOpen(true)}
                      className="mt-4 text-xs font-grotesk font-bold text-[#D5C3AA]/80 hover:text-[#D5C3AA] uppercase tracking-[1px] flex items-center gap-1 cursor-pointer"
                    >
                      ENABLE NOTIFICATIONS →
                    </button>
                  </div>

                  <div className="p-6 bg-[#261C14] border border-[#D5C3AA]/30 hover:border-[#D5C3AA] transition-colors group">
                    <div className="flex items-center justify-between text-xs mb-3 font-semibold">
                      <span className="text-[#D5C3AA]">BESPOKE ANYTIME</span>
                      <span className="text-[#D5C3AA]/70">24/7 STUDIO</span>
                    </div>
                    <h4 className="font-anton text-2xl uppercase tracking-[-0.02em] text-[#EAE4DC] group-hover:text-[#D5C3AA] transition-colors leading-tight">
                      CREATE YOURS STUDIO
                    </h4>
                    <p className="text-xs text-[#B8B8B0] mt-2 font-normal leading-relaxed">
                      Your custom text and graphic placement printed on-demand with no minimums.
                    </p>
                    <button
                      onClick={() => setIsCreateYoursOpen(true)}
                      className="mt-4 text-xs font-sans font-extrabold text-[#D7FF00] uppercase tracking-[0.03em] flex items-center gap-1 group-hover:underline cursor-pointer"
                    >
                      OPEN STUDIO NOW →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Direct Contact & Concierge Section (#contact) */}
            <ContactSection onOpenContactModal={() => setIsContactOpen(true)} />
          </>
        )}
      </main>

      {/* Brand Benefits & Navigation Footer */}
      <Footer
        onCreateYoursClick={() => setIsCreateYoursOpen(true)}
        onOpenFAQ={() => setIsFAQOpen(true)}
        onOpenTerms={() => handleOpenLegal('terms')}
        onOpenPrivacy={() => handleOpenLegal('privacy')}
        onOpenAbout={() => handleSelectSection('about')}
        onOpenContact={() => handleSelectSection('contact')}
        onOpenAdmin={handleNavigateAdmin}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        onExploreDrop={() => handleNavigateCategory('all')}
      />

      {/* Checkout Gateway Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discountPercent={checkoutDiscount}
        onOrderCompleted={handleOrderCompleted}
        userEmail={user.email}
        userName={user.name}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, color, size, qty) => handleAddToCart(p, color, size, qty)}
        isWishlisted={selectedProduct ? user.wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Create Yours Custom Drop Studio */}
      <CreateYoursStudio
        isOpen={isCreateYoursOpen}
        onClose={() => setIsCreateYoursOpen(false)}
        onAddCustomItemToCart={handleAddCustomItem}
      />

      {/* User Account Management Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        allProducts={products}
        onAddToCart={(p) => handleAddToCart(p)}
        onRemoveFromWishlist={handleToggleWishlist}
      />

      {/* Search & Filter Modal */}
      <SearchFilterModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* About Manifesto Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onExploreDrop={() => handleNavigateSection('the-drop')}
      />

      {/* Contact Concierge Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* FAQ & Legal Modal */}
      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
        initialTab={legalModalTab}
      />

      {/* Floating Back-To-Top Button */}
      <BackToTop />

      {/* Gen-Z Streetwear Fixed Side Margins (Left Brutalist Text & Right Scroll-Progress Rail) */}
      <StreetwearMargins />
    </div>
  );
}
