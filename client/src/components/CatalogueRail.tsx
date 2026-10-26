// Quiet Utility reminder: these rails are functional catalogue markers that organize content and reinforce the refill/reuse/repeat loop.

import { ArrowRight, RotateCcw } from "lucide-react";

export function CatalogueRail({ index, label, note }: { index: string; label: string; note?: string }) {
  return <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.15em] text-loop"><span className="grid size-7 place-items-center rounded-full border border-loop/25 bg-cream text-[9px] tracking-normal">{index}</span><span>{label}</span><span className="h-px flex-1 bg-loop/20" />{note && <span className="hidden font-semibold tracking-[.08em] text-charcoal/45 sm:inline">{note}</span>}</div>;
}

export function LoopConnector({ label }: { label: string }) {
  return <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-loop"><span className="grid size-6 place-items-center rounded-full border border-loop/25"><RotateCcw size={12} /></span><span>{label}</span><ArrowRight size={13} className="text-terracotta" /></div>;
}
