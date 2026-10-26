// Quiet Utility reminder: public-facing navigation should feel like a useful catalogue rail, not a generic app shell.
// Preserve warm cream surfaces, thin rules, left-anchored composition, and accessible focus states.

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { products, formatPrice } from "@/lib/data";
import { useShop } from "@/contexts/ShopContext";

const navItems = [
  ["Shop", "/shop"],
  ["Subscriptions", "/subscriptions"],
  ["How it works", "/how-it-works"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-cream" aria-label="RefillLoop home">
      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-loop to-[#7a9276] text-sm font-black tracking-[-0.08em] text-cream shadow-sm transition-transform duration-200 group-hover:rotate-[-8deg]">RL</span>
      {!compact && <span className="font-display text-[1.42rem] font-semibold tracking-[-0.05em] text-forest">refill<span className="text-loop">loop</span></span>}
    </Link>
  );
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartSubtotal, getProduct, removeFromCart, updateQuantity } = useShop();
  if (!cartOpen) return null;
  const shippingProgress = Math.min(cartSubtotal / 50, 1) * 100;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button className="absolute inset-0 bg-forest/25 backdrop-blur-[2px]" aria-label="Close shopping bag" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-forest/10 bg-cream shadow-2xl animate-drawer-in">
        <div className="flex items-center justify-between border-b border-forest/10 px-6 py-5">
          <div>
            <p className="eyebrow text-loop">Your bag</p>
            <h2 className="mt-1 font-display text-2xl text-forest">Refill, on your terms.</h2>
          </div>
          <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-start justify-center py-20">
              <span className="mb-5 grid size-16 place-items-center rounded-full bg-sage/40 text-loop"><ShoppingBag size={24} /></span>
              <p className="font-display text-2xl text-forest">Your bag is ready.</p>
              <p className="mt-2 max-w-[260px] text-sm leading-6 text-charcoal/65">Add a few refills and your next routine is one step closer.</p>
              <Link href="/shop" onClick={() => setCartOpen(false)} className="button button-primary mt-7">Shop the collection <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-loop/10 bg-sage/25 p-4">
                <div className="flex items-center justify-between gap-4 text-xs font-semibold text-forest"><span>{cartSubtotal >= 50 ? "Free shipping unlocked" : "Free shipping at $50"}</span><span>{formatPrice(Math.max(0, 50 - cartSubtotal))} to go</span></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream"><div className="h-full rounded-full bg-terracotta transition-[width] duration-300" style={{ width: `${shippingProgress}%` }} /></div>
              </div>
              <div className="mt-6 space-y-5">
                {cart.map((line) => {
                  const product = getProduct(line.productId);
                  if (!product) return null;
                  const price = line.subscription ? product.subscriptionPrice : product.price;
                  return <div key={`${line.productId}-${line.subscription}`} className="flex gap-4 border-b border-forest/10 pb-5">
                    <img src={product.image} alt={product.imageAlt} className="size-[76px] shrink-0 rounded-xl object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2"><div><p className="text-sm font-semibold leading-5 text-forest">{product.name}</p><p className="mt-1 text-xs text-charcoal/55">{line.subscription ? "Subscription" : "One-time"}</p></div><button onClick={() => removeFromCart(line.productId, line.subscription)} className="text-charcoal/40 transition-colors hover:text-terracotta" aria-label={`Remove ${product.name}`}><X size={16} /></button></div>
                      <div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-full border border-forest/15 bg-white/50"><button className="grid size-7 place-items-center text-forest/70 hover:text-terracotta" onClick={() => updateQuantity(line.productId, line.quantity - 1, line.subscription)} aria-label="Decrease quantity">−</button><span className="w-6 text-center text-xs font-semibold text-forest">{line.quantity}</span><button className="grid size-7 place-items-center text-forest/70 hover:text-terracotta" onClick={() => updateQuantity(line.productId, line.quantity + 1, line.subscription)} aria-label="Increase quantity">+</button></div><p className="text-sm font-semibold text-forest">{formatPrice(price * line.quantity)}</p></div>
                    </div>
                  </div>;
                })}
              </div>
            </>
          )}
        </div>
        {cart.length > 0 && <div className="border-t border-forest/10 bg-cream px-6 py-5"><div className="flex items-center justify-between text-sm text-charcoal/65"><span>Subtotal</span><span className="font-semibold text-forest">{formatPrice(cartSubtotal)}</span></div><div className="mt-1 flex items-center justify-between text-xs text-charcoal/50"><span>Shipping</span><span>{cartSubtotal >= 50 ? "Free" : "Calculated at checkout"}</span></div><Link href="/cart" onClick={() => setCartOpen(false)} className="button button-primary mt-5 w-full justify-center">View bag <ArrowRight size={16} /></Link></div>}
      </aside>
    </div>
  );
}

