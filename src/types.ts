export type ProductLabel = 
  | 'NEW' 
  | 'BEST SELLER' 
  | 'LIMITED' 
  | 'ARCHIVE'
  | 'ESSENTIAL'
  | 'HEAVYWEIGHT'
  | 'JUST IN'
  | 'CULT CLASSIC'
  | 'STREET FAV'
  | 'TRENDING'
  | 'STEAL DEAL'
  | 'VINTAGE WASH'
  | 'LIMITED RUN'
  | 'VAULT DROP'
  | (string & {});

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export type ProductCategory = 'jeans' | 'shirts' | 't-shirts' | 'the-drop' | 'hoodies' | 'tees' | 'sweats' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  label?: ProductLabel;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  gsm: string;
  fit: string;
  details: string[];
  inStock: boolean;
  releaseDate?: string;
}

export interface CartItem {
  id: string; // unique item id in cart
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  isCustom?: boolean;
  customDetails?: {
    garmentType: string;
    text: string;
    graphic: string;
    placement: string;
    printColor: string;
  };
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Printing' | 'Quality Check' | 'Dispatched' | 'Delivered' | 'Cancelled' | (string & {});
  trackingNumber: string;
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}

export interface UserAccount {
  email: string;
  name: string;
  joinedDate: string;
  orders: Order[];
  savedAddresses: {
    id: string;
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  wishlist: string[]; // product IDs
}
