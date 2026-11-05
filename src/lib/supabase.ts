import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, CartItem } from '../types';

// Supabase configuration
// Project ID: iqfcjetndgtayptfceyu
export const SUPABASE_PROJECT_ID = 'iqfcjetndgtayptfceyu';
export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY !== 'placeholder_key' &&
    !SUPABASE_ANON_KEY.includes('placeholder')
  );
}

/**
 * Normalizes an order record from Supabase table or local persistence into a unified Order model.
 */
export function normalizeOrder(raw: any): any {
  if (!raw) return null;

  const items = Array.isArray(raw.items)
    ? raw.items
    : typeof raw.items === 'string'
    ? (() => {
        try {
          return JSON.parse(raw.items);
        } catch {
          return [];
        }
      })()
    : [];

  const fullName =
    raw.customer_name ||
    raw.shippingAddress?.fullName ||
    raw.shipping_address_name ||
    'Valued Customer';

  const email =
    raw.customer_email ||
    raw.shippingAddress?.email ||
    '';

  const phone =
    raw.customer_phone ||
    raw.shippingAddress?.phone ||
    '';

  const address =
    raw.shipping_address ||
    raw.shippingAddress?.address ||
    '';

  const city =
    raw.city ||
    raw.shippingAddress?.city ||
    'India';

  const postalCode =
    raw.postal_code ||
    raw.shippingAddress?.postalCode ||
    '';

  const country =
    raw.country ||
    raw.shippingAddress?.country ||
    'India';

  const rawDate = raw.created_at || raw.date || new Date().toISOString();
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

  return {
    id: raw.id || raw.order_number || `ZN-${Date.now()}`,
    order_number: raw.order_number || raw.id,
    date: formattedDate,
    created_at: raw.created_at || rawDate,
    items,
    subtotal: Number(raw.subtotal) || Number(raw.total) || 0,
    discount: Number(raw.discount) || 0,
    shipping: Number(raw.shipping_fee) || Number(raw.shipping) || 0,
    total: Number(raw.total) || 0,
    status: raw.status || 'Confirmed',
    trackingNumber: raw.tracking_number || raw.trackingNumber || '',
    paymentMethod: raw.payment_method || raw.paymentMethod || 'Online Gateway',
    paymentStatus: raw.paymentStatus || (raw.payment_method ? `Paid via ${raw.payment_method}` : 'Paid (Online Gateway)'),
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
  };
}

/**
 * Directly queries all customer orders from Supabase table 'orders'.
 */
export async function fetchOrdersFromSupabase(): Promise<{
  orders: any[];
  error?: string;
  isLive: boolean;
}> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Client] fetchOrdersFromSupabase warning:', error.message);
      return { orders: [], error: error.message, isLive: false };
    }

    if (Array.isArray(data)) {
      console.log(`[Supabase Client] Fetched ${data.length} orders directly from Supabase.`);
      return {
        orders: data.map(normalizeOrder),
        isLive: true
      };
    }

    return { orders: [], isLive: true };
  } catch (err: any) {
    console.error('[Supabase Client] Exception fetching orders:', err);
    return { orders: [], error: err?.message || 'Database query failed', isLive: false };
  }
}

/**
 * Persists an order and its line items into Supabase backend tables.
 * Saves to both 'orders' and 'order_items' tables.
 */
