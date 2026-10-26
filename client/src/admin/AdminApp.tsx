import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Route, Switch, useLocation, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Bell, BriefcaseBusiness, Building2, Check, ChevronRight, CircleDollarSign, ClipboardCheck, CreditCard, FileText, FolderKanban, ImagePlus, LayoutDashboard, LogOut, Menu, Package2, PencilLine, Search, Settings, ShieldCheck, ShoppingBag, ShoppingCart, Star, TrendingUp, Users, X } from "lucide-react";
import { adminStorageKeys, defaultArticles, defaultBlogPosts, defaultCategories, defaultCoupons, defaultCustomers, defaultOrders, defaultProducts, defaultReviews, defaultSubscriptions, formatCurrency, type AdminRole, type AdminUser, type BlogPost, type CategoryItem, type CouponItem, type OrderItem, type ProductItem, type ProductStatus, type SubscriptionItem, type ArticleItem } from "@/admin/mock-data";
import { canAccessAdminSection, createAdminAccount, getAdminRolePermissions, getCurrentAdminUser, sendPasswordResetEmail, signInAdmin, signOutAdmin, validateEmail, validatePassword, passwordStrength, resetAdminPassword } from "@/admin/auth";

type AdminNavItem = { label: string; href: string; icon: typeof LayoutDashboard; section: string; roles?: AdminRole[] };

type AdminPageProps = { user: AdminUser | null };

const navItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, section: "dashboard" },
  { label: "Products", href: "/admin/products", icon: Package2, section: "products" },
  { label: "Categories", href: "/admin/categories", icon: FolderKanban, section: "categories" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart, section: "orders" },
  { label: "Customers", href: "/admin/customers", icon: Users, section: "customers" },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: ClipboardCheck, section: "subscriptions" },
  { label: "Articles", href: "/admin/articles", icon: FileText, section: "articles" },
  { label: "Blog", href: "/admin/blog", icon: PencilLine, section: "blog" },
  { label: "Media", href: "/admin/media", icon: ImagePlus, section: "media" },
  { label: "Reviews", href: "/admin/reviews", icon: Star, section: "reviews" },
  { label: "Coupons", href: "/admin/coupons", icon: CreditCard, section: "coupons" },
  { label: "Pages", href: "/admin/pages", icon: BriefcaseBusiness, section: "pages" },
  { label: "Settings", href: "/admin/settings", icon: Settings, section: "settings" },
  { label: "Admin Users", href: "/admin/admin-users", icon: ShieldCheck, section: "admin-users", roles: ["Super Admin"] },
];