function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = query.trim() ? products.filter((product) => `${product.name} ${product.category} ${product.scent}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  if (!open) return null;
  return <div className="fixed inset-0 z-40 bg-cream/95 backdrop-blur-md"><div className="container py-6"><div className="flex items-center justify-between"><p className="eyebrow text-loop">Search the collection</p><button className="icon-button" onClick={onClose} aria-label="Close search"><X size={20} /></button></div><div className="mt-10 max-w-2xl"><div className="flex items-center gap-3 border-b-2 border-loop pb-3"><Search size={22} className="text-loop" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent font-display text-3xl text-forest outline-none placeholder:text-forest/30" placeholder="Try “laundry” or “citrus”" aria-label="Search products" /></div><div className="mt-5 space-y-1">{results.map((product) => <Link key={product.id} href={`/product/${product.slug}`} onClick={onClose} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-sage/30"><img src={product.image} alt="" className="size-12 rounded-lg object-cover" /><span className="flex-1 text-sm font-semibold text-forest">{product.name}</span><span className="text-xs text-charcoal/55">{formatPrice(product.price)}</span><ArrowRight size={15} className="text-loop" /></Link>)}{query && results.length === 0 && <p className="py-5 text-sm text-charcoal/60">No refills matched that search. Try another everyday essential.</p>}{!query && <p className="py-5 text-sm text-charcoal/60">Search by product, room, or scent.</p>}</div></div></div></div>;
}

export function Header() {
  const [location] = useLocation();
  const { cartCount, wishlist, setCartOpen } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [location]);
  return <>
    <div className="bg-loop px-4 py-2 text-center text-[11px] font-semibold tracking-[0.08em] text-cream">Free shipping on orders over $50 <span className="mx-2 text-terracotta">•</span> Packed light, made to repeat</div>
    <header className="sticky top-0 z-30 border-b border-forest/10 bg-cream/95 backdrop-blur-md"><div className="container flex h-[76px] items-center justify-between gap-6"><Logo /><nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">{navItems.map(([label, href]) => <Link key={href} href={href} className={`nav-link ${location === href ? "nav-link-active" : ""}`}>{label}{label === "Shop" && <ChevronDown size={13} className="ml-1" />}</Link>)}</nav><div className="flex items-center gap-1.5"><button onClick={() => setSearchOpen(true)} className="icon-button" aria-label="Search"><Search size={19} /></button><Link href="/account" className="icon-button hidden sm:inline-flex" aria-label="Account"><span className="relative block size-[18px] rounded-full border-[1.7px] border-current"><span className="absolute left-1/2 top-[2px] size-[5px] -translate-x-1/2 rounded-full bg-current" /><span className="absolute bottom-[2px] left-1/2 h-[5px] w-[9px] -translate-x-1/2 rounded-t-full bg-current" /></span></Link><Link href="/saved" className="icon-button relative hidden sm:inline-flex" aria-label={`Saved items${wishlist.length ? `, ${wishlist.length}` : ""}`}><Heart size={19} /><span className="absolute -right-0.5 -top-0.5 hidden size-3.5 place-items-center rounded-full bg-terracotta text-[9px] font-bold text-white sm:grid">{wishlist.length}</span></Link><button onClick={() => setCartOpen(true)} className="icon-button relative" aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ""}`}><ShoppingBag size={19} />{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-3.5 place-items-center rounded-full bg-terracotta text-[9px] font-bold text-white">{cartCount}</span>}</button><button onClick={() => setMenuOpen((open) => !open)} className="icon-button lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div></div>{menuOpen && <nav className="border-t border-forest/10 bg-cream px-4 py-4 lg:hidden" aria-label="Mobile navigation"><div className="container flex flex-col gap-1">{navItems.map(([label, href]) => <Link key={href} href={href} className="rounded-xl px-3 py-3 font-medium text-forest hover:bg-sage/30">{label}</Link>)}<Link href="/saved" className="rounded-xl px-3 py-3 font-medium text-forest hover:bg-sage/30">Saved items <span className="text-xs text-charcoal/50">({wishlist.length})</span></Link></div></nav>}</header><SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} /><CartDrawer /></>;
}

export function Footer() {
  return <footer className="border-t border-forest/10 bg-sage/25"><div className="container py-14 md:py-20"><div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr]"><div><Logo /><p className="mt-5 max-w-[270px] text-sm leading-6 text-charcoal/65">Refills for the everyday things. Less packaging, more staying power.</p><div className="mt-7 flex gap-2"><a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">ig</a><a href="https://pinterest.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Pinterest">p</a><a href="mailto:hello@refillloop.co" className="social-link" aria-label="Email RefillLoop">@</a></div></div><div><p className="eyebrow text-loop">Explore</p><div className="mt-5 flex flex-col items-start gap-3 text-sm text-charcoal/70"><Link href="/shop" className="footer-link">Shop all</Link><Link href="/subscriptions" className="footer-link">Subscriptions</Link><Link href="/how-it-works" className="footer-link">How it works</Link><Link href="/about" className="footer-link">Our story</Link></div></div><div><p className="eyebrow text-loop">Good to know</p><div className="mt-5 flex flex-col items-start gap-3 text-sm text-charcoal/70"><a href="#shipping" className="footer-link">Shipping information</a><a href="#returns" className="footer-link">Returns & exchanges</a><a href="#privacy" className="footer-link">Privacy policy</a><a href="#terms" className="footer-link">Terms of use</a><a href="#cookies" className="footer-link">Cookie preferences</a></div></div><div><p className="eyebrow text-loop">A note for your inbox</p><p className="mt-4 text-sm leading-6 text-charcoal/65">Occasional notes on refill routines, new drops, and ways to keep the cupboard in rotation.</p><NewsletterForm /></div></div><div className="mt-14 flex flex-col gap-3 border-t border-forest/10 pt-5 text-xs text-charcoal/50 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 RefillLoop. Built for repeat.</span><span>Questions? <a href="mailto:hello@refillloop.co" className="font-semibold text-loop hover:underline">hello@refillloop.co</a></span></div></div></footer>;
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Enter a valid email address"); return; } setSubmitted(true); toast.success("You’re on the list", { description: "We’ll keep it useful and occasional." }); };
  if (submitted) return <div className="mt-5 rounded-xl border border-loop/15 bg-cream px-4 py-3 text-sm text-loop">Thanks — keep an eye on your inbox.</div>;
  return <form onSubmit={submit} className="mt-5 flex gap-2"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="input min-w-0 flex-1" /><button className="button button-primary shrink-0 px-4" type="submit" aria-label="Join newsletter"><ArrowRight size={16} /></button></form>;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-cream text-charcoal"><Header /><main>{children}</main><Footer /></div>;
}
