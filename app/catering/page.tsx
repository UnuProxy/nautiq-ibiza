"use client";

/**
 * Nautiq Catering — COMPLETE FIXED VERSION
 * - Checkout form reorganized into proper 2-column grid (cleaner UX)
 * - Cart notification badge reduced to sensible size
 * - Cart persisted to localStorage to survive page refresh
 */

import { useCallback, useEffect, useMemo, useRef, useState, ChangeEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  collection, query, where, getDocs, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ShoppingCart, Plus, Star, Clock, Search, X, ArrowLeft, Loader2, Minus,
} from "lucide-react";

/* ========================
   TYPES
========================= */
interface Toast { id: string; type: "success" | "error" | "info" | "warning"; message: string }
interface Variant { label: string; priceDelta?: number }
interface Product {
  id: string; name: string; price: number; description: string; imageUrl: string; category: string;
  contents?: string; stock: number; isActive: boolean; prepTime?: number; rating?: number; reviews?: number;
  tags?: string[]; variants?: Variant[]; isColdChain?: boolean; featured?: boolean;
}
interface CartItem { key: string; productId: string; name: string; imageUrl: string; price: number; variantLabel?: string; quantity: number; stock: number; tags?: string[]; specialInstructions?: string }
interface OrderData {
  customerName: string; email: string; phone: string; marina: string; deliveryDate: string; deliveryTime: string;
  boatCompany: string; boatName: string; items: CartItem[]; subtotal: number; delivery: number; total: number;
}
type Page = "shop" | "checkout" | "confirmation";

/* ========================
   CONSTANTS
========================= */
const BRAND = "#2095AE";
const FREE_DELIVERY_THRESHOLD = 150;
const MIN_ORDER = 50;
const DELIVERY_COST = 15;
const MARINAS = [
  "Marina Ibiza",
  "Botafoch",
  "Club Náutico Ibiza",
];
const DELIVERY_TIMES = [
  { label: "08:00 – 12:00", value: "08:00-12:00" },
  { label: "12:00 – 16:00", value: "12:00-16:00" },
  { label: "16:00 – 20:00", value: "16:00-20:00" },
  { label: "20:00 – 22:00", value: "20:00-22:00" },
];


let toastIdCounter = 0;

/* ========================
   STYLING CONSTANTS
========================= */
const INPUT_CLASSES = {
  base: "rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-offset-0 focus:ring-cyan-500 outline-none transition-all",
  default: "border-slate-200 bg-white",
  error: "border-rose-500 ring-rose-100 bg-rose-50",
};

const LABEL_CLASSES = "text-sm font-semibold text-slate-700";
const ERROR_TEXT_CLASSES = "text-xs text-rose-600 font-medium";

/* ========================
   SMALL FORM PRIMITIVES
========================= */
interface FormInputProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "date" | "number";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  min?: string;
}

function FormInput({ label, name, type = "text", value, onChange, placeholder, error, min }: FormInputProps) {
  const inputClass = `${INPUT_CLASSES.base} ${error ? INPUT_CLASSES.error : INPUT_CLASSES.default}`;
  return (
    <div className="grid gap-2">
      <label className={LABEL_CLASSES}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className={inputClass}
      />
      {error && <p className={ERROR_TEXT_CLASSES}>{error}</p>}
    </div>
  );
}

interface SelectOption { value: string; label: string; }
interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
}
function FormSelect({ label, name, value, onChange, options, error }: FormSelectProps) {
  const selectClass = `${INPUT_CLASSES.base} bg-white ${error ? INPUT_CLASSES.error : INPUT_CLASSES.default}`;
  return (
    <div className="grid gap-2">
      <label className={LABEL_CLASSES}>{label}</label>
      <select name={name} value={value} onChange={onChange} className={selectClass}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className={ERROR_TEXT_CLASSES}>{error}</p>}
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}
function FormTextarea({ label, name, value, onChange, placeholder, rows = 4 }: FormTextareaProps) {
  return (
    <div className="grid gap-2">
      <label className={LABEL_CLASSES}>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`${INPUT_CLASSES.base} ${INPUT_CLASSES.default} resize-none`}
      />
    </div>
  );
}

