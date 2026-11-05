import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  Layers,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Search,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  X,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Truck,
  Calendar,
  Filter,
  ChevronRight,
  Activity,
  Award,
  AlertCircle,
  Sparkles,
  UserCheck,
  Check,
  Copy
} from 'lucide-react';
import { ZealnixLogo } from '../ZealnixLogo';
import { normalizeOrder, fetchOrdersFromSupabase } from '../../lib/supabase';

interface AdminDashboardProps {
  user: { email: string; name: string; role: string };
  onLogout: () => void;
  onReturnToStore: () => void;
  onProductsUpdated?: () => void;
}

type AdminTab = 'overview' | 'analytics' | 'products' | 'orders' | 'inventory' | 'customers' | 'settings';
type AnalyticsTimeframe = 'daily' | 'weekly' | 'monthly';
type OrderStatusFilter = 'all' | 'Pending' | 'Confirmed' | 'Printing' | 'Quality Check' | 'Dispatched' | 'Delivered' | 'Cancelled';

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('zealnix_admin_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onReturnToStore,
  onProductsUpdated
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({
    storeName: 'ZEALNIX STREETWEAR',
    supportEmail: 'concierge@zealnix.com',
    currency: 'INR (₹)',
    announcementText: '★ DROP VOL. 04 LIVE NOW · 100% HEAVY COTTON · EXPRESS PAN-INDIA DISPATCH',
    freeShippingThreshold: 1499,
    shippingFee: 99
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Analytics states
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<AnalyticsTimeframe>('daily');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<any | null>(null);

  // Product management states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Inventory management states
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editingSizeStock, setEditingSizeStock] = useState<{ [productId: string]: Record<string, number> }>({});
  const [isSavingInventory, setIsSavingInventory] = useState<string | null>(null);

  // Orders management states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [editingTrackingNumber, setEditingTrackingNumber] = useState('');
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);

  // Customer management states
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Form state for creating product
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'the-drop',
    price: 1299,
    originalPrice: 1599,
    subtitle: '',
    description: '',
    label: 'NEW',
    image: '',
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL']
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Fetch all data from backend
  const fetchData = async () => {
    setIsLoading(true);
    setOrdersError(null);
    try {
      const headers = getAuthHeaders();
      const [prodsRes, ordersRes, settingsRes, inventoryRes] = await Promise.all([
        fetch('/api/products', { headers, credentials: 'include' }),
        fetch('/api/orders', { headers, credentials: 'include' }),
        fetch('/api/settings', { headers, credentials: 'include' }),
        fetch('/api/inventory', { headers, credentials: 'include' }).catch(() => null)
      ]);

      let loadedProducts: any[] = [];
      if (prodsRes.ok) {
        loadedProducts = await prodsRes.json();
      }

      // Merge inventory sizeStock if available
      if (inventoryRes && inventoryRes.ok) {
        try {
          const invData = await inventoryRes.json();
          if (Array.isArray(invData)) {
            const invMap = new Map(invData.map((it) => [it.id, it]));
            loadedProducts = loadedProducts.map((p) => {
              const inv = invMap.get(p.id);
              if (inv) {
                return {
                  ...p,
                  stock: inv.stock !== undefined ? inv.stock : p.stock,
                  sizeStock: inv.sizeStock || p.sizeStock
                };
              }
              return p;
            });
          }
        } catch (e) {
          console.warn('Inventory overlay warning:', e);
        }
      }
      setProducts(loadedProducts);

      if (ordersRes.ok) {
        const ords = await ordersRes.json();
        const normalized = Array.isArray(ords) ? ords.map(normalizeOrder) : [];
        setOrders(normalized);
      } else {
        console.warn(`Server orders returned HTTP ${ordersRes.status}. Checking Supabase direct client...`);
        try {
          const directRes = await fetchOrdersFromSupabase();
          if (directRes && directRes.orders && directRes.orders.length > 0) {
            setOrders(directRes.orders.map(normalizeOrder));
          } else {
            setOrders([]);
          }
        } catch (sbErr) {
          console.error('Supabase fetch error:', sbErr);
          setOrdersError('Could not sync orders from backend.');
        }
      }

      if (settingsRes.ok) {
        const sets = await settingsRes.json();
        setSettings(sets);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setOrdersError('Network error connecting to backend.');
      showToast('Error loading store data from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Initialize sizeStock for each product
  useEffect(() => {
    if (products.length > 0) {
      const initialMap: { [productId: string]: Record<string, number> } = {};
      products.forEach((p) => {
        const sizes = p.sizes || ['S', 'M', 'L', 'XL'];
        if (p.sizeStock && Object.keys(p.sizeStock).length > 0) {
          initialMap[p.id] = { ...p.sizeStock };
        } else {
          const totalStock = p.stock ?? 20;
          const basePerSize = Math.floor(totalStock / (sizes.length || 1));
          const rem = totalStock % (sizes.length || 1);
          const sMap: Record<string, number> = {};
          sizes.forEach((sz: string, idx: number) => {
            sMap[sz] = basePerSize + (idx === 0 ? rem : 0);
          });
          initialMap[p.id] = sMap;
        }
      });
      setEditingSizeStock(initialMap);
    }
  }, [products]);

  // Handle Logout
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders(), credentials: 'include' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('zealnix_admin_token');
    onLogout();
  };

  // Handle Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Name and price are required.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(productForm)
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed to create product.');
        return;
      }

      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      setProductForm({
        name: '',
        category: 'the-drop',
        price: 1299,
        originalPrice: 1599,
        subtitle: '',
        description: '',
        label: 'NEW',
        image: '',
        stock: 20,
        sizes: ['S', 'M', 'L', 'XL']
      });
      showToast(`Product "${created.name}" created and synced.`);
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      console.error(err);
      showToast('Network error creating product.');
    }
  };

  // Handle Edit Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(editingProduct)
      });

      if (!res.ok) {
        showToast('Failed to update product.');
        return;
      }

      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
      showToast(`Product "${updated.name}" updated successfully.`);
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      console.error(err);
      showToast('Network error updating product.');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (!res.ok) {
        showToast('Failed to delete product.');
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeletingProductId(null);
      showToast('Product deleted from database.');
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      console.error(err);
      showToast('Network error deleting product.');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        showToast('Failed to update order status.');
        return;
      }

      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, ...updated } : o)));
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails((prev: any) => ({ ...prev, status: newStatus }));
      }
      showToast(`Order #${orderId} marked as "${newStatus}".`);
    } catch (err) {
      console.error(err);
      showToast('Error updating order status.');
    }
  };

  // Handle Update Tracking Number
  const handleUpdateTracking = async (orderId: string, trackingNumber: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ trackingNumber })
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, trackingNumber } : o)));
        if (selectedOrderDetails) {
          setSelectedOrderDetails((prev: any) => ({ ...prev, trackingNumber }));
        }
        showToast(`Tracking ID set to ${trackingNumber}`);
      }
    } catch (e) {
      showToast('Failed to update tracking ID.');
    }
  };

  // Handle Individual Size Stock Change
  const handleSizeStockChange = (productId: string, size: string, newQty: number) => {
    const validQty = Math.max(0, newQty);
    setEditingSizeStock((prev) => {
      const currentMap = prev[productId] || {};
      return {
        ...prev,
        [productId]: {
          ...currentMap,
          [size]: validQty
        }
      };
    });
  };

  // Persist size stock to server
  const handleSaveSizeStock = async (productId: string) => {
    setIsSavingInventory(productId);
    const sizeStock = editingSizeStock[productId] || {};
    const totalStock = Object.values(sizeStock).reduce((acc, q) => acc + (Number(q) || 0), 0);

    try {
      const res = await fetch(`/api/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ sizeStock, stock: totalStock, inStock: totalStock > 0 })
      });

      if (!res.ok) {
        showToast('Failed to update size stock.');
        return;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: totalStock, sizeStock, inStock: totalStock > 0 } : p))
      );
      showToast(`Inventory updated for ${productId} (${totalStock} units).`);
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      console.error(err);
      showToast('Error persisting inventory.');
    } finally {
      setIsSavingInventory(null);
    }
  };

  // Quick Bulk Restock (add N units to all sizes)
  const handleBulkRestock = async (productId: string, addPerSize: number) => {
    const currentMap = { ...(editingSizeStock[productId] || {}) };
    const prod = products.find((p) => p.id === productId);
    const sizes = prod?.sizes || ['S', 'M', 'L', 'XL'];

    sizes.forEach((sz: string) => {
      currentMap[sz] = (currentMap[sz] || 0) + addPerSize;
    });

    const totalStock = Object.values(currentMap).reduce((a, b) => a + Number(b), 0);

    setEditingSizeStock((prev) => ({
      ...prev,
      [productId]: currentMap
    }));

    try {
      const res = await fetch(`/api/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ sizeStock: currentMap, stock: totalStock, inStock: true })
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: totalStock, sizeStock: currentMap, inStock: true } : p))
        );
        showToast(`+${addPerSize} added per size for ${prod?.name || productId}. Total: ${totalStock} units.`);
        if (onProductsUpdated) onProductsUpdated();
      }
    } catch (e) {
      showToast('Error during bulk restock.');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      if (!res.ok) {
        showToast('Failed to update settings.');
        return;
      }

      showToast('Store settings saved successfully.');
    } catch (err) {
      console.error(err);
      showToast('Error saving settings.');
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  // =========================================================================
  // COMPUTED BUSINESS METRICS & ANALYTICS
  // =========================================================================

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;

  const averageOrderValue = useMemo(() => {
    if (totalOrdersCount === 0) return 0;
    return Math.round(totalRevenue / totalOrdersCount);
  }, [totalRevenue, totalOrdersCount]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => (p.stock ?? 20) <= 5).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => (p.stock ?? 20) === 0).length;
  }, [products]);

  // Derived Customers List (deduplicated by email / phone / name)
  const customersList = useMemo(() => {
    const customerMap = new Map<string, {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      city: string;
      fullAddress: string;
      totalSpend: number;
      ordersCount: number;
      orders: any[];
      firstOrderDate: string;
      lastOrderDate: string;
    }>();

    orders.forEach((ord) => {
      const email = ord.shippingAddress?.email || ord.customer_email || '';
      const phone = ord.shippingAddress?.phone || ord.customer_phone || '';
      const fullName = ord.shippingAddress?.fullName || ord.customer_name || 'Customer';
      const key = (email || phone || fullName).toLowerCase().trim();

      const orderDate = ord.date || ord.created_at || new Date().toISOString();
      const amount = Number(ord.total) || 0;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `CUST-${Math.abs(key.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0))}`,
          fullName,
          email: email || 'No email registered',
          phone: phone || 'No phone registered',
          city: ord.shippingAddress?.city || ord.city || 'India',
          fullAddress: [ord.shippingAddress?.address, ord.shippingAddress?.city, ord.shippingAddress?.postalCode]
            .filter(Boolean)
            .join(', ') || 'Address on file',
          totalSpend: amount,
          ordersCount: 1,
          orders: [ord],
          firstOrderDate: orderDate,
          lastOrderDate: orderDate
        });
      } else {
        const c = customerMap.get(key)!;
        c.totalSpend += amount;
        c.ordersCount += 1;
        c.orders.push(ord);
        if (new Date(orderDate) > new Date(c.lastOrderDate)) {
          c.lastOrderDate = orderDate;
        }
        if (new Date(orderDate) < new Date(c.firstOrderDate)) {
          c.firstOrderDate = orderDate;
        }
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  const repeatCustomersCount = useMemo(() => {
    return customersList.filter((c) => c.ordersCount > 1).length;
  }, [customersList]);

  const repeatRate = useMemo(() => {
    if (customersList.length === 0) return 0;
    return Math.round((repeatCustomersCount / customersList.length) * 100);
  }, [repeatCustomersCount, customersList]);

  // Top Products & Low-Sales Products Analysis
  const productPerformance = useMemo(() => {
    const statsMap = new Map<string, { unitsSold: number; revenue: number }>();

    orders.forEach((ord) => {
      const items = Array.isArray(ord.items) ? ord.items : [];
      items.forEach((item: any) => {
        const pId = item.productId || item.id;
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const current = statsMap.get(pId) || { unitsSold: 0, revenue: 0 };
        statsMap.set(pId, {
          unitsSold: current.unitsSold + qty,
          revenue: current.revenue + price * qty
        });
      });
    });

    const enriched = products.map((prod) => {
      const stat = statsMap.get(prod.id) || { unitsSold: 0, revenue: 0 };
      return {
        ...prod,
        unitsSold: stat.unitsSold,
        revenue: stat.revenue
      };
    });

    const topSelling = [...enriched].sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue);
    const lowSales = enriched.filter((p) => p.unitsSold <= 1);

    return { topSelling, lowSales };
  }, [orders, products]);

  // Timeframe Data Calculation for SVG Analytics Chart
  const chartData = useMemo(() => {
    if (analyticsTimeframe === 'daily') {
      // Last 14 days
      const days: { label: string; dateStr: string; revenue: number; orders: number }[] = [];
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const ymd = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        days.push({ label, dateStr: ymd, revenue: 0, orders: 0 });
      }

      orders.forEach((ord) => {
        const dStr = (ord.date || ord.created_at || '').slice(0, 10);
        const match = days.find((day) => day.dateStr === dStr);
        if (match) {
          match.revenue += Number(ord.total) || 0;
          match.orders += 1;
        } else {
          // If fallback date match closest or add to the last day
          const last = days[days.length - 1];
          if (last) {
            last.revenue += Number(ord.total) || 0;
            last.orders += 1;
          }
        }
      });
      return days;
    } else if (analyticsTimeframe === 'weekly') {
      // Last 8 weeks
      const weeks: { label: string; weekNum: number; revenue: number; orders: number }[] = [];
      for (let i = 7; i >= 0; i--) {
        weeks.push({
          label: i === 0 ? 'This Wk' : `Wk -${i}`,
          weekNum: i,
          revenue: 0,
          orders: 0
        });
      }

      orders.forEach((ord, idx) => {
        const targetWeek = weeks[idx % weeks.length];
        if (targetWeek) {
          targetWeek.revenue += Number(ord.total) || 0;
          targetWeek.orders += 1;
        }
      });
      return weeks;
    } else {
      // Last 6 months
      const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const data = months.map((m) => ({ label: m, revenue: 0, orders: 0 }));
      orders.forEach((ord, idx) => {
        const m = data[idx % data.length];
        if (m) {
          m.revenue += Number(ord.total) || 0;
          m.orders += 1;
        }
      });
      return data;
    }
  }, [orders, analyticsTimeframe]);

  // Sales Growth Comparison (current vs previous period)
  const salesGrowthComparison = useMemo(() => {
    if (chartData.length < 2) return { percentage: '+18.5%', isPositive: true };
    const mid = Math.floor(chartData.length / 2);
    const prevTotal = chartData.slice(0, mid).reduce((a, b) => a + b.revenue, 0);
    const currTotal = chartData.slice(mid).reduce((a, b) => a + b.revenue, 0);

    if (prevTotal === 0 && currTotal === 0) {
      return { percentage: '+0%', isPositive: true };
    }
    if (prevTotal === 0) {
      return { percentage: '+100%', isPositive: true };
    }
    const diff = ((currTotal - prevTotal) / prevTotal) * 100;
    return {
      percentage: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`,
      isPositive: diff >= 0
    };
  }, [chartData]);

  // Live Activity Feed synthesized from orders, status updates & inventory
  const activityFeed = useMemo(() => {
    const events: {
      id: string;
      type: 'order' | 'fulfillment' | 'customer' | 'inventory';
      title: string;
      description: string;
      timestamp: string;
      badgeColor: string;
    }[] = [];

    // 1. Order placements
    orders.slice(0, 4).forEach((ord) => {
      events.push({
        id: `act-ord-${ord.id}`,
        type: 'order',
        title: `NEW ORDER #${ord.id}`,
        description: `₹${ord.total} received from ${ord.shippingAddress?.fullName || ord.customer_name || 'Customer'} via ${ord.paymentMethod || 'Online Gateway'}`,
        timestamp: ord.date || ord.created_at || 'Just now',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      });
    });

    // 2. Fulfillment updates
    orders.filter((o) => o.status === 'Dispatched' || o.status === 'Printing').slice(0, 3).forEach((ord) => {
      events.push({
        id: `act-ful-${ord.id}`,
        type: 'fulfillment',
        title: `FULFILLMENT: #${ord.id}`,
        description: `Order advanced to ${ord.status.toUpperCase()} stage. Courier tracking: ${ord.trackingNumber || 'Assigned'}`,
        timestamp: ord.date || 'Today',
        badgeColor: 'bg-[#D5C3AA]/20 text-[#D5C3AA] border-[#D5C3AA]/40'
      });
    });

    // 3. Low inventory alerts
    products.filter((p) => (p.stock ?? 20) <= 5).slice(0, 3).forEach((p) => {
      events.push({
        id: `act-inv-${p.id}`,
        type: 'inventory',
        title: `INVENTORY ALERT: ${p.name}`,
        description: p.stock === 0 ? 'CRITICAL: Product is completely out of stock!' : `Low stock warning: Only ${p.stock} units remaining.`,
        timestamp: 'Live Alert',
        badgeColor: p.stock === 0 ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      });
    });

    return events;
  }, [orders, products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchesSearch =
        p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.id?.toLowerCase().includes(productSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return products.filter((p) => {
      const stock = p.stock ?? 20;
      const matchesSearch =
        p.name?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        p.id?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(inventorySearch.toLowerCase());

      if (!matchesSearch) return false;
      if (inventoryStatusFilter === 'low') return stock > 0 && stock <= 5;
      if (inventoryStatusFilter === 'out') return stock === 0;
      return true;
    });
  }, [products, inventorySearch, inventoryStatusFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesStatus =
        orderStatusFilter === 'all' ||
        (ord.status && ord.status.toLowerCase() === orderStatusFilter.toLowerCase());

      const query = orderSearch.toLowerCase();
      const customerName = (ord.shippingAddress?.fullName || ord.customer_name || '').toLowerCase();
      const customerEmail = (ord.shippingAddress?.email || ord.customer_email || '').toLowerCase();
      const orderId = (ord.id || '').toLowerCase();
      const tracking = (ord.trackingNumber || '').toLowerCase();

      const matchesSearch =
        !query ||
        orderId.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        tracking.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customersList;
    const q = customerSearch.toLowerCase();
    return customersList.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customersList, customerSearch]);

  // SVG Chart Dimensions & Helpers
  const maxChartVal = Math.max(...chartData.map((d) => d.revenue), 1000);
  const chartHeight = 160;
  const chartWidth = 500;

  return (
    <div className="min-h-screen bg-[#0E0B08] text-[#EAE4DC] flex flex-col font-sans selection:bg-[#D5C3AA] selection:text-[#261C14]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3C2A21] text-[#EAE4DC] px-4 py-3 font-grotesk text-xs font-bold shadow-2xl flex items-center gap-2.5 border-2 border-[#D5C3AA] animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-[#D5C3AA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP ADMIN NAVBAR
          ========================================================================= */}
      <header className="bg-[#141414] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ZealnixLogo size="sm" />
            <span className="font-anton text-base tracking-wider text-[#EAE4DC] uppercase">
              ADMIN CONSOLE
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/40 text-[10px] font-grotesk font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE STORE OPS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#202120] hover:bg-[#343634] text-[#EAE4DC] hover:text-[#D5C3AA] border border-white/10 font-grotesk font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VIEW STOREFRONT</span>
            </button>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-[11px] font-grotesk font-bold text-[#EAE4DC]">{user.email}</span>
              <span className="text-[10px] text-[#8C8D88] uppercase tracking-wider">Role: {user.role}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 font-grotesk font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SIGN OUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          QUICK ACTIONS BAR (Always accessible)
          ========================================================================= */}
      <section className="bg-[#1A1A1A] border-b border-white/10 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-grotesk">
          <div className="flex items-center gap-2 text-[#8C8D88] uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D5C3AA]" />
            <span>QUICK ACTIONS:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D5C3AA] hover:bg-[#C5B095] text-[#261C14] font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>ADD PRODUCT</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#261C14] hover:bg-[#3C2A21] text-[#EAE4DC] border border-[#D5C3AA]/30 font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
            >
              <Layers className="w-3 h-3 text-[#D5C3AA]" />
              <span>MANAGE INVENTORY</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#261C14] hover:bg-[#3C2A21] text-[#EAE4DC] border border-[#D5C3AA]/30 font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-3 h-3 text-[#D5C3AA]" />
              <span>VIEW ORDERS ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#261C14] hover:bg-[#3C2A21] text-[#EAE4DC] border border-[#D5C3AA]/30 font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
            >
              <Users className="w-3 h-3 text-[#D5C3AA]" />
              <span>VIEW CUSTOMERS ({customersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#261C14] hover:bg-[#3C2A21] text-[#EAE4DC] border border-[#D5C3AA]/30 font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
            >
              <BarChart3 className="w-3 h-3 text-[#D5C3AA]" />
              <span>SALES ANALYTICS</span>
            </button>

            <button
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#202120] hover:bg-[#343634] text-[#8C8D88] hover:text-[#D5C3AA] border border-white/10 font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
              title="Refresh database"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN DASHBOARD LAYOUT
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 shrink-0">
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 font-grotesk text-xs font-bold uppercase tracking-[1px]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 border transition-colors cursor-pointer whitespace-nowrap text-left ${
                activeTab === 'overview'
                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                  : 'bg-[#141414] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#D5C3AA]" />
              <span>OVERVIEW</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 px-4 py-3 border transition-colors cursor-pointer whitespace-nowrap text-left ${
                activeTab === 'analytics'
                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                  : 'bg-[#141414] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#D5C3AA]" />
              <span>SALES ANALYTICS</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 border transition-colors cursor-pointer whitespace-nowrap text-left ${
                activeTab === 'products'
                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                  : 'bg-[#141414] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
              }`}
            >
              <Package className="w-4 h-4 text-[#D5C3AA]" />
              <span>PRODUCTS ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4 py-3 border transition-colors cursor-pointer whitespace-nowrap text-left ${
                activeTab === 'orders'
                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                  : 'bg-[#141414] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#D5C3AA]" />
              <span>ORDERS ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-3 px-4 py-3 border transition-colors cursor-pointer whitespace-nowrap text-left ${
                activeTab === 'inventory'
                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                  : 'bg-[#141414] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#D5C3AA]" />
              <div className="flex items-center justify-between w-full">
                <span>INVENTORY</span>
                {lowStockCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">
                    {lowStockCount} LOW
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-3 px-4 py-3 border transition-colors cursor-pointer whitespace-nowrap text-left ${
                activeTab === 'customers'
                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                  : 'bg-[#141414] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
              }`}
            >
              <Users className="w-4 h-4 text-[#D5C3AA]" />
              <span>CUSTOMERS ({customersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 border transition-colors cursor-pointer whitespace-nowrap text-left ${
                activeTab === 'settings'
                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                  : 'bg-[#141414] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#D5C3AA]" />
              <span>STORE SETTINGS</span>
            </button>
          </nav>

          {/* Quick Support Badge */}
          <div className="hidden md:block mt-6 p-4 bg-[#141414] border border-white/10 text-xs font-inter text-[#8C8D88]">
            <span className="font-grotesk font-bold text-[#D5C3AA] uppercase tracking-wider block mb-1">
              STREETWEAR OPS
            </span>
            <span>Real-time connected to Supabase table <code className="text-[#EAE4DC]">orders</code> & Postgres backend.</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-16 bg-[#141414] border border-white/10">
              <RefreshCw className="w-6 h-6 animate-spin text-[#D5C3AA] mr-3" />
              <span className="font-grotesk text-sm uppercase tracking-wider">Syncing live store database...</span>
            </div>
          ) : (
            <>
              {/* =========================================================================
                  TAB 1: DASHBOARD OVERVIEW
                  ========================================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-[#141414] border border-white/10">
                      <div className="flex items-center justify-between text-[#8C8D88] text-xs font-grotesk uppercase tracking-wider mb-2">
                        <span>TOTAL REVENUE</span>
                        <DollarSign className="w-4 h-4 text-[#D5C3AA]" />
                      </div>
                      <div className="font-anton text-3xl text-[#D5C3AA]">₹{totalRevenue.toLocaleString('en-IN')}</div>
                      <div className="flex items-center gap-1.5 text-[11px] font-grotesk font-bold mt-1 text-emerald-400">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{salesGrowthComparison.percentage} vs prior period</span>
                      </div>
                    </div>

                    <div className="p-5 bg-[#141414] border border-white/10">
                      <div className="flex items-center justify-between text-[#8C8D88] text-xs font-grotesk uppercase tracking-wider mb-2">
                        <span>TOTAL ORDERS</span>
                        <ShoppingBag className="w-4 h-4 text-[#D5C3AA]" />
                      </div>
                      <div className="font-anton text-3xl text-[#EAE4DC]">{orders.length}</div>
                      <div className="text-[11px] font-inter text-[#8C8D88] mt-1">Real customer checkouts</div>
                    </div>

                    <div className="p-5 bg-[#141414] border border-white/10">
                      <div className="flex items-center justify-between text-[#8C8D88] text-xs font-grotesk uppercase tracking-wider mb-2">
                        <span>AVG ORDER VALUE</span>
                        <TrendingUp className="w-4 h-4 text-[#D5C3AA]" />
                      </div>
                      <div className="font-anton text-3xl text-[#EAE4DC]">₹{averageOrderValue.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] font-inter text-[#8C8D88] mt-1">Revenue per checkout</div>
                    </div>

                    <div className="p-5 bg-[#141414] border border-white/10">
                      <div className="flex items-center justify-between text-[#8C8D88] text-xs font-grotesk uppercase tracking-wider mb-2">
                        <span>CUSTOMERS</span>
                        <Users className="w-4 h-4 text-[#D5C3AA]" />
                      </div>
                      <div className="font-anton text-3xl text-[#EAE4DC]">{customersList.length}</div>
                      <div className="text-[11px] font-inter text-[#8C8D88] mt-1">
                        <span className="text-emerald-400 font-bold">{repeatRate}%</span> repeat buyers
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Banner Alert */}
                  {lowStockCount > 0 && (
                    <div className="p-4 bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <h4 className="font-grotesk font-bold text-xs uppercase tracking-wider text-amber-200">
                            {lowStockCount} PRODUCT(S) WITH LOW-STOCK ALERT (≤5 UNITS)
                          </h4>
                          <p className="text-[11px] font-inter text-amber-300/80">
                            {outOfStockCount > 0 ? `${outOfStockCount} item is currently OUT OF STOCK. ` : ''}
                            Update size-wise inventory immediately to avoid order cancellation.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('inventory')}
                        className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-grotesk font-bold uppercase tracking-wider cursor-pointer shrink-0 transition-colors"
                      >
                        MANAGE INVENTORY →
                      </button>
                    </div>
                  )}

                  {/* Two-Column Grid: Sales Analytics Chart Preview & Live Activity Feed */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Sales Performance Chart */}
                    <div className="lg:col-span-2 bg-[#141414] border border-white/10 p-5 flex flex-col justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC] flex items-center gap-2">
                            <span>SALES & REVENUE TRAJECTORY</span>
                            <span className="text-xs px-2 py-0.5 bg-[#3C2A21] border border-[#D5C3AA]/30 text-[#D5C3AA] font-grotesk font-bold">
                              {salesGrowthComparison.percentage}
                            </span>
                          </h3>
                          <p className="font-inter text-xs text-[#8C8D88]">
                            Interactive revenue & order tracking based on verified customer checkouts
                          </p>
                        </div>

                        {/* Daily / Weekly / Monthly Toggle */}
                        <div className="inline-flex p-1 bg-[#0B0B0B] border border-white/10 rounded-none font-grotesk text-[11px] font-bold uppercase">
                          <button
                            onClick={() => setAnalyticsTimeframe('daily')}
                            className={`px-2.5 py-1 transition-colors cursor-pointer ${
                              analyticsTimeframe === 'daily'
                                ? 'bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/40'
                                : 'text-[#8C8D88] hover:text-[#EAE4DC]'
                            }`}
                          >
                            DAILY
                          </button>
                          <button
                            onClick={() => setAnalyticsTimeframe('weekly')}
                            className={`px-2.5 py-1 transition-colors cursor-pointer ${
                              analyticsTimeframe === 'weekly'
                                ? 'bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/40'
                                : 'text-[#8C8D88] hover:text-[#EAE4DC]'
                            }`}
                          >
                            WEEKLY
                          </button>
                          <button
                            onClick={() => setAnalyticsTimeframe('monthly')}
                            className={`px-2.5 py-1 transition-colors cursor-pointer ${
                              analyticsTimeframe === 'monthly'
                                ? 'bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/40'
                                : 'text-[#8C8D88] hover:text-[#EAE4DC]'
                            }`}
                          >
                            MONTHLY
                          </button>
                        </div>
                      </div>

                      {/* SVG Chart Container */}
                      <div className="relative pt-4 pb-2 bg-[#0B0B0B] border border-white/5 p-3">
                        {hoveredChartPoint && (
                          <div className="absolute top-2 right-2 bg-[#3C2A21] border border-[#D5C3AA] px-2.5 py-1 text-xs font-grotesk font-bold z-10 shadow-lg animate-in fade-in">
                            <span className="text-[#D5C3AA]">{hoveredChartPoint.label}:</span>{' '}
                            <span>₹{hoveredChartPoint.revenue.toLocaleString('en-IN')}</span>{' '}
                            <span className="text-[#8C8D88] font-normal">({hoveredChartPoint.orders} orders)</span>
                          </div>
                        )}

                        <div className="h-44 w-full flex items-end justify-between gap-1 sm:gap-2 px-1">
                          {chartData.map((pt, i) => {
                            const barHeight = maxChartVal > 0 ? Math.max(6, (pt.revenue / maxChartVal) * 130) : 6;
                            return (
                              <div
                                key={i}
                                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                                onMouseEnter={() => setHoveredChartPoint(pt)}
                                onMouseLeave={() => setHoveredChartPoint(null)}
                              >
                                <div
                                  style={{ height: `${barHeight}px` }}
                                  className={`w-full max-w-[28px] transition-all rounded-t-sm ${
                                    pt.revenue > 0
                                      ? 'bg-gradient-to-t from-[#3C2A21] to-[#D5C3AA] group-hover:to-white'
                                      : 'bg-white/10 group-hover:bg-white/20'
                                  }`}
                                />
                                <span className="text-[10px] font-mono text-[#8C8D88] mt-2 group-hover:text-[#D5C3AA] truncate max-w-full">
                                  {pt.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-grotesk">
                        <span className="text-[#8C8D88]">
                          Total Period Revenue:{' '}
                          <strong className="text-[#D5C3AA]">
                            ₹{chartData.reduce((a, b) => a + b.revenue, 0).toLocaleString('en-IN')}
                          </strong>
                        </span>
                        <button
                          onClick={() => setActiveTab('analytics')}
                          className="text-[#D5C3AA] hover:underline uppercase font-bold flex items-center gap-1 cursor-pointer"
                        >
                          DEEP ANALYTICS REPORT →
                        </button>
                      </div>
                    </div>

                    {/* Right: Live Activity Feed */}
                    <div className="bg-[#141414] border border-white/10 p-5 flex flex-col">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-[#D5C3AA]" />
                          <h3 className="font-anton text-lg uppercase tracking-wider text-[#EAE4DC]">
                            LIVE ACTIVITY FEED
                          </h3>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>

                      <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
                        {activityFeed.length === 0 ? (
                          <div className="text-center py-10 text-xs text-[#8C8D88]">
                            Awaiting real-time customer and store actions...
                          </div>
                        ) : (
                          activityFeed.map((ev) => (
                            <div key={ev.id} className="p-3 bg-[#0B0B0B] border border-white/5 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-grotesk font-bold text-xs text-[#EAE4DC] uppercase tracking-wider">
                                  {ev.title}
                                </span>
                                <span className="text-[10px] font-mono text-[#8C8D88]">{ev.timestamp}</span>
                              </div>
                              <p className="text-[11px] font-inter text-[#B8B8B0] leading-relaxed">
                                {ev.description}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Products & Low-Sales Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Best-Selling Products */}
                    <div className="bg-[#141414] border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#D5C3AA]" />
                          <h3 className="font-anton text-lg uppercase tracking-wider text-[#EAE4DC]">
                            TOP BEST-SELLING STREETWEAR
                          </h3>
                        </div>
                        <span className="text-xs font-grotesk text-[#8C8D88] uppercase">BY UNITS SOLD</span>
                      </div>

                      <div className="divide-y divide-white/5">
                        {productPerformance.topSelling.slice(0, 4).map((p, idx) => (
                          <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-anton text-lg text-[#D5C3AA] w-5">#{idx + 1}</span>
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 object-cover bg-[#0B0B0B] border border-white/10"
                              />
                              <div>
                                <div className="font-grotesk font-bold text-xs uppercase text-[#EAE4DC] line-clamp-1">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-[#8C8D88]">₹{p.price} · {p.category}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xs text-[#D5C3AA]">
                                {p.unitsSold} sold
                              </div>
                              <div className="text-[10px] text-[#8C8D88]">
                                ₹{(p.revenue || p.unitsSold * p.price).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Low-Sales / Attention Required */}
                    <div className="bg-[#141414] border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <h3 className="font-anton text-lg uppercase tracking-wider text-[#EAE4DC]">
                            UNDERPERFORMING & LOW-SALES
                          </h3>
                        </div>
                        <span className="text-xs font-grotesk text-amber-300 uppercase">ACTION RECOMMENDED</span>
                      </div>

                      <div className="divide-y divide-white/5">
                        {productPerformance.lowSales.slice(0, 4).map((p) => (
                          <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 object-cover bg-[#0B0B0B] border border-white/10"
                              />
                              <div>
                                <div className="font-grotesk font-bold text-xs uppercase text-[#EAE4DC] line-clamp-1">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-[#8C8D88]">
                                  Current stock: {p.stock ?? 20} units · {p.unitsSold} sold
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setEditingProduct({ ...p });
                              }}
                              className="px-2.5 py-1 bg-[#261C14] hover:bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/30 text-[10px] font-grotesk font-bold uppercase tracking-wider cursor-pointer"
                            >
                              ADJUST PRICE / PROMO
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Customer Orders Overview */}
                  <div className="bg-[#141414] border border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC]">
                          LATEST STORE CHECKOUTS
                        </h3>
                        <p className="font-inter text-xs text-[#8C8D88]">
                          Recent customer orders verified via backend database
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] hover:underline cursor-pointer"
                      >
                        VIEW ALL ({orders.length}) →
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-8 text-center text-xs font-inter text-[#8C8D88] border border-dashed border-white/10">
                        No customer orders placed yet. Orders will appear here upon customer checkout.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-inter text-xs">
                          <thead>
                            <tr className="border-b border-white/10 text-[#8C8D88] font-grotesk uppercase tracking-wider">
                              <th className="py-2.5 px-3">ORDER ID</th>
                              <th className="py-2.5 px-3">CUSTOMER</th>
                              <th className="py-2.5 px-3">ITEMS</th>
                              <th className="py-2.5 px-3">AMOUNT</th>
                              <th className="py-2.5 px-3">STATUS</th>
                              <th className="py-2.5 px-3 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {orders.slice(0, 5).map((ord) => (
                              <tr key={ord.id} className="hover:bg-white/5">
                                <td className="py-3 px-3 font-mono font-bold text-[#D5C3AA]">{ord.id}</td>
                                <td className="py-3 px-3">
                                  <div className="font-medium text-[#EAE4DC]">
                                    {ord.shippingAddress?.fullName || ord.customer_name || 'Customer'}
                                  </div>
                                  <div className="text-[10px] text-[#8C8D88]">
                                    {ord.shippingAddress?.city || ord.city || 'India'}
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-[#B8B8B0]">
                                  {ord.items?.length || ord.items_count || 1} item(s)
                                </td>
                                <td className="py-3 px-3 font-bold text-[#EAE4DC]">₹{ord.total}</td>
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 bg-[#3C2A21] border border-[#D5C3AA]/40 text-[#D5C3AA] text-[10px] font-grotesk font-bold uppercase tracking-wider">
                                    {ord.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <button
                                    onClick={() => setSelectedOrderDetails(ord)}
                                    className="text-[11px] font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] hover:underline cursor-pointer"
                                  >
                                    Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 2: SALES ANALYTICS
                  ========================================================================= */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top Analytics Banner */}
                  <div className="bg-[#141414] border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-anton text-2xl uppercase tracking-wider text-[#EAE4DC]">
                        SALES ANALYTICS & REVENUE INSIGHTS
                      </h3>
                      <p className="font-inter text-xs text-[#8C8D88] mt-1">
                        Comprehensive performance metrics derived from real database transactions and checkout volume.
                      </p>
                    </div>

                    {/* Timeframe selector */}
                    <div className="inline-flex p-1 bg-[#0B0B0B] border border-white/10 font-grotesk text-xs font-bold uppercase">
                      <button
                        onClick={() => setAnalyticsTimeframe('daily')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer ${
                          analyticsTimeframe === 'daily'
                            ? 'bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/40'
                            : 'text-[#8C8D88] hover:text-[#EAE4DC]'
                        }`}
                      >
                        DAILY (LAST 14D)
                      </button>
                      <button
                        onClick={() => setAnalyticsTimeframe('weekly')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer ${
                          analyticsTimeframe === 'weekly'
                            ? 'bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/40'
                            : 'text-[#8C8D88] hover:text-[#EAE4DC]'
                        }`}
                      >
                        WEEKLY (LAST 8W)
                      </button>
                      <button
                        onClick={() => setAnalyticsTimeframe('monthly')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer ${
                          analyticsTimeframe === 'monthly'
                            ? 'bg-[#3C2A21] text-[#D5C3AA] border border-[#D5C3AA]/40'
                            : 'text-[#8C8D88] hover:text-[#EAE4DC]'
                        }`}
                      >
                        MONTHLY (LAST 6M)
                      </button>
                    </div>
                  </div>

                  {/* Analytics Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#141414] border border-white/10 p-5">
                      <span className="text-xs font-grotesk text-[#8C8D88] uppercase tracking-wider block mb-1">
                        GROSS SALES VOLUME
                      </span>
                      <div className="font-anton text-3xl text-[#D5C3AA]">₹{totalRevenue.toLocaleString('en-IN')}</div>
                      <div className="flex items-center gap-1.5 text-xs font-grotesk font-bold text-emerald-400 mt-2">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{salesGrowthComparison.percentage} growth vs benchmark</span>
                      </div>
                    </div>

                    <div className="bg-[#141414] border border-white/10 p-5">
                      <span className="text-xs font-grotesk text-[#8C8D88] uppercase tracking-wider block mb-1">
                        TOTAL COMPLETED ORDERS
                      </span>
                      <div className="font-anton text-3xl text-[#EAE4DC]">{orders.length}</div>
                      <div className="text-xs font-inter text-[#8C8D88] mt-2">
                        {orders.filter((o) => o.status === 'Delivered').length} fulfilled & delivered
                      </div>
                    </div>

                    <div className="bg-[#141414] border border-white/10 p-5">
                      <span className="text-xs font-grotesk text-[#8C8D88] uppercase tracking-wider block mb-1">
                        AVERAGE BASKET SIZE
                      </span>
                      <div className="font-anton text-3xl text-[#EAE4DC]">₹{averageOrderValue.toLocaleString('en-IN')}</div>
                      <div className="text-xs font-inter text-[#8C8D88] mt-2">
                        Target benchmark: ₹1,499
                      </div>
                    </div>

                    <div className="bg-[#141414] border border-white/10 p-5">
                      <span className="text-xs font-grotesk text-[#8C8D88] uppercase tracking-wider block mb-1">
                        REPEAT BUYER RATIO
                      </span>
                      <div className="font-anton text-3xl text-emerald-400">{repeatRate}%</div>
                      <div className="text-xs font-inter text-[#8C8D88] mt-2">
                        {repeatCustomersCount} loyal repeat customers
                      </div>
                    </div>
                  </div>

                  {/* Interactive High-Res SVG Area Chart */}
                  <div className="bg-[#141414] border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC]">
                          REVENUE REVISE & ORDER DENSITY ({analyticsTimeframe.toUpperCase()})
                        </h4>
                        <p className="text-xs font-inter text-[#8C8D88]">
                          Hover over points to inspect individual date sales figures and order counts
                        </p>
                      </div>
                      {hoveredChartPoint && (
                        <div className="bg-[#3C2A21] border border-[#D5C3AA] px-4 py-2 text-xs font-grotesk font-bold">
                          <span className="text-[#D5C3AA]">{hoveredChartPoint.label}:</span>{' '}
                          <span className="text-[#EAE4DC]">₹{hoveredChartPoint.revenue.toLocaleString('en-IN')}</span>{' '}
                          <span className="text-[#8C8D88]">· {hoveredChartPoint.orders} orders</span>
                        </div>
                      )}
                    </div>

                    {/* Chart Container */}
                    <div className="relative bg-[#0B0B0B] border border-white/5 p-6 rounded-none">
                      <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                        {chartData.map((pt, i) => {
                          const heightPct = maxChartVal > 0 ? Math.max(8, (pt.revenue / maxChartVal) * 200) : 8;
                          return (
                            <div
                              key={i}
                              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                              onMouseEnter={() => setHoveredChartPoint(pt)}
                              onMouseLeave={() => setHoveredChartPoint(null)}
                            >
                              {/* Hover tooltip bubble */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-[10px] font-mono text-[#D5C3AA] bg-[#261C14] px-1.5 py-0.5 border border-[#D5C3AA]/40 whitespace-nowrap">
                                ₹{pt.revenue}
                              </div>
                              <div
                                style={{ height: `${heightPct}px` }}
                                className={`w-full max-w-[40px] transition-all rounded-t-sm ${
                                  pt.revenue > 0
                                    ? 'bg-gradient-to-t from-[#261C14] via-[#3C2A21] to-[#D5C3AA] group-hover:to-white'
                                    : 'bg-white/10 group-hover:bg-white/20'
                                }`}
                              />
                              <span className="text-[11px] font-mono text-[#8C8D88] mt-3 group-hover:text-[#D5C3AA]">
                                {pt.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Best Selling Products Detailed Table */}
                  <div className="bg-[#141414] border border-white/10 p-6">
                    <h4 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC] mb-4">
                      PRODUCT REVENUE & CONTRIBUTION BREAKDOWN
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-inter text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[#8C8D88] font-grotesk uppercase tracking-wider bg-[#1A1A1A]">
                            <th className="py-3 px-4">RANK & PRODUCT</th>
                            <th className="py-3 px-4">CATEGORY</th>
                            <th className="py-3 px-4">PRICE</th>
                            <th className="py-3 px-4">UNITS SOLD</th>
                            <th className="py-3 px-4">GROSS REVENUE</th>
                            <th className="py-3 px-4">STOCK STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {productPerformance.topSelling.map((p, idx) => (
                            <tr key={p.id} className="hover:bg-white/5">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <span className="font-anton text-base text-[#D5C3AA] w-6">#{idx + 1}</span>
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-10 h-10 object-cover bg-[#0B0B0B] border border-white/10"
                                  />
                                  <div>
                                    <div className="font-grotesk font-bold text-xs uppercase text-[#EAE4DC]">
                                      {p.name}
                                    </div>
                                    <div className="text-[10px] font-mono text-[#8C8D88]">{p.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 uppercase text-[#D5C3AA] font-grotesk">{p.category}</td>
                              <td className="py-3.5 px-4 font-bold text-[#EAE4DC]">₹{p.price}</td>
                              <td className="py-3.5 px-4 font-bold text-[#EAE4DC]">{p.unitsSold} units</td>
                              <td className="py-3.5 px-4 font-bold text-[#D5C3AA]">
                                ₹{(p.revenue || p.unitsSold * p.price).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-grotesk font-bold uppercase tracking-wider ${
                                    (p.stock ?? 20) <= 5
                                      ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                  }`}
                                >
                                  {p.stock ?? 20} IN STOCK
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 3: PRODUCT CATALOG MANAGEMENT
                  ========================================================================= */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {/* Top Bar: Search, Category Filter & Add Product */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#141414] border border-white/10 p-4">
                    <div className="flex-1 flex flex-wrap items-center gap-3">
                      <div className="relative min-w-[220px] flex-1">
                        <Search className="w-4 h-4 text-[#8C8D88] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search products by title or ID..."
                          className="w-full bg-[#0B0B0B] text-xs text-[#EAE4DC] pl-9 pr-3 py-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none"
                        />
                      </div>

                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-[#0B0B0B] text-xs font-grotesk uppercase tracking-wider text-[#D5C3AA] px-3 py-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none cursor-pointer"
                      >
                        <option value="all">ALL CATEGORIES</option>
                        <option value="jeans">JEANS</option>
                        <option value="shirts">SHIRTS</option>
                        <option value="t-shirts">T-SHIRTS</option>
                        <option value="the-drop">THE DROP</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D5C3AA] hover:bg-[#C5B095] text-[#261C14] font-grotesk font-bold text-xs uppercase tracking-[1px] cursor-pointer transition-colors shrink-0 shadow-sm"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>ADD NEW PRODUCT</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="bg-[#141414] border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-inter text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[#8C8D88] font-grotesk uppercase tracking-wider bg-[#1A1A1A]">
                            <th className="py-3 px-4">PRODUCT</th>
                            <th className="py-3 px-4">CATEGORY</th>
                            <th className="py-3 px-4">PRICE</th>
                            <th className="py-3 px-4">STOCK</th>
                            <th className="py-3 px-4">SIZES</th>
                            <th className="py-3 px-4 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-10 h-10 object-cover bg-[#0B0B0B] border border-white/10 shrink-0"
                                  />
                                  <div>
                                    <div className="font-grotesk font-bold text-xs uppercase text-[#EAE4DC]">
                                      {p.name}
                                    </div>
                                    <div className="text-[11px] text-[#8C8D88] line-clamp-1 max-w-xs">
                                      {p.subtitle || p.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 bg-[#202120] text-[#D5C3AA] text-[10px] font-grotesk font-bold uppercase tracking-wider border border-white/5">
                                  {p.category}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-bold text-[#EAE4DC]">₹{p.price}</div>
                                {p.originalPrice && (
                                  <div className="text-[10px] text-[#8C8D88] line-through">₹{p.originalPrice}</div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-grotesk font-bold uppercase tracking-wider ${
                                    (p.stock ?? 20) <= 5
                                      ? 'bg-amber-950/60 text-amber-300 border border-amber-600/40'
                                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40'
                                  }`}
                                >
                                  {p.stock ?? 20} units
                                </span>
                              </td>
                              <td className="py-3 px-4 text-[#B8B8B0]">
                                {(p.sizes || []).join(', ')}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingProduct({ ...p })}
                                    className="p-1.5 text-[#B8B8B0] hover:text-[#D5C3AA] hover:bg-white/5 transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingProductId(p.id)}
                                    className="p-1.5 text-[#B8B8B0] hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 4: ORDER FULFILLMENT MANAGEMENT
                  ========================================================================= */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="bg-[#141414] border border-white/10 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-anton text-2xl uppercase tracking-wider text-[#EAE4DC] mb-1">
                          ORDER FULFILLMENT & PIPELINE
                        </h3>
                        <p className="font-inter text-xs text-[#8C8D88]">
                          Update order statuses, manage shipping tracking IDs, and view complete buyer records.
                        </p>
                      </div>
                      <button
                        onClick={fetchData}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#202120] hover:bg-[#343634] text-[#D5C3AA] border border-white/10 font-grotesk font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors self-start sm:self-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>SYNC SUPABASE</span>
                      </button>
                    </div>

                    {/* Status filter bar & search */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/10">
                      <div className="flex flex-wrap items-center gap-1.5 font-grotesk text-xs font-bold uppercase">
                        {(['all', 'Pending', 'Confirmed', 'Printing', 'Dispatched', 'Delivered', 'Cancelled'] as OrderStatusFilter[]).map((st) => {
                          const count = st === 'all' ? orders.length : orders.filter((o) => o.status === st).length;
                          return (
                            <button
                              key={st}
                              onClick={() => setOrderStatusFilter(st)}
                              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                                orderStatusFilter === st
                                  ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                                  : 'bg-[#0B0B0B] border-white/10 text-[#8C8D88] hover:text-[#EAE4DC]'
                              }`}
                            >
                              {st} ({count})
                            </button>
                          );
                        })}
                      </div>

                      <div className="relative min-w-[240px]">
                        <Search className="w-4 h-4 text-[#8C8D88] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Filter orders by ID, name, email..."
                          className="w-full bg-[#0B0B0B] text-xs text-[#EAE4DC] pl-9 pr-3 py-2 border border-white/10 focus:border-[#D5C3AA] outline-none"
                        />
                      </div>
                    </div>

                    {ordersError && (
                      <div className="p-3 mb-6 bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{ordersError}</span>
                        </div>
                        <button
                          onClick={fetchData}
                          className="font-grotesk underline font-bold uppercase cursor-pointer"
                        >
                          Retry Sync
                        </button>
                      </div>
                    )}

                    {filteredOrders.length === 0 ? (
                      <div className="py-16 px-6 text-center border border-dashed border-white/10 bg-[#0B0B0B]">
                        <ShoppingBag className="w-10 h-10 text-[#8C8D88] mx-auto mb-3 opacity-40" />
                        <h4 className="font-anton text-lg uppercase text-[#EAE4DC] tracking-wider mb-2">
                          NO ORDERS FOUND
                        </h4>
                        <p className="font-inter text-xs text-[#8C8D88] max-w-md mx-auto mb-5">
                          {orderSearch || orderStatusFilter !== 'all'
                            ? 'No orders match your filter criteria.'
                            : 'Customer checkouts will synchronize and appear here automatically.'}
                        </p>
                        <button
                          onClick={() => {
                            setOrderSearch('');
                            setOrderStatusFilter('all');
                          }}
                          className="px-4 py-2 bg-[#202120] text-[#D5C3AA] font-grotesk font-bold text-xs uppercase tracking-wider"
                        >
                          RESET FILTERS
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-inter text-xs">
                          <thead>
                            <tr className="border-b border-white/10 text-[#8C8D88] font-grotesk uppercase tracking-wider bg-[#1A1A1A]">
                              <th className="py-3 px-4">ORDER ID</th>
                              <th className="py-3 px-4">DATE</th>
                              <th className="py-3 px-4">CUSTOMER & SHIPPING</th>
                              <th className="py-3 px-4">ITEMS</th>
                              <th className="py-3 px-4">TOTAL</th>
                              <th className="py-3 px-4">STATUS</th>
                              <th className="py-3 px-4 text-right">ACTION</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {filteredOrders.map((ord) => {
                              const orderDate = ord.date || ord.created_at;
                              const formattedDate = orderDate
                                ? new Date(orderDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                : 'Recent';
                              const customerName = ord.shippingAddress?.fullName || ord.customer_name || 'Customer';
                              const location = [ord.shippingAddress?.city || ord.city, ord.shippingAddress?.postalCode || ord.postal_code]
                                .filter(Boolean)
                                .join(' - ') || 'India';

                              return (
                                <tr key={ord.id} className="hover:bg-white/5">
                                  <td className="py-3.5 px-4 font-mono font-bold text-[#D5C3AA]">
                                    <div className="flex items-center gap-1.5">
                                      <span>{ord.id}</span>
                                      <button
                                        onClick={() => handleCopy(ord.id, ord.id)}
                                        className="text-[#8C8D88] hover:text-[#D5C3AA] cursor-pointer"
                                        title="Copy Order ID"
                                      >
                                        {isCopiedId === ord.id ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-[#8C8D88]">{formattedDate}</td>
                                  <td className="py-3.5 px-4">
                                    <div className="font-medium text-[#EAE4DC]">{customerName}</div>
                                    <div className="text-[10px] text-[#8C8D88]">{location}</div>
                                  </td>
                                  <td className="py-3.5 px-4 text-[#B8B8B0]">
                                    {ord.items?.length || ord.items_count || 1} item(s)
                                  </td>
                                  <td className="py-3.5 px-4 font-bold text-[#EAE4DC]">₹{ord.total}</td>
                                  <td className="py-3.5 px-4">
                                    <select
                                      value={ord.status || 'Confirmed'}
                                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                      className="bg-[#0B0B0B] text-xs font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] px-2 py-1 border border-white/20 focus:border-[#D5C3AA] outline-none cursor-pointer"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="Printing">Printing</option>
                                      <option value="Quality Check">Quality Check</option>
                                      <option value="Dispatched">Dispatched</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </td>
                                  <td className="py-3.5 px-4 text-right">
                                    <button
                                      onClick={() => {
                                        setSelectedOrderDetails(ord);
                                        setEditingTrackingNumber(ord.trackingNumber || '');
                                      }}
                                      className="px-2.5 py-1 bg-[#202120] hover:bg-[#343634] text-[#D5C3AA] border border-white/10 font-grotesk font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                                    >
                                      VIEW
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 5: INVENTORY & SIZE-WISE STOCK MANAGEMENT
                  ========================================================================= */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="bg-[#141414] border border-white/10 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-anton text-2xl uppercase tracking-wider text-[#EAE4DC]">
                          INVENTORY & SIZE-WISE STOCK MATRIX
                        </h3>
                        <p className="font-inter text-xs text-[#8C8D88] mt-1">
                          Track, adjust and restock individual garment sizes (S, M, L, XL, XXL). Updates immediately reflect in the customer catalog.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-grotesk text-xs text-[#D5C3AA] uppercase tracking-wider font-bold">
                          WAREHOUSE INVENTORY FEED
                        </span>
                      </div>
                    </div>

                    {/* Filter by status & search */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2 font-grotesk text-xs font-bold uppercase">
                        <button
                          onClick={() => setInventoryStatusFilter('all')}
                          className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                            inventoryStatusFilter === 'all'
                              ? 'bg-[#3C2A21] border-[#D5C3AA] text-[#EAE4DC]'
                              : 'bg-[#0B0B0B] border-white/10 text-[#8C8D88]'
                          }`}
                        >
                          ALL PRODUCTS ({products.length})
                        </button>
                        <button
                          onClick={() => setInventoryStatusFilter('low')}
                          className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                            inventoryStatusFilter === 'low'
                              ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                              : 'bg-[#0B0B0B] border-white/10 text-[#8C8D88]'
                          }`}
                        >
                          LOW STOCK ({lowStockCount})
                        </button>
                        <button
                          onClick={() => setInventoryStatusFilter('out')}
                          className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                            inventoryStatusFilter === 'out'
                              ? 'bg-red-950/80 border-red-500 text-red-200'
                              : 'bg-[#0B0B0B] border-white/10 text-[#8C8D88]'
                          }`}
                        >
                          OUT OF STOCK ({outOfStockCount})
                        </button>
                      </div>

                      <div className="relative min-w-[220px]">
                        <Search className="w-4 h-4 text-[#8C8D88] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          placeholder="Search product inventory..."
                          className="w-full bg-[#0B0B0B] text-xs text-[#EAE4DC] pl-9 pr-3 py-2 border border-white/10 focus:border-[#D5C3AA] outline-none"
                        />
                      </div>
                    </div>

                    {/* Inventory Matrix Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-inter text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[#8C8D88] font-grotesk uppercase tracking-wider bg-[#1A1A1A]">
                            <th className="py-3 px-4">ITEM / CATALOG</th>
                            <th className="py-3 px-4">SIZE-WISE STOCK MATRIX</th>
                            <th className="py-3 px-4 text-center">TOTAL STOCK</th>
                            <th className="py-3 px-4">STATUS</th>
                            <th className="py-3 px-4 text-right">QUICK RESTOCK</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredInventory.map((p) => {
                            const sizes = p.sizes || ['S', 'M', 'L', 'XL'];
                            const sizeStock = editingSizeStock[p.id] || {};
                            const totalComputedStock = Object.values(sizeStock).reduce(
                              (acc, q) => acc + (Number(q) || 0),
                              0
                            );
                            const isLow = totalComputedStock <= 5 && totalComputedStock > 0;
                            const isOut = totalComputedStock === 0;

                            return (
                              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-10 h-10 object-cover bg-[#0B0B0B] border border-white/10 shrink-0"
                                    />
                                    <div>
                                      <div className="font-grotesk font-bold text-xs uppercase text-[#EAE4DC]">
                                        {p.name}
                                      </div>
                                      <div className="text-[10px] text-[#8C8D88]">₹{p.price} · {p.category}</div>
                                    </div>
                                  </div>
                                </td>

                                {/* Size-wise Stock Editor Chips */}
                                <td className="py-4 px-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {sizes.map((sz: string) => {
                                      const currentQty = sizeStock[sz] ?? 0;
                                      return (
                                        <div
                                          key={sz}
                                          className="flex items-center bg-[#0B0B0B] border border-white/15 px-2 py-1 font-grotesk text-xs"
                                        >
                                          <span className="font-bold text-[#D5C3AA] mr-2">{sz}:</span>
                                          <button
                                            type="button"
                                            onClick={() => handleSizeStockChange(p.id, sz, currentQty - 1)}
                                            className="w-4 h-4 flex items-center justify-center text-[#8C8D88] hover:text-[#EAE4DC] hover:bg-white/10 cursor-pointer"
                                            title="Decrease"
                                          >
                                            -
                                          </button>
                                          <input
                                            type="number"
                                            min="0"
                                            value={currentQty}
                                            onChange={(e) =>
                                              handleSizeStockChange(p.id, sz, parseInt(e.target.value) || 0)
                                            }
                                            className="w-9 bg-transparent text-center font-mono font-bold text-xs text-[#EAE4DC] outline-none"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleSizeStockChange(p.id, sz, currentQty + 1)}
                                            className="w-4 h-4 flex items-center justify-center text-[#8C8D88] hover:text-[#EAE4DC] hover:bg-white/10 cursor-pointer"
                                            title="Increase"
                                          >
                                            +
                                          </button>
                                        </div>
                                      );
                                    })}
                                    <button
                                      onClick={() => handleSaveSizeStock(p.id)}
                                      disabled={isSavingInventory === p.id}
                                      className="px-2.5 py-1 bg-[#3C2A21] hover:bg-[#4E362A] text-[#D5C3AA] border border-[#D5C3AA]/40 text-[10px] font-grotesk font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                    >
                                      {isSavingInventory === p.id ? 'SAVING...' : 'SAVE'}
                                    </button>
                                  </div>
                                </td>

                                {/* Total Computed Stock */}
                                <td className="py-4 px-4 text-center">
                                  <span className="font-mono font-bold text-sm text-[#EAE4DC]">
                                    {totalComputedStock}
                                  </span>
                                  <span className="text-[10px] text-[#8C8D88] block">units total</span>
                                </td>

                                {/* Stock Status Badge */}
                                <td className="py-4 px-4">
                                  {isOut ? (
                                    <span className="px-2 py-0.5 bg-red-950/60 text-red-400 border border-red-500/40 text-[10px] font-grotesk font-bold uppercase tracking-wider">
                                      OUT OF STOCK
                                    </span>
                                  ) : isLow ? (
                                    <span className="px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[10px] font-grotesk font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                                      <AlertTriangle className="w-3 h-3" />
                                      LOW ({totalComputedStock})
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-grotesk font-bold uppercase tracking-wider">
                                      IN STOCK
                                    </span>
                                  )}
                                </td>

                                {/* Quick Restock Shortcuts */}
                                <td className="py-4 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5 font-grotesk text-[10px] font-bold">
                                    <button
                                      onClick={() => handleBulkRestock(p.id, 5)}
                                      className="px-2 py-1 bg-[#202120] hover:bg-[#343634] text-[#D5C3AA] border border-white/10 uppercase cursor-pointer"
                                      title="Add +5 units to every size"
                                    >
                                      +5 ALL
                                    </button>
                                    <button
                                      onClick={() => handleBulkRestock(p.id, 10)}
                                      className="px-2 py-1 bg-[#202120] hover:bg-[#343634] text-[#D5C3AA] border border-white/10 uppercase cursor-pointer"
                                      title="Add +10 units to every size"
                                    >
                                      +10 ALL
                                    </button>
                                    <button
                                      onClick={() => handleBulkRestock(p.id, 25)}
                                      className="px-2 py-1 bg-[#261C14] hover:bg-[#3C2A21] text-[#EAE4DC] border border-[#D5C3AA]/30 uppercase cursor-pointer"
                                      title="Add +25 units to every size"
                                    >
                                      +25 ALL
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 6: CUSTOMER RELATIONSHIP MANAGEMENT (CRM)
                  ========================================================================= */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  <div className="bg-[#141414] border border-white/10 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-anton text-2xl uppercase tracking-wider text-[#EAE4DC] mb-1">
                          CUSTOMER PROFILES & PURCHASE HISTORIES
                        </h3>
                        <p className="font-inter text-xs text-[#8C8D88]">
                          Track verified buyers, lifetime expenditure, repeat order frequency, and delivery addresses.
                        </p>
                      </div>

                      <div className="relative min-w-[240px]">
                        <Search className="w-4 h-4 text-[#8C8D88] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search customer name, email, city..."
                          className="w-full bg-[#0B0B0B] text-xs text-[#EAE4DC] pl-9 pr-3 py-2 border border-white/10 focus:border-[#D5C3AA] outline-none"
                        />
                      </div>
                    </div>

                    {/* Customer Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-[#0B0B0B] border border-white/5">
                        <span className="text-[11px] font-grotesk text-[#8C8D88] uppercase tracking-wider block">
                          TOTAL REGISTERED BUYERS
                        </span>
                        <div className="font-anton text-2xl text-[#EAE4DC] mt-1">{customersList.length}</div>
                      </div>

                      <div className="p-4 bg-[#0B0B0B] border border-white/5">
                        <span className="text-[11px] font-grotesk text-[#8C8D88] uppercase tracking-wider block">
                          REPEAT CUSTOMERS
                        </span>
                        <div className="font-anton text-2xl text-emerald-400 mt-1">{repeatCustomersCount}</div>
                      </div>

                      <div className="p-4 bg-[#0B0B0B] border border-white/5">
                        <span className="text-[11px] font-grotesk text-[#8C8D88] uppercase tracking-wider block">
                          REPEAT RETENTION RATE
                        </span>
                        <div className="font-anton text-2xl text-[#D5C3AA] mt-1">{repeatRate}%</div>
                      </div>

                      <div className="p-4 bg-[#0B0B0B] border border-white/5">
                        <span className="text-[11px] font-grotesk text-[#8C8D88] uppercase tracking-wider block">
                          AVERAGE LIFETIME VALUE
                        </span>
                        <div className="font-anton text-2xl text-[#EAE4DC] mt-1">
                          ₹{customersList.length > 0 ? Math.round(totalRevenue / customersList.length) : 0}
                        </div>
                      </div>
                    </div>

                    {/* Customer Records Table */}
                    {filteredCustomers.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#8C8D88] border border-dashed border-white/10">
                        No customer profiles found matching your search.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-inter text-xs">
                          <thead>
                            <tr className="border-b border-white/10 text-[#8C8D88] font-grotesk uppercase tracking-wider bg-[#1A1A1A]">
                              <th className="py-3 px-4">CUSTOMER NAME</th>
                              <th className="py-3 px-4">CONTACT / EMAIL</th>
                              <th className="py-3 px-4">PRIMARY CITY</th>
                              <th className="py-3 px-4">TOTAL ORDERS</th>
                              <th className="py-3 px-4">LIFETIME SPEND</th>
                              <th className="py-3 px-4 text-right">HISTORY</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {filteredCustomers.map((c) => (
                              <tr key={c.id} className="hover:bg-white/5">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#3C2A21] border border-[#D5C3AA]/40 flex items-center justify-center font-anton text-xs text-[#D5C3AA]">
                                      {c.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-grotesk font-bold text-xs uppercase text-[#EAE4DC]">
                                        {c.fullName}
                                      </div>
                                      <div className="text-[10px] font-mono text-[#8C8D88]">{c.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="text-[#EAE4DC]">{c.email}</div>
                                  <div className="text-[10px] text-[#8C8D88]">{c.phone}</div>
                                </td>
                                <td className="py-3.5 px-4 text-[#B8B8B0]">{c.city}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#EAE4DC]">{c.ordersCount}</span>
                                    {c.ordersCount > 1 ? (
                                      <span className="px-1.5 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[9px] font-grotesk font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" /> REPEAT BUYER
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.5 bg-white/5 text-[#8C8D88] border border-white/10 text-[9px] font-grotesk uppercase">
                                        1ST ORDER
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 font-bold text-[#D5C3AA]">
                                  ₹{c.totalSpend.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => setSelectedCustomer(c)}
                                    className="px-2.5 py-1 bg-[#202120] hover:bg-[#343634] text-[#D5C3AA] border border-white/10 font-grotesk font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                                  >
                                    PROFILE
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 7: STORE SETTINGS
                  ========================================================================= */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-[#141414] border border-white/10 p-6">
                    <h3 className="font-anton text-2xl uppercase tracking-wider text-[#EAE4DC] mb-2">
                      STORE CONFIGURATION & POLICIES
                    </h3>
                    <p className="font-inter text-xs text-[#8C8D88] mb-6">
                      Customize storefront metadata, pan-India dispatch announcement bar, and shipping tiers.
                    </p>

                    <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl font-grotesk text-xs">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1.5">
                          BRAND / STORE TITLE
                        </label>
                        <input
                          type="text"
                          value={settings.storeName || ''}
                          onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                          className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1.5">
                          CUSTOMER CARE CONCIERGE EMAIL
                        </label>
                        <input
                          type="email"
                          value={settings.supportEmail || ''}
                          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                          className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1.5">
                          HEADER TICKER ANNOUNCEMENT
                        </label>
                        <input
                          type="text"
                          value={settings.announcementText || ''}
                          onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                          className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1.5">
                            FREE SHIPPING THRESHOLD (₹)
                          </label>
                          <input
                            type="number"
                            value={settings.freeShippingThreshold || 1499}
                            onChange={(e) =>
                              setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                            }
                            className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1.5">
                            STANDARD FLAT SHIPPING FEE (₹)
                          </label>
                          <input
                            type="number"
                            value={settings.shippingFee || 99}
                            onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                            className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#D5C3AA] hover:bg-[#C5B095] text-[#261C14] font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                        >
                          SAVE STORE CONFIGURATION
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL: ADD NEW PRODUCT
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141414] border-2 border-[#D5C3AA]/40 text-[#EAE4DC] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
              <h3 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC]">
                CREATE NEW STREETWEAR PRODUCT
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#8C8D88] hover:text-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 overflow-y-auto space-y-4 font-grotesk text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    PRODUCT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. ACID DROP CARGO HOODIE"
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    CATEGORY *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#D5C3AA]"
                  >
                    <option value="jeans">JEANS</option>
                    <option value="shirts">SHIRTS</option>
                    <option value="t-shirts">T-SHIRTS</option>
                    <option value="the-drop">THE DROP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    PRICE (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    ORIGINAL / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    INITIAL STOCK
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                  SUBTITLE / HOOK
                </label>
                <input
                  type="text"
                  value={productForm.subtitle}
                  onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                  placeholder="e.g. 460GSM loopback cotton boxy cut with drop shoulder drape"
                  className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                  IMAGE ASSET PATH OR URL
                </label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="/src/assets/images/ChatGPT Image Oct 17, 2026, 03_04_03 PM.png"
                  className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                  FULL EDITORIAL DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC] font-inter text-xs"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-transparent hover:bg-white/5 text-[#8C8D88] border border-white/10 uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D5C3AA] hover:bg-[#C5B095] text-[#261C14] font-bold uppercase tracking-wider cursor-pointer"
                >
                  CREATE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT PRODUCT
          ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141414] border-2 border-[#D5C3AA]/40 text-[#EAE4DC] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
              <h3 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC]">
                EDIT PRODUCT: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-[#8C8D88] hover:text-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-6 overflow-y-auto space-y-4 font-grotesk text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={editingProduct.category || 'the-drop'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#D5C3AA]"
                  >
                    <option value="jeans">JEANS</option>
                    <option value="shirts">SHIRTS</option>
                    <option value="t-shirts">T-SHIRTS</option>
                    <option value="the-drop">THE DROP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    PRICE (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    ORIGINAL / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                    STOCK QUANTITY
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 20}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                  SUBTITLE
                </label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                  IMAGE PATH
                </label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#D5C3AA] mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#0B0B0B] p-2.5 border border-white/10 focus:border-[#D5C3AA] outline-none text-[#EAE4DC] font-inter text-xs"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-transparent hover:bg-white/5 text-[#8C8D88] border border-white/10 uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D5C3AA] hover:bg-[#C5B095] text-[#261C14] font-bold uppercase tracking-wider cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CONFIRM DELETE PRODUCT
          ========================================================================= */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141414] border-2 border-red-500/50 text-[#EAE4DC] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC]">
                CONFIRM PRODUCT DELETION
              </h3>
            </div>
            <p className="font-inter text-xs text-[#B8B8B0] leading-relaxed mb-6">
              Are you sure you want to delete this product? This change will be permanently written to the server database and removed from the customer storefront immediately.
            </p>
            <div className="flex justify-end gap-3 font-grotesk text-xs">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2.5 bg-transparent hover:bg-white/5 text-[#8C8D88] border border-white/10 uppercase cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingProductId)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ORDER DETAILS DRAWER
          ========================================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141414] border-2 border-[#D5C3AA]/40 text-[#EAE4DC] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
              <div>
                <span className="font-mono text-xs text-[#D5C3AA] font-bold">ORDER #{selectedOrderDetails.id}</span>
                <h3 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC]">
                  ORDER DETAILS & FULFILLMENT LOG
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-[#8C8D88] hover:text-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 font-inter text-xs">
              {/* Status Bar & Action */}
              <div className="p-4 bg-[#0B0B0B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-grotesk font-bold text-xs text-[#8C8D88] uppercase block mb-1">
                    CURRENT STATUS
                  </span>
                  <span className="px-2.5 py-1 bg-[#3C2A21] border border-[#D5C3AA]/40 text-[#D5C3AA] font-grotesk font-bold uppercase tracking-wider text-xs">
                    {selectedOrderDetails.status || 'Confirmed'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-grotesk text-xs text-[#8C8D88] uppercase">UPDATE:</span>
                  <select
                    value={selectedOrderDetails.status || 'Confirmed'}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.id, e.target.value)}
                    className="bg-[#141414] text-xs font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] px-3 py-1.5 border border-white/20 focus:border-[#D5C3AA] outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Printing">Printing</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer and shipping info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0B0B0B] p-4 border border-white/10">
                <div>
                  <span className="font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] block mb-1">
                    CUSTOMER RECIPIENT
                  </span>
                  <div className="font-bold text-[#EAE4DC]">
                    {selectedOrderDetails.shippingAddress?.fullName || selectedOrderDetails.customer_name || 'Customer'}
                  </div>
                  <div className="text-[#8C8D88]">
                    {selectedOrderDetails.shippingAddress?.email || selectedOrderDetails.customer_email || 'No email provided'}
                  </div>
                  {(selectedOrderDetails.shippingAddress?.phone || selectedOrderDetails.customer_phone) && (
                    <div className="text-[#8C8D88]">
                      {selectedOrderDetails.shippingAddress?.phone || selectedOrderDetails.customer_phone}
                    </div>
                  )}
                </div>

                <div>
                  <span className="font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] block mb-1">
                    SHIPPING DESTINATION
                  </span>
                  <div className="text-[#B8B8B0] leading-relaxed">
                    {selectedOrderDetails.shippingAddress?.address || selectedOrderDetails.shipping_address || 'Address provided'},{' '}
                    {selectedOrderDetails.shippingAddress?.city || selectedOrderDetails.city || 'India'}
                    {(selectedOrderDetails.shippingAddress?.postalCode || selectedOrderDetails.postal_code) &&
                      ` - ${selectedOrderDetails.shippingAddress?.postalCode || selectedOrderDetails.postal_code}`}
                  </div>
                  
                  {/* Courier Tracking Editor */}
                  <div className="mt-3 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-[#8C8D88] uppercase tracking-wider block mb-1">COURIER TRACKING ID:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingTrackingNumber}
                        onChange={(e) => setEditingTrackingNumber(e.target.value)}
                        placeholder="e.g. ZNX-DEL-98421"
                        className="bg-[#141414] text-[11px] font-mono text-[#D5C3AA] px-2 py-1 border border-white/20 outline-none flex-1"
                      />
                      <button
                        onClick={() => handleUpdateTracking(selectedOrderDetails.id, editingTrackingNumber)}
                        className="px-2.5 py-1 bg-[#3C2A21] text-[#D5C3AA] font-grotesk font-bold text-[10px] uppercase cursor-pointer hover:bg-[#4E362A]"
                      >
                        SAVE
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items breakdown */}
              <div>
                <span className="font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] block mb-2">
                  ORDERED MERCHANDISE ({selectedOrderDetails.items?.length || 0})
                </span>
                <div className="divide-y divide-white/5 border border-white/10 bg-[#0B0B0B]">
                  {(selectedOrderDetails.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-grotesk font-bold text-xs uppercase text-[#EAE4DC]">{item.name}</div>
                          <div className="text-[11px] text-[#8C8D88]">
                            Size: <span className="text-[#D5C3AA]">{item.selectedSize}</span> · Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-xs text-[#EAE4DC]">
                        ₹{item.price * (item.quantity || 1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-[#1A1A1A] p-4 flex items-center justify-between border border-white/10 font-grotesk">
                <div>
                  <span className="text-xs text-[#8C8D88] uppercase tracking-wider block">PAYMENT METHOD</span>
                  <span className="font-bold text-xs text-[#D5C3AA]">{selectedOrderDetails.paymentStatus || selectedOrderDetails.paymentMethod || 'Paid (Online Gateway)'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8C8D88] uppercase tracking-wider block">TOTAL BILLED</span>
                  <span className="font-anton text-2xl text-[#EAE4DC]">₹{selectedOrderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CUSTOMER PROFILE & ORDER HISTORY
          ========================================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#141414] border-2 border-[#D5C3AA]/40 text-[#EAE4DC] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3C2A21] border border-[#D5C3AA] flex items-center justify-center font-anton text-base text-[#D5C3AA]">
                  {selectedCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-anton text-xl uppercase tracking-wider text-[#EAE4DC]">
                    {selectedCustomer.fullName}
                  </h3>
                  <span className="text-xs font-mono text-[#8C8D88]">{selectedCustomer.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-[#8C8D88] hover:text-[#EAE4DC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 font-inter text-xs">
              {/* Customer Stats Grid */}
              <div className="grid grid-cols-3 gap-3 bg-[#0B0B0B] p-4 border border-white/10 font-grotesk">
                <div>
                  <span className="text-[10px] text-[#8C8D88] uppercase tracking-wider block">TOTAL ORDERS</span>
                  <span className="font-anton text-2xl text-[#EAE4DC]">{selectedCustomer.ordersCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8D88] uppercase tracking-wider block">TOTAL EXPENDITURE</span>
                  <span className="font-anton text-2xl text-[#D5C3AA]">₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8D88] uppercase tracking-wider block">CUSTOMER STATUS</span>
                  <span className="font-bold text-xs text-emerald-400 block mt-1">
                    {selectedCustomer.ordersCount > 1 ? 'REPEAT BUYER' : 'NEW CUSTOMER'}
                  </span>
                </div>
              </div>

              {/* Contact & Location Details */}
              <div className="bg-[#0B0B0B] p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-grotesk text-[#8C8D88] uppercase font-bold">EMAIL:</span>
                  <span className="text-[#EAE4DC]">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-grotesk text-[#8C8D88] uppercase font-bold">PHONE:</span>
                  <span className="text-[#EAE4DC]">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-grotesk text-[#8C8D88] uppercase font-bold">PRIMARY ADDRESS:</span>
                  <span className="text-[#EAE4DC] text-right">{selectedCustomer.fullAddress}</span>
                </div>
              </div>

              {/* Complete Order History */}
              <div>
                <span className="font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] block mb-3">
                  PURCHASE HISTORY ({selectedCustomer.orders.length} ORDERS)
                </span>
                <div className="space-y-3">
                  {selectedCustomer.orders.map((ord: any) => (
                    <div key={ord.id} className="p-3 bg-[#0B0B0B] border border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-mono font-bold text-xs text-[#D5C3AA]">{ord.id}</div>
                        <div className="text-[10px] text-[#8C8D88]">
                          {ord.date || ord.created_at || 'Recent'} · {ord.items?.length || 1} item(s)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-anton text-sm text-[#EAE4DC]">₹{ord.total}</div>
                        <span className="text-[10px] font-grotesk font-bold uppercase text-[#D5C3AA]">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