function ensureSeededStorage() {
  const keys = [
    [adminStorageKeys.products, defaultProducts],
    [adminStorageKeys.categories, defaultCategories],
    [adminStorageKeys.orders, defaultOrders],
    [adminStorageKeys.customers, defaultCustomers],
    [adminStorageKeys.subscriptions, defaultSubscriptions],
    [adminStorageKeys.reviews, defaultReviews],
    [adminStorageKeys.coupons, defaultCoupons],
    [adminStorageKeys.articles, defaultArticles],
    [adminStorageKeys.blogPosts, defaultBlogPosts],
  ] as const;

  for (const [key, fallback] of keys) {
    try {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(fallback));
      }
    } catch {
      // ignore localStorage failures in restricted environments
    }
  }
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function buildAdminStats() {
  const products = readStorage<ProductItem[]>(adminStorageKeys.products, defaultProducts);
  const orders = readStorage<OrderItem[]>(adminStorageKeys.orders, defaultOrders);
  const customers = readStorage<any[]>(adminStorageKeys.customers, defaultCustomers);
  const subscriptions = readStorage<SubscriptionItem[]>(adminStorageKeys.subscriptions, defaultSubscriptions);
  const blogPosts = readStorage<BlogPost[]>(adminStorageKeys.blogPosts, defaultBlogPosts);

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = products.length;
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "Active").length;
  const customersCount = customers.length;
  const blogViews = blogPosts.reduce((sum, post) => sum + (post.featured ? 412 : 210), 0);

  return {
    totalSales,
    totalOrders: orders.length,
    totalProducts,
    activeSubscriptions,
    registeredCustomers: customersCount,
    blogViews,
  };
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();
  const user = getCurrentAdminUser();

  useEffect(() => {
    ensureSeededStorage();
  }, []);

  const visibleNav = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <div className="min-h-screen bg-[#f8f4ea] text-[#28332d]">
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-[#173a2b]/10 bg-[#fffdf8] px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((open) => !open)} className="icon-button" aria-label="Toggle admin menu">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f6b4f]">RefillLoop</p>
              <p className="text-xs text-[#28332d]/70">Admin</p>
            </div>
          </div>
          <button onClick={() => { signOutAdmin(); navigate("/admin/login"); }} className="button button-secondary px-3 py-2 text-[10px]">Sign out</button>
        </div>
        {sidebarOpen && (
          <div className="border-b border-[#173a2b]/10 bg-[#fffdf8] p-4">
            <AdminSidebarCompact items={visibleNav} onNavigate={() => setSidebarOpen(false)} user={user} />
          </div>
        )}
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#173a2b]/10 bg-[#fffdf8] lg:flex lg:flex-col">
          <div className="border-b border-[#173a2b]/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#2f6b4f] text-[#fffdf8] shadow-sm">
                <Building2 size={18} />
              </span>
              <div>
                <p className="font-display text-2xl leading-none tracking-[-0.06em] text-[#173a2b]">refill<span className="text-[#2f6b4f]">loop</span></p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f6b4f]">Store admin</p>
              </div>
            </div>
          </div>
          <AdminSidebarCompact items={visibleNav} user={user} />
          <div className="mt-auto border-t border-[#173a2b]/10 p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3">
              <div className="grid size-9 place-items-center rounded-full bg-[#dce6d7] font-bold text-[#173a2b]">{user?.name?.slice(0, 1) ?? "A"}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#173a2b]">{user?.name ?? "Admin"}</p>
                <p className="truncate text-[11px] text-[#28332d]/60">{user?.role ?? "Guest"}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[#f8f4ea]">
          <header className="border-b border-[#173a2b]/10 bg-[#fffdf8]/95 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div>
                <p className="eyebrow text-[#2f6b4f]">Operations</p>
                <h1 className="mt-1 font-display text-3xl tracking-[-0.05em] text-[#173a2b]">RefillLoop admin</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
                <button onClick={() => { signOutAdmin(); navigate("/admin/login"); }} className="button button-secondary px-3 py-2 text-[11px]">Sign out</button>
              </div>
            </div>
          </header>
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AdminSidebarCompact({ items, user, onNavigate }: { items: AdminNavItem[]; user: AdminUser | null; onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className="space-y-1 p-3" aria-label="Admin navigation">
      {items.map(({ label, href, icon: Icon, section, roles }) => {
        const active = location.startsWith(href);
        const hiddenByRole = roles && user && !roles.includes(user.role);
        if (hiddenByRole) return null;
        return (
          <Link key={href} href={href} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-[#dce6d7] text-[#173a2b]" : "text-[#28332d]/72 hover:bg-[#f3f0e8] hover:text-[#173a2b]"}`}>
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AdminCard({ title, value, note, accent = "green" }: { title: string; value: string; note: string; accent?: "green" | "orange" | "blue" | "red" }) {
  const accentMap = {
    green: "bg-[#dce6d7] text-[#173a2b]",
    orange: "bg-[#f5e1d6] text-[#bd684e]",
    blue: "bg-[#dae9f4] text-[#173a2b]",
    red: "bg-[#f8e0dc] text-[#8f3d35]",
  };
  return (
    <div className="rounded-[1.25rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#28332d]/55">{title}</p>
          <p className="mt-4 font-display text-3xl tracking-[-0.06em] text-[#173a2b]">{value}</p>
        </div>
        <span className={`grid size-10 place-items-center rounded-full ${accentMap[accent]}`}><TrendingUp size={16} /></span>
      </div>
      <p className="mt-3 text-xs text-[#28332d]/65">{note}</p>
    </div>
  );
}

function StatTrend({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#173a2b]/10 bg-[#fffdf8] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#28332d]/55">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[#173a2b]">{value}</p>
    </div>
  );
}

function TableEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#173a2b]/15 bg-[#fffdf8] p-10 text-center">
      <p className="font-display text-2xl text-[#173a2b]">{title}</p>
      <p className="mt-2 text-sm text-[#28332d]/65">{description}</p>
    </div>
  );
}

function DashboardPage() {
  const stats = buildAdminStats();
  const orders = readStorage<OrderItem[]>(adminStorageKeys.orders, defaultOrders);
  const lowStock = readStorage<ProductItem[]>(adminStorageKeys.products, defaultProducts).filter((item) => item.stock <= item.lowStockThreshold);
  const recentCustomers = readStorage<any[]>(adminStorageKeys.customers, defaultCustomers).slice(0, 4);
  const posts = readStorage<BlogPost[]>(adminStorageKeys.blogPosts, defaultBlogPosts).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow text-[#2f6b4f]">Overview</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Dashboard</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="button button-primary">Add Product</Link>
          <Link href="/admin/articles/new" className="button button-secondary">Write Article</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminCard title="Total sales" value={formatCurrency(stats.totalSales)} note="Across all live orders" accent="green" />
        <AdminCard title="Total orders" value={String(stats.totalOrders)} note="This month vs previous period" accent="blue" />
        <AdminCard title="Total products" value={String(stats.totalProducts)} note="Catalog items tracked" accent="orange" />
        <AdminCard title="Active subscriptions" value={String(stats.activeSubscriptions)} note="Recurring customer plans" accent="green" />
        <AdminCard title="Registered customers" value={String(stats.registeredCustomers)} note="Active customer accounts" accent="blue" />
        <AdminCard title="Blog views" value={String(stats.blogViews)} note="Estimated page views" accent="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-[#2f6b4f]">Sales chart</p>
              <h3 className="mt-2 text-xl font-semibold text-[#173a2b]">Monthly overview</h3>
            </div>
            <span className="rounded-full bg-[#dce6d7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#173a2b]">Live</span>
          </div>
          <div className="mt-7 flex h-44 items-end gap-3">
            {[38, 62, 48, 66, 80, 72, 93].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className="w-full rounded-t-2xl bg-[#2f6b4f]" style={{ height: `${height}%` }} />
                <span className="text-[10px] font-semibold text-[#28332d]/60">{["J", "F", "M", "A", "M", "J", "J"][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
          <p className="eyebrow text-[#2f6b4f]">Quick actions</p>
          <div className="mt-4 space-y-3">
            <Link href="/admin/products/new" className="flex items-center justify-between rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] px-3 py-3 text-sm font-semibold text-[#173a2b]"><span>Add Product</span><ChevronRight size={16} /></Link>
            <Link href="/admin/blog/new" className="flex items-center justify-between rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] px-3 py-3 text-sm font-semibold text-[#173a2b]"><span>Add Blog Post</span><ChevronRight size={16} /></Link>
            <Link href="/admin/orders" className="flex items-center justify-between rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] px-3 py-3 text-sm font-semibold text-[#173a2b]"><span>View Orders</span><ChevronRight size={16} /></Link>
            <Link href="/admin/customers" className="flex items-center justify-between rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] px-3 py-3 text-sm font-semibold text-[#173a2b]"><span>Manage Customers</span><ChevronRight size={16} /></Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#173a2b]">Recent orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-[0.14em] text-[#2f6b4f]">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[#28332d]/60">
                <tr>
                  <th className="pb-3 pr-4 font-semibold">Order</th>
                  <th className="pb-3 pr-4 font-semibold">Customer</th>
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="border-t border-[#173a2b]/10">
                    <td className="py-3 pr-4 font-semibold text-[#173a2b]">{order.id}</td>
                    <td className="py-3 pr-4 text-[#28332d]/80">{order.customer}</td>
                    <td className="py-3 pr-4 text-[#28332d]/80">{order.date}</td>
                    <td className="py-3 pr-4"><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{order.status}</span></td>
                    <td className="py-3 font-semibold text-[#173a2b]">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#173a2b]">Low-stock products</h3>
            <span className="rounded-full bg-[#f9e3a5] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#80652f]">Alert</span>
          </div>
          <div className="space-y-3">
            {lowStock.length ? lowStock.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3">
                <div>
                  <p className="text-sm font-semibold text-[#173a2b]">{item.name}</p>
                  <p className="text-[11px] text-[#28332d]/60">{item.stock} left</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#bd684e]">Low</span>
              </div>
            )) : <TableEmptyState title="All stocked" description="No urgent inventory alerts." />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
          <h3 className="text-xl font-semibold text-[#173a2b]">Recent customer activity</h3>
          <div className="mt-4 space-y-3">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3">
                <div>
                  <p className="text-sm font-semibold text-[#173a2b]">{customer.name}</p>
                  <p className="text-[11px] text-[#28332d]/60">{customer.email}</p>
                </div>
                <span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{customer.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
          <h3 className="text-xl font-semibold text-[#173a2b]">Recent articles and posts</h3>
          <div className="mt-4 space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3">
                <p className="text-sm font-semibold text-[#173a2b]">{post.title}</p>
                <p className="mt-1 text-[11px] text-[#28332d]/60">{post.status} · {post.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListPage() {
  const [products, setProducts] = useState<ProductItem[]>(() => readStorage<ProductItem[]>(adminStorageKeys.products, defaultProducts));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    writeStorage(adminStorageKeys.products, products);
  }, [products]);

  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const filtered = products.filter((product) => {
    const matchesSearch = !search || `${product.name} ${product.sku}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || product.status === status;
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleSelected = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const bulkArchive = () => {
    setProducts((current) => current.map((product) => selected.includes(product.id) ? { ...product, status: "Archived" } : product));
    setSelected([]);
  };

  const duplicateProduct = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const copy = { ...product, id: `p-${Date.now()}`, sku: `${product.sku}-COPY`, name: `${product.name} Copy` };
    setProducts((current) => [copy, ...current]);
  };

  const updateStatus = (id: string, nextStatus: ProductStatus) => {
    setProducts((current) => current.map((product) => product.id === id ? { ...product, status: nextStatus } : product));
  };

  const removeProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-[#2f6b4f]">Catalog</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Products</h2>
        </div>
        <Link href="/admin/products/new" className="button button-primary">Add Product</Link>
      </div>

      <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative max-w-xl flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2f6b4f]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="input h-11 w-full pl-9" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input h-11 min-w-[140px]">
            <option>All</option>
            <option>Draft</option>
            <option>Active</option>
            <option>Out of Stock</option>
            <option>Archived</option>
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="input h-11 min-w-[140px]">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={bulkArchive} className="button button-secondary px-3 py-2 text-[10px]">Archive selected</button>
            <button onClick={() => setSelected([])} className="button button-quiet px-3 py-2 text-[10px]">Clear</button>
          </div>
        )}
      </div>

      <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[#28332d]/60">
              <tr>
                <th className="pb-3 pr-3"><input type="checkbox" onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((item) => item.id))} checked={filtered.length > 0 && selected.length === filtered.length} /></th>
                <th className="pb-3 pr-4 font-semibold">Product</th>
                <th className="pb-3 pr-4 font-semibold">SKU</th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 pr-4 font-semibold">Price</th>
                <th className="pb-3 pr-4 font-semibold">Stock</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map((product) => (
                <tr key={product.id} className="border-t border-[#173a2b]/10">
                  <td className="py-3 pr-3"><input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggleSelected(product.id)} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="size-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-[#173a2b]">{product.name}</p>
                        <p className="text-[11px] text-[#28332d]/60">{product.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[#28332d]/75">{product.sku}</td>
                  <td className="py-3 pr-4 text-[#28332d]/75">{product.category}</td>
                  <td className="py-3 pr-4 text-[#173a2b] font-semibold">{formatCurrency(product.price)}</td>
                  <td className="py-3 pr-4 text-[#28332d]/75">{product.stock}</td>
                  <td className="py-3 pr-4"><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{product.status}</span></td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-xs font-bold text-[#2f6b4f]">Edit</Link>
                      <button onClick={() => duplicateProduct(product.id)} className="text-xs font-bold text-[#28332d]/70">Duplicate</button>
                      {product.status === "Archived" ? <button onClick={() => updateStatus(product.id, "Active")} className="text-xs font-bold text-[#2f6b4f]">Restore</button> : <button onClick={() => updateStatus(product.id, "Archived")} className="text-xs font-bold text-[#bd684e]">Archive</button>}
                      <button onClick={() => removeProduct(product.id)} className="text-xs font-bold text-[#b94638]">Delete</button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={8}><div className="py-10"><TableEmptyState title="No products found" description="Adjust filters or add a new variant." /></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductFormPage({ initialId }: { initialId?: string }) {
  const [products, setProducts] = useState<ProductItem[]>(() => readStorage<ProductItem[]>(adminStorageKeys.products, defaultProducts));
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const isEdit = Boolean(initialId);
  const product = products.find((item) => item.id === initialId) ?? null;
  const formDefaults = product ?? { id: `p-${Date.now()}`, name: "", slug: "", sku: "", category: "Kitchen", status: "Draft" as ProductStatus, price: 0, subscriptionPrice: 0, stock: 0, lowStockThreshold: 5, image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg", tags: [], createdAt: new Date().toISOString(), featured: false, bestSeller: false, type: "Refill" as const };

  const [form, setForm] = useState(formDefaults);
  const [, navigate] = useLocation();

  useEffect(() => {
    setForm(formDefaults);
  }, [initialId]);

  const updateField = (field: keyof ProductItem, value: string | number | boolean | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<string, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required";
    if (!form.sku.trim()) nextErrors.sku = "SKU is required";
    if (!form.category.trim()) nextErrors.category = "Category is required";
    if (form.price <= 0) nextErrors.price = "Price must be greater than zero";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = { ...form, createdAt: form.createdAt || new Date().toISOString() };
    setProducts((current) => {
      const next = isEdit ? current.map((item) => item.id === initialId ? payload : item) : [payload, ...current];
      writeStorage(adminStorageKeys.products, next);
      return next;
    });

    navigate("/admin/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-[#2f6b4f]">{isEdit ? "Update" : "Add"}</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">{isEdit ? "Edit product" : "New product"}</h2>
        </div>
        <Link href="/admin/products" className="button button-secondary">Back to products</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Product name</span>
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="input w-full" />
            {errors.name && <span className="mt-1 block text-[11px] font-semibold text-[#b94638]">{errors.name}</span>}
          </label>
          <label className="block">
            <span className="field-label">Slug</span>
            <input value={form.slug} onChange={(event) => updateField("slug", event.target.value)} className="input w-full" />
            {errors.slug && <span className="mt-1 block text-[11px] font-semibold text-[#b94638]">{errors.slug}</span>}
          </label>
          <label className="block">
            <span className="field-label">SKU</span>
            <input value={form.sku} onChange={(event) => updateField("sku", event.target.value)} className="input w-full" />
            {errors.sku && <span className="mt-1 block text-[11px] font-semibold text-[#b94638]">{errors.sku}</span>}
          </label>
          <label className="block">
            <span className="field-label">Category</span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="input w-full">
              <option>Kitchen</option>
              <option>Bathroom</option>
              <option>Laundry</option>
              <option>Cleaning</option>
              <option>Pantry</option>
            </select>
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="field-label">One-time price</span>
            <input type="number" value={form.price} onChange={(event) => updateField("price", Number(event.target.value))} className="input w-full" />
            {errors.price && <span className="mt-1 block text-[11px] font-semibold text-[#b94638]">{errors.price}</span>}
          </label>
          <label className="block">
            <span className="field-label">Subscription price</span>
            <input type="number" value={form.subscriptionPrice} onChange={(event) => updateField("subscriptionPrice", Number(event.target.value))} className="input w-full" />
          </label>
          <label className="block">
            <span className="field-label">Inventory</span>
            <input type="number" value={form.stock} onChange={(event) => updateField("stock", Number(event.target.value))} className="input w-full" />
          </label>
          <label className="block">
            <span className="field-label">Low stock threshold</span>
            <input type="number" value={form.lowStockThreshold} onChange={(event) => updateField("lowStockThreshold", Number(event.target.value))} className="input w-full" />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Short description</span>
            <textarea value={form.tags.join(", ")} onChange={(event) => updateField("tags", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} className="input min-h-[90px] w-full" />
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Image URL</span>
            <input value={form.image} onChange={(event) => updateField("image", event.target.value)} className="input w-full" />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[#173a2b]"><input type="checkbox" checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} /> Featured</label>
          <label className="inline-flex items-center gap-2 text-sm text-[#173a2b]"><input type="checkbox" checked={form.bestSeller} onChange={(event) => updateField("bestSeller", event.target.checked)} /> Best seller</label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="button button-primary">{isEdit ? "Save changes" : "Publish product"}</button>
          <button type="button" onClick={() => navigate("/admin/products")} className="button button-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(() => readStorage<CategoryItem[]>(adminStorageKeys.categories, defaultCategories));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addCategory = () => {
    if (!name.trim()) return;
    const next = [{ id: `cat-${Date.now()}`, name: name.trim(), slug: name.trim().toLowerCase().replace(/\s+/g, "-"), description: description || "New category", image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg", featured: false }, ...categories];
    setCategories(next);
    writeStorage(adminStorageKeys.categories, next);
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-[#2f6b4f]">Structure</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Categories</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5">
          <p className="text-xl font-semibold text-[#173a2b]">Create category</p>
          <div className="mt-4 space-y-3">
            <label className="block"><span className="field-label">Name</span><input value={name} onChange={(event) => setName(event.target.value)} className="input w-full" /></label>
            <label className="block"><span className="field-label">Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} className="input min-h-[100px] w-full" /></label>
            <button onClick={addCategory} className="button button-primary">Add category</button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5">
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3">
                <div>
                  <p className="font-semibold text-[#173a2b]">{category.name}</p>
                  <p className="text-[11px] text-[#28332d]/60">{category.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-bold text-[#2f6b4f]">Edit</button>
                  <button className="text-xs font-bold text-[#b94638]">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>(() => readStorage<OrderItem[]>(adminStorageKeys.orders, defaultOrders));
  const updateStatus = (id: string, status: OrderItem["status"]) => {
    const next = orders.map((order) => order.id === id ? { ...order, status } : order);
    setOrders(next);
    writeStorage(adminStorageKeys.orders, next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow text-[#2f6b4f]">Orders</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Order management</h2>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-4 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[#28332d]/60">
              <tr>
                <th className="pb-3 pr-4 font-semibold">Order</th>
                <th className="pb-3 pr-4 font-semibold">Customer</th>
                <th className="pb-3 pr-4 font-semibold">Date</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#173a2b]/10">
                  <td className="py-3 pr-4 font-semibold text-[#173a2b]">{order.id}</td>
                  <td className="py-3 pr-4 text-[#28332d]/80">{order.customer}</td>
                  <td className="py-3 pr-4 text-[#28332d]/80">{order.date}</td>
                  <td className="py-3 pr-4"><select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value as OrderItem["status"])} className="input h-9 min-w-[120px] text-[11px]"><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td>
                  <td className="py-3 pr-4 font-semibold text-[#173a2b]">{formatCurrency(order.total)}</td>
                  <td className="py-3"><Link href={`/admin/orders/${order.id}`} className="text-xs font-bold text-[#2f6b4f]">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminListPage<T>({ title, subtitle, items, renderItem }: { title: string; subtitle: string; items: T[]; renderItem: (item: T) => React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-[#2f6b4f]">{subtitle}</p>
        <h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">{title}</h2>
      </div>
      <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
        {items.length ? <div className="space-y-3">{items.map(renderItem)}</div> : <TableEmptyState title={`No ${title.toLowerCase()} yet`} description="Add data here when it becomes available." />}
      </div>
    </div>
  );
}

function CustomersPage() {
  const customers = readStorage<any[]>(adminStorageKeys.customers, defaultCustomers);
  return <AdminListPage title="Customers" subtitle="People" items={customers} renderItem={(customer) => <div className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3"><div><p className="font-semibold text-[#173a2b]">{customer.name}</p><p className="text-[11px] text-[#28332d]/60">{customer.email}</p></div><div className="flex gap-2 text-xs"><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[#173a2b]">{customer.orders} orders</span><span className="rounded-full bg-[#f9e3a5] px-2 py-1 text-[#80652f]">{customer.subscriptionStatus}</span></div></div>} />;
}

function SubscriptionsPage() {
  const subscriptions = readStorage<SubscriptionItem[]>(adminStorageKeys.subscriptions, defaultSubscriptions);
  return <AdminListPage title="Subscriptions" subtitle="Recurring" items={subscriptions} renderItem={(item) => <div className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3"><div><p className="font-semibold text-[#173a2b]">{item.customer}</p><p className="text-[11px] text-[#28332d]/60">{item.product} · {item.frequency}</p></div><div className="flex gap-2 text-xs"><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[#173a2b]">{item.status}</span><span className="rounded-full bg-[#f5e1d6] px-2 py-1 text-[#bd684e]">{formatCurrency(item.value)}</span></div></div>} />;
}

function ContentListPage({ title, subtitle, items }: { title: string; subtitle: string; items: Array<{ id: string; title: string; status: string; author: string }> }) {
  return <AdminListPage title={title} subtitle={subtitle} items={items} renderItem={(item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3"><div><p className="font-semibold text-[#173a2b]">{item.title}</p><p className="text-[11px] text-[#28332d]/60">{item.author}</p></div><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{item.status}</span></div>} />;
}

function ArticlesPage() {
  const articles = readStorage<ArticleItem[]>(adminStorageKeys.articles, defaultArticles);
  return <ContentListPage title="Articles" subtitle="Knowledge" items={articles.map((item) => ({ id: item.id, title: item.title, status: item.status, author: item.author }))} />;
}

function BlogPage() {
  const posts = readStorage<BlogPost[]>(adminStorageKeys.blogPosts, defaultBlogPosts);
  return <ContentListPage title="Blog" subtitle="Journal" items={posts.map((item) => ({ id: item.id, title: item.title, status: item.status, author: item.author }))} />;
}

function MediaPage() {
  const images = [
    { id: "m1", title: "Dish soap hero", status: "Used in 3 products" },
    { id: "m2", title: "Pantry shelf", status: "Used in 1 article" },
    { id: "m3", title: "Laundry bottle", status: "Unused" },
  ];
  return <AdminListPage title="Media library" subtitle="Assets" items={images} renderItem={(item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3"><div><p className="font-semibold text-[#173a2b]">{item.title}</p><p className="text-[11px] text-[#28332d]/60">{item.status}</p></div><button className="text-xs font-bold text-[#2f6b4f]">Select</button></div>} />;
}

function ReviewsPage() {
  const reviews = readStorage<any[]>(adminStorageKeys.reviews, defaultReviews);
  return <AdminListPage title="Reviews" subtitle="Feedback" items={reviews} renderItem={(item) => <div className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3"><div><p className="font-semibold text-[#173a2b]">{item.product}</p><p className="text-[11px] text-[#28332d]/60">{item.customer} · {item.rating}/5</p></div><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{item.status}</span></div>} />;
}

function CouponsPage() {
  const coupons = readStorage<CouponItem[]>(adminStorageKeys.coupons, defaultCoupons);
  return <AdminListPage title="Coupons" subtitle="Promotions" items={coupons} renderItem={(item) => <div className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3"><div><p className="font-semibold text-[#173a2b]">{item.code}</p><p className="text-[11px] text-[#28332d]/60">{item.type} · {item.value}{item.type === "Percentage" ? "%" : "$"}</p></div><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{item.status}</span></div>} />;
}

function PageManagementPage() {
  const pages = [
    { id: "p1", title: "Homepage hero", status: "Published" },
    { id: "p2", title: "Sustainability section", status: "Draft" },
    { id: "p3", title: "FAQ content", status: "Published" },
  ];
  return <AdminListPage title="Pages" subtitle="Content" items={pages} renderItem={(item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3"><p className="font-semibold text-[#173a2b]">{item.title}</p><span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{item.status}</span></div>} />;
}

function SettingsPage() {
  const user = getCurrentAdminUser();
  return (
    <div className="space-y-6">
      <div><p className="eyebrow text-[#2f6b4f]">Settings</p><h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Store settings</h2></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5">
          <p className="text-xl font-semibold text-[#173a2b]">Store details</p>
          <div className="mt-4 space-y-3">
            <label className="block"><span className="field-label">Store name</span><input className="input w-full" defaultValue="RefillLoop" /></label>
            <label className="block"><span className="field-label">Store email</span><input className="input w-full" defaultValue="hello@refillloop.co" /></label>
            <label className="block"><span className="field-label">Currency</span><input className="input w-full" defaultValue="USD" /></label>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5">
          <p className="text-xl font-semibold text-[#173a2b]">Security</p>
          <div className="mt-4 space-y-3">
            <label className="block"><span className="field-label">Current password</span><input type="password" className="input w-full" /></label>
            <label className="block"><span className="field-label">New password</span><input type="password" className="input w-full" /></label>
            <button className="button button-primary">Update password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsersPage({ user }: AdminPageProps) {
  const [admins, setAdmins] = useState<any[]>(() => readStorage<any[]>(adminStorageKeys.users, []));
  useEffect(() => {
    setAdmins(readStorage<any[]>(adminStorageKeys.users, []));
  }, []);

  if (user?.role !== "Super Admin") {
    return <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-8 text-center"><p className="eyebrow text-[#bd684e]">Restricted</p><p className="mt-2 text-lg text-[#173a2b]">Only Super Admins can manage administrator accounts.</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-[#2f6b4f]">Permissions</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Admin users</h2>
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5">
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3">
              <div>
                <p className="font-semibold text-[#173a2b]">{admin.name}</p>
                <p className="text-[11px] text-[#28332d]/60">{admin.email} · {admin.role}</p>
              </div>
              <span className="rounded-full bg-[#dce6d7] px-2 py-1 text-[10px] font-bold uppercase text-[#173a2b]">{admin.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ea] p-4">
      <div className="w-full max-w-[480px] rounded-[2rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6 shadow-[0_24px_60px_rgba(23,58,43,0.08)] md:p-8">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-[#2f6b4f] text-[#fffdf8]">
            <Building2 size={18} />
          </span>
          <div>
            <p className="font-display text-3xl leading-none tracking-[-0.05em] text-[#173a2b]">refill<span className="text-[#2f6b4f]">loop</span></p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f6b4f]">Admin portal</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!validateEmail(email)) throw new Error("Enter a valid admin email address.");
      await signInAdmin({ email, password, rememberMe });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="mb-6">
        <p className="eyebrow text-[#2f6b4f]">Welcome back</p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Admin sign in</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="field-label">Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input w-full" /></label>
        <label className="block"><span className="field-label">Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input w-full" /></label>
        <div className="flex items-center justify-between gap-2 text-xs text-[#28332d]/65">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Keep me signed in</label>
          <Link href="/admin/forgot-password" className="font-bold text-[#2f6b4f]">Forgot password?</Link>
        </div>
        {error && <p className="rounded-xl border border-[#f0d3cf] bg-[#fff4f2] px-3 py-2 text-xs font-semibold text-[#b94638]">{error}</p>}
        <button type="submit" disabled={loading} className="button button-primary w-full justify-center">{loading ? "Signing in..." : "Sign in"}</button>
      </form>
      <p className="mt-5 text-center text-sm text-[#28332d]/65">Need access? <Link href="/admin/signup" className="font-bold text-[#2f6b4f]">Create admin account</Link></p>
    </AuthPageShell>
  );
}

function AdminSignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "Store Manager" as AdminRole });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [, navigate] = useLocation();

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const passwordState = passwordStrength(form.password);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!form.name.trim()) throw new Error("Admin name is required.");
      if (!validateEmail(form.email)) throw new Error("Enter a valid email address.");
      const passwordResult = validatePassword(form.password);
      if (!passwordResult.valid) throw new Error(passwordResult.message);
      if (form.password !== form.confirmPassword) throw new Error("Passwords do not match.");
      await createAdminAccount({ ...form, role: form.role });
      setSuccess("Admin account created successfully. Redirecting...");
      setTimeout(() => navigate("/admin/login"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="mb-6">
        <p className="eyebrow text-[#2f6b4f]">Secure access</p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Create admin</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="field-label">Full name</span><input value={form.name} onChange={(event) => update("name", event.target.value)} className="input w-full" /></label>
        <label className="block"><span className="field-label">Email address</span><input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="input w-full" /></label>
        <label className="block"><span className="field-label">Role</span><select value={form.role} onChange={(event) => update("role", event.target.value)} className="input w-full"><option>Super Admin</option><option>Editor</option><option>Store Manager</option></select></label>
        <label className="block"><span className="field-label">Password</span><input type="password" value={form.password} onChange={(event) => update("password", event.target.value)} className="input w-full" /></label>
        <div className="rounded-xl border border-[#173a2b]/10 bg-[#f8f4ea] p-3 text-xs text-[#28332d]/70">
          <div className="flex items-center justify-between"><span>Password strength</span><span className="font-bold text-[#173a2b]">{passwordState.label}</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dce6d7]">
            <div className="h-full rounded-full bg-[#2f6b4f]" style={{ width: `${(passwordState.score / 4) * 100}%` }} />
          </div>
        </div>
        <label className="block"><span className="field-label">Confirm password</span><input type="password" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} className="input w-full" /></label>
        {error && <p className="rounded-xl border border-[#f0d3cf] bg-[#fff4f2] px-3 py-2 text-xs font-semibold text-[#b94638]">{error}</p>}
        {success && <p className="rounded-xl border border-[#d4ead8] bg-[#edf9ef] px-3 py-2 text-xs font-semibold text-[#2f6b4f]">{success}</p>}
        <button type="submit" disabled={loading} className="button button-primary w-full justify-center">{loading ? "Creating account..." : "Create admin account"}</button>
      </form>
      <p className="mt-5 text-center text-sm text-[#28332d]/65">Already have access? <Link href="/admin/login" className="font-bold text-[#2f6b4f]">Return to sign in</Link></p>
    </AuthPageShell>
  );
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await sendPasswordResetEmail(email);
    setStatus(result.message);
  };

  return (
    <AuthPageShell>
      <div className="mb-6">
        <p className="eyebrow text-[#2f6b4f]">Account recovery</p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Forgot password</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="field-label">Admin email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input w-full" /></label>
        {status && <p className="rounded-xl border border-[#d4ead8] bg-[#edf9ef] px-3 py-2 text-xs font-semibold text-[#2f6b4f]">{status}</p>}
        <button type="submit" className="button button-primary w-full justify-center">Send reset link</button>
      </form>
      <p className="mt-5 text-center text-sm text-[#28332d]/65">Back to <Link href="/admin/login" className="font-bold text-[#2f6b4f]">sign in</Link></p>
    </AuthPageShell>
  );
}

function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await resetAdminPassword(token, password, confirm);
      setStatus("Password updated successfully. Redirecting to sign in...");
      setTimeout(() => navigate("/admin/login"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    }
  };

  return (
    <AuthPageShell>
      <div className="mb-6">
        <p className="eyebrow text-[#2f6b4f]">Security</p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Reset password</h1>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="field-label">Reset token</span><input value={token} onChange={(event) => setToken(event.target.value)} className="input w-full" /></label>
        <label className="block"><span className="field-label">New password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input w-full" /></label>
        <label className="block"><span className="field-label">Confirm password</span><input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="input w-full" /></label>
        {error && <p className="rounded-xl border border-[#f0d3cf] bg-[#fff4f2] px-3 py-2 text-xs font-semibold text-[#b94638]">{error}</p>}
        {status && <p className="rounded-xl border border-[#d4ead8] bg-[#edf9ef] px-3 py-2 text-xs font-semibold text-[#2f6b4f]">{status}</p>}
        <button type="submit" className="button button-primary w-full justify-center">Update password</button>
      </form>
    </AuthPageShell>
  );
}

function ProtectedAdminRoute({ children, allowedRoles, section }: { children: React.ReactNode; allowedRoles?: AdminRole[]; section?: string }) {
  const user = getCurrentAdminUser();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate("/admin/dashboard");
      return;
    }
    if (section && !canAccessAdminSection(user.role, section)) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate, allowedRoles, section]);

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (section && !canAccessAdminSection(user.role, section)) return null;
  return <>{children}</>;
}

export function AdminApp() {
  const user = getCurrentAdminUser();

  return (
    <Switch>
      <Route path="/admin/login"><AdminLoginPage /></Route>
      <Route path="/admin/signup"><AdminSignUpPage /></Route>
      <Route path="/admin/forgot-password"><ForgotPasswordPage /></Route>
      <Route path="/admin/reset-password"><ResetPasswordPage /></Route>

      <Route path="/admin/dashboard">
        <ProtectedAdminRoute section="dashboard"><AdminShell><DashboardPage /></AdminShell></ProtectedAdminRoute>
      </Route>
      <Route path="/admin/products"><ProtectedAdminRoute section="products"><AdminShell><ProductListPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/products/new"><ProtectedAdminRoute section="products"><AdminShell><ProductFormPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/products/:id/edit"><ProtectedAdminRoute section="products"><AdminShell><ProductFormPage initialId={useParams<{ id: string }>().id} /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/categories"><ProtectedAdminRoute section="categories"><AdminShell><CategoriesPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/orders"><ProtectedAdminRoute section="orders"><AdminShell><OrdersPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/orders/:id"><ProtectedAdminRoute section="orders"><AdminShell><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-8"><p className="eyebrow text-[#2f6b4f]">Order detail</p><h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">#{useParams<{ id: string }>().id}</h2><p className="mt-3 text-sm text-[#28332d]/65">This order detail view is ready for a full fulfillment workflow and printable summary.</p></div></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/customers"><ProtectedAdminRoute section="customers"><AdminShell><CustomersPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/subscriptions"><ProtectedAdminRoute section="subscriptions"><AdminShell><SubscriptionsPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/articles"><ProtectedAdminRoute section="articles"><AdminShell><ArticlesPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/articles/new"><ProtectedAdminRoute section="articles"><AdminShell><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-8"><p className="eyebrow text-[#2f6b4f]">Article</p><h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Write article</h2><p className="mt-3 text-sm text-[#28332d]/65">Editor form and preview mode can be expanded here.</p></div></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/articles/:id/edit"><ProtectedAdminRoute section="articles"><AdminShell><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-8"><p className="eyebrow text-[#2f6b4f]">Article</p><h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Edit article #{useParams<{ id: string }>().id}</h2></div></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/blog"><ProtectedAdminRoute section="blog"><AdminShell><BlogPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/blog/new"><ProtectedAdminRoute section="blog"><AdminShell><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-8"><p className="eyebrow text-[#2f6b4f]">Blog</p><h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">New blog post</h2></div></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/blog/:id/edit"><ProtectedAdminRoute section="blog"><AdminShell><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-8"><p className="eyebrow text-[#2f6b4f]">Blog</p><h2 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#173a2b]">Edit post #{useParams<{ id: string }>().id}</h2></div></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/media"><ProtectedAdminRoute section="media"><AdminShell><MediaPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/reviews"><ProtectedAdminRoute section="reviews"><AdminShell><ReviewsPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/coupons"><ProtectedAdminRoute section="coupons"><AdminShell><CouponsPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/pages"><ProtectedAdminRoute section="pages"><AdminShell><PageManagementPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/settings"><ProtectedAdminRoute section="settings"><AdminShell><SettingsPage /></AdminShell></ProtectedAdminRoute></Route>
      <Route path="/admin/admin-users"><ProtectedAdminRoute allowedRoles={["Super Admin"]} section="admin-users"><AdminShell><AdminUsersPage user={user} /></AdminShell></ProtectedAdminRoute></Route>

      <Route><div className="p-10 text-center">Admin route not found.</div></Route>
    </Switch>
  );
}