interface SummaryItem { label: string; value: string | React.ReactNode; isBold?: boolean; textSize?: "text-xs" | "text-sm" | "text-base" | "text-lg"; }
function SummaryBox({ title, items }: { title: string; items: SummaryItem[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div key={idx} className={`flex justify-between ${item.textSize || "text-sm"}`}>
            <span className="text-slate-600">{item.label}</span>
            <span className={`font-semibold text-slate-900 ${item.isBold ? "font-bold" : ""}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryCostDisplay({ cost, currency, brandColor }: { cost: number; currency: (n: number) => string; brandColor: string }) {
  const isFree = cost === 0;
  return <span className={isFree ? "font-bold" : ""} style={{ color: isFree ? brandColor : undefined }}>{isFree ? "FREE" : currency(cost)}</span>;
}

function getToastColors(type: Toast["type"], brandColor: string) {
  const map: Record<Toast["type"], { bg: string; text: string }> = {
    success: { bg: brandColor, text: "text-white" },
    error: { bg: "#dc2626", text: "text-white" },
    info: { bg: "#0891b2", text: "text-white" },
    warning: { bg: "#d97706", text: "text-white" },
  };
  return map[type];
}

/* ========================
   HEADER + SEARCH MODAL
========================= */
function Header({
  badgeCount, openCart, headBg, headBorder, headBlur,
  committedSearch, setCommittedSearch, draftSearch, setDraftSearch,
}: {
  badgeCount: number;
  openCart: () => void;
  headBg: any; headBorder: any; headBlur: any;
  committedSearch: string; setCommittedSearch: (v: string) => void;
  draftSearch: string; setDraftSearch: (v: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.header style={{ background: headBg, borderBottomColor: headBorder, backdropFilter: headBlur as any }} className="sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="font-black tracking-tight text-xl text-slate-900 select-none shrink-0">Nautiq Catering</div>
        <div className="flex-1" />
        <button
          onClick={() => setSearchOpen(true)}
          className="inline-grid place-items-center w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50"
          aria-label="Open search (⌘K)" title="Search (⌘K)"
        >
          <Search className="w-5 h-5 text-slate-600" />
        </button>
        <button
          onClick={openCart}
          aria-label="Open basket"
          className="relative ml-2 inline-grid place-items-center w-11 h-11 rounded-lg bg-slate-900 text-white"
        >
          <ShoppingCart className="w-5 h-5" />
          {badgeCount > 0 && (
            <motion.span key={badgeCount} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-[8px] font-bold flex items-center justify-center text-white shadow-sm leading-none" style={{ background: BRAND }}>
              {badgeCount}
            </motion.span>
          )}
        </button>
      </div>

      <SearchModal
        open={searchOpen}
        value={draftSearch}
        onChange={setDraftSearch}
        onSubmit={(q) => { setCommittedSearch(q); setSearchOpen(false); }}
        onClose={() => setSearchOpen(false)}
      />
    </motion.header>
  );
}

function HeaderCompact({
  badgeCount = 0, openCart, title, onBack, headBg, headBorder, headBlur,
}: {
  badgeCount?: number; openCart?: () => void; title?: string; onBack?: () => void; headBg: any; headBorder: any; headBlur: any;
}) {
  return (
    <motion.header style={{ background: headBg, borderBottomColor: headBorder, backdropFilter: headBlur as any }} className="sticky top-0 z-50 border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        {onBack ? (
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-9" />}
        <div className="font-black tracking-tight text-lg text-slate-900">{title || "Nautiq Catering"}</div>
        <div className="flex-1" />
        {openCart && (
          <button
            onClick={openCart}
            aria-label="Open basket"
            className="relative inline-grid place-items-center w-10 h-10 rounded-lg bg-slate-900 text-white"
          >
            <ShoppingCart className="w-5 h-5" />
            {badgeCount > 0 && (
              <motion.span key={badgeCount} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-[8px] font-bold flex items-center justify-center text-white shadow-sm leading-none" style={{ background: BRAND }}>
                {badgeCount}
              </motion.span>
            )}
          </button>
        )}
      </div>
    </motion.header>
  );
}

function SearchModal({
  open, onClose, value, onChange, onSubmit,
}: {
  open: boolean; onClose: () => void; value: string; onChange: (v: string) => void; onSubmit: (v: string) => void;
}) {
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm grid place-items-start pt-24 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-2xl p-3" role="dialog" aria-modal="true" aria-label="Search products">
          <label className="relative block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search wines, spirits, fresh food…"
              className="w-full pl-9 pr-24 py-2.5 rounded-lg bg-white border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {value && (
              <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-semibold rounded-md text-white" style={{ background: BRAND }}>
              Search
            </button>
          </label>
          <div className="text-[11px] text-slate-500 mt-2">Press Enter to search • ⌘K / Ctrl+K to toggle</div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

/* ========================
   HERO SECTION
========================= */
function HeroSection({ mounted, products = [] as Product[] }: { mounted: boolean; products?: Product[] }) {
  const featured = useMemo(() => {
    const f = products.filter((p) => p.featured).slice(0, 3);
    return f.length ? f : products.slice(0, 3);
  }, [products]);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#031319] via-[#062327] to-[#07313a] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[88vw] h-[88vw] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-48 left-10 w-[60vw] h-[60vw] rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur px-3 py-1 text-[13px] font-semibold">
            <span>Premium yacht provisioning</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }} className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
            Luxury provisions delivered to your yacht
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="mt-3 max-w-xl text-white/90">
            Curated wines, spirits and gourmet produce for Ibiza &amp; Formentera. Cold chain safe. Two-to-four hour delivery windows.
          </motion.p>
        </div>

        <div className="relative h-[360px] md:h-[440px] lg:h-[520px]">
          <AnimatePresence>
            {mounted && featured.map((p, i) => (
              <BottleFloat key={p.id} idx={i} imageUrl={p.imageUrl} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function BottleFloat({ idx, imageUrl }: { idx: number; imageUrl: string }) {
  const POS = [
    { sm: { x: 18, y: 18, rot: -6, z: 10 }, md: { x: 14, y: 10, rot: -6, z: 10 }, lg: { x: 12, y: 6, rot: -6, z: 10 } },
    { sm: { x: 50, y: -2, rot: 0,  z: 30 }, md: { x: 50, y: -6, rot: 0,  z: 30 }, lg: { x: 48, y: -10, rot: 0, z: 30 } },
    { sm: { x: 82, y: 18, rot: 6,  z: 20 }, md: { x: 86, y: 10, rot: 6,  z: 20 }, lg: { x: 90, y: 6, rot: 6,  z: 20 } },
  ][idx] || { sm: { x: 50, y: 0, rot: 0, z: 10 }, md: { x: 50, y: 0, rot: 0, z: 10 }, lg: { x: 50, y: 0, rot: 0, z: 10 } };

  const size = idx === 1 ? "clamp(150px, 21vw, 300px)" : "clamp(128px, 17vw, 260px)";
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <motion.div initial={{ opacity: 0, y: 40, rotate: POS.sm.rot }} animate={{ opacity: 1, y: 0, rotate: POS.sm.rot }} transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.12 * idx }} className="absolute" style={{ left: `${POS.sm.x}%`, top: `${POS.sm.y}%`, zIndex: POS.sm.z }}>
      <style jsx>{`
        @media (min-width: 768px) {
          .b-${idx} { left: ${POS.md.x}%; top: ${POS.md.y}%; z-index: ${POS.md.z}; transform: translate(-50%, 0) rotate(${POS.md.rot}deg); }
        }
        @media (min-width: 1024px) {
          .b-${idx} { left: ${POS.lg.x}%; top: ${POS.lg.y}%; z-index: ${POS.lg.z}; transform: translate(-50%, 0) rotate(${POS.lg.rot}deg); }
        }
      `}</style>
      <div className={`b-${idx} relative -translate-x-1/2`} style={{ transform: `translate(-50%, 0) rotate(${POS.sm.rot}deg)` }}>
        <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-white/20 via-white/5 to-transparent blur-xl" />
        <motion.img
          src={imageUrl}
          alt="Featured product"
          style={{ width: size, height: "auto" }}
          className="relative z-[1] object-contain drop-shadow-[0_28px_42px_rgba(0,0,0,0.45)] select-none will-change-transform"
          whileHover={!prefersReduced ? { scale: 1.045, rotate: idx === 1 ? 0.5 : (idx === 0 ? -0.5 : 0.5) } : {}}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <motion.div aria-hidden initial={{ opacity: 0.35 }} animate={!prefersReduced ? { opacity: [0.35, 0.5, 0.35], y: [0, -4, 0] } : { opacity: 0.4 }} transition={!prefersReduced ? { duration: 4 + idx, repeat: Infinity, ease: "easeInOut" } : {}} className="mt-2 h-4 w-2/3 mx-auto rounded-full bg-black/40 blur-[10px]" />
      </div>
    </motion.div>
  );
}

/* ========================
   CATEGORY BELT
========================= */
function CategoryBelt({ categories, current, onSelect }: { categories: string[]; current: string; onSelect: (c: string) => void }) {
  return (
    <div className="z-40 bg-white/90 backdrop-blur-sm border-b shadow-sm sticky" style={{ top: 60 }}>
      <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2">
          {categories.map((c) => {
            const active = current === c;
            return (
              <button
                key={c}
                onClick={() => onSelect(c)}
                className={`relative group flex items-center gap-2 px-4 py-2 rounded-lg border text-sm whitespace-nowrap font-semibold transition-all ${active ? "text-white shadow-md" : "bg-white border-slate-200 text-slate-700 hover:border-cyan-300"}`}
                style={{ background: active ? BRAND : undefined, borderColor: active ? BRAND : undefined }}
                aria-pressed={active}
              >
                <span className="capitalize">{c === "all" ? "All items" : c}</span>
                {active && <motion.span layoutId="cat-dot" className="absolute -bottom-1 left-1/2 size-[6px] -translate-x-1/2 rounded-full bg-cyan-300 shadow" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ========================
   PRODUCT CARD
========================= */
function ProductCard({ product, onSelect, currency }: { product: Product; onSelect: (p: Product) => void; currency: (n: number) => string }) {
  const oos = product.stock === 0;
  return (
    <div
      onClick={() => !oos && onSelect(product)}
      className={`group rounded-lg border ${oos ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col`}
      role="button" aria-label={`${product.name}${oos ? " (out of stock)" : ""}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" && !oos) onSelect(product); }}
    >
      <div className="relative h-44 bg-slate-50 p-2">
        <img src={product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
        {oos && <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-rose-600 text-white shadow-md">Out of stock</span>}
        {product.isColdChain && !oos && <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-cyan-600 text-white shadow-md">Cold chain</span>}

        {!oos && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
            aria-label={`Configure and add ${product.name}`}
            className="absolute bottom-2 right-2 flex items-center justify-center aspect-square min-w-10 min-h-10 rounded-lg text-white shadow-md hover:brightness-110 opacity-95 hover:opacity-100 transition-all leading-none"
            style={{ background: BRAND }}
          >
            <Plus className="w-4 h-4 block" />
          </motion.button>
        )}
      </div>

      <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base leading-snug text-slate-900">{product.name}</h3>
            <span className="shrink-0 text-base font-extrabold" style={{ color: BRAND }}>{currency(product.price)}</span>
          </div>
          <p className="text-[13px] text-slate-600 line-clamp-2">{product.description}</p>
        </div>

        {(product.prepTime || product.rating) && (
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
            {product.prepTime && (<span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {product.prepTime}m</span>)}
            {product.rating && (<span className="inline-flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}<span className="text-slate-500 opacity-60 ml-1">({product.reviews || 0})</span></span>)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================
   PRODUCT DETAIL MODAL
========================= */
function ProductDetailModal({
  product, onClose, onAddToCart, currency,
}: { product: Product | null; onClose: () => void; onAddToCart: (p: Product, q: number, v?: string, note?: string) => void; currency: (n: number) => string }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNote("");
      setSelectedVariant(product.variants?.[0]?.label);
    }
  }, [product]);

  if (!product) return null;

  const variant = product.variants?.find((x) => x.label === selectedVariant);
  const finalPrice = product.price + (variant?.priceDelta || 0);
  const stock = product.stock;
  const oos = stock === 0;

  const handleAdd = () => { onAddToCart(product, quantity, selectedVariant, note); onClose(); };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[60] bg-black/40 grid place-items-center overflow-y-auto p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-white rounded-2xl w-full max-w-sm sm:max-w-xl shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${product.name} details`}>
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:bg-white" aria-label="Close product view">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="h-40 sm:h-64 bg-slate-100 relative overflow-hidden p-2 sm:p-4">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
            {oos && <span className="absolute inset-0 bg-black/30 grid place-items-center text-white text-lg sm:text-xl font-bold">Out of Stock</span>}
            {product.isColdChain && !oos && <span className="absolute bottom-2 left-3 text-xs font-bold px-2 py-1 rounded-full bg-cyan-600 text-white shadow-lg">Cold chain</span>}
          </div>

          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">{product.name}</h2>
            <p className="text-sm sm:text-base text-slate-600">{product.description}</p>
            {product.contents && <div className="text-xs sm:text-sm text-slate-500">Contents: {product.contents}</div>}

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-xs sm:text-base text-slate-700">Select option:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((op) => (
                    <button
                      key={op.label}
                      onClick={() => setSelectedVariant(op.label)}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${selectedVariant === op.label ? "shadow-sm" : "hover:border-cyan-400"}`}
                      style={{ borderColor: selectedVariant === op.label ? BRAND : "#e5e7eb", background: selectedVariant === op.label ? "#ECFEFF" : "#fff", color: selectedVariant === op.label ? BRAND : "#334155" }}
                    >
                      {op.label}{op.priceDelta ? ` (+${currency(op.priceDelta)})` : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-xs sm:text-base text-slate-700">Special instructions (optional)</h3>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder='E.g., "Ensure vintage 2018" or "Place in fridge immediately".' className="w-full h-16 sm:h-20 rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
            </div>

            {!oos && (
              <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 gap-3">
                <div className="flex items-center gap-2 sm:gap-4">
                  <h3 className="font-semibold text-sm sm:text-lg text-slate-700">Qty</h3>
                  <div className="inline-flex items-center gap-1 border border-slate-300 rounded-lg p-1 bg-slate-50">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-7 h-7 sm:w-9 sm:h-9 rounded grid place-items-center hover:bg-slate-200" aria-label="Decrease quantity" disabled={quantity <= 1}>
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm sm:text-lg text-slate-800">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(stock, q + 1))} className="w-7 h-7 sm:w-9 sm:h-9 rounded grid place-items-center hover:bg-slate-200" aria-label="Increase quantity" disabled={quantity >= stock}>
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  {stock < 10 && <span className="text-xs sm:text-sm text-rose-600 font-medium">Only {stock} left</span>}
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleAdd} className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-bold text-sm sm:text-lg shadow-lg hover:brightness-110" style={{ background: BRAND }}>
                  Add {quantity} • {currency(finalPrice * quantity)}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ========================
   CART DRAWER
========================= */
function CartDrawer({
  open, onClose, items, subtotal, delivery, total, onUpdate, onRemove, onCheckout, currency, minOrder,
}: {
  open: boolean; onClose: () => void; items: CartItem[]; subtotal: number; delivery: number; total: number;
  onUpdate: (key: string, q: number) => void; onRemove: (key: string) => void; onCheckout: () => void;
  currency: (n: number) => string; minOrder: number;
}) {
  const canCheckout = total >= minOrder;
  const toFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside className="fixed inset-0 z-50 grid grid-cols-[1fr_minmax(320px,400px)] lg:grid-cols-[1fr_minmax(400px,440px)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div onClick={onClose} className="bg-black/40" aria-hidden />
          <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} className="bg-white h-full flex flex-col border-l shadow-2xl">
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900">Your basket</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Close basket">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full grid place-items-center text-slate-500 p-6 text-center">
                  <ShoppingCart className="w-12 h-12 mb-4 text-slate-300" />
                  <p className="text-lg font-semibold">Your basket is empty</p>
                  <p className="text-sm mt-1">Start adding luxurious provisions for your trip.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 p-2">
                  {items.map((it) => (
                    <li key={it.key} className="p-2 flex gap-3 hover:bg-slate-50 rounded-lg">
                      <img src={it.imageUrl} alt={it.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100 shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-semibold leading-tight text-slate-800 truncate">{it.name}</div>
                        {it.variantLabel && <div className="text-xs text-slate-500">{it.variantLabel}</div>}
                        {it.specialInstructions && <div className="text-[11px] text-cyan-700 italic mt-0.5 truncate">Note: {it.specialInstructions}</div>}
                        <div className="text-sm font-bold" style={{ color: BRAND }}>{currency(it.price)}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="inline-flex items-center gap-1 border border-slate-200 rounded-lg">
                          <button onClick={() => onUpdate(it.key, Math.max(0, it.quantity - 1))} className="w-7 h-7 rounded-l grid place-items-center hover:bg-slate-100" aria-label="Decrease quantity"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-6 text-center text-sm font-medium">{it.quantity}</span>
                          <button onClick={() => onUpdate(it.key, Math.min(it.stock, it.quantity + 1))} className="w-7 h-7 rounded-r grid place-items-center hover:bg-slate-100" aria-label="Increase quantity"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <button onClick={() => onRemove(it.key)} className="text-xs text-rose-600 font-semibold hover:underline">Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-4 py-4 border-t space-y-3 bg-slate-50/70 backdrop-blur-sm">
                {toFree > 0 && (
                  <div className="bg-cyan-100 text-cyan-900 p-2 rounded-lg text-xs font-semibold text-center">
                    Add <strong>{currency(toFree)}</strong> to get FREE delivery.
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span>Delivery</span><DeliveryCostDisplay cost={delivery} currency={currency} brandColor={BRAND} /></div>
                </div>

                <div className="flex justify-between font-extrabold text-lg pt-2 border-t border-slate-200"><span>Total</span><span>{currency(total)}</span></div>

                <button
                  onClick={onCheckout}
                  disabled={!canCheckout}
                  className={`w-full mt-1 rounded-lg text-white font-bold px-3 py-3 text-lg transition-colours ${!canCheckout ? "bg-slate-400 cursor-not-allowed" : "hover:brightness-110"}`}
                  style={{ background: canCheckout ? BRAND : undefined }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* ========================
   IMPROVED CHECKOUT PAGE (2-column grid)
========================= */
function CheckoutPageImproved({
  cart, subtotal, delivery, total, onSubmit, submitting, currency, minOrder,
}: {
  cart: CartItem[]; subtotal: number; delivery: number; total: number; onSubmit: (data: any) => Promise<void>;
  submitting: boolean; currency: (n: number) => string; minOrder: number;
}) {
  const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; };
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", marina: MARINAS[0], deliveryDate: tomorrow(), deliveryTime: DELIVERY_TIMES[0].value, boatCompany: "", boatName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = (e: any) => { setForm((s) => ({ ...s, [e.target.name]: e.target.value })); if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: "" })); };

  const validate = () => {
    const er: Record<string, string> = {};
    if (!form.customerName.trim()) er.customerName = "Full name is required";
    if (!/.+@.+\..+/.test(form.email)) er.email = "Valid e-mail required";
    if (form.phone.replace(/\D/g, "").length < 7) er.phone = "Valid phone required";
    if (!form.marina) er.marina = "Marina location required";
    if (!form.deliveryDate) er.deliveryDate = "Delivery date required";
    if (!form.deliveryTime) er.deliveryTime = "Delivery time required";
    if (!form.boatCompany.trim()) er.boatCompany = "Boat rental company required";
    if (!form.boatName.trim()) er.boatName = "Boat name is required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
      {/* HEADER WITH TRUST BADGES */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Secure Checkout</h1>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-lg">✓</span>
            <span className="font-medium">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-lg">✓</span>
            <span className="font-medium">Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-lg">✓</span>
            <span className="font-medium">Concierge Support</span>
          </div>
        </div>
      </div>

      <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(form); }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: FORM (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          {/* PERSONAL INFO */}
          <section className="border border-slate-200 rounded-lg p-5 bg-white">
            <h2 className="text-sm font-bold text-slate-900 mb-4">👤 Personal Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Full name *" name="customerName" value={form.customerName} onChange={handle} placeholder="Jane Doe" error={errors.customerName} />
              <FormInput label="E-mail *" name="email" type="email" value={form.email} onChange={handle} placeholder="jane@example.com" error={errors.email} />
            </div>
            <div className="mt-3">
              <FormInput label="Phone number *" name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+34 692 688 348" error={errors.phone} />
            </div>
          </section>

          {/* DELIVERY DETAILS */}
          <section className="border border-slate-200 rounded-lg p-5 bg-white">
            <h2 className="text-sm font-bold text-slate-900 mb-4">⛵ Exclusive Ibiza & Formentera Delivery</h2>
            <div className="mb-3 p-2 bg-cyan-50 rounded text-xs text-cyan-900">
              <strong>Premium Service:</strong> Only available at Marina Ibiza, Botafoch & Club Náutico Ibiza
            </div>
            <div className="space-y-3">
              <FormSelect label="Marina location *" name="marina" value={form.marina} onChange={handle} options={MARINAS.map((m) => ({ value: m, label: m }))} error={errors.marina} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Delivery date *" name="deliveryDate" type="date" value={form.deliveryDate} onChange={handle} min={tomorrow()} error={errors.deliveryDate} />
                <FormSelect label="Delivery time *" name="deliveryTime" value={form.deliveryTime} onChange={handle} options={DELIVERY_TIMES} error={errors.deliveryTime} />
              </div>
            </div>
          </section>

          {/* BOAT DETAILS */}
          <section className="border border-slate-200 rounded-lg p-5 bg-white">
            <h2 className="text-sm font-bold text-slate-900 mb-4">🚤 Your Boat</h2>
            <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-900">
              <strong>Help us deliver:</strong> We'll use this to identify your boat at the marina
            </div>
            <div className="space-y-3">
              <FormInput label="Boat rental company *" name="boatCompany" value={form.boatCompany} onChange={handle} placeholder="e.g., Absolute Rent, Sailpoint" error={errors.boatCompany} />
              <FormInput label="Boat name *" name="boatName" value={form.boatName} onChange={handle} placeholder="e.g., Sailing Dreams, Serenity II" error={errors.boatName} />
            </div>
          </section>
        </div>

        {/* RIGHT: ORDER SUMMARY (1 column) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* DELIVERY GUARANTEE */}
            <div className="border-2 border-cyan-200 rounded-lg bg-cyan-50 p-4">
              <h3 className="text-xs font-bold text-cyan-900 mb-2 uppercase">✓ White-Glove Delivery</h3>
              <p className="text-xs text-cyan-800 leading-relaxed">
                Your provisions will arrive fresh at <strong>{form.marina}</strong> within <strong>2-4 hours</strong>. Not satisfied? Full refund within 24 hours, no questions asked.
              </p>
            </div>

            {/* PERSONALIZED DELIVERY PREVIEW */}
            {form.marina && form.boatName && (
              <div className="border border-slate-200 rounded-lg bg-slate-50 p-4">
                <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide">Your Delivery</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Marina:</span>
                    <span className="font-semibold text-slate-900">{form.marina}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Boat:</span>
                    <span className="font-semibold text-slate-900">{form.boatName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-semibold text-slate-900">{form.deliveryDate ? new Date(form.deliveryDate).toLocaleDateString() : "–"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time:</span>
                    <span className="font-semibold text-slate-900">{form.deliveryTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* YOUR ITEMS */}
            <div className="border border-slate-200 rounded-lg bg-white p-4">
              <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide">Your items</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500">No items</p>
                ) : cart.map((item) => (
                  <div key={item.key} className="flex justify-between items-start text-xs pb-2 border-b border-slate-100 last:border-b-0">
                    <span className="font-medium text-slate-700">
                      {item.quantity}× {item.name}
                      {item.variantLabel && <span className="text-xs text-slate-500 block mt-0.5">({item.variantLabel})</span>}
                    </span>
                    <span className="shrink-0 font-semibold text-slate-900 ml-2">{currency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <SummaryBox title="Order summary" items={[
              { label: "Subtotal", value: currency(subtotal), textSize: "text-xs" },
              { label: "Delivery", value: <DeliveryCostDisplay cost={delivery} currency={currency} brandColor={BRAND} />, textSize: "text-xs" },
              { label: "Total", value: currency(total), isBold: true, textSize: "text-base" },
            ]} />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting || total < minOrder}
              className={`w-full rounded-lg text-white font-bold px-4 py-3 text-sm transition-all ${submitting || total < minOrder ? "bg-slate-400 cursor-not-allowed" : "hover:brightness-110"}`}
              style={{ background: submitting || total < minOrder ? undefined : BRAND }}
            >
              {submitting ? (<span className="flex items-center justify-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing…</span>) : `Place order • ${currency(total)}`}
            </button>

            {/* GUARANTEES */}
            <div className="space-y-2 text-[10px] text-slate-500">
              <p className="text-center">✓ Cold-chain safe delivery guaranteed</p>
              <p className="text-center">✓ 24-hour money-back guarantee</p>
              <p className="text-center">By placing this order, you agree to our Terms &amp; Conditions.</p>
            </div>

            {/* CONCIERGE CONTACT */}
            <div className="bg-slate-900 text-white rounded-lg p-3 text-center">
              <p className="text-xs font-semibold mb-1">Need Help?</p>
              <p className="text-[11px] text-slate-300">Concierge: <a href="tel:+34" className="text-cyan-400 hover:underline font-semibold">+34 971 XXX XXX</a></p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

/* ========================
   CONFIRMATION PAGE
========================= */
function ConfirmationPage({ orderData, currency, setPage }: { orderData: OrderData; currency: (n: number) => string; setPage: (p: Page) => void }) {
  const { items, subtotal, delivery, total, customerName, marina, deliveryDate, deliveryTime, boatCompany, boatName } = orderData;
  const firstName = customerName.split(" ")[0] || "Client";
  const [emailCopied, setEmailCopied] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20">
      {/* PREMIUM HEADER */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-slate-900 to-cyan-900 text-white rounded-2xl shadow-xl p-8 text-center space-y-4 mb-8">
        <div className="text-5xl mb-2">✓</div>
        <h1 className="text-4xl font-extrabold">Order Confirmed!</h1>
        <p className="text-lg text-white/90">Thank you, <strong>{firstName}</strong>. Your luxurious provisions are being prepared for immediate delivery.</p>
      </motion.div>

      <div className="space-y-6">
        {/* DELIVERY SUMMARY */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="border-2 border-cyan-200 rounded-lg bg-cyan-50 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">📍 Your Delivery Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase">Marina</p>
              <p className="font-bold text-slate-900">{marina}</p>
            </div>
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase">Boat</p>
              <p className="font-bold text-slate-900">{boatName}</p>
            </div>
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase">Company</p>
              <p className="font-bold text-slate-900 text-sm">{boatCompany}</p>
            </div>
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase">Date</p>
              <p className="font-bold text-slate-900">{new Date(deliveryDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase">Time Window</p>
              <p className="font-bold text-slate-900">{deliveryTime}</p>
            </div>
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase">Delivery</p>
              <p className="font-bold text-cyan-700">FREE</p>
            </div>
          </div>
        </motion.div>

        {/* ORDER CONTENTS */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-slate-200 rounded-lg bg-white p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">🍾 Your Order</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-b-0">
                <div>
                  <p className="font-semibold text-slate-900">{item.quantity}× {item.name}</p>
                  {item.variantLabel && <p className="text-xs text-slate-500">{item.variantLabel}</p>}
                </div>
                <p className="font-bold text-slate-900">{currency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold">{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Delivery</span>
              <span className="font-semibold text-cyan-700">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span style={{ color: "#2095AE" }}>{currency(total)}</span>
            </div>
          </div>
        </motion.div>

        {/* CONCIERGE + SUPPORT */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-lg bg-slate-50 p-6">
            <h3 className="font-bold text-slate-900 mb-2">📞 Concierge Support</h3>
            <p className="text-sm text-slate-600 mb-3">Have questions? Our team is standing by.</p>
            <a href="tel:+34" className="inline-block px-4 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: "#2095AE" }}>
              Call: +34 971 XXX XXX
            </a>
          </div>
          <div className="border border-slate-200 rounded-lg bg-slate-50 p-6">
            <h3 className="font-bold text-slate-900 mb-2">✉️ Order Confirmation</h3>
            <p className="text-sm text-slate-600 mb-3">Sent to <strong>{orderData.email}</strong></p>
            <button onClick={() => { setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000); }} className="inline-block px-4 py-2 rounded-lg bg-white border border-slate-300 font-semibold text-sm hover:bg-slate-50">
              {emailCopied ? "✓ Copied" : "Copy Email"}
            </button>
          </div>
        </motion.div>

        {/* GUARANTEES */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="border-l-4 border-cyan-400 bg-cyan-50 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-3">Our Promises to You</h3>
          <div className="space-y-2 text-sm text-slate-700">
            <p>✓ <strong>Cold-chain safe:</strong> All items kept at perfect temperature</p>
            <p>✓ <strong>Fresh guarantee:</strong> Items arrive in perfect condition or we replace them</p>
            <p>✓ <strong>24-hour satisfaction:</strong> Not happy? Full refund, no questions asked</p>
            <p>✓ <strong>White-glove service:</strong> Professional delivery to your exact location</p>
          </div>
        </motion.div>

        {/* LOYALTY + REFERRAL */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-slate-900 to-cyan-900 text-white rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">🎁 VIP Loyalty Program</h3>
            <p className="text-sm text-white/90">Every €1 spent = 1 loyalty point. Collect 100 points for €25 credit!</p>
            <div className="mt-3 bg-white/10 rounded p-3">
              <p className="text-xs text-white/70">Your loyalty balance:</p>
              <p className="font-bold text-2xl">{Math.floor(total)} points</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4">
            <h3 className="font-bold text-lg mb-2">👥 Refer & Earn</h3>
            <p className="text-sm text-white/90">Share your unique link with friends. When they order, you both get €15 off!</p>
            <button className="mt-3 w-full bg-white text-slate-900 font-bold py-2 rounded-lg hover:bg-slate-100 text-sm">
              Get Your Referral Link
            </button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-center space-y-4">
          <p className="text-slate-600 text-sm">What would you like to do next?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setPage("shop")} className="px-8 py-3 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-700">
              Continue Shopping
            </button>
            <a href="/" className="px-8 py-3 rounded-lg border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-50">
              Back to Home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ========================
   TOAST STACK
========================= */
function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-[280px] w-full">
      <AnimatePresence>
        {toasts.map((t) => {
          const c = getToastColors(t.type, BRAND);
          return (
            <motion.div key={t.id} initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`px-3 py-2 rounded-md shadow font-medium text-[12px] ${c.text}`} style={{ background: c.bg }}>
              {t.message}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ========================
   MAIN COMPONENT
========================= */
export default function NautiqCatering() {
  const [page, setPage] = useState<Page>("shop");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [committedSearch, setCommittedSearch] = useState<string>("");
  const [draftSearch, setDraftSearch] = useState<string>("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [collaboratorRef, setCollaboratorRef] = useState<string | null>(null);

  const lastToastRef = useRef<{ message: string; time: number } | null>(null);

  // CART PERSISTENCE: Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("nautiq-cart");
      if (stored) {
        const cartData = JSON.parse(stored);
        if (Array.isArray(cartData)) {
          setCart(cartData);
        }
      }
    } catch (err) {
      console.error("Failed to load cart from storage:", err);
    }
  }, []);

  // CART PERSISTENCE: Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("nautiq-cart", JSON.stringify(cart));
      } catch (err) {
        console.error("Failed to save cart to storage:", err);
      }
    }
  }, [cart, mounted]);

  const { scrollY } = useScroll();
  const headBg = useTransform(scrollY, [0, 120], ["rgba(255,255,255,0)", "rgba(255,255,255,0.96)"]);
  const headBorder = useTransform(scrollY, [0, 120], ["transparent", "#e5e7eb"]);
  const headBlur = useTransform(scrollY, [0, 120], ["0px", "14px"]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "products"), where("isActive", "==", true));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];
        setProducts(data);
      } catch (err) {
        console.error(err);
        showToast("error", "Failed to load products. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setCollaboratorRef(ref);
  }, []);

  const currency = (n: number) => `€${n.toFixed(2)}`;
  const keyOf = (pid: string, variantLabel?: string) => `${pid}${variantLabel ? `::${variantLabel}` : ""}`;

  const showToast = useCallback((type: Toast["type"], message: string) => {
    const now = Date.now();
    if (lastToastRef.current && lastToastRef.current.message === message && now - lastToastRef.current.time < 500) return;
    lastToastRef.current = { message, time: now };
    const id = `${now}-${toastIdCounter++}`;
    setToasts((prev) => [{ id, type, message }, ...prev]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number, variantLabel?: string, specialInstructions?: string) => {
    if (quantity <= 0) return;
    const k = keyOf(product.id, variantLabel);
    const variant = product.variants?.find((v) => v.label === variantLabel);
    const finalPrice = product.price + (variant?.priceDelta || 0);

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.key === k);
      const newQty = (idx !== -1 ? prev[idx].quantity : 0) + quantity;

      if (newQty > product.stock) {
        showToast("error", `Only ${product.stock} of ${product.name} available.`);
        return prev;
      }
      if (idx !== -1) {
        showToast("success", `Added ${quantity} more of ${product.name}`);
        return prev.map((i, j) => (j === idx ? { ...i, quantity: newQty } : i));
      }
      showToast("success", `${product.name} added to basket`);
      return [
        ...prev,
        { key: k, productId: product.id, name: product.name, imageUrl: product.imageUrl, price: finalPrice, variantLabel, quantity, stock: product.stock, tags: product.tags, specialInstructions },
      ];
    });
  }, [showToast]);

  const updateCartQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.key === key);
      if (!item) return prev;
      if (quantity > item.stock) {
        showToast("error", `Only ${item.stock} available.`);
        return prev.map((i) => (i.key === key ? { ...i, quantity: item.stock } : i));
      }
      return quantity > 0 ? prev.map((i) => (i.key === key ? { ...i, quantity } : i)) : prev.filter((i) => i.key !== key);
    });
  }, [showToast]);

  const removeFromCart = useCallback((key: string) => { setCart((prev) => prev.filter((i) => i.key !== key)); showToast("info", "Item removed"); }, [showToast]);
  const clearCart = useCallback(() => setCart([]), []);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const deliveryCost = useMemo(() => (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST), [subtotal]);
  const total = subtotal + deliveryCost;
  const categories = useMemo(() => ["all", ...Array.from(new Set(products.map((p) => p.category))).sort()], [products]);

  const filteredProducts = useMemo(() => {
    const q = committedSearch.trim().toLowerCase();
    return products.filter((p) =>
      (selectedCategory === "all" || p.category === selectedCategory) &&
      (q === "" || p.name.toLowerCase().includes(q) || p.description?.toLowerCase()?.includes(q))
    );
  }, [products, selectedCategory, committedSearch]);

  const canCheckout = total >= MIN_ORDER;

  const submitOrder = useCallback(async (formData: Omit<OrderData, "items" | "subtotal" | "delivery" | "total">) => {
    try {
      if (cart.length === 0) return showToast("error", "Your basket is empty");
      if (!canCheckout) return showToast("error", `Minimum order is ${currency(MIN_ORDER)}`);
      setSubmitting(true);

      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        marina: formData.marina,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        boatCompany: formData.boatCompany,
        boatName: formData.boatName,
        items: cart.map((i) => ({ productId: i.productId, name: i.name, variant: i.variantLabel, quantity: i.quantity, unitPrice: i.price, specialInstructions: i.specialInstructions })),
        subtotal,
        deliveryCost,
        total,
        collaboratorRef: collaboratorRef || null,
        createdAt: serverTimestamp(),
        status: "pending",
      };
      await addDoc(collection(db, "orders"), payload);

      setOrderData({ ...formData, items: cart, subtotal, delivery: deliveryCost, total });
      clearCart();
      localStorage.removeItem("nautiq-cart");
      setPage("confirmation");
      showToast("success", "Order placed successfully.");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [cart, subtotal, deliveryCost, total, clearCart, canCheckout, showToast, currency]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white">
        <Header badgeCount={cart.length} openCart={() => setIsDrawerOpen(true)} headBg={headBg} headBorder={headBorder} headBlur={headBlur} committedSearch={committedSearch} setCommittedSearch={setCommittedSearch} draftSearch={draftSearch} setDraftSearch={setDraftSearch} />
        <HeroSection mounted={mounted} products={products} />
        <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-44 bg-slate-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-4/5 bg-slate-100 animate-pulse rounded-lg" />
                <div className="h-4 w-1/3 bg-slate-100 animate-pulse rounded-md" />
                <div className="h-9 w-full bg-slate-100 animate-pulse rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "checkout") {
    return (
      <>
        <HeaderCompact badgeCount={cart.length} openCart={() => setIsDrawerOpen(true)} headBg={headBg} headBorder={headBorder} headBlur={headBlur} onBack={() => setPage("shop")} title="Checkout" />
        <CheckoutPageImproved cart={cart} subtotal={subtotal} delivery={deliveryCost} total={total} onSubmit={submitOrder} submitting={submitting} currency={currency} minOrder={MIN_ORDER} />
        <ToastStack toasts={toasts} />
      </>
    );
  }
  if (page === "confirmation" && orderData) {
    return (
      <>
        <HeaderCompact badgeCount={0} headBg={headBg} headBorder={headBorder} headBlur={headBlur} title="Order confirmed" />
        <ConfirmationPage orderData={orderData} currency={currency} setPage={setPage} />
        <ToastStack toasts={toasts} />
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header
        badgeCount={cart.length}
        openCart={() => setIsDrawerOpen(true)}
        headBg={headBg} headBorder={headBorder} headBlur={headBlur}
        committedSearch={committedSearch}
        setCommittedSearch={setCommittedSearch}
        draftSearch={draftSearch}
        setDraftSearch={setDraftSearch}
      />

      <HeroSection mounted={mounted} products={products} />

      <CategoryBelt categories={categories} current={selectedCategory} onSelect={setSelectedCategory} />

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}>
              <ProductCard product={p} currency={currency} onSelect={setModalProduct} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500">
            <Search className="w-10 h-10 mx-auto mb-3" />
            <p className="text-xl font-semibold">No products found</p>
            <p>Try clearing your search or selecting a different category.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40 md:bottom-6"
          >
            <div className="bg-white rounded-3xl p-3 flex items-center justify-between shadow-2xl border border-slate-200 backdrop-blur-sm">
              <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-3" aria-label={`Basket with ${cart.length} items`}>
                <span className="relative inline-flex">
                  <ShoppingCart className="w-6 h-6" style={{ color: BRAND }} />
                  <span
                    className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-[8px] font-bold flex items-center justify-center text-white shadow-sm leading-none"
                    style={{ background: BRAND }}
                  >
                    {cart.length}
                  </span>
                </span>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-slate-800">{cart.length} {cart.length === 1 ? "item" : "items"}</div>
                  <div className="text-xs text-slate-500">Subtotal {currency(subtotal)}</div>
                </div>
              </button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => { if (canCheckout) setPage("checkout"); else showToast("error", `Minimum order is ${currency(MIN_ORDER)}`); }}
                className={`px-4 py-2 rounded-xl text-white font-bold transition-colors ${canCheckout ? "hover:brightness-110" : "bg-slate-400 cursor-not-allowed"}`}
                style={{ background: canCheckout ? BRAND : undefined }}
              >
                {canCheckout ? `Checkout • ${currency(total)}` : `Min ${currency(MIN_ORDER)}`}
              </motion.button>
            </div>

            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-2 text-center text-xs font-semibold text-cyan-900 p-2 bg-cyan-50 rounded-xl border border-cyan-200 shadow-inner">
                Add <strong>{currency(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> for <strong>FREE</strong> delivery.
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={cart}
        subtotal={subtotal}
        delivery={deliveryCost}
        total={total}
        onUpdate={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={() => { if (canCheckout) { setIsDrawerOpen(false); setPage("checkout"); } else showToast("error", `Minimum order is ${currency(MIN_ORDER)}`); }}
        currency={currency}
        minOrder={MIN_ORDER}
      />

      <ProductDetailModal product={modalProduct} onClose={() => setModalProduct(null)} onAddToCart={addToCart} currency={currency} />
      <ToastStack toasts={toasts} />
    </div>
  );
}





