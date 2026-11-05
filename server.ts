import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Backend Integration (Project: iqfcjetndgtayptfceyu)
const SUPABASE_PROJECT_ID = 'iqfcjetndgtayptfceyu';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key';
const serverSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/Photos', express.static(path.resolve(__dirname, 'Photos')));
app.use('/PHOTOS', express.static(path.resolve(__dirname, 'PHOTOS')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));

// =========================================================================
// DATA PERSISTENCE LAYER (JSON Database in data/)
// =========================================================================
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const AUTH_FILE = path.join(DATA_DIR, 'admin_auth.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'admin_sessions.json');

// Helper functions for safe JSON reading/writing
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// =========================================================================
// DEFAULT SEEDED DATA
// =========================================================================
const INITIAL_PRODUCTS = [
  {
    id: 'archive-wide-cargo-jeans',
    name: 'ARCHIVE WIDE-LEG CARGO JEANS',
    category: 'jeans',
    categoryLabel: 'Heavyweight Denim Jeans',
    subtitle: 'Washed black wide-leg streetwear denim featuring reinforced cargo utility pockets and raw hem details.',
    price: 1499,
    originalPrice: 1799,
    label: 'NEW',
    image: '/src/assets/images/ChatGPT Image Oct 17, 2026, 03_17_58 PM.png',
    gallery: [
      '/src/assets/images/ChatGPT Image Oct 17, 2026, 03_17_58 PM.png',
      '/src/assets/images/brand_editorial_texture_1791889116081.jpg'
    ],
    colors: [
      { name: 'Washed Charcoal', hex: '#2B2B2B' },
      { name: 'Onyx Black', hex: '#111211' }
    ],
    sizes: ['30', '32', '34', '36'],
    stock: 24,
    description: 'Constructed from premium 14oz ring-spun cotton denim with a lived-in mineral stone wash. Relaxed wide-leg drape with double-needle cargo utility construction.',
    gsm: '14oz Ring-Spun Cotton Denim',
    fit: 'Relaxed Wide-Leg Streetwear Drape',
    details: [
      '100% Ring-Spun Cotton Denim (14oz)',
      'Subtle mineral stone enzyme wash',
      'Reinforced rivet hardware and custom YKK zip fly'
    ],
    inStock: true
  },
  {
    id: 'raw-indigo-stacked-denim',
    name: 'RAW INDIGO STACKED DENIM',
    category: 'jeans',
    categoryLabel: 'Japanese Selvedge Denim',
    subtitle: 'Deep indigo rigid stacked denim jeans with copper rivets, contrast stitching, and roll-up selvedge cuff.',
    price: 1699,
    originalPrice: 1999,
    label: 'BEST SELLER',
    image: '/src/assets/images/ChatGPT Image Oct 17, 2026, 03_18_16 PM.png',
    gallery: ['/src/assets/images/ChatGPT Image Oct 17, 2026, 03_18_16 PM.png'],
    colors: [{ name: 'Raw Deep Indigo', hex: '#1B263B' }],
    sizes: ['28', '30', '32', '34', '36'],
    stock: 18,
    description: 'Crafted from authentic 14.5oz Japanese shuttle-loom selvedge denim. Unwashed rigid finish engineered to develop personalized whiskers over time.',
    gsm: '14.5oz Japanese Selvedge Denim',
    fit: 'Stacked Straight Leg Silhouette',
    details: [
      '14.5oz Red-line Japanese shuttle loom selvedge denim',
      'Solid copper donut button fly and embossed rivets'
    ],
    inStock: true
  },
  {
    id: 'vintage-stonewash-baggy-jeans',
    name: 'VINTAGE STONEWASH BAGGY JEANS',
    category: 'jeans',
    categoryLabel: 'Oversized Streetwear Jeans',
    subtitle: 'Heavily stone-washed baggy denim with authentic whiskering, subtle distressing, and 90s skater cut.',
    price: 1499,
    originalPrice: 1699,
    label: 'LIMITED',
    image: '/src/assets/images/streetwear_baggy_jeans_1792147547393.jpg',
    gallery: ['/src/assets/images/streetwear_baggy_jeans_1792147547393.jpg'],
    colors: [{ name: 'Acid Washed Black', hex: '#333333' }],
    sizes: ['30', '32', '34', '36'],
    stock: 12,
    description: 'Throwback loose skater cut with generous knee clearance and subtle hand-distressed whiskers. Washed down for soft drape.',
    gsm: '13.5oz Durable Slub Denim',
    fit: 'Oversized 90s Skater Baggy Fit',
    details: ['13.5oz Cotton Slub Denim', 'Acid and stone wash finish'],
    inStock: true
  },
  {
    id: 'heavy-shadow-plaid-flannel',
    name: 'HEAVY SHADOW-PLAID OVERSHIRT',
    category: 'shirts',
    categoryLabel: 'Heavyweight Flannel Shirt',
    subtitle: 'Boxy drop-shoulder flannel overshirt in monochrome shadow plaid with twin patch chest pockets.',
    price: 1399,
    originalPrice: 1599,
    label: 'BEST SELLER',
    image: '/src/assets/images/ChatGPT Image Oct 17, 2026, 03_00_23 PM.png',
    gallery: ['/src/assets/images/ChatGPT Image Oct 17, 2026, 03_00_23 PM.png'],
    colors: [{ name: 'Stealth Black', hex: '#1C1C1E' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    description: 'Engineered as an outerwear layer or standalone statement piece. 380GSM brushed double-weave cotton with boxy streetwear silhouette.',
    gsm: '380GSM Brushed Heavy Flannel',
    fit: 'Boxy Drop-Shoulder Overshirt',
    details: ['Double-brushed cotton yarn', 'Dual bellows flap chest pockets'],
    inStock: true
  },
  {
    id: 'tactical-box-work-shirt',
    name: 'TACTICAL BOX WORK SHIRT',
    category: 'shirts',
    categoryLabel: 'Technical Workwear Shirt',
    subtitle: 'Camp collar technical utility work shirt with modular webbing, metal D-ring, and concealed snap closures.',
    price: 1499,
    originalPrice: 1799,
    label: 'NEW',
    image: '/src/assets/images/ChatGPT Image Oct 17, 2026, 02_58_37 PM.png',
    gallery: ['/src/assets/images/ChatGPT Image Oct 17, 2026, 02_58_37 PM.png'],
    colors: [{ name: 'Cyber Black', hex: '#101214' }],
    sizes: ['M', 'L', 'XL'],
    stock: 15,
    description: 'Utility meets modern editorial tailoring. Constructed from water-repellent cotton-ripstop blend with matte black hardware.',
    gsm: '320GSM Heavy Cotton-Ripstop',
    fit: 'Structured Square Cut',
    details: ['Matte black stainless hardware', 'Concealed magnetic snap placket'],
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
    image: '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_33_31 PM.png',
    gallery: ['/PHOTOS/ChatGPT Image Oct 22, 2026, 04_33_31 PM.png'],
    colors: [
      { name: 'Forest Green / Cream', hex: '#1C352D' },
      { name: 'Onyx Contrast', hex: '#111211' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    description: 'Dark green boxy-fit short-sleeve shirt with a half-zip collar and cream white side panel inserts.',
    gsm: '320 GSM Cotton Twill',
    fit: 'Boxy Fit / Half-Zip Overshirt',
    details: [
      'Dark green boxy-fit short-sleeve shirt with a half-zip collar and cream white side panel inserts.',
      'Heavyweight 320 GSM structured cotton weave',
      'Silver-tone industrial half-zip pull'
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
    image: '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_34_26 PM.png',
    gallery: ['/PHOTOS/ChatGPT Image Oct 22, 2026, 04_34_26 PM.png'],
    colors: [{ name: 'Off-White / Cobalt Art', hex: '#F0EFEA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    description: 'Off-white short-sleeve linen blend resort shirt featuring blue hand-drawn line art of plants and furniture.',
    gsm: '220 GSM Linen-Cotton Blend',
    fit: 'Linen Blend / Oversized Fit',
    details: [
      'Off-white short-sleeve linen blend resort shirt featuring blue hand-drawn line art of plants and furniture.',
      'Breathable lightweight linen-cotton blend for summer layering'
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
    image: '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_35_20 PM.png',
    gallery: ['/PHOTOS/ChatGPT Image Oct 22, 2026, 04_35_20 PM.png'],
    colors: [{ name: 'Cream White / Crimson Piping', hex: '#F5F5F0' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    description: 'White button-up baseball jersey style shirt with "Superman" script embroidery, red piping, and "Kryptonite" patch.',
    gsm: '280 GSM Athletic Knit',
    fit: 'Oversized Fit / Baseball Shirt',
    details: [
      'White button-up baseball jersey style shirt with "Superman" script embroidery, red piping, and "Kryptonite" patch.',
      'Tactile cursive script embroidery across chest'
    ],
    inStock: true
  },
  {
    id: 'zora-brown-embroidered-shirt',
    name: 'ZORA BROWN',
    category: 'shirts',
    categoryLabel: 'SHIRTS',
    subtitle: 'RELAXED FIT / EMBROIDERED SHIRT',
    price: 799,
    originalPrice: 999,
    label: 'BEST SELLER',
    image: '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_36_25 PM.png',
    gallery: ['/PHOTOS/ChatGPT Image Oct 22, 2026, 04_36_25 PM.png'],
    colors: [{ name: 'Warm Terracotta Brown', hex: '#634735' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    description: 'Brown relaxed-fit long-sleeve button-down shirt with a embroidered palm tree on the front pocket and sun embroidery on the back.',
    gsm: '260 GSM Washed Slub Cotton',
    fit: 'Relaxed Fit / Embroidered Shirt',
    details: [
      'Brown relaxed-fit long-sleeve button-down shirt with a embroidered palm tree on the front pocket and sun embroidery on the back.',
      'Detailed needlework palm embroidery on chest pocket'
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
    image: '/PHOTOS/ChatGPT Image Oct 22, 2026, 04_37_34 PM.png',
    gallery: ['/PHOTOS/ChatGPT Image Oct 22, 2026, 04_37_34 PM.png'],
    colors: [{ name: 'Dusty Pink / Crimson Check', hex: '#D1889C' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    description: 'Pink check/plaid long-sleeve shirt featuring a large red Snow White graphic with the word "Enchanted" on the back.',
    gsm: '280 GSM Brushed Plaid Twill',
    fit: 'Graphic Print / Oversized Shirt',
    details: [
      'Pink check/plaid long-sleeve shirt featuring a large red Snow White graphic with the word "Enchanted" on the back.',
      'Custom woven pastel pink and cream shadow check'
    ],
    inStock: true
  },
  {
    id: 'mindset-oversized-boxy-tee',
    name: 'MINDSET OVERSIZED BOXY TEE',
    category: 't-shirts',
    categoryLabel: 'Heavyweight Graphic Tee',
    subtitle: '280GSM combed cotton boxy tee featuring high-density typography screenprint on chest and back spine.',
    price: 999,
    originalPrice: 1299,
    label: 'BEST SELLER',
    image: '/src/assets/images/ChatGPT Image Oct 16, 2026, 04_59_54 PM.png',
    gallery: ['/src/assets/images/ChatGPT Image Oct 16, 2026, 04_59_54 PM.png'],
    colors: [{ name: 'Warm Ivory', hex: '#EDE8DF' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    description: 'The definitive daily driver tee. Thick 1.25-inch ribbed collar that retains shape, dropped shoulders, and ultra-dense combed cotton.',
    gsm: '280GSM 100% Combed Cotton',
    fit: 'Signature ZEALNIX Boxy Dropped Fit',
    details: ['1.25" thick shape-retention collar', 'Tactile puff screenprint'],
    inStock: true
  },
  {
    id: 'feel-the-moment-acid-wash-tee',
    name: 'FEEL THE MOMENT ACID-WASH TEE',
    category: 't-shirts',
    categoryLabel: 'Vintage Mineral Wash Tee',
    subtitle: 'Distressed mineral wash streetwear tee with cracked-ink graphic illustration and raw edge styling.',
    price: 999,
    originalPrice: 1199,
    label: 'NEW',
    image: '/src/assets/images/ChatGPT Image Oct 17, 2026, 03_05_16 PM.png',
    gallery: ['/src/assets/images/ChatGPT Image Oct 17, 2026, 03_05_16 PM.png'],
    colors: [{ name: 'Acid Washed Black', hex: '#2A2928' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    description: 'Individual hand-applied mineral wash ensures no two garments are identical. Finished with cracked soft-hand vintage screen ink.',
    gsm: '260GSM Mineral-Washed Cotton',
    fit: 'Relaxed Drop-Shoulder Vintage Cut',
    details: ['Hand-dyed mineral wash finish', 'Soft-touch breathable inks'],
    inStock: true
  },
  {
    id: 'anchor-zeal',
    name: 'ANCHOR ZEAL',
    category: 't-shirts',
    categoryLabel: 'T-SHIRTS',
    subtitle: 'OVERSIZED FIT / KNITTED POLO',
    price: 799,
    originalPrice: 999,
    label: 'ESSENTIAL',
    image: '/PHOTOS/IMG_20261027_174423.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174423.jpg'],
    colors: [{ name: 'Cream / Navy Collar', hex: '#EDE8D0' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    description: 'Cream/beige ribbed knit polo shirt with dark blue collar and anchor chest patch logo.',
    gsm: '320 GSM Ribbed Knit Cotton',
    fit: 'OVERSIZED FIT / KNITTED POLO',
    details: [
      'Cream/beige ribbed knit polo shirt with dark blue collar and anchor chest patch logo.',
      'Heavyweight ribbed cotton knit structure',
      'Contrast dark navy collar and placket',
      'Tactile embroidered anchor chest badge'
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
    image: '/PHOTOS/IMG_20261027_174437.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174437.jpg'],
    colors: [{ name: 'Acid Washed Charcoal', hex: '#2C2B2A' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    description: 'Dark grey/black heavy gauge acid wash tee with intricate gold/brown taurus bull back graphic.',
    gsm: '300 GSM Heavy Gauge Jersey',
    fit: 'SUPER OVERSIZED FIT / HEAVY GAUGE',
    details: [
      'Dark grey/black heavy gauge acid wash tee with intricate gold/brown taurus bull back graphic.',
      '300 GSM ultra-dense combed cotton',
      'Distressed vintage acid wash treatment',
      'High-density screenprinted taurus artwork on back'
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
    image: '/PHOTOS/IMG_20261027_174451.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174451.jpg'],
    colors: [{ name: 'Pitch Black', hex: '#111211' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35,
    description: 'Black oversized tee with Japanese Kanji chest graphic and large golden phoenix back print.',
    gsm: '280 GSM Heavy Combed Cotton',
    fit: 'OVERSIZED FIT / HEAVY GAUGE',
    details: [
      'Black oversized tee with Japanese Kanji chest graphic and large golden phoenix back print.',
      'Golden metallic and discharge screenprint ink',
      'Japanese typography chest detailing'
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
    image: '/PHOTOS/IMG_20261027_174510.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174510.jpg'],
    colors: [{ name: 'Off-White Ivory', hex: '#F3EFE6' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 28,
    description: 'Cream/off-white tee with Fourth Hokage Minato Namikaze / Naruto back artwork and Japanese typography.',
    gsm: '280 GSM Ring-Spun Cotton',
    fit: 'OVERSIZED FIT / ANIME GRAPHIC',
    details: [
      'Cream/off-white tee with Fourth Hokage Minato Namikaze / Naruto back artwork and Japanese typography.',
      'Authentic manga artwork and Kanji typography',
      'Pre-washed soft hand-feel combed cotton'
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
    image: '/PHOTOS/IMG_20261027_174521.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174521.jpg'],
    colors: [{ name: 'Heather Grey', hex: '#D1D0CE' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    description: 'Light grey oversized tee featuring the iconic Welcome movie horse painting with "MASTERPIECE" print.',
    gsm: '280 GSM Single Jersey',
    fit: 'OVERSIZED FIT / ART PRINT',
    details: [
      'Light grey oversized tee featuring the iconic Welcome movie horse painting with "MASTERPIECE" print.',
      'Pop-culture cult art front graphic print',
      'Thick shape-retaining ribbed neckline'
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
    image: '/PHOTOS/IMG_20261027_174535.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174535.jpg'],
    colors: [{ name: 'Pastel Colorblock', hex: '#D7E0EB' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35,
    description: 'Pastel multi-color block raglan jersey featuring Powerpuff Girls baseball graphic back print.',
    gsm: '260 GSM Sport Mesh & Jersey',
    fit: 'OVERSIZED FIT / RAGLAN TEE',
    details: [
      'Pastel multi-color block raglan jersey featuring Powerpuff Girls baseball graphic back print.',
      'Varsity baseball jersey raglan cut',
      'Playful 90s cartoon back print'
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
    image: '/PHOTOS/IMG_20261027_174545.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174545.jpg'],
    colors: [{ name: 'Rust Red', hex: '#A4392D' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40,
    description: 'Rust red oversized graphic tee covered in black SpongeBob line-art doodles and yellow "Chill Vibes" front text.',
    gsm: '260 GSM Combed Cotton',
    fit: 'OVERSIZED FIT / ALL-OVER SKETCH',
    details: [
      'Rust red oversized graphic tee covered in black SpongeBob line-art doodles and yellow "Chill Vibes" front text.',
      'All-over cartoon doodle screenprint',
      'Enzyme washed rust red tone'
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
    image: '/PHOTOS/IMG_20261027_174559.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174559.jpg'],
    colors: [{ name: 'Vintage Acid Charcoal', hex: '#353535' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    description: 'Vintage charcoal grey acid wash tee featuring an embroidered muted gold Superman shield chest patch.',
    gsm: '290 GSM Heavy Mineral Wash Jersey',
    fit: 'OVERSIZED FIT / ACID WASH',
    details: [
      'Vintage charcoal grey acid wash tee featuring an embroidered muted gold Superman shield chest patch.',
      'Heavily acid washed lived-in texture',
      'Embroidered metallic gold shield patch on chest'
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
    image: '/PHOTOS/IMG_20261027_174611.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174611.jpg'],
    colors: [{ name: 'Sky Blue', hex: '#87CEEB' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    description: 'Sky blue oversized tee featuring sketch-style Hello Kitty graphics with a red sequin embroidered bow accent.',
    gsm: '270 GSM Soft Ring-Spun Cotton',
    fit: 'OVERSIZED FIT / SEQUIN EMBROIDERED',
    details: [
      'Sky blue oversized tee featuring sketch-style Hello Kitty graphics with a red sequin embroidered bow accent.',
      'Shimmering red sequin embroidered bow',
      'Minimalist hand-sketch character art'
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
    image: '/PHOTOS/IMG_20261027_174623.jpg',
    gallery: ['/PHOTOS/IMG_20261027_174623.jpg'],
    colors: [{ name: 'Beige / Floral Contrast', hex: '#DFD8C4' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    description: 'Beige tee featuring floral patterned sleeves and a Minion applique patch on the chest with "BELLO!" text.',
    gsm: '300 GSM Heavyweight Cotton',
    fit: 'OVERSIZED FIT / APPLIQUE PATCH',
    details: [
      'Beige tee featuring floral patterned sleeves and a Minion applique patch on the chest with "BELLO!" text.',
      'Intricate printed floral pattern sleeve panels',
      'Embroidered tactile Minion chest applique badge'
    ],
    inStock: true
  },
  {
    id: 'chaos-club-hoodie',
    name: 'CHAOS CLUB HEAVY HOODIE',
    category: 'the-drop',
    categoryLabel: '460GSM Loopback Terry Hoodie',
    subtitle: 'Double-layered oversized streetwear hoodie with metal aglets, distressed raw seams, and tactile front emblem.',
    price: 1399,
    originalPrice: 1799,
    label: 'BEST SELLER',
    image: '/src/assets/images/product_chaos_club_1791889113498.jpg',
    gallery: ['/src/assets/images/product_chaos_club_1791889113498.jpg'],
    colors: [{ name: 'Deep Graphite', hex: '#232323' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 20,
    description: 'Heavyweight 460GSM loopback cotton hoodie built for cold streets and editorial silhouette drape. Double-walled crossover hood.',
    gsm: '460GSM French Terry Combed Loopback',
    fit: 'Oversized Boxy Silhouette with Dropped Shoulders',
    details: ['Seamless double-layered hood', 'Custom brushed stainless aglets'],
    inStock: true
  }
];

const INITIAL_SETTINGS = {
  storeName: 'ZEALNIX STREETWEAR',
  supportEmail: 'concierge@zealnix.com',
  currency: 'INR (₹)',
  announcementText: '★ DROP VOL. 04 LIVE NOW · 100% HEAVY COTTON · EXPRESS PAN-INDIA DISPATCH',
  freeShippingThreshold: 1499,
  shippingFee: 99,
  orderNotificationsEnabled: true
};

const INITIAL_ORDERS = [
  {
    id: 'ZNX-2026-9481',
    date: '2026-10-21T18:45:00.000Z',
    items: [
      {
        id: 'item-1',
        productId: 'chaos-club-hoodie',
        name: 'CHAOS CLUB HEAVY HOODIE',
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
    status: 'Printing',
    paymentStatus: 'Paid (Razorpay UPI)',
    trackingNumber: 'ZNX-BLR-88349',
    shippingAddress: {
      fullName: 'Aarav Mehta',
      email: 'aarav.m@example.com',
      address: '42 Brigade Road, Indiranagar',
      city: 'Bengaluru, Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    paymentMethod: 'UPI / NetBanking'
  },
  {
    id: 'ZNX-2026-9477',
    date: '2026-10-20T14:20:00.000Z',
    items: [
      {
        id: 'item-2',
        productId: 'archive-wide-cargo-jeans',
        name: 'ARCHIVE WIDE-LEG CARGO JEANS',
        price: 1499,
        image: '/src/assets/images/ChatGPT Image Oct 17, 2026, 03_17_58 PM.png',
        selectedColor: 'Washed Charcoal',
        selectedSize: '32',
        quantity: 1
      },
      {
        id: 'item-3',
        productId: 'mindset-oversized-boxy-tee',
        name: 'MINDSET OVERSIZED BOXY TEE',
        price: 999,
        image: '/src/assets/images/ChatGPT Image Oct 16, 2026, 04_59_54 PM.png',
        selectedColor: 'Warm Ivory',
        selectedSize: 'L',
        quantity: 1
      }
    ],
    subtotal: 2498,
    discount: 250,
    shipping: 0,
    total: 2248,
    status: 'Dispatched',
    paymentStatus: 'Paid (Credit Card)',
    trackingNumber: 'ZNX-BOM-10492',
    shippingAddress: {
      fullName: 'Rhea Sen',
      email: 'rhea.sen@example.com',
      address: 'Flat 8B, Sea View Apts, Bandra West',
      city: 'Mumbai, Maharashtra',
      postalCode: '400050',
      country: 'India'
    },
    paymentMethod: 'Credit Card (256-bit SSL)'
  }
];

// Initialize JSON files if missing
if (!fs.existsSync(PRODUCTS_FILE)) {
  writeJsonFile(PRODUCTS_FILE, INITIAL_PRODUCTS);
}
if (!fs.existsSync(ORDERS_FILE)) {
  writeJsonFile(ORDERS_FILE, INITIAL_ORDERS);
}
if (!fs.existsSync(SETTINGS_FILE)) {
  writeJsonFile(SETTINGS_FILE, INITIAL_SETTINGS);
}

// =========================================================================
// SECURITY & AUTHENTICATION (PBKDF2, Salted Hashing & Sessions)
// =========================================================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@zealnix.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ZealnixAdmin#2026!';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const computedHash = hashPassword(password, salt);
    const hashBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch (err) {
    return false;
  }
}

// Ensure auth file exists with securely hashed admin credentials
let adminCredentials = readJsonFile<{ email: string; salt: string; hash: string } | null>(AUTH_FILE, null);
if (!adminCredentials || adminCredentials.email !== ADMIN_EMAIL) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(ADMIN_PASSWORD, salt);
  adminCredentials = { email: ADMIN_EMAIL, salt, hash };
  writeJsonFile(AUTH_FILE, adminCredentials);
}

// Session store: token -> Session
interface AdminSession {
  token: string;
  email: string;
  role: 'admin';
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, AdminSession>();

// In-memory rate limiter for login attempts (max 5 failed attempts per 15 mins)
interface RateLimitRecord {
  attempts: number;
  blockedUntil: number;
}
const loginRateLimiter = new Map<string, RateLimitRecord>();

function checkRateLimit(key: string): { allowed: boolean; remainingWaitMs?: number } {
  const now = Date.now();
  const record = loginRateLimiter.get(key);
  if (!record) return { allowed: true };

  if (record.blockedUntil > now) {
    return { allowed: false, remainingWaitMs: record.blockedUntil - now };
  }

  if (now - record.blockedUntil > 15 * 60 * 1000) {
    loginRateLimiter.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedLogin(key: string): void {
  const now = Date.now();
  const record = loginRateLimiter.get(key) || { attempts: 0, blockedUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.blockedUntil = now + 15 * 60 * 1000; // 15 minutes block
  }
  loginRateLimiter.set(key, record);
}

function clearRateLimit(key: string): void {
  loginRateLimiter.delete(key);
}

// Authentication middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.zealnix_admin_token || req.headers.authorization?.replace(/^Bearer\s+/, '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  let session = activeSessions.get(token);
  if (!session) {
    const savedSessions = readJsonFile<Record<string, AdminSession>>(SESSIONS_FILE, {});
    if (savedSessions[token]) {
      session = savedSessions[token];
      activeSessions.set(token, session);
    }
  }

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      activeSessions.delete(token);
      const savedSessions = readJsonFile<Record<string, AdminSession>>(SESSIONS_FILE, {});
      delete savedSessions[token];
      writeJsonFile(SESSIONS_FILE, savedSessions);
    }
    res.clearCookie('zealnix_admin_token');
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  (req as any).adminSession = session;
  next();
}

// =========================================================================
// API ROUTES: AUTHENTICATION
// =========================================================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const rateLimitKey = `${clientIp}_${String(email || '').toLowerCase().trim()}`;

  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil((rateCheck.remainingWaitMs || 0) / 60000);
    return res.status(429).json({
      error: `Too many failed attempts. Login is temporarily locked for security. Try again in ${minutesLeft} minute(s).`
    });
  }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const creds = readJsonFile<{ email: string; salt: string; hash: string }>(AUTH_FILE, adminCredentials!);
  const normalizedInputEmail = email.toLowerCase().trim();
  const normalizedStoredEmail = creds.email.toLowerCase().trim();

  const isEmailMatch = normalizedInputEmail === normalizedStoredEmail;
  const isPasswordMatch = isEmailMatch && verifyPassword(password, creds.salt, creds.hash);

  if (!isPasswordMatch) {
    recordFailedLogin(rateLimitKey);
    return res.status(401).json({
      error: 'Invalid administrator credentials. Access denied.'
    });
  }

  clearRateLimit(rateLimitKey);

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours

  const session: AdminSession = {
    token,
    email: creds.email,
    role: 'admin',
    createdAt: now,
    expiresAt: now + sessionDuration
  };

  activeSessions.set(token, session);
  const savedSessions = readJsonFile<Record<string, AdminSession>>(SESSIONS_FILE, {});
  savedSessions[token] = session;
  writeJsonFile(SESSIONS_FILE, savedSessions);

  // Set secure cookie
  res.cookie('zealnix_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: sessionDuration,
    path: '/'
  });

  return res.json({
    success: true,
    token,
    user: {
      email: creds.email,
      role: 'admin',
      name: 'ZEALNIX Admin'
    }
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = req.cookies.zealnix_admin_token || req.headers.authorization?.replace(/^Bearer\s+/, '');
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  let session = activeSessions.get(token);
  if (!session) {
    const savedSessions = readJsonFile<Record<string, AdminSession>>(SESSIONS_FILE, {});
    if (savedSessions[token]) {
      session = savedSessions[token];
      activeSessions.set(token, session);
    }
  }

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      activeSessions.delete(token);
      const savedSessions = readJsonFile<Record<string, AdminSession>>(SESSIONS_FILE, {});
      delete savedSessions[token];
      writeJsonFile(SESSIONS_FILE, savedSessions);
    }
    res.clearCookie('zealnix_admin_token');
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role,
      name: 'ZEALNIX Admin'
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.cookies.zealnix_admin_token || req.headers.authorization?.replace(/^Bearer\s+/, '');
  if (token) {
    activeSessions.delete(token);
    const savedSessions = readJsonFile<Record<string, AdminSession>>(SESSIONS_FILE, {});
    delete savedSessions[token];
    writeJsonFile(SESSIONS_FILE, savedSessions);
  }
  res.clearCookie('zealnix_admin_token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// =========================================================================
// API ROUTES: PRODUCTS (CRUD & Live Persistence)
// =========================================================================
app.get('/api/products', (req: Request, res: Response) => {
  const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  return res.json(products);
});

app.post('/api/products', requireAdminAuth, (req: Request, res: Response) => {
  const { name, category, price, subtitle, description, sizes, image, stock, label, gsm, fit } = req.body || {};

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required.' });
  }

  const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `${slug}-${Date.now().toString().slice(-4)}`;

  const newProduct = {
    id,
    name: String(name).toUpperCase(),
    category,
    categoryLabel: `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`,
    subtitle: subtitle || 'New ZEALNIX drop addition with bespoke streetwear cut.',
    price: Number(price),
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : Math.round(Number(price) * 1.25),
    label: label || 'NEW',
    image: image || '/src/assets/images/ChatGPT Image Oct 16, 2026, 04_59_54 PM.png',
    gallery: [image || '/src/assets/images/ChatGPT Image Oct 16, 2026, 04_59_54 PM.png'],
    colors: [{ name: 'Standard Wash', hex: '#261C14' }],
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
    stock: stock !== undefined ? Number(stock) : 25,
    description: description || 'Heavyweight combed cotton designed with dropped shoulders and relaxed drape.',
    gsm: gsm || '380GSM Combed Cotton',
    fit: fit || 'Boxy Oversized Streetwear Fit',
    details: ['100% Combed Heavy Cotton', 'Small-batch screen printed'],
    inStock: (stock !== undefined ? Number(stock) : 25) > 0
  };

  products.unshift(newProduct);
  writeJsonFile(PRODUCTS_FILE, products);

  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const current = products[index];
  const updatedProduct = {
    ...current,
    ...updates,
    id: current.id, // prevent ID overwrite
    price: updates.price !== undefined ? Number(updates.price) : current.price,
    originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : current.originalPrice,
    stock: updates.stock !== undefined ? Number(updates.stock) : current.stock,
    inStock: updates.stock !== undefined ? Number(updates.stock) > 0 : current.inStock
  };

  products[index] = updatedProduct;
  writeJsonFile(PRODUCTS_FILE, products);

  return res.json(updatedProduct);
});

app.delete('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  writeJsonFile(PRODUCTS_FILE, filtered);
  return res.json({ success: true, id, message: 'Product deleted successfully.' });
});

// =========================================================================
// API ROUTES: ORDERS (Customer checkout & Admin management)
// =========================================================================
app.get('/api/orders', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const localOrders = readJsonFile<any[]>(ORDERS_FILE, INITIAL_ORDERS);

    let supabaseOrders: any[] = [];
    try {
      const { data, error } = await serverSupabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase Server] Orders query warning:', error.message);
      } else if (Array.isArray(data)) {
        supabaseOrders = data;
        console.log(`[Supabase Server] Successfully retrieved ${data.length} orders from Supabase.`);
      }
    } catch (err: any) {
      console.warn('[Supabase Server] Query exception:', err?.message || err);
    }

    const orderMap = new Map<string, any>();

    // 1. Add local orders
    for (const ord of localOrders) {
      orderMap.set(ord.id, {
        id: ord.id,
        order_number: ord.id,
        date: ord.date || new Date().toISOString(),
        items: ord.items || [],
        subtotal: Number(ord.subtotal) || 0,
        discount: Number(ord.discount) || 0,
        shipping: Number(ord.shipping) || 0,
        total: Number(ord.total) || 0,
        status: ord.status || 'Confirmed',
        trackingNumber: ord.trackingNumber || '',
        paymentMethod: ord.paymentMethod || 'Online Gateway',
        paymentStatus: ord.paymentStatus || 'Paid (Online Gateway)',
        customer_name: ord.shippingAddress?.fullName || 'Valued Customer',
        customer_email: ord.shippingAddress?.email || '',
        customer_phone: ord.shippingAddress?.phone || '',
        shippingAddress: {
          fullName: ord.shippingAddress?.fullName || 'Valued Customer',
          email: ord.shippingAddress?.email || '',
          phone: ord.shippingAddress?.phone || '',
          address: ord.shippingAddress?.address || '',
          city: ord.shippingAddress?.city || 'India',
          postalCode: ord.shippingAddress?.postalCode || '',
          country: ord.shippingAddress?.country || 'India'
        }
      });
    }

    // 2. Overlay Supabase orders (authoritative)
    for (const row of supabaseOrders) {
      const items = Array.isArray(row.items)
        ? row.items
        : typeof row.items === 'string'
        ? (() => {
            try {
              return JSON.parse(row.items);
            } catch {
              return [];
            }
          })()
        : [];

      const fullName = row.customer_name || 'Valued Customer';
      const email = row.customer_email || '';
      const phone = row.customer_phone || '';
      const address = row.shipping_address || '';
      const city = row.city || 'India';
      const postalCode = row.postal_code || '';
      const country = row.country || 'India';

      const rawDate = row.created_at || new Date().toISOString();
      let formattedDate: string;
      try {
        formattedDate = new Date(rawDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        if (formattedDate === 'Invalid Date') {
          formattedDate = String(rawDate);
        }
      } catch {
        formattedDate = String(rawDate);
      }

      const ordId = row.id || row.order_number;
      orderMap.set(ordId, {
        id: ordId,
        order_number: ordId,
        date: formattedDate,
        created_at: rawDate,
        items,
        subtotal: Number(row.subtotal) || Number(row.total) || 0,
        discount: Number(row.discount) || 0,
        shipping: Number(row.shipping_fee) || 0,
        total: Number(row.total) || 0,
        status: row.status || 'Confirmed',
        trackingNumber: row.tracking_number || '',
        paymentMethod: row.payment_method || 'Online Gateway',
        paymentStatus: row.payment_method ? `Paid via ${row.payment_method}` : 'Paid (Online Gateway)',
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        shippingAddress: {
          fullName,
          email,
          phone,
          address,
          city,
          postalCode,
          country
        }
      });
    }

    const merged = Array.from(orderMap.values());
    merged.sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());
    return res.json(merged);
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    return res.json(readJsonFile<any[]>(ORDERS_FILE, INITIAL_ORDERS));
  }
});

// Update order fulfillment status
app.put('/api/orders/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  const orders = readJsonFile<any[]>(ORDERS_FILE, INITIAL_ORDERS);
  const index = orders.findIndex((o) => o.id === id);
  let updatedOrder = null;
  if (index !== -1) {
    orders[index].status = status;
    updatedOrder = orders[index];
    writeJsonFile(ORDERS_FILE, orders);
  }

  // Update in Supabase
  try {
    const { error } = await serverSupabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (error) {
      console.warn('[Supabase Server] Note on order status update:', error.message);
    } else {
      console.log(`[Supabase Server] Order ${id} status set to ${status}`);
    }
  } catch (e: any) {
    console.warn('[Supabase Server] Status update exception:', e?.message || e);
  }

  return res.json(updatedOrder || { id, status, success: true });
});

// Customer checkout placement
app.post('/api/orders', async (req: Request, res: Response) => {
  const orderData = req.body;
  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  const orders = readJsonFile<any[]>(ORDERS_FILE, INITIAL_ORDERS);
  const orderId = orderData.id || `ZNX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newOrder = {
    ...orderData,
    id: orderId,
    date: orderData.date || new Date().toISOString(),
    status: orderData.status || 'Confirmed',
    paymentStatus: orderData.paymentMethod ? `Paid via ${orderData.paymentMethod}` : 'Paid (Online Gateway)',
    trackingNumber: orderData.trackingNumber || `ZNX-DEL-${Math.floor(10000 + Math.random() * 90000)}`
  };

  orders.unshift(newOrder);
  writeJsonFile(ORDERS_FILE, orders);

  // Sync to Supabase 'orders' and 'order_items' tables
  try {
    const orderPayload = {
      id: newOrder.id,
      order_number: newOrder.id,
      customer_name: newOrder.shippingAddress?.fullName || 'Valued Customer',
      customer_email: newOrder.shippingAddress?.email || 'customer@zealnix.com',
      customer_phone: newOrder.shippingAddress?.phone || '+91 98765 43210',
      shipping_address: newOrder.shippingAddress?.address || '',
      city: newOrder.shippingAddress?.city || '',
      postal_code: newOrder.shippingAddress?.postalCode || '',
      country: newOrder.shippingAddress?.country || 'India',
      payment_method: newOrder.paymentMethod || 'Online Gateway',
      subtotal: newOrder.subtotal || 0,
      discount: newOrder.discount || 0,
      shipping_fee: newOrder.shipping || 0,
      total: newOrder.total || 0,
      status: newOrder.status || 'Confirmed',
      tracking_number: newOrder.trackingNumber || '',
      items_count: (newOrder.items || []).reduce((sum: number, it: any) => sum + (it.quantity || 1), 0),
      items: newOrder.items || [],
      created_at: new Date().toISOString()
    };

    const { error: orderError } = await serverSupabase.from('orders').insert([orderPayload]);
    if (orderError) {
      console.warn('[Supabase Server] Note on orders insert:', orderError.message);
    } else {
      console.log(`[Supabase Server] Order ${newOrder.id} successfully recorded in Supabase!`);
    }

    if (Array.isArray(newOrder.items) && newOrder.items.length > 0) {
      const lineItems = newOrder.items.map((it: any, idx: number) => ({
        id: `${newOrder.id}-${idx + 1}`,
        order_id: newOrder.id,
        product_id: it.productId || it.id || `prod-${idx}`,
        product_name: it.name,
        price: it.price,
        quantity: it.quantity || 1,
        selected_size: it.selectedSize || 'Standard',
        selected_color: it.selectedColor || 'Standard',
        image_url: it.image || '',
        is_custom: Boolean(it.isCustom),
        custom_details: it.customDetails || null,
        created_at: new Date().toISOString()
      }));

      const { error: itemsError } = await serverSupabase.from('order_items').insert(lineItems);
      if (itemsError) {
        console.warn('[Supabase Server] Note on order_items insert:', itemsError.message);
      }
    }
  } catch (err: any) {
    console.warn('[Supabase Server] Error during Supabase order sync:', err?.message || err);
  }

  // Decrement inventory on product database
  const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  orderData.items.forEach((item: any) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod && prod.stock !== undefined) {
      prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      prod.inStock = prod.stock > 0;
    }
  });
  writeJsonFile(PRODUCTS_FILE, products);

  return res.status(201).json(newOrder);
});

// Contact Us Inquiries (Persisted to Supabase contact_inquiries)
app.post('/api/contact', async (req: Request, res: Response) => {
  const { ticket_id, full_name, phone, email, reason, message } = req.body || {};
  if (!full_name || !phone) {
    return res.status(400).json({ error: 'Full name and phone are required.' });
  }

  const tid = ticket_id || `ZNX-${Math.floor(100000 + Math.random() * 900000)}`;
  const inquiryRecord = {
    ticket_id: tid,
    full_name,
    phone,
    email: email || '',
    reason: reason || 'General Inquiry',
    message: message || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
  const inquiries = readJsonFile<any[]>(INQUIRIES_FILE, []);
  inquiries.unshift(inquiryRecord);
  writeJsonFile(INQUIRIES_FILE, inquiries);

  // Sync to Supabase table 'contact_inquiries'
  try {
    const { error } = await serverSupabase.from('contact_inquiries').insert([inquiryRecord]);
    if (error) console.warn('[Supabase Server] Contact insert note:', error.message);
    else console.log('[Supabase Server] Contact inquiry saved to Supabase:', tid);
  } catch (err: any) {
    console.warn('[Supabase Server] Contact insert error:', err?.message || err);
  }

  return res.status(201).json({ success: true, inquiry: inquiryRecord });
});

// Supabase Connection Status Healthcheck
app.get('/api/supabase-status', (req: Request, res: Response) => {
  return res.json({
    connected: true,
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
    tables: ['orders', 'order_items', 'contact_inquiries', 'custom_orders']
  });
});

app.put('/api/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus, trackingNumber } = req.body;

  const orders = readJsonFile<any[]>(ORDERS_FILE, INITIAL_ORDERS);
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (status) orders[index].status = status;
  if (paymentStatus) orders[index].paymentStatus = paymentStatus;
  if (trackingNumber) orders[index].trackingNumber = trackingNumber;

  writeJsonFile(ORDERS_FILE, orders);
  return res.json(orders[index]);
});

// =========================================================================
// API ROUTES: INVENTORY MANAGEMENT
// =========================================================================
app.get('/api/inventory', requireAdminAuth, (req: Request, res: Response) => {
  const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const inventory = products.map((p) => {
    // Generate default sizeStock if not explicitly set
    const defaultSizes = p.sizes || ['S', 'M', 'L', 'XL'];
    const currentStock = p.stock ?? 20;
    const basePerSize = Math.floor(currentStock / (defaultSizes.length || 1));
    const remainder = currentStock % (defaultSizes.length || 1);
    const fallbackSizeStock: Record<string, number> = {};
    defaultSizes.forEach((sz: string, i: number) => {
      fallbackSizeStock[sz] = basePerSize + (i === 0 ? remainder : 0);
    });

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: currentStock,
      sizeStock: p.sizeStock || fallbackSizeStock,
      inStock: p.inStock ?? true,
      isLowStock: currentStock <= 5,
      sizes: p.sizes || ['S', 'M', 'L', 'XL']
    };
  });
  return res.json(inventory);
});

app.put('/api/inventory/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { stock, inStock, sizeStock } = req.body;

  const products = readJsonFile<any[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  if (sizeStock && typeof sizeStock === 'object') {
    products[index].sizeStock = sizeStock;
    const computedTotal = Object.values(sizeStock).reduce((acc: number, val: any) => acc + Math.max(0, Number(val) || 0), 0);
    products[index].stock = computedTotal;
    products[index].inStock = computedTotal > 0;
  } else if (stock !== undefined) {
    products[index].stock = Number(stock);
    products[index].inStock = Number(stock) > 0;
  }

  if (inStock !== undefined) {
    products[index].inStock = Boolean(inStock);
  }

  writeJsonFile(PRODUCTS_FILE, products);
  return res.json({
    id,
    stock: products[index].stock,
    inStock: products[index].inStock,
    sizeStock: products[index].sizeStock
  });
});

// =========================================================================
// API ROUTES: STORE SETTINGS
// =========================================================================
app.get('/api/settings', (req: Request, res: Response) => {
  const settings = readJsonFile(SETTINGS_FILE, INITIAL_SETTINGS);
  return res.json(settings);
});

app.put('/api/settings', requireAdminAuth, (req: Request, res: Response) => {
  const current = readJsonFile(SETTINGS_FILE, INITIAL_SETTINGS);
  const updated = { ...current, ...req.body };
  writeJsonFile(SETTINGS_FILE, updated);
  return res.json({ success: true, settings: updated });
});

// =========================================================================
// VITE SPA MIDDLEWARE / PRODUCTION STATIC SERVING
// =========================================================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZEALNIX API & Web Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
