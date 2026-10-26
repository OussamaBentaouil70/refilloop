export type AdminRole = "Super Admin" | "Editor" | "Store Manager";
export type AdminStatus = "Active" | "Pending" | "Locked";
export type ProductStatus = "Draft" | "Active" | "Out of Stock" | "Archived";
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Refunded";
export type FulfillmentStatus = "Unfulfilled" | "Packed" | "Shipped" | "Delivered";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  passwordHash: string;
  passwordSalt: string;
};

export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  status: ProductStatus;
  price: number;
  subscriptionPrice: number;
  stock: number;
  lowStockThreshold: number;
  image: string;
  tags: string[];
  createdAt: string;
  featured: boolean;
  bestSeller: boolean;
  type: "Refill" | "Starter kit" | "Bundle" | "Reusable";
};

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
  children?: CategoryItem[];
};

export type OrderItem = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingMethod: string;
  items: number;
};

export type CustomerItem = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spending: number;
  subscriptionStatus: "Active" | "Paused" | "None";
  registeredAt: string;
  lastOrder: string;
  status: "Active" | "VIP" | "On hold";
};

export type SubscriptionItem = {
  id: string;
  customer: string;
  product: string;
  frequency: "Every 30 days" | "Every 60 days" | "Every 90 days";
  nextShipment: string;
  value: number;
  status: "Active" | "Paused" | "Cancelled" | "Past due";
};

export type ReviewItem = {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  status: "Approved" | "Pending" | "Rejected" | "Hidden";
  verified: boolean;
};

export type CouponItem = {
  id: string;
  code: string;
  type: "Percentage" | "Fixed";
  value: number;
  startDate: string;
  expiryDate: string;
  minOrder: number;
  usageLimit: number;
  status: "Active" | "Expired" | "Disabled";
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  excerptImage: string;
  featured: boolean;
  status: "Draft" | "Published" | "Scheduled";
  publishedAt: string;
  readTime: string;
  category: string;
};

export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  coverImage: string;
  featured: boolean;
  status: "Draft" | "Published" | "Scheduled";
  publishedAt: string;
  readTime: string;
  category: string;
};

export const adminRoles: AdminRole[] = ["Super Admin", "Editor", "Store Manager"];

export const adminSeedUsers: Omit<AdminUser, "passwordHash" | "passwordSalt">[] = [
  {
    id: "admin-1",
    name: "Ava Williams",
    email: "super@refillloop.co",
    role: "Super Admin",
    status: "Active",
    createdAt: "2024-01-12",
    lastLogin: "2026-09-01",
    emailVerified: true,
    twoFactorEnabled: true,
  },
  {
    id: "admin-2",
    name: "Mila Brooks",
    email: "editor@refillloop.co",
    role: "Editor",
    status: "Active",
    createdAt: "2024-02-02",
    lastLogin: "2026-08-25",
    emailVerified: true,
    twoFactorEnabled: false,
  },
  {
    id: "admin-3",
    name: "Noah Patel",
    email: "store@refillloop.co",
    role: "Store Manager",
    status: "Active",
    createdAt: "2024-03-01",
    lastLogin: "2026-08-30",
    emailVerified: true,
    twoFactorEnabled: false,
  },
];

