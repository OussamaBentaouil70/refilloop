// Quiet Utility reminder: shopping should feel like editing a useful shelf—clear filters, calm density, quick comparison.

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, ChevronDown, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { products, type ProductCategory } from "@/lib/data";
import { ProductGrid } from "@/components/ProductCard";
import { CatalogueRail } from "@/components/CatalogueRail";

const categoryOptions: ProductCategory[] = ["Kitchen", "Bathroom", "Laundry", "Cleaning", "Pantry"];
const scentOptions = ["Any scent", "Citrus grove", "Lavender field", "Unscented", "Eucalyptus leaf", "Herbal garden", "Cedar & sage", "Warm pantry", "No scent"];
const typeOptions = ["Any type", "Refill", "Starter kit", "Bundle", "Reusable"];

export default function Shop() {
  const [location] = useLocation();
  const initialCategory = new URLSearchParams(window.location.search).get("category") as ProductCategory | null;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "All">(initialCategory && categoryOptions.includes(initialCategory) ? initialCategory : "All");
  const [scent, setScent] = useState("Any scent");
  const [type, setType] = useState("Any type");
  const [subscriptionOnly, setSubscriptionOnly] = useState(false);
  const [sort, setSort] = useState("Featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const categoryParam = new URLSearchParams(window.location.search).get("category") as ProductCategory | null;
    if (categoryParam && categoryOptions.includes(categoryParam)) setCategory(categoryParam);
  }, [location]);

  const filteredProducts = useMemo(() => {
    const output = products.filter((product) => {
      const haystack = `${product.name} ${product.description} ${product.category} ${product.scent}`.toLowerCase();
      return (!query || haystack.includes(query.toLowerCase())) && (category === "All" || product.category === category) && (scent === "Any scent" || product.scent === scent) && (type === "Any type" || product.type === type) && (!subscriptionOnly || product.subscriptionPrice < product.price);
    });
    return [...output].sort((a, b) => sort === "Price Low to High" ? a.price - b.price : sort === "Price High to Low" ? b.price - a.price : sort === "New Arrivals" ? (a.badge === "New" ? -1 : 1) : sort === "Best Selling" ? (a.badge === "Best seller" ? -1 : 1) : 0);
  }, [category, query, scent, sort, subscriptionOnly, type]);

  const clearFilters = () => { setCategory("All"); setScent("Any scent"); setType("Any type"); setSubscriptionOnly(false); setQuery(""); };
  const activeFilterCount = (category !== "All" ? 1 : 0) + (scent !== "Any scent" ? 1 : 0) + (type !== "Any type" ? 1 : 0) + (subscriptionOnly ? 1 : 0);
  return <div className="container py-10 md:py-16">
    <CatalogueRail index="01" label="the collection" note="products for the places you already live" />
    <div className="mt-9 flex flex-col gap-7 border-b border-forest/10 pb-9 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow text-terracotta">A useful shelf edit</p><h1 className="display-lg mt-4 text-forest">Good things to<br /><span className="text-loop">keep around.</span></h1><p className="mt-5 max-w-[500px] text-sm leading-6 text-charcoal/65">Refills, reusable bottles, and pantry staples chosen for the places your routines actually happen.</p></div><Link href="/subscriptions" className="button button-secondary self-start lg:self-end">Save 15% with subscriptions <ChevronDown size={15} className="rotate-[-45deg]" /></Link></div>
    <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="relative w-full max-w-[470px]"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-loop" /><label htmlFor="shop-search" className="sr-only">Search products</label><input id="shop-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product, room, or scent" className="input h-12 w-full rounded-full pl-11 pr-5" /></div><div className="flex items-center justify-between gap-3 md:justify-end"><button onClick={() => setFiltersOpen((open) => !open)} className="button button-secondary md:hidden"><SlidersHorizontal size={15} /> Filters {activeFilterCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-terracotta text-[10px] text-white">{activeFilterCount}</span>}</button><label className="flex items-center gap-2 text-xs font-semibold text-forest"><span className="hidden text-charcoal/50 sm:inline">Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-full border border-forest/15 bg-cream px-4 text-xs font-bold text-forest outline-none focus:border-loop"><option>Featured</option><option>Best Selling</option><option>Price Low to High</option><option>Price High to Low</option><option>New Arrivals</option></select></label></div></div>
    <div className="mt-8 grid gap-10 lg:grid-cols-[190px_1fr]"><aside className={`${filtersOpen ? "block" : "hidden"} md:block`}><div className="sticky top-[98px] rounded-2xl border border-forest/10 bg-sage/20 p-5"><div className="flex items-center justify-between"><p className="eyebrow text-loop">Filter by</p><button className="text-[11px] font-bold text-terracotta hover:underline" onClick={clearFilters}>Clear</button></div><FilterGroup title="Room"><div className="space-y-1.5">{["All", ...categoryOptions].map((option) => <button key={option} onClick={() => setCategory(option as ProductCategory | "All")} className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold transition-colors ${category === option ? "bg-cream text-loop" : "text-charcoal/60 hover:bg-cream/60 hover:text-forest"}`}>{option}{category === option && <Check size={14} />}</button>)}</div></FilterGroup><FilterGroup title="Scent"><select value={scent} onChange={(event) => setScent(event.target.value)} className="input h-10 w-full text-xs"><option>Any scent</option>{scentOptions.slice(1).map((option) => <option key={option}>{option}</option>)}</select></FilterGroup><FilterGroup title="Product type"><select value={type} onChange={(event) => setType(event.target.value)} className="input h-10 w-full text-xs"><option>Any type</option>{typeOptions.slice(1).map((option) => <option key={option}>{option}</option>)}</select></FilterGroup><FilterGroup title="Availability"><label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-charcoal/65"><input type="checkbox" checked={subscriptionOnly} onChange={(event) => setSubscriptionOnly(event.target.checked)} className="mt-1 accent-[#2f6b4f]" /> Subscription eligible</label></FilterGroup></div></aside><div><div className="mb-5 flex items-center justify-between"><p className="text-xs font-semibold text-charcoal/50"><span className="font-bold text-forest">{filteredProducts.length}</span> products {location === "/shop" && category !== "All" ? `in ${category}` : ""}</p>{activeFilterCount > 0 && <div className="flex flex-wrap justify-end gap-2">{category !== "All" && <FilterChip label={category} onRemove={() => setCategory("All")} />}{scent !== "Any scent" && <FilterChip label={scent} onRemove={() => setScent("Any scent")} />}{subscriptionOnly && <FilterChip label="Subscriptions" onRemove={() => setSubscriptionOnly(false)} />}</div>}</div><ProductGrid items={filteredProducts} /></div></div>
  </div>;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) { return <div className="mt-7 border-t border-forest/10 pt-5 first:mt-6 first:border-t-0 first:pt-0"><p className="mb-3 text-xs font-bold text-forest">{title}</p>{children}</div>; }
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) { return <button onClick={onRemove} className="inline-flex items-center gap-1.5 rounded-full bg-sage/50 px-2.5 py-1 text-[10px] font-bold text-loop">{label}<X size={12} /></button>; }
