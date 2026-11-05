import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RefreshCw, Shirt } from 'lucide-react';
import { CartItem } from '../types';
import { ZealnixMonogram } from './ZealnixLogo';
import { saveCustomOrderToSupabase } from '../lib/supabase';

interface CreateYoursStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomItemToCart: (item: CartItem) => void;
}

export const CreateYoursStudio: React.FC<CreateYoursStudioProps> = ({
  isOpen,
  onClose,
  onAddCustomItemToCart
}) => {
  const [garmentType, setGarmentType] = useState<'hoodie' | 'tee' | 'longsleeve'>('hoodie');
  const [baseColor, setBaseColor] = useState<{ name: string; hex: string; textClass: string }>({
    name: 'Deep Graphite',
    hex: '#292A29',
    textClass: 'text-[#F2F0E9]'
  });
  const [customText, setCustomText] = useState('NO RESTOCKS');
  const [selectedGraphic, setSelectedGraphic] = useState<'monogram' | 'globe' | 'brutalist' | 'sun'>('monogram');
  const [placement, setPlacement] = useState<'chest' | 'back' | 'minimal'>('chest');
  const [printColor, setPrintColor] = useState<'lime' | 'ivory' | 'stealth'>('lime');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const garmentPrices = {
    hoodie: 1499,
    tee: 699,
    longsleeve: 899
  };

  const garmentNames = {
    hoodie: 'Custom 460GSM French Terry Hoodie',
    tee: 'Custom 280GSM Combed Boxy Tee',
    longsleeve: 'Custom Heavy Thermal Long Sleeve'
  };

  const colors = [
    { name: 'Deep Graphite', hex: '#292A29', textClass: 'text-[#F2F0E9]' },
    { name: 'Warm Ivory', hex: '#F2F0E9', textClass: 'text-[#292A29]' },
    { name: 'Washed Black', hex: '#1C1D1C', textClass: 'text-[#F2F0E9]' },
    { name: 'Concrete Ash', hex: '#636460', textClass: 'text-[#F2F0E9]' }
  ];

  const graphics = [
    { id: 'monogram', label: 'ZN Cyber Monogram' },
    { id: 'globe', label: 'Orbital Chaos Globe' },
    { id: 'brutalist', label: 'Brutalist Frame' },
    { id: 'sun', label: 'Botanical Solar' }
  ];

  const printColorHex = {
    lime: '#D7FF00',
    ivory: '#F2F0E9',
    stealth: '#92948F'
  };

  const handleAddToCart = () => {
    const customItem: CartItem = {
      id: `custom-${Date.now()}`,
      productId: `custom-${garmentType}`,
      name: `${garmentNames[garmentType]} ("${customText}")`,
      price: garmentPrices[garmentType],
      image: garmentType === 'hoodie'
        ? '/src/assets/images/product_chaos_club_1791889113498.jpg'
        : '/src/assets/images/product_good_days_1791889114917.jpg',
      selectedColor: baseColor.name,
      selectedSize,
      quantity: 1,
      isCustom: true,
      customDetails: {
        garmentType,
        text: customText,
        graphic: selectedGraphic,
        placement,
        printColor
      }
    };

    // Save custom design specs to Supabase custom_orders table
    saveCustomOrderToSupabase({
      garment_type: garmentType,
      garment_name: garmentNames[garmentType],
      base_color: baseColor.name,
      size: selectedSize,
      custom_text: customText,
      graphic: selectedGraphic,
      placement,
      print_color: printColor,
      price: garmentPrices[garmentType]
    }).catch((err) => console.warn('[CustomStudio] Supabase save note:', err));

    onAddCustomItemToCart(customItem);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0B0B] text-[#F2F0E9] border-2 border-[#262626] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header bar */}
        <div className="p-4 sm:p-6 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D7FF00] text-[#0B0B0B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-anton uppercase text-2xl sm:text-3xl tracking-tight text-[#F2F0E9] leading-none">
                CREATE YOURS STUDIO
              </h2>
              <p className="text-xs font-mono text-[#B8B8B0] mt-1">
                Bespoke on-demand silkscreen drop · Zero minimum order quantity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#B8B8B0] hover:text-[#D7FF00] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close customizer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#3E403D]">
          {/* Left Canvas: Live Realistic Interactive Garment Mockup (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col items-center justify-center bg-[#1F201F] relative">
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[11px] text-[#B8B8B0]">
              <span className="w-2 h-2 rounded-full bg-[#D7FF00] animate-pulse" />
              <span>LIVE MOCKUP PREVIEW</span>
            </div>

            {/* Simulated Streetwear Canvas */}
            <div
              className="relative w-72 sm:w-88 aspect-[4/5] border border-white/10 shadow-2xl flex flex-col items-center justify-center p-6 transition-colors duration-300 select-none overflow-hidden"
              style={{ backgroundColor: baseColor.hex }}
            >
              {/* Garment silhouette outline / fabric texture */}
              <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

              {/* Graphic Print Container based on Placement */}
              <div
                className={`relative z-10 flex flex-col items-center text-center p-4 transition-all duration-300 border border-dashed border-white/10 hover:border-[#D7FF00]/40 ${
                  placement === 'chest'
                    ? 'w-full my-auto'
                    : placement === 'back'
                    ? 'w-full my-auto scale-110'
                    : 'w-32 self-start mt-8 ml-4'
                }`}
              >
                {/* Graphic Motif */}
                <div
                  className="mb-3 transition-colors duration-200"
                  style={{ color: printColorHex[printColor] }}
                >
                  {selectedGraphic === 'monogram' && (
                    <ZealnixMonogram size={placement === 'minimal' ? 36 : 72} />
                  )}
                  {selectedGraphic === 'globe' && (
                    <svg
                      width={placement === 'minimal' ? 36 : 72}
                      height={placement === 'minimal' ? 36 : 72}
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                    >
                      <circle cx="50" cy="50" r="42" />
                      <ellipse cx="50" cy="50" rx="42" ry="18" />
                      <ellipse cx="50" cy="50" rx="18" ry="42" />
                      <line x1="8" y1="50" x2="92" y2="50" />
                    </svg>
                  )}
                  {selectedGraphic === 'brutalist' && (
                    <svg
                      width={placement === 'minimal' ? 36 : 72}
                      height={placement === 'minimal' ? 36 : 72}
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                    >
                      <rect x="15" y="15" width="70" height="70" />
                      <line x1="15" y1="15" x2="85" y2="85" />
                      <line x1="85" y1="15" x2="15" y2="85" />
                    </svg>
                  )}
                  {selectedGraphic === 'sun' && (
                    <svg
                      width={placement === 'minimal' ? 36 : 72}
                      height={placement === 'minimal' ? 36 : 72}
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                    >
                      <circle cx="50" cy="50" r="22" />
                      <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M22 22 L30 30 M70 70 L78 78 M22 78 L30 70 M70 30 L78 22" />
                    </svg>
                  )}
                </div>

                {/* Custom Slogan Typography */}
                {customText.trim() && (
                  <div
                    className="font-anton uppercase tracking-wider leading-none transition-colors duration-200"
                    style={{
                      color: printColorHex[printColor],
                      fontSize: placement === 'minimal' ? '12px' : '28px'
                    }}
                  >
                    {customText}
                  </div>
                )}

                <div
                  className="font-mono text-[9px] mt-1 tracking-widest uppercase opacity-75"
                  style={{ color: printColorHex[printColor] }}
                >
                  ZEALNIX BESPOKE DROP
                </div>
              </div>

              {/* Bottom hem tag */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[9px] font-mono opacity-60 text-white">
                <span>{garmentType.toUpperCase()} · 100% COTTON</span>
                <span>SIZE {selectedSize}</span>
              </div>
            </div>

            <div className="mt-4 text-center font-mono text-xs text-[#B8B8B0]">
              Estimated Production: <strong>24-48 hours</strong> · Eco-friendly water inks
            </div>
          </div>

          {/* Right Controls: Garment, Color, Text, Placement (5 cols) */}
          <div className="lg:col-span-5 p-6 space-y-6 overflow-y-auto">
            {/* Step 1: Garment Selection */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D7FF00] block mb-2">
                1. Select Garment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['hoodie', 'tee', 'longsleeve'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGarmentType(g)}
                    className={`p-3 text-left border transition-colors ${
                      garmentType === g
                        ? 'bg-[#3E403D] border-[#D7FF00] text-[#D7FF00]'
                        : 'bg-[#232423] border-[#3E403D] text-[#F2F0E9] hover:border-[#666]'
                    }`}
                  >
                    <div className="font-bebas text-lg leading-tight uppercase">
                      {g}
                    </div>
                    <div className="font-mono text-xs text-[#B8B8B0] mt-1 tabular-nums">
                      ₹{garmentPrices[g].toLocaleString('en-IN')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Base Garment Color */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D7FF00] block mb-2">
                2. Base Garment Shade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setBaseColor(c)}
                    className={`flex items-center gap-2.5 p-2.5 border transition-all ${
                      baseColor.name === c.name
                        ? 'border-[#D7FF00] bg-[#343634]'
                        : 'border-[#3E403D] bg-[#232423] hover:border-[#666]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-none border border-black/40 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-semibold">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Custom Slogan / Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D7FF00]">
                  3. Your Idea / Slogan
                </label>
                <span className="text-[10px] font-mono text-[#B8B8B0]">
                  Max 24 chars
                </span>
              </div>
              <input
                type="text"
                value={customText}
                maxLength={24}
                onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                placeholder="ENTER YOUR SLOGAN..."
                className="w-full px-4 py-3 bg-[#1C1D1C] border border-[#4A4B48] text-[#F2F0E9] font-anton text-lg tracking-wider focus:outline-none focus:border-[#D7FF00]"
              />
            </div>

            {/* Step 4: Graphic Motif */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D7FF00] block mb-2">
                4. Graphic Artwork Emblem
              </label>
              <div className="grid grid-cols-2 gap-2">
                {graphics.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGraphic(g.id as any)}
                    className={`p-2.5 text-left border text-xs font-semibold transition-all ${
                      selectedGraphic === g.id
                        ? 'border-[#D7FF00] bg-[#343634] text-[#D7FF00]'
                        : 'border-[#3E403D] bg-[#232423] text-[#F2F0E9] hover:border-[#666]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Print Color & Placement */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D7FF00] block mb-2">
                  5. Ink Color
                </label>
                <div className="flex gap-2">
                  {(['lime', 'ivory', 'stealth'] as const).map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setPrintColor(clr)}
                      className={`flex-1 py-2 text-center text-xs font-mono uppercase font-bold border transition-all ${
                        printColor === clr
                          ? 'border-[#D7FF00] bg-[#343634] text-[#D7FF00]'
                          : 'border-[#3E403D] bg-[#232423] text-[#B8B8B0]'
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D7FF00] block mb-2">
                  6. Placement
                </label>
                <div className="flex gap-2">
                  {(['chest', 'back', 'minimal'] as const).map((plc) => (
                    <button
                      key={plc}
                      onClick={() => setPlacement(plc)}
                      className={`flex-1 py-2 text-center text-xs font-mono uppercase font-bold border transition-all ${
                        placement === plc
                          ? 'border-[#D7FF00] bg-[#343634] text-[#D7FF00]'
                          : 'border-[#3E403D] bg-[#232423] text-[#B8B8B0]'
                      }`}
                    >
                      {plc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 7: Size Selection */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D7FF00] block mb-2">
                7. Size (Oversized Streetwear Fit)
              </label>
              <div className="flex gap-2">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`flex-1 py-2 text-center text-xs font-inter font-bold border transition-all ${
                      selectedSize === sz
                        ? 'border-[#D7FF00] bg-[#D7FF00] text-[#0B0B0B]'
                        : 'border-[#3E403D] bg-[#232423] text-[#F2F0E9] hover:border-[#666]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Final Action Bar */}
            <div className="pt-4 border-t border-[#3E403D]">
              <div className="flex items-center justify-between mb-3 font-grotesk">
                <span className="text-xs text-[#B8B8B0] font-medium uppercase tracking-[1px]">TOTAL PRICE:</span>
                <span className="text-2xl font-bold text-[#D7FF00] tabular-nums">
                  ₹{garmentPrices[garmentType].toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isSuccess}
                className="w-full py-4 bg-[#D7FF00] text-[#0B0B0B] font-grotesk font-bold tracking-[1px] text-sm uppercase flex items-center justify-center gap-3 transition-all duration-200 hover:bg-[#C6EC00] active:scale-[0.98] cursor-pointer shadow-lg disabled:opacity-80"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>CUSTOM DROP ADDED!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>ADD CUSTOM DROP TO BAG</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
