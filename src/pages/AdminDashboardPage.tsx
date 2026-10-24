import React, { useEffect, useState } from 'react';
import {
  AdminStats,
  Order,
  Product,
  ProductVariation,
  Category,
  DiscountCode,
  StoreSettings,
  OrderStatus,
  PaymentStatus,
} from '../types';
import { formatNaira } from '../lib/pricing';
import { SafeImage } from '../components/ui/SafeImage';
import { clientStore } from '../lib/client-store';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  Settings,
  LogOut,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Save,
  Check,
  X,
  Shield,
  Sparkles,
  RefreshCw,
  Store,
  Eye,
  Upload,
  Camera,
  Palette,
  Star,
  Image as ImageIcon,
} from 'lucide-react';

// Preset Luxury Color Shades for Furniture and Smart Appliances
export const COLOR_PRESETS = [
  { name: 'Warm Walnut', hex: '#5C4033' },
  { name: 'Warm Teak', hex: '#8B5A2B' },
  { name: 'Emerald Velvet', hex: '#1B4D3E' },
  { name: 'Royal Navy', hex: '#1B2A4A' },
  { name: 'Velvet Charcoal', hex: '#2B2B2B' },
  { name: 'Cream Bouclé', hex: '#EAE3D2' },
  { name: 'Pearl White', hex: '#F8F8F8' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Terracotta Clay', hex: '#C86446' },
  { name: 'Inverter Platinum', hex: '#A0A5AA' },
  { name: 'Obsidian Black', hex: '#111111' },
  { name: 'Olive Green', hex: '#556B2F' },
];

// Client-side image compressor for device gallery uploads
export const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read device photo'));
    reader.readAsDataURL(file);
  });
};

