import { Product } from '../types';
import heroStreetwearImage from '../assets/images/Cinematic Urban Streetwear Portrait.png';
import mindsetTeeImage from '../assets/images/ChatGPT Image Oct 16, 2026, 04_59_54 PM.png';
import heavyFlannelImage from '../assets/images/ChatGPT Image Oct 17, 2026, 03_00_23 PM.png';
import boxyTacticalWorkShirtImage from '../assets/images/ChatGPT Image Oct 17, 2026, 02_58_37 PM.png';
import cyberShellImage from '../assets/images/ChatGPT Image Oct 17, 2026, 03_04_03 PM.png';
import feelTheMomentImage from '../assets/images/ChatGPT Image Oct 17, 2026, 03_05_16 PM.png';
import cargoJeansImage from '../assets/images/ChatGPT Image Oct 17, 2026, 03_17_58 PM.png';
import stackedDenimImage from '../assets/images/ChatGPT Image Oct 17, 2026, 03_18_16 PM.png';
import greenHalfZipImage from '../assets/images/ChatGPT Image Oct 22, 2026, 04_33_31 PM.png';
import whitePrintedTeeImage from '../assets/images/ChatGPT Image Oct 22, 2026, 04_34_26 PM.png';
import supermanClassicImage from '../assets/images/ChatGPT Image Oct 22, 2026, 04_35_20 PM.png';
import zoraBrownImage from '../assets/images/ChatGPT Image Oct 22, 2026, 04_36_25 PM.png';
import enchantedPinkImage from '../assets/images/ChatGPT Image Oct 22, 2026, 04_37_34 PM.png';
import anchorZealImage from '../assets/images/IMG_20261027_174423.jpg';
import taurusWorldImage from '../assets/images/IMG_20261027_174437.jpg';
import phoenixRisingImage from '../assets/images/IMG_20261027_174451.jpg';
import hokage4everImage from '../assets/images/IMG_20261027_174510.jpg';
import majnuBhaiImage from '../assets/images/IMG_20261027_174521.jpg';
import powerpuffVarsityImage from '../assets/images/IMG_20261027_174535.jpg';
import spongebobChillImage from '../assets/images/IMG_20261027_174545.jpg';
import supermanShieldImage from '../assets/images/IMG_20261027_174559.jpg';
import helloKittySkyImage from '../assets/images/IMG_20261027_174611.jpg';
import minionsDesiBelloImage from '../assets/images/IMG_20261027_174623.jpg';

// New Drop & Jeans Imports
import espressoShearlingImage from '../assets/images/IMG_20261027_220212.jpg';
import yinYangRoseImage from '../assets/images/IMG_20261027_220222.jpg';
import ivoryBotanicalImage from '../assets/images/IMG_20261027_220233.jpg';
import cherryCheckImage from '../assets/images/IMG_20261027_220247.jpg';
import mythicTaleImage from '../assets/images/IMG_20261027_220342.jpg';
import xMutantLeatherImage from '../assets/images/IMG_20261028_105301.jpg';
import baxiTartanImage from '../assets/images/IMG_20261028_110521.jpg';
import cranberrySupermanImage from '../assets/images/IMG_20261028_110608.jpg';
import alpinePeakFleeceImage from '../assets/images/IMG_20261028_110620.jpg';
import prep07SweaterImage from '../assets/images/IMG_20261028_110533.jpg';
import omnitrixTechFleeceImage from '../assets/images/IMG_20261028_111620.jpg';

import midnightButterflyImage from '../assets/images/IMG_20261027_220311.jpg';
import smokeWashGrungeImage from '../assets/images/IMG_20261027_220322.jpg';
import animeStripeUtilityImage from '../assets/images/IMG_20261028_110122.jpg';
import cobaltSidePanelImage from '../assets/images/IMG_20261028_105250.jpg';

export const HERO_IMAGE = heroStreetwearImage;
export const STORY_IMAGE_1 = '/src/assets/images/brand_editorial_texture_1791889116081.jpg';
export const STORY_IMAGE_2 = '/src/assets/images/story_screenprint_closeup_1791889152422.jpg';

