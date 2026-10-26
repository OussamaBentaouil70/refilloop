// Quiet Utility reminder: product cards are catalogue tiles—clear hierarchy, practical metadata, restrained hover motion.

import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Heart, Plus, X } from "lucide-react";
import { LoopConnector } from "@/components/CatalogueRail";
import { Product, formatPrice } from "@/lib/data";
import { useShop } from "@/contexts/ShopContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [quickView, setQuickView] = useState(false);
  return <>
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-[1.35rem] bg-sage/30">
        {product.badge && <span className="absolute left-4 top-4 z-10 rounded-full bg-cream px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-loop shadow-sm">{product.badge}</span>}
        <button onClick={() => toggleWishlist(product.id)} aria-label={isWishlisted(product.id) ? `Remove ${product.name} from saved items` : `Save ${product.name}`} className={`absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border transition-all ${isWishlisted(product.id) ? "border-terracotta bg-terracotta text-white" : "border-forest/10 bg-cream/80 text-forest hover:border-terracotta hover:text-terracotta"}`}><Heart size={16} fill={isWishlisted(product.id) ? "currentColor" : "none"} /></button>
        <Link href={`/product/${product.slug}`} className="block aspect-[4/4.5] overflow-hidden"><img src={product.image} alt={product.imageAlt} className="size-full object-cover transition duration-500 ease-out group-hover:scale-[1.035]" loading="lazy" /></Link>
        <button onClick={() => setQuickView(true)} className="absolute bottom-4 left-4 right-4 translate-y-2 rounded-full bg-cream/95 px-4 py-3 text-xs font-bold text-forest opacity-0 shadow-lg backdrop-blur transition duration-250 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100">Quick view <ArrowRight size={14} className="ml-1 inline" /></button>
      </div>
      <div className="flex flex-1 flex-col border-t border-forest/10 pt-4"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-loop">{product.category} · {product.type}</p><Link href={`/product/${product.slug}`} className="mt-2 block font-display text-[1.15rem] leading-5 text-forest transition-colors hover:text-terracotta">{product.name}</Link></div><button onClick={() => addToCart(product)} className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-loop text-cream transition hover:bg-terracotta active:scale-95" aria-label={`Add ${product.name} to cart`}><Plus size={17} /></button></div><p className="mt-2 max-w-[260px] text-sm leading-5 text-charcoal/60">{product.description}</p><div className="mt-auto pt-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-forest">{formatPrice(product.price)}</span><span className="text-[11px] text-charcoal/50">{formatPrice(product.subscriptionPrice)} subscription</span></div><div className="mt-3"><LoopConnector label={product.type === "Reusable" ? "reuse / repeat" : "refill / reuse / repeat"} /></div></div></div>
    </article>
    {quickView && <QuickView product={product} onClose={() => setQuickView(false)} />}
  </>;
}

function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useShop();
  return <div className="fixed inset-0 z-50 grid place-items-center bg-forest/25 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}><button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close quick view" /><div className="relative grid w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-cream shadow-2xl md:grid-cols-2 animate-pop-in"><button className="icon-button absolute right-4 top-4 z-10 bg-cream/80" onClick={onClose} aria-label="Close quick view"><X size={18} /></button><div className="aspect-square bg-sage/30 md:aspect-auto"><img src={product.image} alt={product.imageAlt} className="size-full object-cover" /></div><div className="flex flex-col justify-center p-7 sm:p-10"><p className="eyebrow text-loop">{product.category} · {product.type}</p><h2 className="mt-3 font-display text-3xl leading-tight text-forest">{product.name}</h2><p className="mt-4 text-sm leading-6 text-charcoal/65">{product.longDescription}</p><div className="mt-6 flex items-center justify-between border-y border-forest/10 py-4"><span className="font-semibold text-forest">{formatPrice(product.price)}</span><span className="text-xs text-charcoal/55">{product.size}</span></div><div className="mt-6 flex flex-col gap-2 sm:flex-row"><button onClick={() => { addToCart(product); onClose(); }} className="button button-primary flex-1 justify-center">Add to bag <Plus size={16} /></button><Link href={`/product/${product.slug}`} onClick={onClose} className="button button-secondary flex-1 justify-center">See full details</Link></div></div></div></div>;
}

export function ProductGrid({ items }: { items: Product[] }) {
  if (!items.length) return <div className="rounded-2xl border border-dashed border-forest/20 bg-sage/15 p-12 text-center"><p className="font-display text-2xl text-forest">Nothing in this corner yet.</p><p className="mt-2 text-sm text-charcoal/60">Try loosening a filter or searching another room.</p></div>;
  return <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