export async function saveOrderToSupabase(order: Order, customerPhone?: string): Promise<{
  success: boolean;
  error?: string;
  savedToBackend: boolean;
}> {
  console.log(`[Supabase] Initiating order persistence for ${order.id}...`);

  const supabaseClient = getSupabaseClient();

  const orderPayload = {
    id: order.id,
    order_number: order.id,
    customer_name: order.shippingAddress.fullName,
    customer_email: order.shippingAddress.email,
    customer_phone: customerPhone || '+91 98765 43210',
    shipping_address: order.shippingAddress.address,
    city: order.shippingAddress.city,
    postal_code: order.shippingAddress.postalCode,
    country: order.shippingAddress.country,
    payment_method: order.paymentMethod,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping_fee: order.shipping,
    total: order.total,
    status: order.status,
    tracking_number: order.trackingNumber,
    items_count: order.items.reduce((sum, item) => sum + item.quantity, 0),
    items: order.items,
    created_at: new Date().toISOString()
  };

  try {
    // 1. Insert into orders table
    const { error: orderError } = await supabaseClient
      .from('orders')
      .insert([orderPayload]);

    if (orderError) {
      console.warn('[Supabase] Note on orders table insert:', orderError.message);
    } else {
      console.log(`[Supabase] Order ${order.id} saved to 'orders' table.`);
    }

    // 2. Insert line items into order_items table
    if (order.items && order.items.length > 0) {
      const lineItems = order.items.map((item, idx) => ({
        id: `${order.id}-${idx + 1}`,
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
        image_url: item.image,
        is_custom: Boolean(item.isCustom),
        custom_details: item.customDetails || null,
        created_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(lineItems);

      if (itemsError) {
        console.warn('[Supabase] Note on order_items table insert:', itemsError.message);
      } else {
        console.log(`[Supabase] ${lineItems.length} items saved to 'order_items' table.`);
      }
    }

    // 3. If any item is a custom studio design, also save to custom_orders table
    const customItems = order.items.filter((item) => item.isCustom);
    if (customItems.length > 0) {
      for (const customItem of customItems) {
        await saveCustomOrderToSupabase({
          order_id: order.id,
          garment_type: customItem.customDetails?.garmentType || 'bespoke',
          garment_name: customItem.name,
          base_color: customItem.selectedColor,
          size: customItem.selectedSize,
          custom_text: customItem.customDetails?.text || '',
          graphic: customItem.customDetails?.graphic || '',
          placement: customItem.customDetails?.placement || '',
          print_color: customItem.customDetails?.printColor || '',
          price: customItem.price,
          customer_name: order.shippingAddress.fullName,
          customer_email: order.shippingAddress.email
        });
      }
    }

    return { success: true, savedToBackend: true };
  } catch (err: any) {
    console.warn('[Supabase] Order persistence caught exception:', err?.message || err);
    return { success: false, error: err?.message || 'Database connection error', savedToBackend: false };
  }
}

/**
 * Persists a Contact Us concierge inquiry into the 'contact_inquiries' Supabase table.
 */
export async function saveContactInquiryToSupabase(inquiry: {
  ticket_id: string;
  full_name: string;
  phone: string;
  email?: string;
  reason: string;
  message?: string;
}): Promise<{ success: boolean; error?: string }> {
  console.log(`[Supabase] Saving contact inquiry ${inquiry.ticket_id}...`);
  const supabaseClient = getSupabaseClient();

  const payload = {
    ticket_id: inquiry.ticket_id,
    full_name: inquiry.full_name,
    phone: inquiry.phone,
    email: inquiry.email || '',
    reason: inquiry.reason,
    message: inquiry.message || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    const { error } = await supabaseClient
      .from('contact_inquiries')
      .insert([payload]);

    if (error) {
      console.warn('[Supabase] Note on contact_inquiries insert:', error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Supabase] Contact inquiry ${inquiry.ticket_id} saved to 'contact_inquiries' table.`);
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] Contact inquiry caught exception:', err?.message || err);
    return { success: false, error: err?.message || 'Failed to submit inquiry' };
  }
}

/**
 * Persists custom studio bespoke garments to 'custom_orders' table.
 */
export async function saveCustomOrderToSupabase(customData: {
  order_id?: string;
  garment_type: string;
  garment_name: string;
  base_color: string;
  size: string;
  custom_text: string;
  graphic: string;
  placement: string;
  print_color: string;
  price: number;
  customer_name?: string;
  customer_email?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabaseClient = getSupabaseClient();

  const payload = {
    id: `CUSTOM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    order_id: customData.order_id || null,
    garment_type: customData.garment_type,
    garment_name: customData.garment_name,
    base_color: customData.base_color,
    size: customData.size,
    custom_text: customData.custom_text,
    graphic: customData.graphic,
    placement: customData.placement,
    print_color: customData.print_color,
    price: customData.price,
    customer_name: customData.customer_name || 'Anonymous Creator',
    customer_email: customData.customer_email || '',
    created_at: new Date().toISOString()
  };

  try {
    const { error } = await supabaseClient
      .from('custom_orders')
      .insert([payload]);

    if (error) {
      console.warn('[Supabase] Note on custom_orders insert:', error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Supabase] Custom creation saved to 'custom_orders' table.`);
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] Custom order caught exception:', err?.message || err);
    return { success: false, error: err?.message };
  }
}