interface AdminDashboardPageProps {
  token: string;
  user: any;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  token,
  user,
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'inventory' | 'discounts' | 'settings'
  >('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [inventoryHistory, setInventoryHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  // Device Gallery Image Upload state & refs
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Color Shades & Finishes state & refs
  const [newShade, setNewShade] = useState({
    name: 'Warm Walnut Finish',
    hex: '#5C4033',
    additionalPriceNaira: 0,
    stockCount: 8,
    image: '',
  });
  const [showShadeForm, setShowShadeForm] = useState(false);
  const shadeFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Discount modal
  const [newDiscount, setNewDiscount] = useState<{
    code: string;
    discountPercentage: number;
    minimumOrderNaira: number;
    maximumUses: number;
  }>({
    code: '',
    discountPercentage: 10,
    minimumOrderNaira: 50000,
    maximumUses: 100,
  });
  const [discountModalOpen, setDiscountModalOpen] = useState(false);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Fetch data with full clientStore fallback for Vercel static hosting
  const loadAllData = () => {
    setLoading(true);

    const safeFetch = async (url: string, headers?: any) => {
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error('API non-200');
        return await res.json();
      } catch {
        return null;
      }
    };

    Promise.all([
      safeFetch('/api/admin/stats', authHeaders),
      safeFetch('/api/admin/orders', authHeaders),
      safeFetch('/api/admin/products', authHeaders),
      safeFetch('/api/admin/discounts', authHeaders),
      safeFetch('/api/settings'),
      safeFetch('/api/admin/inventory/history', authHeaders),
    ])
      .then(([statsData, ordersData, prodsData, discData, settingsData, invData]) => {
        setStats(statsData || clientStore.getAdminStats());
        setOrders(ordersData || clientStore.getOrders());
        setProducts(prodsData || clientStore.getProducts());
        setDiscounts(discData || clientStore.getDiscounts());
        setSettings(settingsData || clientStore.getStoreSettings());
        setInventoryHistory(invData || []);
      })
      .catch((err) => {
        console.warn('API fetch fell back to clientStore:', err);
        setStats(clientStore.getAdminStats());
        setOrders(clientStore.getOrders());
        setProducts(clientStore.getProducts());
        setDiscounts(clientStore.getDiscounts());
        setSettings(clientStore.getStoreSettings());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAllData();
  }, [token]);

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (
    orderNumber: string,
    orderStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}/status`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(`Order #${orderNumber} updated to ${orderStatus}`);
          loadAllData();
          if (selectedOrder?.orderNumber === orderNumber) {
            setSelectedOrder(data.order);
          }
          return;
        }
      }
      throw new Error('Server update failed');
    } catch {
      // Fallback to clientStore
      const updated = clientStore.updateOrderStatus(orderNumber, orderStatus, paymentStatus);
      if (updated) {
        showToast(`Order #${orderNumber} updated to ${orderStatus}`);
        loadAllData();
        if (selectedOrder?.orderNumber === orderNumber) {
          setSelectedOrder(updated);
        }
      }
    }
  };

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Product catalog updated');
          setProductModalOpen(false);
          setEditingProduct(null);
          loadAllData();
          return;
        }
      }
      throw new Error('Server save failed');
    } catch {
      // Fallback to clientStore
      clientStore.saveProduct(editingProduct);
      showToast('Product catalog updated');
      setProductModalOpen(false);
      setEditingProduct(null);
      loadAllData();
    }
  };

  // Device gallery image upload (mobile & desktop)
  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map((file) => compressImageFile(file));
      const compressedUrls = await Promise.all(uploadPromises);

      setEditingProduct((prev) => {
        if (!prev) return prev;
        const currentImages = prev.images || [];
        return {
          ...prev,
          images: [...currentImages, ...compressedUrls],
        };
      });

      showToast(`${files.length} photo(s) uploaded from device gallery`);
    } catch (err) {
      console.error('Image compression error:', err);
      showToast('Error uploading photo from gallery. Please try again.');
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add image by direct URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setEditingProduct((prev) => {
      if (!prev) return prev;
      const currentImages = prev.images || [];
      return {
        ...prev,
        images: [...currentImages, imageUrlInput.trim()],
      };
    });
    setImageUrlInput('');
    showToast('Image URL added to gallery');
  };

  // Set image as primary showroom photo
  const handleSetPrimaryImage = (index: number) => {
    setEditingProduct((prev) => {
      if (!prev || !prev.images) return prev;
      const images = [...prev.images];
      const [chosen] = images.splice(index, 1);
      images.unshift(chosen);
      return { ...prev, images };
    });
    showToast('Primary showroom image updated');
  };

  // Remove image from product
  const handleRemoveImage = (index: number) => {
    setEditingProduct((prev) => {
      if (!prev || !prev.images) return prev;
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images };
    });
  };

  // Upload specific photo for a color shade from device gallery
  const handleShadeDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const compressed = await compressImageFile(files[0]);
      setNewShade((prev) => ({ ...prev, image: compressed }));
      showToast('Shade specific photo uploaded');
    } catch (err) {
      showToast('Error uploading shade photo');
    } finally {
      if (shadeFileInputRef.current) shadeFileInputRef.current.value = '';
    }
  };

  // Add color shade to editing product
  const handleAddColorShade = () => {
    if (!editingProduct) return;
    if (!newShade.name.trim()) {
      showToast('Please provide a name for this color shade');
      return;
    }

    const variationId = `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const productSku = editingProduct.sku || 'FMN';
    const shadeSku = `${productSku}-${newShade.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`;

    const newVariation: ProductVariation = {
      id: variationId,
      productId: editingProduct.id || `prod-${Date.now()}`,
      sku: shadeSku,
      name: newShade.name.trim(),
      attributes: {
        color: newShade.hex,
        colorHex: newShade.hex,
        shade: newShade.name.trim(),
        finish: newShade.name.trim(),
      },
      additionalPriceKobo: (Number(newShade.additionalPriceNaira) || 0) * 100,
      stockCount: Number(newShade.stockCount) || 5,
      image: newShade.image || editingProduct.images?.[0] || null,
      isActive: true,
    };

    const currentVariations = editingProduct.variations || [];
    setEditingProduct({
      ...editingProduct,
      variations: [...currentVariations, newVariation],
    });

    // Reset shade form
    setNewShade({
      name: '',
      hex: '#5C4033',
      additionalPriceNaira: 0,
      stockCount: 8,
      image: '',
    });
    setShowShadeForm(false);
    showToast(`Color shade "${newVariation.name}" added`);
  };

  // Remove color shade
  const handleRemoveColorShade = (varId: string) => {
    if (!editingProduct || !editingProduct.variations) return;
    setEditingProduct({
      ...editingProduct,
      variations: editingProduct.variations.filter((v) => v.id !== varId),
    });
    showToast('Color shade removed');
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the showroom?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        showToast('Product removed');
        loadAllData();
        return;
      }
      throw new Error('Server delete failed');
    } catch {
      // Fallback to clientStore
      clientStore.deleteProduct(id);
      showToast('Product removed');
      loadAllData();
    }
  };

  // Handle Stock Update
  const handleStockUpdate = async (variationId: string, newStock: number) => {
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          variationId,
          stockCount: newStock,
          reason: 'Showroom staff manual adjustment',
        }),
      });
      if (res.ok) {
        showToast('Stock count adjusted');
        loadAllData();
        return;
      }
      throw new Error('Server stock update failed');
    } catch {
      // Fallback to clientStore
      clientStore.updateVariationStock(variationId, newStock);
      showToast('Stock count adjusted');
      loadAllData();
    }
  };

  // Handle Create Discount Code
  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscount.code) return;

    const discountPayload = {
      code: newDiscount.code.toUpperCase().trim(),
      discountPercentage: newDiscount.discountPercentage,
      minimumOrderKobo: newDiscount.minimumOrderNaira * 100,
      maximumUses: newDiscount.maximumUses,
      isActive: true,
    };

    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(discountPayload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(`Discount code ${newDiscount.code} created`);
          setDiscountModalOpen(false);
          setNewDiscount({
            code: '',
            discountPercentage: 10,
            minimumOrderNaira: 50000,
            maximumUses: 100,
          });
          loadAllData();
          return;
        }
      }
      throw new Error('Server discount creation failed');
    } catch {
      // Fallback to clientStore
      clientStore.createDiscount(discountPayload);
      showToast(`Discount code ${newDiscount.code} created`);
      setDiscountModalOpen(false);
      setNewDiscount({
        code: '',
        discountPercentage: 10,
        minimumOrderNaira: 50000,
        maximumUses: 100,
      });
      loadAllData();
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast('Store settings saved successfully');
          loadAllData();
          return;
        }
      }
      throw new Error('Server settings save failed');
    } catch {
      // Fallback to clientStore
      const updated = clientStore.updateStoreSettings(settings);
      setSettings(updated);
      showToast('Store settings saved successfully');
      loadAllData();
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.orderStatus !== orderStatusFilter) return false;
    if (orderPaymentFilter !== 'ALL' && o.paymentStatus !== orderPaymentFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 font-sans text-stone-900">
      {/* Top Gold Accent Bar */}
      <div className="bg-[#B58235] text-white px-4 sm:px-8 py-1.5 text-[11px] sm:text-xs flex items-center justify-between font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
          <span className="truncate">
            Frankman Luxury Showroom &amp; Properties · Authorized Management Console
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-amber-100/90 text-[11px]">
            Umuahia Showroom Hub · Live
          </span>
          <button
            onClick={loadAllData}
            className="flex items-center gap-1 hover:text-amber-100 transition-colors text-white/95 text-[11px] cursor-pointer"
            title="Refresh Store Data"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Sync Data</span>
          </button>
        </div>
      </div>

      {/* Admin Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DC] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Wordmark matching Public Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
              title="Return to Showroom"
            >
              <div className="w-9 h-9 rounded-full bg-[#B58235] text-white flex items-center justify-center shadow-xs group-hover:bg-[#9E6F2B] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-stone-900 group-hover:text-[#B58235] transition-colors">
                    Frankman
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#FDF8EE] text-[#B58235] border border-[#EBD8B8] px-2.5 py-0.5 rounded-full">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  Showroom Operations &amp; Inventory Suite
                </p>
              </div>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-[#B58235] bg-white border border-[#EAE5DC] hover:border-[#B58235] rounded-full transition-all shadow-2xs cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#B58235]" />
              <span className="hidden sm:inline">Showroom Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EAE5DC] rounded-full text-xs text-stone-600 shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-[#B58235]" />
                <span className="font-medium text-stone-800 truncate max-w-[150px]">
                  {user.email || 'Admin'}
                </span>
              </div>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-[#EAE5DC] hover:border-rose-200 rounded-full transition-all shadow-2xs cursor-pointer"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2.5 border border-stone-800 animate-in fade-in slide-in-from-top-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Admin Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs Bar matching website style */}
        <div className="bg-white/80 backdrop-blur-md border border-[#EAE5DC] p-1.5 rounded-2xl shadow-xs overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders', count: orders.length, icon: ShoppingBag },
            { id: 'products', label: 'Products', count: products.length, icon: Package },
            { id: 'inventory', label: 'Inventory & Stock', icon: Layers },
            { id: 'discounts', label: 'Discounts', count: discounts.length, icon: Tag },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#B58235] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#FDF8EE]/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F7F4EE] text-stone-600 border border-[#EAE5DC]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Overview Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE5DC] shadow-xs">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                  Live Showroom Console
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  Welcome to Frankman Showroom Administration
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
                  Real-time visibility over verified customer orders, furniture &amp; electronics catalog inventory, and Paystack transactions across Nigeria.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      slug: '',
                      description: '',
                      basePriceKobo: 25000000,
                      sku: `FMN-${Date.now().toString().slice(-4)}`,
                      categoryId: 'cat-furniture',
                      isActive: true,
                      isFeatured: false,
                      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
                      variations: [],
                    });
                    setProductModalOpen(true);
                    setActiveTab('products');
                  }}
                  className="px-4 py-2.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2.5 bg-white border border-[#EAE5DC] hover:border-[#B58235] text-stone-700 hover:text-[#B58235] rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  Inspect Orders
                </button>
              </div>
            </div>

            {/* KPI Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Paid Sales */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE5DC] shadow-xs hover:border-[#B58235]/40 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Paid Revenue (Confirmed)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums tracking-tight">
                  {formatNaira(stats.totalPaidRevenueKobo)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>{stats.paidOrders} confirmed customer orders</span>
                </div>
              </div>

              {/* Pending Orders Value */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE5DC] shadow-xs hover:border-[#B58235]/40 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Pending Orders Value
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDF8EE] border border-[#EBD8B8] text-[#B58235] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#B58235] tabular-nums tracking-tight">
                  {formatNaira(stats.totalPendingRevenueKobo)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B58235] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B58235] inline-block"></span>
                  <span>{stats.pendingOrders} orders awaiting verification</span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE5DC] shadow-xs hover:border-[#B58235]/40 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Total Showroom Orders
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#F7F4EE] border border-[#EAE5DC] text-stone-700 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums tracking-tight">
                  {stats.totalOrders}
                </div>
                <div className="text-xs text-stone-500">
                  Recorded transactions in database
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE5DC] shadow-xs hover:border-[#B58235]/40 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Low Stock Alert Items
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-rose-700 tabular-nums tracking-tight">
                  {stats.lowStockItemsCount}
                </div>
                <div className="text-xs text-stone-500">
                  {stats.activeProducts} active catalog showroom products
                </div>
              </div>
            </div>

            {/* Quick Showroom Bento Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE5DC] flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE5DC] text-[#B58235] flex items-center justify-center shrink-0 shadow-2xs">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-stone-900">
                    Physical Showroom
                  </h4>
                  <p className="text-xs text-stone-500">
                    {settings?.businessAddress || 'Umuahia, Abia State, Nigeria'}
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE5DC] flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE5DC] text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-stone-900">
                    Paystack Payment Gateway
                  </h4>
                  <p className="text-xs text-stone-500">
                    Secured 128-bit card, bank transfer &amp; USSD payments
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE5DC] flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE5DC] text-[#B58235] flex items-center justify-center shrink-0 shadow-2xs">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-stone-900">
                    Active Promotions
                  </h4>
                  <p className="text-xs text-stone-500">
                    {discounts.filter((d) => d.isActive).length} active discount codes configured
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-[#EAE5DC] overflow-hidden shadow-xs">
              <div className="p-5 sm:p-6 border-b border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-stone-900 tracking-tight">
                    Recent Showroom Orders
                  </h3>
                  <p className="text-xs text-stone-500">
                    Latest customer transactions needing showroom preparation and dispatch.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#B58235] hover:text-[#9E6F2B] transition-colors cursor-pointer"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F4EE]/70 text-stone-600 border-b border-[#EAE5DC] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">City &amp; State</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DC]/70">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="p-4 font-mono font-semibold text-stone-900">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4 font-medium text-stone-800">
                          <span className="block font-semibold">{ord.customerName}</span>
                          <span className="block text-[11px] text-stone-400">
                            {ord.customerPhone}
                          </span>
                        </td>
                        <td className="p-4 text-stone-600">
                          {ord.deliveryCity}, {ord.deliveryState}
                        </td>
                        <td className="p-4 font-semibold text-stone-900 tabular-nums">
                          {formatNaira(ord.totalAmountKobo)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              ord.orderStatus === 'CONFIRMED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                                : ord.orderStatus === 'PROCESSING'
                                ? 'bg-amber-50 text-amber-900 border-amber-200/60'
                                : ord.orderStatus === 'DELIVERED'
                                ? 'bg-blue-50 text-blue-800 border-blue-200/60'
                                : ord.orderStatus === 'CANCELLED'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-[#FDF8EE] text-[#B58235] border-[#EBD8B8]'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              ord.paymentStatus === 'PAID'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                                : ord.paymentStatus === 'FAILED'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-[#FDF8EE] text-[#B58235] border-[#EBD8B8]'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveTab('orders');
                            }}
                            className="text-[#B58235] hover:text-[#9E6F2B] font-semibold hover:underline cursor-pointer"
                          >
                            Details &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                  Fulfillment &amp; Commerce
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Customer Orders &amp; Dispatch
                </h3>
                <p className="text-xs text-stone-500">
                  Review Paystack payment confirmations, update delivery stages, and generate digital customer receipts.
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EAE5DC] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, customer, email, phone..."
                  className="w-full text-xs border border-[#EAE5DC] rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] placeholder:text-stone-400 bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                    Status:
                  </span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="border border-[#EAE5DC] rounded-xl px-3 py-2 text-xs bg-white text-stone-800 focus:outline-none focus:border-[#B58235] cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                    Payment:
                  </span>
                  <select
                    value={orderPaymentFilter}
                    onChange={(e) => setOrderPaymentFilter(e.target.value)}
                    className="border border-[#EAE5DC] rounded-xl px-3 py-2 text-xs bg-white text-stone-800 focus:outline-none focus:border-[#B58235] cursor-pointer"
                  >
                    <option value="ALL">All Payments</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#EAE5DC] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F4EE]/70 text-stone-600 border-b border-[#EAE5DC] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Delivery Address</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DC]/70">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-stone-400">
                          <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                          <span>No showroom orders match your current filter criteria.</span>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="p-4">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="font-mono font-bold text-[#B58235] hover:text-[#9E6F2B] hover:underline block cursor-pointer"
                            >
                              {ord.orderNumber}
                            </button>
                            <span className="text-[10px] text-stone-400">
                              {new Date(ord.createdAt).toLocaleDateString('en-NG')}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-stone-900 block">
                              {ord.customerName}
                            </span>
                            <span className="text-stone-500 block text-[11px]">
                              {ord.customerPhone}
                            </span>
                            <span className="text-stone-400 block text-[11px]">
                              {ord.customerEmail}
                            </span>
                          </td>
                          <td className="p-4 text-stone-600 max-w-xs">
                            <span className="line-clamp-2">
                              {ord.deliveryAddress}, {ord.deliveryCity}
                            </span>
                          </td>
                          <td className="p-4 text-stone-700 font-medium">
                            {ord.items.reduce((s, i) => s + i.quantity, 0)} units
                          </td>
                          <td className="p-4 font-bold text-stone-900 tabular-nums">
                            {formatNaira(ord.totalAmountKobo)}
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  ord.orderNumber,
                                  e.target.value as OrderStatus
                                )
                              }
                              className="text-xs border border-[#EAE5DC] rounded-xl px-2.5 py-1.5 bg-white font-medium focus:outline-none focus:border-[#B58235] cursor-pointer"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.paymentStatus}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  ord.orderNumber,
                                  ord.orderStatus,
                                  e.target.value as PaymentStatus
                                )
                              }
                              className="text-xs border border-[#EAE5DC] rounded-xl px-2.5 py-1.5 bg-white font-medium focus:outline-none focus:border-[#B58235] cursor-pointer"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PAID">PAID</option>
                              <option value="FAILED">FAILED</option>
                              <option value="REFUNDED">REFUNDED</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3.5 py-1.5 bg-[#FDF8EE] hover:bg-[#B58235] text-[#B58235] hover:text-white border border-[#EBD8B8] rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Order Detail Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE5DC] overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 bg-[#1C1917] text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#B58235] text-white px-2 py-0.5 rounded-full">
                          Order Receipt
                        </span>
                        <span className="font-mono text-xs text-amber-200">
                          #{selectedOrder.orderNumber}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold">
                        Transaction &amp; Fulfillment Record
                      </h3>
                      <p className="text-xs text-stone-300">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-NG')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#EAE5DC]">
                      <div className="space-y-1 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE5DC]">
                        <span className="font-semibold text-stone-900 uppercase text-[10px] tracking-wider block text-[#B58235]">
                          Customer Information
                        </span>
                        <p className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</p>
                        <p className="text-stone-600">{selectedOrder.customerPhone}</p>
                        <p className="text-stone-600">{selectedOrder.customerEmail}</p>
                      </div>
                      <div className="space-y-1 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE5DC]">
                        <span className="font-semibold text-stone-900 uppercase text-[10px] tracking-wider block text-[#B58235]">
                          Delivery Destination
                        </span>
                        <p className="font-bold text-stone-900 text-sm">{selectedOrder.deliveryCity}, {selectedOrder.deliveryState}</p>
                        <p className="text-stone-600">{selectedOrder.deliveryAddress}</p>
                        {selectedOrder.deliveryInstructions && (
                          <p className="text-stone-500 italic mt-1 pt-1 border-t border-[#EAE5DC]/60">
                            Note: "{selectedOrder.deliveryInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="font-heading font-bold text-stone-900 text-sm mb-3">
                        Ordered Showroom Items &amp; Snapshots
                      </h4>
                      <div className="space-y-2 divide-y divide-[#EAE5DC]/60">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="pt-2 flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-stone-900">
                                {item.productNameSnapshot}
                              </p>
                              {item.variationSnapshot && (
                                <p className="text-stone-500">{item.variationSnapshot}</p>
                              )}
                              <span className="font-mono text-[11px] text-stone-400">
                                SKU: {item.skuSnapshot}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold tabular-nums text-stone-900">
                                {formatNaira(item.lineTotalKobo)}
                              </p>
                              <p className="text-stone-500 text-[11px]">
                                {item.quantity} × {formatNaira(item.unitPriceKobo)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="p-5 bg-[#FAF8F5] rounded-2xl space-y-2 border border-[#EAE5DC]">
                      <div className="flex justify-between">
                        <span className="text-stone-600">Subtotal:</span>
                        <span className="font-semibold tabular-nums text-stone-900">
                          {formatNaira(selectedOrder.subtotalKobo)}
                        </span>
                      </div>
                      {selectedOrder.discountAmountKobo > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount Applied:</span>
                          <span className="font-semibold tabular-nums">
                            -{formatNaira(selectedOrder.discountAmountKobo)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-stone-600">Delivery Fee:</span>
                        <span className="font-semibold tabular-nums text-stone-900">
                          {selectedOrder.deliveryFeeKobo === 0 ? 'FREE DELIVERY' : formatNaira(selectedOrder.deliveryFeeKobo)}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-[#EAE5DC] flex justify-between text-base font-bold text-stone-950">
                        <span className="font-heading">Total Amount:</span>
                        <span className="tabular-nums font-heading text-[#B58235]">
                          {formatNaira(selectedOrder.totalAmountKobo)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#EAE5DC] flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Payment Status: <strong className="text-stone-900">{selectedOrder.paymentStatus}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-6 py-2.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
                    >
                      Close Receipt
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                  Inventory &amp; Merchandising
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Showroom Catalog Products
                </h3>
                <p className="text-xs text-stone-500">
                  Manage live showroom items, high-resolution visual imagery, base prices, and product variations.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    slug: '',
                    description: '',
                    basePriceKobo: 25000000,
                    sku: `FMN-${Date.now().toString().slice(-4)}`,
                    categoryId: 'cat-furniture',
                    isActive: true,
                    isFeatured: false,
                    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
                    variations: [],
                  });
                  setProductModalOpen(true);
                }}
                className="px-5 py-2.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Showroom Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#EAE5DC] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F4EE]/70 text-stone-600 border-b border-[#EAE5DC] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Visual</th>
                      <th className="p-4">Product Name &amp; SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Variations</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DC]/70">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="p-4">
                          <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden border border-[#EAE5DC]">
                            <SafeImage
                              src={p.images?.[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4 font-medium text-stone-900">
                          <span className="block font-semibold text-stone-900">{p.name}</span>
                          <span className="text-[11px] font-mono text-stone-400">
                            {p.sku}
                          </span>
                        </td>
                        <td className="p-4 capitalize text-stone-600">
                          <span className="bg-[#FAF8F5] border border-[#EAE5DC] px-2.5 py-1 rounded-lg text-[11px] font-medium">
                            {p.category?.name || p.categoryId.replace('cat-', '')}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-stone-900 tabular-nums font-heading">
                          {formatNaira(p.basePriceKobo)}
                        </td>
                        <td className="p-4 text-stone-600">
                          {p.variations.length} options
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              p.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                                : 'bg-stone-100 text-stone-500 border-stone-200'
                            }`}
                          >
                            {p.isActive ? 'Active in Catalog' : 'Unpublished'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductModalOpen(true);
                            }}
                            className="p-2 text-stone-600 hover:text-[#B58235] hover:bg-[#FDF8EE] rounded-xl transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Edit Modal with Device Gallery Upload & Color Shades */}
            {productModalOpen && editingProduct && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#EAE5DC] overflow-hidden flex flex-col max-h-[92vh]">
                  {/* Modal Header */}
                  <div className="p-6 bg-[#1C1917] text-white flex items-center justify-between shrink-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#B58235] text-white px-2.5 py-0.5 rounded-full">
                          {editingProduct.id ? 'Edit Showroom Item' : 'New Showroom Item'}
                        </span>
                        {editingProduct.sku && (
                          <span className="text-[11px] font-mono text-amber-200">
                            {editingProduct.sku}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold">
                        {editingProduct.id ? 'Edit Showroom Product & Color Shades' : 'Add New Showroom Product & Color Shades'}
                      </h3>
                      <p className="text-xs text-stone-300">
                        Upload device photos, define specifications, and customize available color shades.
                      </p>
                    </div>
                    <button
                      onClick={() => setProductModalOpen(false)}
                      className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 text-xs">
                    {/* Basic Info Grid */}
                    <div className="space-y-4">
                      <h4 className="font-heading font-bold text-sm text-stone-900 pb-1 border-b border-[#EAE5DC] flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#B58235]" />
                        <span>Basic Product Details</span>
                      </h4>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-stone-800 block">Product Name</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              name: e.target.value,
                              slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            })
                          }
                          className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] text-xs bg-white text-stone-900 font-medium"
                          placeholder="e.g. Royal Chesterfield 3-Seater Sofa"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-stone-800 block">Base Price (₦ Naira)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={(editingProduct.basePriceKobo || 0) / 100}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                basePriceKobo: (parseInt(e.target.value, 10) || 0) * 100,
                              })
                            }
                            className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] text-xs bg-white text-stone-900 tabular-nums font-semibold"
                            placeholder="e.g. 350000"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-stone-800 block">Catalog Category</label>
                          <select
                            value={editingProduct.categoryId || 'cat-furniture'}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                categoryId: e.target.value,
                              })
                            }
                            className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] bg-white text-stone-900 text-xs cursor-pointer font-medium"
                          >
                            <option value="cat-furniture">Furniture &amp; Interior Decor</option>
                            <option value="cat-electronics">Smart Electronics &amp; Solar</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-stone-800 block">Product Description &amp; Craftsmanship</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              description: e.target.value,
                            })
                          }
                          className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] text-xs bg-white text-stone-900 leading-relaxed"
                          placeholder="Describe materials, warranty, dimensions, foam density, and finish details..."
                        />
                      </div>
                    </div>

                    {/* SECTION 1: Product Imagery & Device Gallery Upload */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between pb-1 border-b border-[#EAE5DC]">
                        <div>
                          <h4 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-[#B58235]" />
                            <span>Product Imagery &amp; Device Gallery Upload</span>
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            Upload photos directly from your phone gallery or computer. You can upload multiple angles.
                          </p>
                        </div>
                        {editingProduct.images && editingProduct.images.length > 0 && (
                          <span className="text-[11px] font-semibold text-[#B58235] bg-[#FDF8EE] border border-[#EBD8B8] px-2.5 py-0.5 rounded-full">
                            {editingProduct.images.length} photo(s)
                          </span>
                        )}
                      </div>

                      {/* Hidden File Input for Device Gallery */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleDeviceImageUpload}
                        className="hidden"
                      />

                      {/* Upload from Device Gallery Button & Dropzone */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-5 border-2 border-dashed border-[#EAE5DC] hover:border-[#B58235] bg-[#FAF8F5] hover:bg-[#FDF8EE] rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer group text-center"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#EBD8B8] text-[#B58235] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                          <Upload className="w-5 h-5 text-[#B58235]" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-heading font-bold text-stone-900 text-sm block group-hover:text-[#B58235] transition-colors">
                            {isUploadingImages
                              ? 'Optimizing and loading device photos...'
                              : 'Tap to Choose Photos from Device Gallery / Camera'}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            Supports phone gallery, photos, JPG, PNG, and WebP (auto-compressed for fast viewing)
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#EAE5DC] text-stone-700 text-[11px] font-semibold rounded-full shadow-2xs group-hover:border-[#B58235]">
                          <Camera className="w-3.5 h-3.5 text-[#B58235]" />
                          <span>Browse Gallery Files</span>
                        </span>
                      </div>

                      {/* Or Direct Image URL input */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImageUrl();
                              }
                            }}
                            placeholder="Or paste an image web URL (e.g. https://...)"
                            className="w-full border border-[#EAE5DC] rounded-xl pl-10 pr-3.5 py-2.5 text-xs bg-white text-stone-900 focus:outline-none focus:border-[#B58235]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          disabled={!imageUrlInput.trim()}
                          className="px-4 py-2.5 bg-stone-100 hover:bg-[#B58235] text-stone-700 hover:text-white disabled:opacity-40 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
                        >
                          Add URL
                        </button>
                      </div>

                      {/* Uploaded Gallery Grid */}
                      {editingProduct.images && editingProduct.images.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {editingProduct.images.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                className={`relative rounded-2xl overflow-hidden border group bg-stone-100 aspect-square shadow-2xs ${
                                  idx === 0 ? 'border-2 border-[#B58235] ring-2 ring-[#B58235]/20' : 'border-[#EAE5DC]'
                                }`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Product visual ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {idx === 0 ? (
                                  <span className="absolute top-2 left-2 bg-[#B58235] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                    <Star className="w-2.5 h-2.5 fill-current" /> Primary
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(idx)}
                                    className="absolute top-2 left-2 bg-stone-900/80 hover:bg-[#B58235] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                                  >
                                    Set Primary
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                                  title="Delete photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: Available Color Shades & Finishes */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between pb-1 border-b border-[#EAE5DC]">
                        <div>
                          <h4 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-[#B58235]" />
                            <span>Available Color Shades &amp; Finishes</span>
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            Configure fabric colors, wood stains, or finish shades available for customer selection in showroom.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-stone-600">
                          {editingProduct.variations?.length || 0} shade(s) configured
                        </span>
                      </div>

                      {/* Current Configured Shades List */}
                      {editingProduct.variations && editingProduct.variations.length > 0 ? (
                        <div className="space-y-2">
                          {editingProduct.variations.map((v) => {
                            const shadeColor = v.attributes?.color || v.attributes?.colorHex || '#5C4033';
                            return (
                              <div
                                key={v.id}
                                className="flex items-center justify-between p-3.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-2xl hover:border-[#B58235]/40 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {/* Color Swatch Circle */}
                                  <div
                                    className="w-7 h-7 rounded-full border-2 border-white shadow-xs shrink-0"
                                    style={{ backgroundColor: shadeColor }}
                                    title={shadeColor}
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-stone-900 text-xs">{v.name}</span>
                                      <span className="text-[10px] font-mono text-stone-400">
                                        ({v.sku})
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                                      <span>
                                        {v.additionalPriceKobo > 0
                                          ? `+${formatNaira(v.additionalPriceKobo)} upgrade`
                                          : 'Standard base price'}
                                      </span>
                                      <span>·</span>
                                      <span className="font-medium text-stone-700">
                                        {v.stockCount} units in showroom
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {v.image && (
                                    <img
                                      src={v.image}
                                      alt={v.name}
                                      className="w-8 h-8 rounded-lg object-cover border border-[#EAE5DC]"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveColorShade(v.id)}
                                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Remove this shade"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-[#FAF8F5] border border-dashed border-[#EAE5DC] rounded-2xl text-center text-stone-500 text-xs">
                          No specific color shades configured yet. Add shades below to let customers choose colors in the showroom.
                        </div>
                      )}

                      {/* Add Color Shade Form */}
                      <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#EAE5DC] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs text-stone-900 uppercase tracking-wider block">
                            + Add Color Shade / Finish
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Pick preset or custom swatch
                          </span>
                        </div>

                        {/* Quick Color Presets */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-stone-600 block">
                            Quick Luxury Color Presets:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {COLOR_PRESETS.map((preset) => {
                              const isSelected = newShade.hex.toLowerCase() === preset.hex.toLowerCase();
                              return (
                                <button
                                  type="button"
                                  key={preset.name}
                                  onClick={() =>
                                    setNewShade((prev) => ({
                                      ...prev,
                                      name: `${preset.name} Finish`,
                                      hex: preset.hex,
                                    }))
                                  }
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                      : 'bg-white text-stone-700 border-[#EAE5DC] hover:border-stone-400'
                                  }`}
                                >
                                  <span
                                    className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                                    style={{ backgroundColor: preset.hex }}
                                  />
                                  <span>{preset.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Shade Name & Custom Color Hex */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[11px] font-semibold text-stone-700 block">
                              Color Swatch
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={newShade.hex}
                                onChange={(e) =>
                                  setNewShade((prev) => ({ ...prev, hex: e.target.value }))
                                }
                                className="w-10 h-10 rounded-xl border border-[#EAE5DC] p-0.5 bg-white cursor-pointer"
                                title="Click to pick custom color shade"
                              />
                              <span className="font-mono text-[11px] text-stone-500 uppercase">
                                {newShade.hex}
                              </span>
                            </div>
                          </div>

                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-[11px] font-semibold text-stone-700 block">
                              Color Shade Name
                            </label>
                            <input
                              type="text"
                              value={newShade.name}
                              onChange={(e) =>
                                setNewShade((prev) => ({ ...prev, name: e.target.value }))
                              }
                              placeholder="e.g. Royal Emerald Velvet"
                              className="w-full border border-[#EAE5DC] rounded-xl p-2.5 text-xs bg-white text-stone-900 focus:outline-none focus:border-[#B58235]"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[11px] font-semibold text-stone-700 block">
                              Extra Price (₦)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={newShade.additionalPriceNaira}
                              onChange={(e) =>
                                setNewShade((prev) => ({
                                  ...prev,
                                  additionalPriceNaira: parseInt(e.target.value, 10) || 0,
                                }))
                              }
                              placeholder="0 if same price"
                              className="w-full border border-[#EAE5DC] rounded-xl p-2.5 text-xs bg-white text-stone-900 tabular-nums focus:outline-none focus:border-[#B58235]"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[11px] font-semibold text-stone-700 block">
                              Stock Units
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={newShade.stockCount}
                              onChange={(e) =>
                                setNewShade((prev) => ({
                                  ...prev,
                                  stockCount: parseInt(e.target.value, 10) || 0,
                                }))
                              }
                              className="w-full border border-[#EAE5DC] rounded-xl p-2.5 text-xs bg-white text-stone-900 tabular-nums focus:outline-none focus:border-[#B58235]"
                            />
                          </div>
                        </div>

                        {/* Optional Shade Image Upload from Device Gallery */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAE5DC]">
                          <input
                            type="file"
                            ref={shadeFileInputRef}
                            accept="image/*"
                            onChange={handleShadeDeviceImageUpload}
                            className="hidden"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => shadeFileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-white border border-[#EAE5DC] hover:border-[#B58235] text-stone-700 hover:text-[#B58235] rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#B58235]" />
                              <span>{newShade.image ? 'Change Shade Photo' : 'Upload Shade Photo (Gallery)'}</span>
                            </button>
                            {newShade.image && (
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={newShade.image}
                                  alt="Shade preview"
                                  className="w-7 h-7 rounded-lg object-cover border border-[#EAE5DC]"
                                />
                                <button
                                  type="button"
                                  onClick={() => setNewShade((prev) => ({ ...prev, image: '' }))}
                                  className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleAddColorShade}
                            disabled={!newShade.name.trim()}
                            className="px-5 py-2 bg-[#B58235] hover:bg-[#9E6F2B] disabled:opacity-40 text-white font-semibold rounded-full text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add This Shade</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Catalog Visibility Switches */}
                    <div className="flex flex-wrap items-center gap-6 pt-3 bg-[#FAF8F5] p-4 sm:p-5 rounded-3xl border border-[#EAE5DC]">
                      <label className="flex items-center gap-2.5 cursor-pointer font-medium text-stone-800 text-xs">
                        <input
                          type="checkbox"
                          checked={editingProduct.isActive ?? true}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded h-4 w-4 text-[#B58235] focus:ring-[#B58235]"
                        />
                        <span>Active &amp; Visible in Showroom Catalog</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer font-medium text-stone-800 text-xs">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFeatured ?? false}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isFeatured: e.target.checked,
                            })
                          }
                          className="rounded h-4 w-4 text-[#B58235] focus:ring-[#B58235]"
                        />
                        <span>Feature in Homepage Bento Showcase</span>
                      </label>
                    </div>

                    {/* Bottom Save / Cancel Actions */}
                    <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-[#EAE5DC] -mx-6 -mb-6 flex items-center justify-between pt-4">
                      <span className="text-[11px] text-stone-500">
                        {editingProduct.images?.length || 0} photo(s) · {editingProduct.variations?.length || 0} color shade(s)
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setProductModalOpen(false)}
                          className="px-5 py-2.5 border border-[#EAE5DC] hover:border-stone-400 text-stone-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-7 py-2.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
                        >
                          Save Product &amp; Shades
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                  Stock Control &amp; Warehouse
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Variation-Level Inventory Management
                </h3>
                <p className="text-xs text-stone-500">
                  Monitor and adjust live stock quantities for every furniture finish, dimension, and electronics model.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE5DC] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F4EE]/70 text-stone-600 border-b border-[#EAE5DC] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Variation / Option</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DC]/70">
                    {products.flatMap((p) =>
                      p.variations.map((v) => (
                        <tr key={v.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="p-4 font-mono font-semibold text-stone-900">
                            {v.sku}
                          </td>
                          <td className="p-4 font-medium text-stone-900">{p.name}</td>
                          <td className="p-4 text-stone-600">
                            <span className="bg-[#FAF8F5] border border-[#EAE5DC] px-2.5 py-0.5 rounded-lg text-[11px]">
                              {v.name}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold tabular-nums text-[11px] border ${
                                v.stockCount <= 3
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : v.stockCount <= 5
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                              }`}
                            >
                              {v.stockCount} units
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                defaultValue={v.stockCount}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val !== v.stockCount) {
                                    handleStockUpdate(v.id, val);
                                  }
                                }}
                                className="w-24 border border-[#EAE5DC] rounded-xl px-3 py-1.5 text-xs tabular-nums focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900"
                              />
                              <span className="text-[11px] text-stone-400">
                                (auto-saves on blur)
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Movement Log */}
            <div className="bg-white rounded-3xl border border-[#EAE5DC] p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DC]">
                <div>
                  <h4 className="font-heading text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                    Showroom Inventory Audit Trail
                  </h4>
                  <p className="text-xs text-stone-500">
                    Live log of stock adjustments performed by showroom floor personnel.
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-[#EAE5DC]/60 text-xs">
                {inventoryHistory.length === 0 ? (
                  <p className="text-stone-400 py-4 text-center">No manual stock adjustments recorded yet.</p>
                ) : (
                  inventoryHistory.map((h) => (
                    <div key={h.id} className="pt-3 flex justify-between items-center text-stone-600">
                      <div>
                        <span className="font-semibold text-stone-900 block">
                          {h.productName} ({h.variationName})
                        </span>
                        <span className="block text-[11px] text-stone-400">
                          {h.reason} · {new Date(h.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold ${
                            h.change > 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {h.change > 0 ? `+${h.change}` : h.change}
                        </span>
                        <span className="block text-[11px] text-stone-400">
                          ({h.previousStock} &rarr; {h.newStock})
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DISCOUNTS */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                  Promotions &amp; Vouchers
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Discount Codes &amp; Showroom Coupons
                </h3>
                <p className="text-xs text-stone-500">
                  Manage percentage discount vouchers, minimum purchase thresholds, and usage caps.
                </p>
              </div>
              <button
                onClick={() => setDiscountModalOpen(true)}
                className="px-5 py-2.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Discount Voucher</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE5DC] overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F4EE]/70 text-stone-600 border-b border-[#EAE5DC] uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Min Order</th>
                    <th className="p-4">Usage Count</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DC]/70">
                  {discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="p-4 font-mono font-bold">
                        <span className="bg-[#FDF8EE] text-[#B58235] border border-[#EBD8B8] px-2.5 py-1 rounded-lg text-xs">
                          {d.code}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-emerald-800">
                        {d.discountPercentage}% OFF
                      </td>
                      <td className="p-4 tabular-nums text-stone-700 font-medium">
                        {formatNaira(d.minimumOrderKobo)}
                      </td>
                      <td className="p-4 text-stone-600 tabular-nums">
                        {d.usedCount} / {d.maximumUses || 'Unlimited'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            d.isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                              : 'bg-stone-100 text-stone-500 border-stone-200'
                          }`}
                        >
                          {d.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Discount Create Modal */}
            {discountModalOpen && (
              <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EAE5DC] p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#B58235] text-white px-2 py-0.5 rounded-full">
                        New Voucher
                      </span>
                      <h3 className="font-heading text-lg font-bold text-stone-900 mt-1">
                        Create Discount Voucher
                      </h3>
                    </div>
                    <button
                      onClick={() => setDiscountModalOpen(false)}
                      className="text-stone-400 hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateDiscount} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-stone-800 block">Voucher Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UMUAHIA15"
                        value={newDiscount.code}
                        onChange={(e) =>
                          setNewDiscount({ ...newDiscount, code: e.target.value })
                        }
                        className="w-full uppercase border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 font-mono tracking-wider"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-stone-800 block">Discount %</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          required
                          value={newDiscount.discountPercentage}
                          onChange={(e) =>
                            setNewDiscount({
                              ...newDiscount,
                              discountPercentage: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 tabular-nums"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-stone-800 block">Min Order (₦)</label>
                        <input
                          type="number"
                          min={0}
                          value={newDiscount.minimumOrderNaira}
                          onChange={(e) =>
                            setNewDiscount({
                              ...newDiscount,
                              minimumOrderNaira: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-stone-800 block">Max Redemptions Limit</label>
                      <input
                        type="number"
                        min={1}
                        value={newDiscount.maximumUses}
                        onChange={(e) =>
                          setNewDiscount({
                            ...newDiscount,
                            maximumUses: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 tabular-nums"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-4 border-t border-[#EAE5DC]">
                      <button
                        type="button"
                        onClick={() => setDiscountModalOpen(false)}
                        className="px-5 py-2.5 border border-[#EAE5DC] hover:border-stone-400 text-stone-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white font-semibold rounded-full text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Create Voucher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-4xl space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                Configuration &amp; Brand
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Showroom Details &amp; Operational Setup
              </h3>
              <p className="text-xs text-stone-500">
                Update verified phone desks, physical showroom address in Umuahia, and storefront announcements.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE5DC] shadow-xs space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-800 block">Showroom Brand Name</label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-800 block">WhatsApp Support Hotline</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-800 block">Official Telephone Number</label>
                  <input
                    type="text"
                    value={settings.phoneNumber}
                    onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                    className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-800 block">Customer Service Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 text-xs"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-semibold text-stone-800 block">Physical Address in Umuahia, Abia State</label>
                  <input
                    type="text"
                    value={settings.businessAddress}
                    onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                    className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 text-xs"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-semibold text-stone-800 block">Showroom Visiting Hours</label>
                  <input
                    type="text"
                    value={settings.businessHours}
                    onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                    className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 text-xs"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-semibold text-stone-800 block">Verified Facebook Page URL</label>
                  <input
                    type="url"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] bg-white text-stone-900 text-xs"
                  />
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="pt-5 border-t border-[#EAE5DC] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading font-bold text-stone-900 text-sm block">
                      Storefront Top Notice Banner
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Displays at the very top of all public showroom pages.
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#EAE5DC]">
                    <input
                      type="checkbox"
                      checked={settings.announcementActive}
                      onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                      className="rounded h-4 w-4 text-[#B58235] focus:ring-[#B58235]"
                    />
                    <span className="font-semibold text-stone-800 text-xs">Display on Storefront</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  placeholder="e.g. Discover stylish handcrafted furniture and quality smart electronics in Umuahia."
                  className="w-full border border-[#EAE5DC] rounded-xl p-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] text-xs bg-white text-stone-900"
                />
              </div>

              <div className="pt-4 border-t border-[#EAE5DC] flex justify-end">
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#B58235] hover:bg-[#9E6F2B] text-white font-semibold rounded-full flex items-center gap-2 text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Store Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
