// Full-Stack Express Server for Frankman Furniture & Electronics
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dataStore } from './src/lib/server-store';
import { CheckoutSchema, DiscountValidateSchema, AdminLoginSchema } from './src/lib/validation';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '2mb' }));

  // --- PUBLIC API ROUTES ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      brand: 'Frankman Furniture & Electronics',
      location: 'Umuahia, Abia State, Nigeria',
      timestamp: new Date().toISOString(),
    });
  });

  // Store Settings (Public)
  app.get('/api/settings', (_req: Request, res: Response) => {
    const settings = dataStore.getStoreSettings();
    res.json(settings);
  });

  // Categories (Public)
  app.get('/api/categories', (_req: Request, res: Response) => {
    const categories = dataStore.getCategories();
    res.json(categories);
  });

  // Products (Public Catalog & Search)
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const categorySlug = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const minPriceKobo = req.query.minPrice ? parseInt(req.query.minPrice as string, 10) : undefined;
      const maxPriceKobo = req.query.maxPrice ? parseInt(req.query.maxPrice as string, 10) : undefined;
      const sortBy = req.query.sortBy as 'newest' | 'price-asc' | 'price-desc' | 'featured' | undefined;
      const inStockOnly = req.query.inStock === 'true';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      const result = dataStore.getProducts({
        categorySlug,
        search,
        minPriceKobo,
        maxPriceKobo,
        sortBy,
        inStockOnly,
        limit,
        offset,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve products', details: err.message });
    }
  });

  // Single Product by Slug
  app.get('/api/products/:slug', (req: Request, res: Response) => {
    const product = dataStore.getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  });

  // Validate Discount Code
  app.post('/api/discounts/validate', (req: Request, res: Response) => {
    const parseResult = DiscountValidateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        valid: false,
        error: parseResult.error.issues[0]?.message || 'Invalid discount request',
      });
      return;
    }

    const { code, subtotalKobo } = parseResult.data;
    const result = dataStore.validateDiscount(code, subtotalKobo);
    res.json(result);
  });

  // Process Checkout Order (Transactional)
  app.post('/api/checkout', async (req: Request, res: Response) => {
    const parseResult = CheckoutSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: parseResult.error.issues[0]?.message || 'Validation error in checkout data',
        details: parseResult.error.flatten(),
      });
      return;
    }

    try {
      const checkoutData = parseResult.data;
      const result = await dataStore.processCheckout(checkoutData);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: 'An internal error occurred while processing your order. Please try again.',
      });
    }
  });

  // Order Confirmation Lookup
  app.get('/api/orders/:reference', (req: Request, res: Response) => {
    const order = dataStore.getOrderByReference(req.params.reference);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Return safe customer receipt
    res.json(order);
  });

  // --- ADMIN ROUTES ---

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const parseResult = AdminLoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: 'Invalid email or password format' });
      return;
    }

    const { email, password } = parseResult.data;
    const authResult = dataStore.verifyAdminLogin(email, password);

    if (!authResult.success) {
      res.status(401).json({ success: false, error: authResult.error });
      return;
    }

    // Simple session token for preview / demonstration
    const token = `adm_${Buffer.from(`${email}:${Date.now()}`).toString('base64')}`;
    res.json({
      success: true,
      token,
      user: authResult.user,
    });
  });

  // Simple token authorization check middleware
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer adm_')) {
      res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
      return;
    }
    next();
  };

  // Admin Overview Stats
  app.get('/api/admin/stats', requireAdminAuth, (_req: Request, res: Response) => {
    const stats = dataStore.getAdminStats();
    res.json(stats);
  });

  // Admin Orders List
  app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
    const orderStatus = req.query.orderStatus as string | undefined;
    const paymentStatus = req.query.paymentStatus as string | undefined;
    const search = req.query.search as string | undefined;

    const orders = dataStore.getAdminOrders({
      orderStatus,
      paymentStatus,
      search,
    });

    res.json(orders);
  });

  // Admin Update Order Status
  app.put('/api/admin/orders/:orderNumber/status', requireAdminAuth, (req: Request, res: Response) => {
    const { orderStatus, paymentStatus } = req.body;
    if (!orderStatus) {
      res.status(400).json({ error: 'orderStatus is required' });
      return;
    }

    const updated = dataStore.updateOrderStatus(
      req.params.orderNumber,
      orderStatus,
      paymentStatus
    );

    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json({ success: true, order: updated });
  });

  // Admin All Products
  app.get('/api/admin/products', requireAdminAuth, (_req: Request, res: Response) => {
    const products = dataStore.getAllProductsAdmin();
    res.json(products);
  });

  // Admin Upsert Product
  app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
    const product = dataStore.upsertProduct(req.body);
    res.json({ success: true, product });
  });

  // Admin Delete Product
  app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
    const success = dataStore.deleteProduct(req.params.id);
    res.json({ success });
  });

  // Admin Update Variation Stock
  app.put('/api/admin/inventory', requireAdminAuth, (req: Request, res: Response) => {
    const { variationId, stockCount, reason } = req.body;
    if (!variationId || stockCount === undefined) {
      res.status(400).json({ error: 'variationId and stockCount are required' });
      return;
    }

    const ok = dataStore.updateVariationStock(
      variationId,
      parseInt(stockCount, 10),
      reason || 'Admin manual adjustment'
    );

    if (!ok) {
      res.status(404).json({ error: 'Variation not found' });
      return;
    }

    res.json({ success: true });
  });

  // Admin Inventory Movement Log
  app.get('/api/admin/inventory/history', requireAdminAuth, (_req: Request, res: Response) => {
    const history = dataStore.getInventoryMovements();
    res.json(history);
  });

  // Admin All Discount Codes
  app.get('/api/admin/discounts', requireAdminAuth, (_req: Request, res: Response) => {
    const codes = dataStore.getDiscountCodesAdmin();
    res.json(codes);
  });

  // Admin Upsert Discount Code
  app.post('/api/admin/discounts', requireAdminAuth, (req: Request, res: Response) => {
    const code = dataStore.upsertDiscountCode(req.body);
    res.json({ success: true, discountCode: code });
  });

  // Admin Update Store Settings
  app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
    const settings = dataStore.updateStoreSettings(req.body);
    res.json({ success: true, settings });
  });

  // --- FRONTEND SPA INTEGRATION ---
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frankman Furniture & Electronics server running at http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