export const defaultProducts: ProductItem[] = [
  { id: "p1", name: "Citrus Grove Dish Soap Refill", slug: "citrus-grove-dish-soap-refill", sku: "RLF-DS-001", category: "Kitchen", status: "Active", price: 8, subscriptionPrice: 6.8, stock: 42, lowStockThreshold: 12, image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg", tags: ["dish soap", "citrus", "kitchen"], createdAt: "2026-08-05", featured: true, bestSeller: true, type: "Refill" },
  { id: "p2", name: "Lavender Laundry Detergent Refill", slug: "lavender-laundry-detergent-refill", sku: "RLF-LD-002", category: "Laundry", status: "Active", price: 14, subscriptionPrice: 11.9, stock: 19, lowStockThreshold: 10, image: "/manus-storage/refillloop-pantry-wide-reference_abfd9aea.jpg", tags: ["laundry", "lavender"], createdAt: "2026-08-11", featured: true, bestSeller: false, type: "Refill" },
  { id: "p3", name: "Unscented Hand Soap Starter Kit", slug: "unscented-hand-soap-starter-kit", sku: "RLF-HS-003", category: "Bathroom", status: "Draft", price: 22, subscriptionPrice: 18.7, stock: 8, lowStockThreshold: 6, image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg", tags: ["starter kit", "hand soap"], createdAt: "2026-08-18", featured: false, bestSeller: false, type: "Starter kit" },
  { id: "p4", name: "Eucalyptus All-Purpose Cleaner", slug: "eucalyptus-all-purpose-cleaner", sku: "RLF-AC-004", category: "Cleaning", status: "Out of Stock", price: 10, subscriptionPrice: 8.5, stock: 0, lowStockThreshold: 7, image: "/manus-storage/refillloop-hero_940da7a9.jpg", tags: ["cleaner", "eucalyptus"], createdAt: "2026-08-20", featured: false, bestSeller: true, type: "Refill" },
  { id: "p5", name: "Botanical Shampoo Refill", slug: "botanical-shampoo-refill", sku: "RLF-SH-005", category: "Bathroom", status: "Active", price: 12, subscriptionPrice: 10.2, stock: 31, lowStockThreshold: 9, image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=85", tags: ["shampoo", "botanical"], createdAt: "2026-08-21", featured: true, bestSeller: false, type: "Refill" },
  { id: "p6", name: "Reusable Amber Bottle Set", slug: "reusable-amber-bottle-set", sku: "RLF-BT-006", category: "Kitchen", status: "Archived", price: 18, subscriptionPrice: 18, stock: 3, lowStockThreshold: 4, image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg", tags: ["bottle", "glass"], createdAt: "2026-07-13", featured: false, bestSeller: false, type: "Reusable" },
];

export const defaultCategories: CategoryItem[] = [
  { id: "cat-1", name: "Kitchen", slug: "kitchen", description: "Dish soap, cleaners, and everyday essentials for the sink and pantry.", image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg", featured: true },
  { id: "cat-2", name: "Bathroom", slug: "bathroom", description: "Hand soap and hair care for everyday rituals.", image: "/manus-storage/refillloop-pantry-reference_dcad66a9.jpg", featured: true },
  { id: "cat-3", name: "Laundry", slug: "laundry", description: "Gentle concentrates for fresh, low-waste washing.", image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=900&q=85", featured: false },
  { id: "cat-4", name: "Cleaning", slug: "cleaning", description: "Counter sprays and all-purpose cleaners made to repeat.", image: "/manus-storage/refillloop-hero_940da7a9.jpg", featured: false },
  { id: "cat-5", name: "Pantry", slug: "pantry", description: "Refillable staples to keep your cupboard in rotation.", image: "/manus-storage/refillloop-pantry-reference_dcad66a9.jpg", featured: true },
];

export const defaultOrders: OrderItem[] = [
  { id: "ORD-1048", customer: "Olivia Mason", email: "olivia@example.com", date: "2026-09-01", total: 46.75, status: "Processing", paymentStatus: "Paid", fulfillmentStatus: "Packed", shippingMethod: "Standard", items: 3 },
  { id: "ORD-1047", customer: "Samir Ali", email: "samir@example.com", date: "2026-08-30", total: 28.4, status: "Shipped", paymentStatus: "Paid", fulfillmentStatus: "Shipped", shippingMethod: "Express", items: 2 },
  { id: "ORD-1046", customer: "Morgan Lee", email: "morgan@example.com", date: "2026-08-27", total: 62.1, status: "Pending", paymentStatus: "Pending", fulfillmentStatus: "Unfulfilled", shippingMethod: "Standard", items: 5 },
  { id: "ORD-1045", customer: "Priya Singh", email: "priya@example.com", date: "2026-08-23", total: 34.9, status: "Delivered", paymentStatus: "Paid", fulfillmentStatus: "Delivered", shippingMethod: "Standard", items: 2 },
];

export const defaultCustomers: CustomerItem[] = [
  { id: "cust-1", name: "Olivia Mason", email: "olivia@example.com", orders: 4, spending: 216.5, subscriptionStatus: "Active", registeredAt: "2025-01-11", lastOrder: "2026-09-01", status: "VIP" },
  { id: "cust-2", name: "Samir Ali", email: "samir@example.com", orders: 2, spending: 94.2, subscriptionStatus: "Paused", registeredAt: "2025-05-12", lastOrder: "2026-08-30", status: "Active" },
  { id: "cust-3", name: "Priya Singh", email: "priya@example.com", orders: 6, spending: 418.7, subscriptionStatus: "Active", registeredAt: "2024-12-06", lastOrder: "2026-08-23", status: "VIP" },
  { id: "cust-4", name: "Mason Cook", email: "mason@example.com", orders: 1, spending: 28.7, subscriptionStatus: "None", registeredAt: "2026-08-15", lastOrder: "2026-08-15", status: "Active" },
];

export const defaultSubscriptions: SubscriptionItem[] = [
  { id: "sub-1", customer: "Olivia Mason", product: "Citrus Grove Dish Soap Refill", frequency: "Every 60 days", nextShipment: "2026-09-20", value: 22.4, status: "Active" },
  { id: "sub-2", customer: "Priya Singh", product: "Botanical Shampoo Refill", frequency: "Every 30 days", nextShipment: "2026-09-05", value: 28.8, status: "Active" },
  { id: "sub-3", customer: "Samir Ali", product: "Lavender Laundry Detergent Refill", frequency: "Every 90 days", nextShipment: "2026-10-02", value: 31.7, status: "Paused" },
  { id: "sub-4", customer: "Morgan Lee", product: "Eucalyptus All-Purpose Cleaner", frequency: "Every 60 days", nextShipment: "2026-09-13", value: 18.5, status: "Past due" },
];

export const defaultReviews: ReviewItem[] = [
  { id: "rev-1", customer: "Olivia Mason", product: "Citrus Grove Dish Soap Refill", rating: 5, comment: "Bright, effective, and a better fit for the sink caddy.", status: "Approved", verified: true },
  { id: "rev-2", customer: "Priya Singh", product: "Botanical Shampoo Refill", rating: 4, comment: "Very easy to work into my routine. The formula feels gentle.", status: "Pending", verified: true },
  { id: "rev-3", customer: "Samir Ali", product: "Lavender Laundry Detergent Refill", rating: 3, comment: "Good scent but I wanted a bit more strength on towels.", status: "Hidden", verified: false },
];

export const defaultCoupons: CouponItem[] = [
  { id: "cp-1", code: "WELCOME15", type: "Percentage", value: 15, startDate: "2026-08-01", expiryDate: "2026-10-31", minOrder: 35, usageLimit: 250, status: "Active" },
  { id: "cp-2", code: "FREESHIP", type: "Fixed", value: 6, startDate: "2026-07-01", expiryDate: "2026-09-10", minOrder: 50, usageLimit: 100, status: "Expired" },
  { id: "cp-3", code: "SUSTAIN10", type: "Percentage", value: 10, startDate: "2026-09-10", expiryDate: "2026-12-31", minOrder: 40, usageLimit: 500, status: "Disabled" },
];

export const defaultArticles: ArticleItem[] = [
  { id: "art-1", title: "How to build a refill routine that actually lasts", slug: "how-to-build-a-refill-routine-that-actually-lasts", excerpt: "A practical guide to turning two good habits into a repeatable routine.", author: "Ava Williams", coverImage: "/manus-storage/refillloop-pantry-reference_dcad66a9.jpg", featured: true, status: "Published", publishedAt: "2026-08-18", readTime: "4 min read", category: "Guides" },
  { id: "art-2", title: "What to keep in the sink caddy for an easier reset", slug: "what-to-keep-in-the-sink-caddy-for-an-easier-reset", excerpt: "A small shelf strategy for daily cleaning without buying more containers.", author: "Mila Brooks", coverImage: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg", featured: false, status: "Draft", publishedAt: "2026-09-02", readTime: "5 min read", category: "Home" },
];

export const defaultBlogPosts: BlogPost[] = [
  { id: "blog-1", title: "What a lighter pantry actually looks like", slug: "what-a-lighter-pantry-actually-looks-like", excerpt: "A practical look at the products that stay on rotation and the ones that are meant to be replaced.", author: "Ava Williams", excerptImage: "/manus-storage/refillloop-pantry-reference_dcad66a9.jpg", featured: true, status: "Published", publishedAt: "2026-08-16", readTime: "6 min read", category: "Sustainability" },
  { id: "blog-2", title: "Three refill swaps that made our kitchen easier", slug: "three-refill-swaps-that-made-our-kitchen-easier", excerpt: "A few small changes that made the sink and counter feel calmer and less wasteful.", author: "Mila Brooks", excerptImage: "/manus-storage/refillloop-hero_940da7a9.jpg", featured: false, status: "Scheduled", publishedAt: "2026-09-07", readTime: "3 min read", category: "Kitchen" },
];

export const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const adminStorageKeys = {
  users: "refillloop-admin-users",
  session: "refillloop-admin-session",
  products: "refillloop-admin-products",
  categories: "refillloop-admin-categories",
  orders: "refillloop-admin-orders",
  customers: "refillloop-admin-customers",
  subscriptions: "refillloop-admin-subscriptions",
  reviews: "refillloop-admin-reviews",
  coupons: "refillloop-admin-coupons",
  articles: "refillloop-admin-articles",
  blogPosts: "refillloop-admin-blog",
};
