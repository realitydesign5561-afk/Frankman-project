import React, { useEffect, useState } from 'react';
import {
  AdminStats,
  Order,
  Product,
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
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF9F5] pb-20">
      {/* Admin Top Header */}
      <div className="bg-[#1C1917] text-white border-b border-stone-800 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg font-bold tracking-tight text-white">
            Frankman Store Administration
          </span>
          <span className="text-xs bg-stone-800 text-amber-400 px-2 py-0.5 rounded font-mono">
            Umuahia Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-stone-300 hover:text-white transition-colors"
          >
            Showroom Storefront &rarr;
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-rose-400 p-1.5 rounded transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'inventory', label: 'Inventory & Stock', icon: Layers },
            { id: 'discounts', label: 'Discounts', icon: Tag },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* KPI Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Paid Sales */}
              <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Paid Revenue (Confirmed)
                </span>
                <div className="text-2xl font-bold text-stone-950 tabular-nums">
                  {formatNaira(stats.totalPaidRevenueKobo)}
                </div>
                <div className="text-xs text-emerald-700 font-medium">
                  {stats.paidOrders} orders paid
                </div>
              </div>

              {/* Pending Orders Value */}
              <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Pending Orders Value
                </span>
                <div className="text-2xl font-bold text-amber-900 tabular-nums">
                  {formatNaira(stats.totalPendingRevenueKobo)}
                </div>
                <div className="text-xs text-amber-700 font-medium">
                  {stats.pendingOrders} orders awaiting payment
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Total Orders Placed
                </span>
                <div className="text-2xl font-bold text-stone-950 tabular-nums">
                  {stats.totalOrders}
                </div>
                <div className="text-xs text-stone-500">
                  All recorded orders in system
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Low Stock Alert Items
                </span>
                <div className="text-2xl font-bold text-rose-700 tabular-nums">
                  {stats.lowStockItemsCount}
                </div>
                <div className="text-xs text-stone-500">
                  {stats.activeProducts} active products in catalog
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Recent Showroom Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-100 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Order Ref</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">City & State</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Order Status</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/60">
                        <td className="p-3.5 font-mono font-semibold text-stone-900">
                          {ord.orderNumber}
                        </td>
                        <td className="p-3.5 font-medium text-stone-800">
                          {ord.customerName}
                          <span className="block text-[11px] text-stone-400">
                            {ord.customerPhone}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-600">
                          {ord.deliveryCity}, {ord.deliveryState}
                        </td>
                        <td className="p-3.5 font-semibold text-stone-900 tabular-nums">
                          {formatNaira(ord.totalAmountKobo)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              ord.orderStatus === 'CONFIRMED'
                                ? 'bg-emerald-50 text-emerald-800'
                                : ord.orderStatus === 'PROCESSING'
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              ord.paymentStatus === 'PAID'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveTab('orders');
                            }}
                            className="text-amber-800 font-semibold hover:underline"
                          >
                            Details
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
            {/* Filter controls */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, customer, email, phone..."
                  className="w-full text-xs border border-stone-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-stone-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium">Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs bg-stone-50 focus:outline-none"
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

                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium">Payment:</span>
                  <select
                    value={orderPaymentFilter}
                    onChange={(e) => setOrderPaymentFilter(e.target.value)}
                    className="border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs bg-stone-50 focus:outline-none"
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
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Order Reference</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Delivery Address</th>
                      <th className="p-4">Items Count</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-stone-400">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/70">
                          <td className="p-4">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="font-mono font-bold text-amber-900 hover:underline block"
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
                          <td className="p-4 text-stone-700">
                            {ord.items.reduce((s, i) => s + i.quantity, 0)} items
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
                              className="text-xs border border-stone-200 rounded px-2 py-1 bg-white font-medium focus:outline-none"
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
                              className="text-xs border border-stone-200 rounded px-2 py-1 bg-white font-medium focus:outline-none"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PAID">PAID</option>
                              <option value="FAILED">FAILED</option>
                              <option value="REFUNDED">REFUNDED</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="text-amber-800 font-semibold hover:underline"
                            >
                              Inspect Details
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
              <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold">
                        Order Details: {selectedOrder.orderNumber}
                      </h3>
                      <p className="text-xs text-stone-300">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-NG')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-stone-400 hover:text-white p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone-100">
                      <div>
                        <span className="font-bold text-stone-900 block">Customer</span>
                        <p>{selectedOrder.customerName}</p>
                        <p>{selectedOrder.customerPhone}</p>
                        <p>{selectedOrder.customerEmail}</p>
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block">Delivery Address</span>
                        <p>{selectedOrder.deliveryAddress}</p>
                        <p>{selectedOrder.deliveryCity}, {selectedOrder.deliveryState}</p>
                        {selectedOrder.deliveryInstructions && (
                          <p className="text-stone-500 italic mt-1">
                            Note: "{selectedOrder.deliveryInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm mb-3">
                        Items Purchased & Snapshots
                      </h4>
                      <div className="space-y-2 divide-y divide-stone-100">
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
                              <p className="font-bold tabular-nums">
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
                    <div className="p-4 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold tabular-nums">
                          {formatNaira(selectedOrder.subtotalKobo)}
                        </span>
                      </div>
                      {selectedOrder.discountAmountKobo > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount:</span>
                          <span className="font-semibold tabular-nums">
                            -{formatNaira(selectedOrder.discountAmountKobo)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span className="font-semibold tabular-nums">
                          {selectedOrder.deliveryFeeKobo === 0 ? 'FREE' : formatNaira(selectedOrder.deliveryFeeKobo)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                        <span>Total:</span>
                        <span className="tabular-nums">
                          {formatNaira(selectedOrder.totalAmountKobo)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Showroom Catalog Products
                </h3>
                <p className="text-xs text-stone-500">
                  Manage active showroom items, images, base prices, and variations.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    slug: '',
                    description: '',
                    basePriceKobo: 20000000,
                    sku: `FMN-${Date.now().toString().slice(-4)}`,
                    categoryId: 'cat-furniture',
                    isActive: true,
                    isFeatured: false,
                    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
                    variations: [],
                  });
                  setProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Visual</th>
                      <th className="p-4">Product Name & SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Variations</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/60">
                        <td className="p-4">
                          <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden">
                            <SafeImage
                              src={p.images?.[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4 font-medium text-stone-900">
                          <span className="block font-semibold">{p.name}</span>
                          <span className="text-[11px] font-mono text-stone-400">
                            {p.sku}
                          </span>
                        </td>
                        <td className="p-4 capitalize text-stone-600">
                          {p.category?.name || p.categoryId}
                        </td>
                        <td className="p-4 font-bold text-stone-900 tabular-nums">
                          {formatNaira(p.basePriceKobo)}
                        </td>
                        <td className="p-4 text-stone-600">
                          {p.variations.length} options
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              p.isActive
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Unpublished'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductModalOpen(true);
                            }}
                            className="p-1 text-stone-600 hover:text-stone-900"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1 text-stone-400 hover:text-rose-600"
                            title="Delete"
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

            {/* Product Edit Modal */}
            {productModalOpen && editingProduct && (
              <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold">
                      {editingProduct.id ? 'Edit Product' : 'Add New Showroom Product'}
                    </h3>
                    <button
                      onClick={() => setProductModalOpen(false)}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Product Name</label>
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
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-800">Base Price (Naira)</label>
                        <input
                          type="number"
                          required
                          value={(editingProduct.basePriceKobo || 0) / 100}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              basePriceKobo: (parseInt(e.target.value, 10) || 0) * 100,
                            })
                          }
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-800">Category</label>
                        <select
                          value={editingProduct.categoryId || 'cat-furniture'}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              categoryId: e.target.value,
                            })
                          }
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none bg-white"
                        >
                          <option value="cat-furniture">Furniture</option>
                          <option value="cat-electronics">Electronics</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Product Description</label>
                      <textarea
                        rows={3}
                        value={editingProduct.description || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Primary Image URL</label>
                      <input
                        type="url"
                        value={editingProduct.images?.[0] || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            images: [e.target.value],
                          })
                        }
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                        <input
                          type="checkbox"
                          checked={editingProduct.isActive ?? true}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isActive: e.target.checked,
                            })
                          }
                          className="rounded h-4 w-4"
                        />
                        <span>Active & Listed in Catalog</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFeatured ?? false}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              isFeatured: e.target.checked,
                            })
                          }
                          className="rounded h-4 w-4"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                    </div>

                    <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setProductModalOpen(false)}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-lg"
                      >
                        Save Product
                      </button>
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
            <div className="border-b border-stone-200 pb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Variation-Level Inventory Management
              </h3>
              <p className="text-xs text-stone-500">
                Monitor and adjust stock quantities for every furniture finish and electronics model.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Variation / Option</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.flatMap((p) =>
                      p.variations.map((v) => (
                        <tr key={v.id} className="hover:bg-stone-50/60">
                          <td className="p-4 font-mono font-semibold text-stone-900">
                            {v.sku}
                          </td>
                          <td className="p-4 font-medium text-stone-900">{p.name}</td>
                          <td className="p-4 text-stone-600">{v.name}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded font-bold tabular-nums ${
                                v.stockCount <= 3
                                  ? 'bg-rose-100 text-rose-800'
                                  : v.stockCount <= 5
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-50 text-emerald-800'
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
                                className="w-20 border border-stone-300 rounded px-2 py-1 text-xs tabular-nums focus:outline-none"
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
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <h4 className="font-serif text-base font-bold text-stone-900">
                Recent Inventory Audit Trail
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-stone-100 text-xs">
                {inventoryHistory.length === 0 ? (
                  <p className="text-stone-400">No stock movements recorded yet.</p>
                ) : (
                  inventoryHistory.map((h) => (
                    <div key={h.id} className="pt-2 flex justify-between items-center text-stone-600">
                      <div>
                        <span className="font-semibold text-stone-900">
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Discount Codes & Promotions
                </h3>
                <p className="text-xs text-stone-500">
                  Manage percentage discount vouchers and usage restrictions.
                </p>
              </div>
              <button
                onClick={() => setDiscountModalOpen(true)}
                className="px-4 py-2 bg-[#1C1917] hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Code</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Min Order</th>
                    <th className="p-4">Usage Count</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-stone-50/60">
                      <td className="p-4 font-mono font-bold text-stone-900">
                        {d.code}
                      </td>
                      <td className="p-4 font-semibold text-emerald-800">
                        {d.discountPercentage}% OFF
                      </td>
                      <td className="p-4 tabular-nums text-stone-600">
                        {formatNaira(d.minimumOrderKobo)}
                      </td>
                      <td className="p-4 text-stone-600 tabular-nums">
                        {d.usedCount} / {d.maximumUses || 'Unlimited'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            d.isActive
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'
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
              <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      Create Discount Code
                    </h3>
                    <button
                      onClick={() => setDiscountModalOpen(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateDiscount} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Coupon Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UMUAHIA15"
                        value={newDiscount.code}
                        onChange={(e) =>
                          setNewDiscount({ ...newDiscount, code: e.target.value })
                        }
                        className="w-full uppercase border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-800">Discount %</label>
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
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-800">Min Order (₦)</label>
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
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Max Usage Limit</label>
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
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setDiscountModalOpen(false)}
                        className="px-4 py-2 border border-stone-300 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1C1917] text-white font-semibold rounded-lg"
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
          <div className="max-w-3xl space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Store Settings & Configuration
              </h3>
              <p className="text-xs text-stone-500">
                Update showroom contact info, local delivery fees, and announcement messages.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Business Name</label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Telephone Phone</label>
                  <input
                    type="text"
                    value={settings.phoneNumber}
                    onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Support Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-stone-800">Physical Address in Umuahia</label>
                  <input
                    type="text"
                    value={settings.businessAddress}
                    onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-stone-800">Showroom Hours</label>
                  <input
                    type="text"
                    value={settings.businessHours}
                    onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-stone-800">Verified Facebook URL</label>
                  <input
                    type="url"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">
                    Announcement Banner
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcementActive}
                      onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                      className="rounded h-4 w-4"
                    />
                    <span className="font-medium text-stone-700">Display on Storefront</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  placeholder="e.g. Discover stylish furniture and quality electronics in Umuahia."
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