export const PRODUCTS: Product[] = [
  // ==========================================
  // JEANS (7 Items Total)
  // ==========================================
  {
    id: 'archive-wide-cargo-jeans',
    name: 'ARCHIVE WIDE-LEG CARGO JEANS',
    category: 'jeans',
    categoryLabel: 'HEAVYWEIGHT DENIM JEANS',
    subtitle: 'Washed black wide-leg streetwear denim featuring reinforced cargo utility pockets.',
    price: 1499,
    originalPrice: 1799,
    label: 'NEW',
    image: cargoJeansImage,
    gallery: [
      cargoJeansImage,
      '/src/assets/images/brand_editorial_texture_1791889116081.jpg'
    ],
    colors: [
      { name: 'Washed Charcoal', hex: '#2B2B2B' },
      { name: 'Onyx Black', hex: '#111211' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'Washed black wide-leg streetwear denim featuring reinforced cargo utility pockets.',
    gsm: '14oz Ring-Spun Cotton Denim',
    fit: 'OVERSIZED',
    details: [
      '100% Ring-Spun Cotton Denim (14oz)',
      'Subtle mineral stone enzyme wash with distressed cuffs',
      'Reinforced rivet hardware and custom YKK zip fly',
      'Embossed ZEALNIX industrial rubber/leather waistband patch',
      'Deep dual cargo utility pockets with bar-tack anchors'
    ],
    inStock: true
  },
  {
    id: 'raw-indigo-stacked-denim',
    name: 'RAW INDIGO STACKED DENIM',
    category: 'jeans',
    categoryLabel: 'JEANS',
    subtitle: 'Deep indigo rigid stacked denim jeans with copper rivets, contrast stitching, and roll-up selvedge cuff.',
    price: 1699,
    originalPrice: 1999,
    label: 'BEST SELLER',
    image: stackedDenimImage,
    gallery: [
      stackedDenimImage,
      '/src/assets/images/brand_editorial_texture_1791889116081.jpg'
    ],
    colors: [
      { name: 'Raw Deep Indigo', hex: '#1B263B' },
      { name: 'Midnight Rinsed', hex: '#0D1B2A' }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'Crafted from authentic 14.5oz Japanese shuttle-loom selvedge denim. Unwashed rigid finish engineered to develop personalized whiskers and high-contrast honeycomb fades over time.',
    gsm: '14.5oz Japanese Selvedge Denim',
    fit: 'Stacked Straight Leg Silhouette',
    details: [
      '14.5oz Red-line Japanese shuttle loom selvedge denim',
      'Solid copper donut button fly and embossed rivets',
      'Extended inseam crafted specifically for ankle stacks',
      'Raw unwashed finish that molds to your silhouette',
      'Chain-stitched waistband and hem for lasting durability'
    ],
    inStock: true
  },
  {
    id: 'vintage-stonewash-baggy-jeans',
    name: 'VINTAGE STONEWASH BAGGY JEANS',
    category: 'jeans',
    categoryLabel: 'JEANS',
    subtitle: 'Heavily stone-washed baggy denim with authentic whiskering, subtle distressing, and 90s skater cut.',
    price: 1499,
    originalPrice: 1699,
    label: 'LIMITED',
    image: '/src/assets/images/streetwear_baggy_jeans_1792147547393.jpg',
    gallery: [
      '/src/assets/images/streetwear_baggy_jeans_1792147547393.jpg',
      '/src/assets/images/story_screenprint_closeup_1791889152422.jpg'
    ],
    colors: [
      { name: 'Acid Washed Black', hex: '#333333' },
      { name: 'Smoky Grey', hex: '#4B4F55' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'A tribute to 90s subcultural skate and street style. Cut wide through the thigh with an effortless taper over footwear.',
    gsm: '13.5oz Milled Denim',
    fit: 'Authentic 90s Baggy Streetwear Cut',
    details: [
      '100% Combed cotton twill (13.5oz)',
      'Hand-applied pumice stone wash and light abrasion',
      'Heavy-duty belt loops built for tactical accessories',
      'Internal drawcord waist for versatile wear',
      'Hidden stash pocket inside coin pouch'
    ],
    inStock: true
  },
  {
    id: 'midnight-butterfly-baggy-jeans',
    name: 'MIDNIGHT BUTTERFLY BAGGY JEANS',
    category: 'jeans',
    categoryLabel: 'JEANS',
    subtitle: 'Baggy fit jeans with rustic butterfly patch detail.',
    price: 1499,
    originalPrice: 1899,
    label: 'Y2K VIBE',
    image: midnightButterflyImage,
    gallery: [
      midnightButterflyImage,
      '/Photos/IMG_20261027_220311.jpg'
    ],
    colors: [
      { name: 'Washed Black', hex: '#262626' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'Baggy fit jeans with rustic butterfly patch detail.',
    gsm: '14oz Milled Ring-Spun Denim',
    fit: 'OVERSIZED',
    details: [
      'Black-washed wide-leg denim featuring frayed front pockets and striking contrast-stitched butterfly patches on the right leg.',
      '14oz ring-spun cotton denim with vintage enzyme wash',
      'Raw distressed frayed pocket openings',
      'Contrast-stitched rustic butterfly patches down the leg',
      'Ultra-relaxed wide-leg silhouette that stacks over sneakers'
    ],
    inStock: true
  },
  {
    id: 'smoke-wash-grunge-denim',
    name: 'SMOKE WASH GRUNGE DENIM',
    category: 'jeans',
    categoryLabel: 'JEANS',
    subtitle: 'SUPER BAGGY FIT / ACID DISTRESSED',
    price: 1599,
    originalPrice: 1999,
    label: 'STREET FAV',
    image: smokeWashGrungeImage,
    gallery: [
      smokeWashGrungeImage,
      '/Photos/IMG_20261027_220322.jpg'
    ],
    colors: [
      { name: 'Smokey Acid Charcoal', hex: '#383838' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'Smokey dark-wash vintage distressed denim with an ultra-baggy silhouette designed for effortless streetwear stacking.',
    gsm: '14.5oz Vintage Distressed Denim',
    fit: 'SUPER BAGGY FIT / ACID DISTRESSED',
    details: [
      'Smokey dark-wash vintage distressed denim with an ultra-baggy silhouette designed for effortless streetwear stacking.',
      '14.5oz heavy slub denim with authentic acid smoke wash',
      'Subtle whisker fading and hand-distressed edge abrasion',
      'Generous thigh and leg opening for fluid drape',
      'Branded ZEALNIX matte black metal button hardware'
    ],
    inStock: true
  },
  {
    id: 'anime-stripe-utility-jeans',
    name: 'ANIME STRIPE UTILITY JEANS',
    category: 'jeans',
    categoryLabel: 'JEANS',
    subtitle: 'BAGGY FIT / PINSTRIPE & EMBROIDERY',
    price: 1699,
    originalPrice: 2099,
    label: 'TRENDING',
    image: animeStripeUtilityImage,
    gallery: [
      animeStripeUtilityImage,
      '/Photos/IMG_20261028_110122.jpg'
    ],
    colors: [
      { name: 'Indigo Pinstripe', hex: '#2C4368' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'Blue pinstriped denim jeans styled with multi-graphic anime embroideries, contrast piping, and utility pockets.',
    gsm: '13.5oz Pinstriped Twill Denim',
    fit: 'BAGGY FIT / PINSTRIPE & EMBROIDERY',
    details: [
      'Blue pinstriped denim jeans styled with multi-graphic anime embroideries, contrast piping, and utility pockets.',
      '13.5oz fine pinstriped indigo twill denim',
      'Vibrant anime character needlework embroideries',
      'Contrast white side piping and tactical carpenter utility loop',
      'Relaxed skater baggy drape'
    ],
    inStock: true
  },
  {
    id: 'cobalt-side-panel-stacked-jeans',
    name: 'COBALT SIDE-PANEL STACKED JEANS',
    category: 'jeans',
    categoryLabel: 'JEANS',
    subtitle: 'SUPER BAGGY FIT / CONTRAST SIDE PANELS',
    price: 1599,
    originalPrice: 1999,
    label: 'HEAVYWEIGHT',
    image: cobaltSidePanelImage,
    gallery: [
      cobaltSidePanelImage,
      '/Photos/IMG_20261028_105250.jpg'
    ],
    colors: [
      { name: 'Deep Cobalt Indigo', hex: '#1E2B45' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'Deep indigo blue wide-leg jeans featuring dark patterned side-panel inserts and a relaxed low-waist structure.',
    gsm: '14oz Ring-Spun Rigid Denim',
    fit: 'SUPER BAGGY FIT / CONTRAST SIDE PANELS',
    details: [
      'Deep indigo blue wide-leg jeans featuring dark patterned side-panel inserts and a relaxed low-waist structure.',
      '14oz deep indigo ring-spun rigid denim',
      'Intricate dark patterned jacquard side-panel inserts',
      'Extended inseam designed for clean ankle stacks',
      'Double-needle felled seams for rugged longevity'
    ],
    inStock: true
  },

  // ==========================================
  // SHIRTS (7 Items Total)
  // ==========================================
  {
    id: 'heavy-flannel-utility-overshirt',
    name: 'WAKANDA FOREVER',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'Brushed cotton twill overshirt in custom dark charcoal and acid-lime grid check with dual chest pockets.',
    price: 1299,
    originalPrice: 1599,
    label: 'NEW',
    image: heavyFlannelImage,
    gallery: [
      heavyFlannelImage,
      '/src/assets/images/brand_editorial_texture_1791889116081.jpg'
    ],
    colors: [
      { name: 'Acid Check Plaid', hex: '#3C4033' },
      { name: 'Graphite Check', hex: '#2A2B28' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Engineered as an outerwear layer or standalone shirt. Cut from custom 380GSM double-brushed cotton twill with deep chest utility pockets, tortoise buttons, and an oversized drop-shoulder fit.',
    gsm: '380 GSM Double-Brushed Cotton Twill',
    fit: 'Relaxed Drop-Shoulder Overshirt Cut',
    details: [
      '380 GSM Heavyweight brushed flannel weave',
      'Dual flap chest pockets with hidden internal pen slot',
      'Matte horn button closure and reinforced placket',
      'Acid-lime interior collar contrast binding',
      'Straight cut bottom hem designed to sit over hoodies'
    ],
    inStock: true
  },
  {
    id: 'boxy-tactical-work-shirt',
    name: 'BOXY PEANUT SHIRT',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'Matte black heavy cotton canvas shirt with metallic chest zips, industrial snap buttons, and sleeve patch.',
    price: 1199,
    originalPrice: 1399,
    label: 'BEST SELLER',
    image: boxyTacticalWorkShirtImage,
    gallery: [
      boxyTacticalWorkShirtImage,
      '/src/assets/images/hero_streetwear_model_1791889113269.jpg'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#121212' },
      { name: 'Urban Slate', hex: '#383838' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Utility meets brutalist streetwear. Durable duck canvas with twin horizontal zip chest pockets, quick-release gunmetal snap front, and branded rubberized arm badge.',
    gsm: '340 GSM Cotton Duck Canvas',
    fit: 'Square Boxy Silhouette',
    details: [
      '340 GSM structured cotton canvas with water-resistant coating',
      'Dual heavy-gauge industrial exposed metal chest zippers',
      'Tactical D-ring webbing attachment point at waist',
      'Subtle monochrome ZEALNIX rubber patch on left bicep',
      'Spread camp collar with magnetic closure point'
    ],
    inStock: true
  },
  {
    id: 'green-half-zip-overshirt',
    name: 'GREEN HALF ZIP',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'BOXY FIT / HALF ZIP OVERSHIRT',
    price: 799,
    originalPrice: 999,
    label: 'NEW',
    image: greenHalfZipImage,
    gallery: [
      greenHalfZipImage,
      '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_33_31 PM.png'
    ],
    colors: [
      { name: 'Forest Green / Cream', hex: '#1C352D' },
      { name: 'Onyx Contrast', hex: '#111211' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Dark green boxy-fit short-sleeve shirt with a half-zip collar and cream white side panel inserts.',
    gsm: '320 GSM Cotton Twill',
    fit: 'Boxy Fit / Half-Zip Overshirt',
    details: [
      'Dark green boxy-fit short-sleeve shirt with a half-zip collar and cream white side panel inserts.',
      'Heavyweight 320 GSM structured cotton weave',
      'Silver-tone industrial half-zip pull',
      'Dual contrast side panel inserts',
      'Relaxed drop-shoulder streetwear silhouette'
    ],
    inStock: true
  },
  {
    id: 'white-printed-tee-resort-shirt',
    name: 'WHITE PRINTED TEE',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'LINEN BLEND / OVERSIZED FIT',
    price: 679,
    originalPrice: 899,
    label: 'NEW',
    image: whitePrintedTeeImage,
    gallery: [
      whitePrintedTeeImage,
      '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_34_26 PM.png'
    ],
    colors: [
      { name: 'Off-White / Cobalt Art', hex: '#F0EFEA' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Off-white short-sleeve linen blend resort shirt featuring blue hand-drawn line art of plants and furniture.',
    gsm: '220 GSM Linen-Cotton Blend',
    fit: 'Linen Blend / Oversized Fit',
    details: [
      'Off-white short-sleeve linen blend resort shirt featuring blue hand-drawn line art of plants and furniture.',
      'Breathable lightweight linen-cotton blend for summer layering',
      'Notched resort camp collar with tonal button closure',
      'Durable soft-touch line art print'
    ],
    inStock: true
  },
  {
    id: 'superman-classic-baseball-shirt',
    name: 'SUPERMAN CLASSIC',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'OVERSIZED FIT / BASEBALL SHIRT',
    price: 899,
    originalPrice: 1199,
    label: 'LIMITED',
    image: supermanClassicImage,
    gallery: [
      supermanClassicImage,
      '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_35_20 PM.png'
    ],
    colors: [
      { name: 'Cream White / Crimson Piping', hex: '#F5F5F0' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'White button-up baseball jersey style shirt with "Superman" script embroidery, red piping, and "Kryptonite" patch.',
    gsm: '280 GSM Athletic Knit',
    fit: 'Oversized Fit / Baseball Shirt',
    details: [
      'White button-up baseball jersey style shirt with "Superman" script embroidery, red piping, and "Kryptonite" patch.',
      'Heavyweight 280 GSM structured baseball jersey texture',
      'Tactile cursive script embroidery across chest',
      'Curved hemline with contrast red accent piping'
    ],
    inStock: true
  },
  {
    id: 'zora-brown-embroidered-shirt',
    name: 'ZORA BROWN',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'Brown relaxed-fit long-sleeve button-down shirt with a embroidered palm tree on the front pocket and sun embroidery on the back.',
    price: 799,
    originalPrice: 999,
    label: 'BEST SELLER',
    image: zoraBrownImage,
    gallery: [
      zoraBrownImage,
      '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_36_25 PM.png'
    ],
    colors: [
      { name: 'Warm Terracotta Brown', hex: '#634735' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Brown relaxed-fit long-sleeve button-down shirt with a embroidered palm tree on the front pocket and sun embroidery on the back.',
    gsm: '260 GSM Washed Slub Cotton',
    fit: 'OVERSIZED',
    details: [
      'Brown relaxed-fit long-sleeve button-down shirt with a embroidered palm tree on the front pocket and sun embroidery on the back.',
      'Pre-washed garment dyed finish for lived-in softness',
      'Detailed needlework palm embroidery on chest pocket',
      'Radiant sun motif embroidered on back yoke'
    ],
    inStock: true
  },
  {
    id: 'enchanted-pink-oversized-shirt',
    name: 'ENCHANTED PINK',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'GRAPHIC PRINT / OVERSIZED SHIRT',
    price: 799,
    originalPrice: 999,
    label: 'NEW',
    image: enchantedPinkImage,
    gallery: [
      enchantedPinkImage,
      '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_37_34 PM.png'
    ],
    colors: [
      { name: 'Dusty Pink / Crimson Check', hex: '#D1889C' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Pink check/plaid long-sleeve shirt featuring a large red Snow White graphic with the word "Enchanted" on the back.',
    gsm: '280 GSM Brushed Plaid Twill',
    fit: 'Graphic Print / Oversized Shirt',
    details: [
      'Pink check/plaid long-sleeve shirt featuring a large red Snow White graphic with the word "Enchanted" on the back.',
      'Custom woven pastel pink and cream shadow check',
      'Dual chest utility pockets with button closures',
      'Statement graphic art with vintage distressed typography'
    ],
    inStock: true
  },

  // ==========================================
  // T-SHIRTS (11 Items Total)
  // ==========================================
  {
    id: 'mindset-oversized-boxy-tee',
    name: 'MINDSET OVERSIZED BOXY TEE',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: '280GSM combed cotton boxy tee featuring high-density typography screenprint on chest and back spine.',
    price: 999,
    originalPrice: 1299,
    label: 'BEST SELLER',
    image: mindsetTeeImage,
    gallery: [
      mindsetTeeImage,
      '/src/assets/images/hero_streetwear_model_1791889113269.jpg'
    ],
    colors: [
      { name: 'Warm Ivory', hex: '#EDE8DF' },
      { name: 'Onyx Black', hex: '#111211' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'The definitive daily driver tee. Thick 1.25-inch ribbed collar that retains shape, dropped shoulders, and ultra-dense combed cotton.',
    gsm: '280GSM 100% Combed Cotton',
    fit: 'Signature ZEALNIX Boxy Dropped Fit',
    details: [
      '1.25" thick shape-retention collar',
      'Tactile puff screenprint',
      'Relaxed drop-shoulder boxy silhouette'
    ],
    inStock: true
  },
  {
    id: 'anchor-zeal',
    name: 'ANCHOR ZEAL',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'Cream/beige ribbed knit polo shirt with dark blue collar and anchor chest patch logo.',
    price: 799,
    originalPrice: 999,
    label: 'ESSENTIAL',
    image: anchorZealImage,
    gallery: [
      anchorZealImage,
      '/PHOTOS/IMG_20261027_174423.jpg'
    ],
    colors: [
      { name: 'Cream / Navy Collar', hex: '#EDE8D0' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Cream/beige ribbed knit polo shirt with dark blue collar and anchor chest patch logo.',
    gsm: '320 GSM Ribbed Knit Cotton',
    fit: 'OVERSIZED',
    details: [
      'Cream/beige ribbed knit polo shirt with dark blue collar and anchor chest patch logo.',
      'Heavyweight ribbed cotton knit structure',
      'Contrast dark navy collar and placket',
      'Tactile embroidered anchor chest badge',
      'Relaxed boxy silhouette with dropped shoulders'
    ],
    inStock: true
  },
  {
    id: 'taurus-world',
    name: 'TAURUS WORLD',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'SUPER OVERSIZED FIT / HEAVY GAUGE',
    price: 679,
    originalPrice: 899,
    label: 'HEAVYWEIGHT',
    image: taurusWorldImage,
    gallery: [
      taurusWorldImage,
      '/PHOTOS/IMG_20261027_174437.jpg'
    ],
    colors: [
      { name: 'Acid Washed Charcoal', hex: '#2C2B2A' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Dark grey/black heavy gauge acid wash tee with intricate gold/brown taurus bull back graphic.',
    gsm: '300 GSM Heavy Gauge Jersey',
    fit: 'SUPER OVERSIZED FIT / HEAVY GAUGE',
    details: [
      'Dark grey/black heavy gauge acid wash tee with intricate gold/brown taurus bull back graphic.',
      '300 GSM ultra-dense combed cotton',
      'Distressed vintage acid wash treatment',
      'High-density screenprinted taurus artwork on back',
      'Reinforced shape-retention collar'
    ],
    inStock: true
  },
  {
    id: 'phoenix-rising',
    name: 'PHOENIX RISING',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / HEAVY GAUGE',
    price: 499,
    originalPrice: 699,
    label: 'JUST IN',
    image: phoenixRisingImage,
    gallery: [
      phoenixRisingImage,
      '/PHOTOS/IMG_20261027_174451.jpg'
    ],
    colors: [
      { name: 'Pitch Black', hex: '#111211' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Black oversized tee with Japanese Kanji chest graphic and large golden phoenix back print.',
    gsm: '280 GSM Heavy Combed Cotton',
    fit: 'OVERSIZED FIT / HEAVY GAUGE',
    details: [
      'Black oversized tee with Japanese Kanji chest graphic and large golden phoenix back print.',
      'Golden metallic and discharge screenprint ink',
      'Japanese typography chest detailing',
      'Thick ribbed crew neck collar',
      'Durable double-stitched sleeves and hem'
    ],
    inStock: true
  },
  {
    id: 'hokage-4ever',
    name: 'HOKAGE 4EVER',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / ANIME GRAPHIC',
    price: 599,
    originalPrice: 799,
    label: 'CULT CLASSIC',
    image: hokage4everImage,
    gallery: [
      hokage4everImage,
      '/PHOTOS/IMG_20261027_174510.jpg'
    ],
    colors: [
      { name: 'Off-White Ivory', hex: '#F3EFE6' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Cream/off-white tee with Fourth Hokage Minato Namikaze / Naruto back artwork and Japanese typography.',
    gsm: '280 GSM Ring-Spun Cotton',
    fit: 'OVERSIZED FIT / ANIME GRAPHIC',
    details: [
      'Cream/off-white tee with Fourth Hokage Minato Namikaze / Naruto back artwork and Japanese typography.',
      'Authentic manga artwork and Kanji typography',
      'Pre-washed soft hand-feel combed cotton',
      'Dropped shoulder boxy cut',
      'Seamless side construction'
    ],
    inStock: true
  },
  {
    id: 'majnu-bhai-masterpiece',
    name: 'MAJNU BHAI MASTERPIECE',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / ART PRINT',
    price: 699,
    originalPrice: 899,
    label: 'STREET FAV',
    image: majnuBhaiImage,
    gallery: [
      majnuBhaiImage,
      '/PHOTOS/IMG_20261027_174521.jpg'
    ],
    colors: [
      { name: 'Heather Grey', hex: '#D1D0CE' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Light grey oversized tee featuring the iconic Welcome movie horse painting with "MASTERPIECE" print.',
    gsm: '280 GSM Single Jersey',
    fit: 'OVERSIZED FIT / ART PRINT',
    details: [
      'Light grey oversized tee featuring the iconic Welcome movie horse painting with "MASTERPIECE" print.',
      'Pop-culture cult art front graphic print',
      'Thick shape-retaining ribbed neckline',
      'Vintage enzyme wash finish',
      'Comfortable relaxed unisex drape'
    ],
    inStock: true
  },
  {
    id: 'powerpuff-varsity',
    name: 'POWERPUFF VARSITY',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / RAGLAN TEE',
    price: 499,
    originalPrice: 699,
    label: 'TRENDING',
    image: powerpuffVarsityImage,
    gallery: [
      powerpuffVarsityImage,
      '/PHOTOS/IMG_20261027_174535.jpg'
    ],
    colors: [
      { name: 'Pastel Colorblock', hex: '#D7E0EB' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Pastel multi-color block raglan jersey featuring Powerpuff Girls baseball graphic back print.',
    gsm: '260 GSM Sport Mesh & Jersey',
    fit: 'OVERSIZED FIT / RAGLAN TEE',
    details: [
      'Pastel multi-color block raglan jersey featuring Powerpuff Girls baseball graphic back print.',
      'Varsity baseball jersey raglan cut',
      'Playful 90s cartoon back print',
      'Breathable cotton construction',
      'Ribbed collar with contrast piping'
    ],
    inStock: true
  },
  {
    id: 'spongebob-chill-red',
    name: 'SPONGEBOB CHILL RED',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / ALL-OVER SKETCH',
    price: 399,
    originalPrice: 599,
    label: 'STEAL DEAL',
    image: spongebobChillImage,
    gallery: [
      spongebobChillImage,
      '/PHOTOS/IMG_20261027_174545.jpg'
    ],
    colors: [
      { name: 'Rust Red', hex: '#A4392D' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Rust red oversized graphic tee covered in black SpongeBob line-art doodles and yellow "Chill Vibes" front text.',
    gsm: '260 GSM Combed Cotton',
    fit: 'OVERSIZED FIT / ALL-OVER SKETCH',
    details: [
      'Rust red oversized graphic tee covered in black SpongeBob line-art doodles and yellow "Chill Vibes" front text.',
      'All-over cartoon doodle screenprint',
      'Enzyme washed rust red tone',
      'Thick 1.2-inch collar band',
      'Relaxed casual boxy fit'
    ],
    inStock: true
  },
  {
    id: 'superman-shield-vintage',
    name: 'SUPERMAN SHIELD VINTAGE',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / ACID WASH',
    price: 688,
    originalPrice: 899,
    label: 'VINTAGE WASH',
    image: supermanShieldImage,
    gallery: [
      supermanShieldImage,
      '/PHOTOS/IMG_20261027_174559.jpg'
    ],
    colors: [
      { name: 'Vintage Acid Charcoal', hex: '#353535' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Vintage charcoal grey acid wash tee featuring an embroidered muted gold Superman shield chest patch.',
    gsm: '290 GSM Heavy Mineral Wash Jersey',
    fit: 'OVERSIZED FIT / ACID WASH',
    details: [
      'Vintage charcoal grey acid wash tee featuring an embroidered muted gold Superman shield chest patch.',
      'Heavily acid washed lived-in texture',
      'Embroidered metallic gold shield patch on chest',
      'Double-needle hem and cuff stitching',
      'Heavyweight boxy cut drape'
    ],
    inStock: true
  },
  {
    id: 'hello-kitty-sky',
    name: 'HELLO KITTY SKY',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / SEQUIN EMBROIDERED',
    price: 599,
    originalPrice: 799,
    label: 'LIMITED RUN',
    image: helloKittySkyImage,
    gallery: [
      helloKittySkyImage,
      '/PHOTOS/IMG_20261027_174611.jpg'
    ],
    colors: [
      { name: 'Sky Blue', hex: '#87CEEB' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Sky blue oversized tee featuring sketch-style Hello Kitty graphics with a red sequin embroidered bow accent.',
    gsm: '270 GSM Soft Ring-Spun Cotton',
    fit: 'OVERSIZED FIT / SEQUIN EMBROIDERED',
    details: [
      'Sky blue oversized tee featuring sketch-style Hello Kitty graphics with a red sequin embroidered bow accent.',
      'Shimmering red sequin embroidered bow',
      'Minimalist hand-sketch character art',
      'Soft garment-dyed sky blue pastel hue',
      'Durable relaxed drop shoulder'
    ],
    inStock: true
  },
  {
    id: 'minions-desi-bello',
    name: 'MINIONS DESI BELLO',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / APPLIQUE PATCH',
    price: 899,
    originalPrice: 1099,
    label: 'VAULT DROP',
    image: minionsDesiBelloImage,
    gallery: [
      minionsDesiBelloImage,
      '/PHOTOS/IMG_20261027_174623.jpg'
    ],
    colors: [
      { name: 'Beige / Floral Contrast', hex: '#DFD8C4' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Beige tee featuring floral patterned sleeves and a Minion applique patch on the chest with "BELLO!" text.',
    gsm: '300 GSM Heavyweight Cotton',
    fit: 'OVERSIZED FIT / APPLIQUE PATCH',
    details: [
      'Beige tee featuring floral patterned sleeves and a Minion applique patch on the chest with "BELLO!" text.',
      'Intricate printed floral pattern sleeve panels',
      'Embroidered tactile Minion chest applique badge',
      'Heavyweight 300 GSM combed jersey body',
      'Comfortable relaxed streetwear silhouette'
    ],
    inStock: true
  },

  // ==========================================
  // THE DRIP (13 Items Total: Transferred Hoodie + Original Hoodie + 11 New Drops)
  // ==========================================
  {
    id: 'chaos-club-hoodie',
    name: 'CHAOS CLUB HEAVY HOODIE',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'Double-layered oversized streetwear hoodie with metal aglets, distressed raw seams, and tactile front emblem.',
    price: 1399,
    originalPrice: 1799,
    label: 'BEST SELLER',
    image: '/src/assets/images/product_chaos_club_1791889113498.jpg',
    gallery: [
      '/src/assets/images/product_chaos_club_1791889113498.jpg',
      '/src/assets/images/story_screenprint_closeup_1791889152422.jpg',
      '/src/assets/images/brand_editorial_texture_1791889116081.jpg'
    ],
    colors: [
      { name: 'Deep Graphite', hex: '#232323' },
      { name: 'Onyx Black', hex: '#111211' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Heavyweight 460GSM loopback cotton hoodie built for cold streets and editorial silhouette drape. Double-walled crossover hood.',
    gsm: '460GSM French Terry Combed Loopback',
    fit: 'Oversized Boxy Silhouette with Dropped Shoulders',
    details: [
      'Seamless double-layered hood',
      'Custom brushed stainless aglets',
      '100% Organic combed cotton French terry (460 GSM)'
    ],
    inStock: true
  },
  {
    id: 'feel-the-moment-acid-wash-tee',
    name: 'FEEL THE MOMENT ACID-WASH TEE',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'Distressed mineral wash streetwear tee with cracked-ink graphic illustration and raw edge styling.',
    price: 999,
    originalPrice: 1199,
    label: 'NEW',
    image: feelTheMomentImage,
    gallery: [
      feelTheMomentImage,
      '/src/assets/images/story_screenprint_closeup_1791889152422.jpg'
    ],
    colors: [
      { name: 'Acid Washed Black', hex: '#2A2928' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Individual hand-applied mineral wash ensures no two garments are identical. Finished with cracked soft-hand vintage screen ink.',
    gsm: '260GSM Mineral-Washed Cotton',
    fit: 'Relaxed Drop-Shoulder Vintage Cut',
    details: [
      'Hand-dyed mineral wash finish',
      'Soft-touch breathable inks',
      'Pre-shrunk vintage bio-wash'
    ],
    inStock: true
  },
  {
    id: 'espresso-shearling-jacket',
    name: 'ESPRESSO SHEARLING JACKET',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'OVERSIZED FIT / FAUX LEATHER & FLEECE',
    price: 1499,
    originalPrice: 1899,
    label: 'VAULT DROP',
    image: espressoShearlingImage,
    gallery: [
      espressoShearlingImage,
      '/Photos/IMG_20261027_220212.jpg'
    ],
    colors: [
      { name: 'Espresso Brown / Beige Fleece', hex: '#3B2F2F' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Dark brown oversized faux leather jacket featuring a contrasting beige fleece shearling collar and button-up front.',
    gsm: 'Heavy Faux Leather & Shearling Fleece',
    fit: 'OVERSIZED FIT / FAUX LEATHER & FLEECE',
    details: [
      'Dark brown oversized faux leather jacket featuring a contrasting beige fleece shearling collar and button-up front.',
      'Heavyweight textured faux leather construction',
      'Plush contrasting beige sherpa fleece shearling collar',
      'Custom embossed horn buttons along front placket',
      'Relaxed boxy streetwear fit engineered for layering'
    ],
    inStock: true
  },
  {
    id: 'yin-yang-rose-knit-bomber',
    name: 'YIN-YANG ROSE KNIT BOMBER',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'OVERSIZED FIT / JACQUARD ZIP JACKET',
    price: 1399,
    originalPrice: 1799,
    label: 'TRENDING',
    image: yinYangRoseImage,
    gallery: [
      yinYangRoseImage,
      '/Photos/IMG_20261027_220222.jpg'
    ],
    colors: [
      { name: 'Beige / Crimson Panel', hex: '#D8CBB5' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Beige knit zip-up bomber jacket featuring all-over rose patterns, red color-block panels, and a prominent yin-yang chest embroidery.',
    gsm: '420 GSM Jacquard Knit',
    fit: 'OVERSIZED FIT / JACQUARD ZIP JACKET',
    details: [
      'Beige knit zip-up bomber jacket featuring all-over rose patterns, red color-block panels, and a prominent yin-yang chest embroidery.',
      '420 GSM high-gauge jacquard knit weave',
      'Intricate all-over floral botanical rose motifs',
      'Contrasting crimson red sleeve color-block panels',
      'Heavy industrial silver zip closure'
    ],
    inStock: true
  },
  {
    id: 'ivory-botanical-dress',
    name: 'IVORY BOTANICAL DRESS',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'SMOCKED FIT / LINEN BLEND DRESS',
    price: 1199,
    originalPrice: 1499,
    label: 'CULT CLASSIC',
    image: ivoryBotanicalImage,
    gallery: [
      ivoryBotanicalImage,
      '/Photos/IMG_20261027_220233.jpg'
    ],
    colors: [
      { name: 'Off-White Ivory', hex: '#FAF9F5' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Off-white strappy smocked dress featuring delicate embroidered leaf and vine details on the skirt.',
    gsm: '240 GSM Linen-Cotton Blend',
    fit: 'SMOCKED FIT / LINEN BLEND DRESS',
    details: [
      'Off-white strappy smocked dress featuring delicate embroidered leaf and vine details on the skirt.',
      'Breathable lightweight premium linen-cotton blend',
      'Form-fitting elasticated smocked bodice with adjustable straps',
      'Detailed monochrome vine and botanical leaf needlework',
      'Flowing A-line streetwear silhouette'
    ],
    inStock: true
  },
  {
    id: 'cherry-check-charm-dress',
    name: 'CHERRY CHECK CHARM DRESS',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'GINGHAM FIT / EMBROIDERED SHIRT DRESS',
    price: 1299,
    originalPrice: 1599,
    label: 'STREET FAV',
    image: cherryCheckImage,
    gallery: [
      cherryCheckImage,
      '/Photos/IMG_20261027_220247.jpg'
    ],
    colors: [
      { name: 'Cherry Gingham', hex: '#B82D38' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Red and white gingham check button-down shirt dress accented with quirky embroidered patches along the placket.',
    gsm: '260 GSM Woven Cotton Gingham',
    fit: 'GINGHAM FIT / EMBROIDERED SHIRT DRESS',
    details: [
      'Red and white gingham check button-down shirt dress accented with quirky embroidered patches along the placket.',
      'Woven crimson cherry and cream gingham check pattern',
      'Full-length button-down front with shirt collar',
      'Whimsical novelty charm embroideries and tactile patches',
      'Relaxed everyday streetwear shirt dress fit'
    ],
    inStock: true
  },
  {
    id: 'mythic-tale-vest',
    name: 'MYTHIC TALE VEST',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'CROPPED FIT / EMBROIDERED TANK VEST',
    price: 899,
    originalPrice: 1199,
    label: 'LIMITED RUN',
    image: mythicTaleImage,
    gallery: [
      mythicTaleImage,
      '/Photos/IMG_20261027_220342.jpg'
    ],
    colors: [
      { name: 'Pitch Black / Multi Embroidery', hex: '#111211' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Black button-up cropped vest featuring whimsical fairytale and magical motif embroideries (glass slippers, tarot cards, poison apple).',
    gsm: '320 GSM Structured Cotton Twill',
    fit: 'CROPPED FIT / EMBROIDERED TANK VEST',
    details: [
      'Black button-up cropped vest featuring whimsical fairytale and magical motif embroideries (glass slippers, tarot cards, poison apple).',
      'Structured 320 GSM cotton twill canvas',
      'Hand-drawn fairytale icons rendered in high-density embroidery',
      'Button-up front closure with notched V-neck cut',
      'Cropped waist profile ideal for layered styling'
    ],
    inStock: true
  },
  {
    id: '1963-x-mutant-leather-jacket',
    name: '1963 X-MUTANT LEATHER JACKET',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'REGULAR FIT / COLOR-BLOCK BOMBER',
    price: 1699,
    originalPrice: 2199,
    label: 'HEAVYWEIGHT',
    image: xMutantLeatherImage,
    gallery: [
      xMutantLeatherImage,
      '/Photos/IMG_20261028_105301.jpg'
    ],
    colors: [
      { name: 'Stealth Black / Mutant Yellow', hex: '#181818' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Black faux leather jacket with bold yellow cross-chests panels, "1963" chest typography, and an X-Men style emblem patch.',
    gsm: 'Heavy Faux Leather & Satin Lining',
    fit: 'REGULAR FIT / COLOR-BLOCK BOMBER',
    details: [
      'Black faux leather jacket with bold yellow cross-chests panels, "1963" chest typography, and an X-Men style emblem patch.',
      'Heavyweight textured faux leather with smooth satin lining',
      'High-contrast canary yellow chest chevron color-blocking',
      'Tactile embroidered chest emblem patch and "1963" archival typography',
      'Ribbed bomber collar, cuffs, and hem band'
    ],
    inStock: true
  },
  {
    id: 'baxi-tartan-half-zip-pullover',
    name: 'BAXI TARTAN HALF-ZIP PULLOVER',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'OVERSIZED FIT / CABLE KNIT APPLIQUE',
    price: 1299,
    originalPrice: 1699,
    label: 'ESSENTIAL',
    image: baxiTartanImage,
    gallery: [
      baxiTartanImage,
      '/Photos/IMG_20261028_110521.jpg'
    ],
    colors: [
      { name: 'Maroon / Navy Block', hex: '#581825' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Maroon and navy color-blocked cable knit half-zip sweater featuring a crest applique chest patch and textured panels.',
    gsm: '450 GSM Heavy Cable Knit',
    fit: 'OVERSIZED FIT / CABLE KNIT APPLIQUE',
    details: [
      'Maroon and navy color-blocked cable knit half-zip sweater featuring a crest applique chest patch and textured panels.',
      '450 GSM heavyweight chunky cable-knit weave',
      'Deep maroon, forest, and navy contrast panels',
      'Embroidered collegiate crest patch at left chest',
      'Quarter-zip funnel neck with chunky puller'
    ],
    inStock: true
  },
  {
    id: 'cranberry-man-of-steel-sweater',
    name: 'CRANBERRY MAN OF STEEL SWEATER',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'OVERSIZED FIT / TEXTURED KNIT PULLOVER',
    price: 1199,
    originalPrice: 1599,
    label: 'JUST IN',
    image: cranberrySupermanImage,
    gallery: [
      cranberrySupermanImage,
      '/Photos/IMG_20261028_110608.jpg'
    ],
    colors: [
      { name: 'Royal Blue / Cranberry Red', hex: '#1C3F73' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Rich blue oversized crewneck sweater with a bold textured dark red Superman \'S\' logo knit across the chest.',
    gsm: '420 GSM Textured Wool-Cotton Blend',
    fit: 'OVERSIZED FIT / TEXTURED KNIT PULLOVER',
    details: [
      'Rich blue oversized crewneck sweater with a bold textured dark red Superman \'S\' logo knit across the chest.',
      '420 GSM textured wool-cotton blend crewneck pullover',
      'Deep royal blue ground with cranberry-toned embossed shield knit',
      'Drop shoulder with ribbed collar, hem, and cuffs',
      'Warm relaxed cut tailored for winter streetwear'
    ],
    inStock: true
  },
  {
    id: 'alpine-peak-fleece-zip-up',
    name: 'ALPINE PEAK FLEECE ZIP-UP',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'OVERSIZED FIT / PREMIUM HEAVY FLEECE',
    price: 1599,
    originalPrice: 1999,
    label: 'VAULT DROP',
    image: alpinePeakFleeceImage,
    gallery: [
      alpinePeakFleeceImage,
      '/Photos/IMG_20261028_110620.jpg'
    ],
    colors: [
      { name: 'Cream / Mountain Navy', hex: '#EAE5D9' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Cream fleece zip-up jacket detailed with a navy mountain landscape graphic and embroidered winter sports accents.',
    gsm: '480 GSM Premium Sherpa Fleece',
    fit: 'OVERSIZED FIT / PREMIUM HEAVY FLEECE',
    details: [
      'Cream fleece zip-up jacket detailed with a navy mountain landscape graphic and embroidered winter sports accents.',
      '480 GSM ultra-dense thermal sherpa fleece body',
      'Scenic navy mountain landscape jacquard graphic across chest',
      'Embroidered alpine expedition badges and woven zipper pull',
      'Drawcord hem for adjustable silhouette taper'
    ],
    inStock: true
  },
  {
    id: 'prep-07-v-neck-sweater',
    name: 'PREP 07 V-NECK SWEATER',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'OVERSIZED FIT / STRIPED RIB KNIT',
    price: 1099,
    originalPrice: 1399,
    label: 'STEAL DEAL',
    image: prep07SweaterImage,
    gallery: [
      prep07SweaterImage,
      '/Photos/IMG_20261028_110533.jpg'
    ],
    colors: [
      { name: 'Ivory / Ivy Green & Red', hex: '#F0ECE1' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Cream cable-knit V-neck sweater featuring green and red striped ribbed trims and a bold "07" felt patch logo.',
    gsm: '400 GSM Ribbed Cable Knit',
    fit: 'OVERSIZED FIT / STRIPED RIB KNIT',
    details: [
      'Cream cable-knit V-neck sweater featuring green and red striped ribbed trims and a bold "07" felt patch logo.',
      '400 GSM chunky cable-knit body in antique ivory',
      'Varsity green and crimson striped ribbing on collar and cuffs',
      'Vintage chenille/felt "07" athletic chest patch',
      'Relaxed cricket/prep streetwear drape'
    ],
    inStock: true
  },
  {
    id: 'omnitrix-tech-fleece-hoodie',
    name: 'OMNITRIX TECH FLEECE HOODIE',
    category: 'the-drop',
    categoryLabel: 'THE DRIP',
    subtitle: 'OVERSIZED FIT / PREMIUM HEAVY FLEECE',
    price: 1699,
    originalPrice: 2199,
    label: 'VAULT DROP',
    image: omnitrixTechFleeceImage,
    gallery: [
      omnitrixTechFleeceImage,
      '/Photos/IMG_20261028_111620.jpg'
    ],
    colors: [
      { name: 'Cyber Heather Grey / Onyx', hex: '#8E9194' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Grey and black color-blocked heavy fleece hoodie featuring geometric cyber graphic sleeves and a central embroidered watch logo.',
    gsm: '460 GSM Heavy Loopback Fleece',
    fit: 'OVERSIZED FIT / PREMIUM HEAVY FLEECE',
    details: [
      'Grey and black color-blocked heavy fleece hoodie featuring geometric cyber graphic sleeves and a central embroidered watch logo.',
      '460 GSM heavyweight combed loopback cotton fleece',
      'Charcoal grey body with onyx black cyber panel inserts',
      'Geometric sleeve graphics and central embroidered Omnitrix device insignia',
      'Double-walled hood with metal-tipped drawcords'
    ],
    inStock: true
  }
];

export const INITIAL_USER = {
  name: 'Alex Rivera',
  email: 'nichewtff@gmail.com',
  joinedDate: 'October 2024',
  orders: [
    {
      id: 'ZN-90412',
      date: 'Oct 11, 2026',
      items: [
        {
          id: 'item-1',
          productId: 'chaos-club-hoodie',
          name: 'CHAOS CLUB (Oversized Hoodie)',
          price: 1399,
          image: '/src/assets/images/product_chaos_club_1791889113498.jpg',
          selectedColor: 'Deep Graphite',
          selectedSize: 'L',
          quantity: 1
        }
      ],
      subtotal: 1399,
      discount: 0,
      shipping: 0,
      total: 1399,
      status: 'Printing' as const,
      trackingNumber: 'ZN-EXP-88912401',
      shippingAddress: {
        fullName: 'Alex Rivera',
        email: 'nichewtff@gmail.com',
        address: 'B-402, Urban Heights, Bandra West',
        city: 'Mumbai',
        postalCode: '400050',
        country: 'India'
      },
      paymentMethod: 'UPI / Cards'
    }
  ],
  savedAddresses: [
    {
      id: 'addr-1',
      fullName: 'Alex Rivera',
      address: 'B-402, Urban Heights, Bandra West',
      city: 'Mumbai',
      postalCode: '400050',
      country: 'India',
      isDefault: true
    }
  ],
  wishlist: ['mindset-oversized-boxy-tee']
};
