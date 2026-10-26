// Quiet Utility reminder: even a dead end should offer a calm, useful next action.

import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return <div className="container flex min-h-[62vh] items-center py-20"><div className="max-w-[560px]"><p className="eyebrow text-terracotta">404 · shelf not found</p><h1 className="display-lg mt-4 text-forest">This page slipped<br /><span className="text-loop">out of the loop.</span></h1><p className="mt-6 max-w-[430px] text-sm leading-6 text-charcoal/65">The link may have moved, but the useful stuff is still here. Head back to the collection or return home.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="button button-primary">Browse refills <ArrowRight size={16} /></Link><Link href="/" className="button button-secondary"><ArrowLeft size={16} /> Back home</Link></div></div></div>;
}
