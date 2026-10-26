// Quiet Utility reminder: cart feedback should be brief, visible, and useful; avoid noisy motion.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products, type Product } from "@/lib/data";

type CartLine = { productId: string; quantity: number; subscription: boolean };

type ShopContextValue = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, subscription?: boolean) => void;
  removeFromCart: (productId: string, subscription?: boolean) => void;
  updateQuantity: (productId: string, quantity: number, subscription?: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  getProduct: (productId: string) => Product | undefined;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const sameLine = (line: CartLine, productId: string, subscription: boolean) => line.productId === productId && line.subscription === subscription;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("refillloop-cart") ?? "[]");
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("refillloop-wishlist") ?? "[]");
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => localStorage.setItem("refillloop-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("refillloop-wishlist", JSON.stringify(wishlist)), [wishlist]);

  const getProduct = (productId: string) => products.find((product) => product.id === productId);
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
  const cartSubtotal = cart.reduce((total, line) => {
    const product = getProduct(line.productId);
    if (!product) return total;
    return total + (line.subscription ? product.subscriptionPrice : product.price) * line.quantity;
  }, 0);

  const addToCart = (product: Product, subscription = false) => {
    setCart((current) => {
      const existing = current.find((line) => sameLine(line, product.id, subscription));
      if (existing) return current.map((line) => sameLine(line, product.id, subscription) ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { productId: product.id, quantity: 1, subscription }];
    });
    setCartOpen(true);
    toast.success(`${product.name} added to your bag`, { description: subscription ? "Subscription pricing applied." : "Ready whenever you are." });
  };

  const removeFromCart = (productId: string, subscription = false) => {
    setCart((current) => current.filter((line) => !sameLine(line, productId, subscription)));
  };

  const updateQuantity = (productId: string, quantity: number, subscription = false) => {
    if (quantity <= 0) return removeFromCart(productId, subscription);
    setCart((current) => current.map((line) => sameLine(line, productId, subscription) ? { ...line, quantity } : line));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
    const product = getProduct(productId);
    if (product) toast.success(wishlist.includes(productId) ? "Removed from saved items" : "Saved for later", { description: product.name });
  };

  const value = useMemo(() => ({ cart, wishlist, cartCount, cartSubtotal, cartOpen, setCartOpen, addToCart, removeFromCart, updateQuantity, toggleWishlist, isWishlisted: (id: string) => wishlist.includes(id), getProduct, clearCart: () => setCart([]) }), [cart, wishlist, cartCount, cartSubtotal, cartOpen]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
