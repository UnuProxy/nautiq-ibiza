"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, Users, Ship, MapPin, Loader2, MessageCircle,
  CheckCircle2, Info, Share2, Heart
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type AnyMap = Record<string, any>;

type FirebaseBoat = {
  id?: string;
  name: string;
  description?: string;
  images?: string[];
  visible?: boolean;
  price?: string;
  detailedSpecs?: AnyMap;
  amenities?: AnyMap;
  services?: AnyMap;
  crew?: AnyMap;
  safety?: AnyMap;
  equipment?: AnyMap;
  waterSports?: AnyMap;
  jacuzziAndPool?: AnyMap;
  tenders?: AnyMap;
  icalUrl?: string;
  cruisingArea?: string;
  ratingAvg?: number;
  ratingCount?: number;
  typicalDay?: string[];
  createdAt?: any;
  updatedAt?: any;
};

type Boat = {
  id: string;
  name: string;
  description: string;
  images: string[];
  guests: number;
  length: number;
  priceFrom: number;
  type: string;
  location: string;
  ratingAvg: number;
  ratingCount: number;
  specs: { label: string; value: string }[];
  amenityFlags: { section: string; items: { label: string; value: boolean | string }[] }[];
  icalUrl?: string;
  typicalDay?: string[];
};

const WHATSAPP =
  "https://wa.me/34692688348?text=Hi%20Nautiq%2C%20I'm%20interested%20in%20boat:%20";

// ---------- helpers ----------
function numFromMixed(x?: string): number {
  if (!x) return 0;
  const m = String(x).replace(/[^\d]/g, "");
  return m ? parseInt(m, 10) : 0;
}
function euroFromMixed(x?: string): number {
  if (!x) return 0;
  const m = String(x).replace(/[€,\s]/g, "").match(/\d+/)?.[0];
  return m ? parseInt(m, 10) : 0;
}

// Flatten nested objects and extract only true boolean values
function flattenAmenities(obj?: AnyMap): { label: string; value: boolean }[] {
  if (!obj) return [];
  const result: { label: string; value: boolean }[] = [];
  
  function recurse(current: any, prefix = "") {
    if (!current || typeof current !== "object") return;
    
    for (const [key, val] of Object.entries(current)) {
      if (typeof val === "boolean") {
        if (val === true) {
          result.push({
            label: prettify(prefix ? `${prefix} ${key}` : key),
            value: true
          });
        }
      } else if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        recurse(val, prefix ? `${prefix} ${key}` : key);
      }
    }
  }
  
  recurse(obj);
  return result;
}

function prettify(s: string): string {
  return s
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function transform(id: string, b: FirebaseBoat): Boat {
  const guests = numFromMixed(b?.detailedSpecs?.Guests ?? "0");
  const length = numFromMixed(b?.detailedSpecs?.Length ?? "0");
  const priceFrom =
    euroFromMixed(b?.detailedSpecs?.Price) || euroFromMixed(b?.price) || 0;

  const baseSpecs = [
    { label: "Guests", value: guests ? `${guests}` : "" },
    { label: "Length", value: length ? `${length} m` : b?.detailedSpecs?.Length || "" },
    { label: "Class", value: b?.detailedSpecs?.Class || "Motorboat" },
    { label: "Cruising Area", value: b?.detailedSpecs?.["Cruising Area"] || b?.cruisingArea || "Ibiza & Formentera" },
    { label: "Engine", value: b?.detailedSpecs?.Engine || "" },
    { label: "Crew", value: b?.detailedSpecs?.Crew || "" },
    { label: "Price", value: priceFrom ? `€${priceFrom.toLocaleString()}/day` : (b?.detailedSpecs?.Price || "") },
  ].filter((x) => x.value);

  const sections = [
    ["Amenities", flattenAmenities(b.amenities)],
    ["Services", flattenAmenities(b.services)],
    ["Crew", flattenAmenities(b.crew)],
    ["Safety", flattenAmenities(b.safety)],
    ["Jacuzzi & Pool", flattenAmenities(b.jacuzziAndPool)],
    ["Tenders", flattenAmenities(b.tenders)],
    ["Water Sports", flattenAmenities(b.waterSports)],
    ["Equipment", flattenAmenities(b.equipment)],
  ] as const;

  const amenityFlags = sections
    .map(([section, items]) => ({
      section,
      items,
    }))
    .filter((sec) => sec.items.length > 0);

  return {
    id,
    name: b.name,
    description: b.description || "",
    images: b.images?.length ? b.images : ["/placeholder-boat.jpg"],
    guests,
    length,
    priceFrom,
    type: b?.detailedSpecs?.Class || "Motorboat",
    location: b?.detailedSpecs?.["Cruising Area"] || b?.cruisingArea || "Balearics",
    ratingAvg: b.ratingAvg ?? 0,
    ratingCount: b.ratingCount ?? 0,
    specs: baseSpecs,
    amenityFlags,
    icalUrl: b.icalUrl,
    typicalDay: b.typicalDay,
  };
}

// ---------- page ----------
export default function BoatPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [boat, setBoat] = useState<Boat | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ref = doc(db, "boats", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) { if (!cancelled) setMissing(true); return; }
        const data = snap.data() as FirebaseBoat;
        if (data.visible === false) { if (!cancelled) setMissing(true); return; }
        if (!cancelled) setBoat(transform(snap.id, data));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="flex items-center gap-3 text-slate-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading boat…
        </div>
      </main>
    );
  }

  if (missing || !boat) {
    return (
      <main className="min-h-screen grid place-items-center px-6">
        <div className="text-center">
          <p className="text-xl font-medium text-slate-900">Boat not found</p>
          <p className="text-slate-600 mt-1">It may be private or no longer listed.</p>
          <button
            onClick={() => router.push("/fleet")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2095AE] text-white"
          >
            Back to fleet
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pb-28 sm:pb-10 overflow-x-hidden w-full max-w-full">
      {/* Global styles to prevent horizontal scroll */}
      <style jsx global>{`
        html, body { 
          overflow-x: hidden; 
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .overscroll-x-contain { overscroll-behavior-x: contain; }
      `}</style>

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 w-full overflow-hidden">
        <div className="w-full max-w-full lg:max-w-6xl mx-auto px-4 py-3 text-sm">
          <Link href="/fleet" className="text-slate-600 hover:text-slate-900">Fleet</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900 font-medium truncate inline-block max-w-[200px] sm:max-w-none">{boat.name}</span>
        </div>
      </div>

      {/* Main wrapper - prevents any child from overflowing */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="w-full lg:max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">
            
            {/* Left column: Gallery + Content */}
            <div className="lg:col-span-2 w-full max-w-full min-w-0">
              
              {/* Image Gallery */}
              <section className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-sm w-full max-w-full">
                {/* Main image */}
                <div className="relative w-full h-[50vh] sm:h-[420px]">
                  <Image
                    key={active}
                    src={boat.images[active]}
                    alt={`${boat.name} photo ${active + 1}`}
                    fill
                    sizes="(max-width:1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-white text-xs sm:text-sm flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                        <span className="whitespace-nowrap">{boat.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                        <span className="whitespace-nowrap">{boat.guests} guests</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Ship className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                        <span className="whitespace-nowrap">{boat.length} m</span>
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors" aria-label="Add to favorites">
                        <Heart className="w-4 h-4 text-slate-700" />
                      </button>
                      <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors" aria-label="Share">
                        <Share2 className="w-4 h-4 text-slate-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                {boat.images.length > 1 && (
                  <>
                    {/* Mobile thumbnail strip */}
                    <div className="md:hidden w-full max-w-full overflow-hidden bg-slate-50">
                      <div className="flex gap-2.5 px-3 py-3 overflow-x-auto no-scrollbar overscroll-x-contain snap-x snap-mandatory">
                        {boat.images.slice(0, 16).map((src, i) => (
                          <button
                            key={`thumb-${i}`}
                            onClick={() => setActive(i)}
                            className={`relative w-[80px] h-[80px] flex-none rounded-lg overflow-hidden border-2 snap-center transition-all ${
                              i === active 
                                ? "border-[#2095AE] ring-2 ring-[#2095AE]/30 scale-105" 
                                : "border-slate-300 hover:border-slate-400"
                            }`}
                            aria-label={`Preview image ${i + 1}`}
                          >
                            <Image src={src} alt="" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Desktop thumbnail grid */}
                    <div className="hidden md:grid grid-cols-8 gap-2 p-2 bg-slate-50">
                      {boat.images.slice(0, 16).map((src, i) => (
                        <button
                          key={`thumb-desktop-${i}`}
                          onClick={() => setActive(i)}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                            i === active 
                              ? "border-[#2095AE] ring-2 ring-[#2095AE]/30" 
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          aria-label={`Preview image ${i + 1}`}
                        >
                          <Image src={src} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </section>

              {/* Boat Overview */}
              <section className="mt-4 sm:mt-6 w-full max-w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight break-words">{boat.name}</h1>
                {boat.ratingCount > 0 && (
                  <div className="flex items-center gap-2 text-slate-700 mb-3 flex-wrap">
                    <Star className="w-4 h-4 text-[#C9A55C] fill-[#C9A55C] flex-shrink-0" />
                    <span className="font-semibold">{boat.ratingAvg.toFixed(1)}</span>
                    <span className="text-slate-500 text-sm">({boat.ratingCount} {boat.ratingCount === 1 ? 'review' : 'reviews'})</span>
                  </div>
                )}
                {boat.description && (
                  <p className="text-slate-700 leading-relaxed text-base sm:text-lg break-words">{boat.description}</p>
                )}
              </section>

              {/* Specifications */}
              <section className="mt-5 sm:mt-6 w-full max-w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {boat.specs.map((s) => (
                    <div key={s.label} className="rounded-xl border border-slate-200 p-4 bg-white hover:border-slate-300 transition-colors w-full min-w-0">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 mt-0.5 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-0.5">{s.label}</div>
                          <div className="font-semibold text-slate-900 text-base break-words">{s.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Amenity Flags */}
              {boat.amenityFlags.map((group) => {
                if (group.items.length === 0) return null;
                return (
                  <section key={group.section} className="mt-5 sm:mt-6 w-full max-w-full overflow-hidden">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{group.section}</h3>
                    <div className="flex flex-wrap gap-2 w-full">
                      {group.items.map((item) => (
                        <span
                          key={item.label}
                          className="inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="whitespace-nowrap">{item.label}</span>
                        </span>
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* Typical Day */}
              {boat.typicalDay && boat.typicalDay.length > 0 && (
                <section className="mt-6 sm:mt-8 w-full max-w-full">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Typical Day</h2>
                  <ul className="list-disc pl-5 text-slate-700 space-y-2 text-base">
                    {boat.typicalDay.map((item, idx) => (
                      <li key={idx} className="break-words">{item}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right column: Enquiry Card (Desktop Only) */}
            <aside className="hidden lg:block lg:sticky lg:top-4 h-max">
              <div className="rounded-2xl border border-slate-200 p-5 shadow-sm bg-white">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-slate-900">
                    {boat.priceFrom > 0 ? <>€{boat.priceFrom.toLocaleString()}</> : <>Price on request</>}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">per day · skipper on request</div>
                </div>

                <button
                  onClick={() => window.open(`${WHATSAPP}${encodeURIComponent(" " + boat.name)}`, "_blank")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2095AE] hover:bg-[#1a7d94] text-white rounded-xl px-5 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enquire on WhatsApp
                </button>

                <div className="mt-3 text-xs text-slate-500 leading-relaxed">
                  Fast response · We'll confirm price, availability, catering and fuel estimate.
                </div>

                {boat.icalUrl && (
                  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm">
                    <div className="font-semibold text-slate-900 mb-1">Availability</div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      This boat syncs with a live calendar. Ask us for your preferred date.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl w-full max-w-full"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
      >
        <div className="w-full max-w-full px-4 pt-3 pb-1 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-slate-900 font-bold text-lg leading-none truncate">
              {boat.priceFrom > 0 ? `€${boat.priceFrom.toLocaleString()}` : "Price on request"}
            </div>
            <div className="text-xs text-slate-500 leading-none mt-1.5">per day · skipper on request</div>
          </div>
          <button
            onClick={() => window.open(`${WHATSAPP}${encodeURIComponent(" " + boat.name)}`, "_blank")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2095AE] hover:bg-[#1a7d94] active:scale-95 text-white text-sm font-semibold shadow-lg transition-all whitespace-nowrap flex-shrink-0"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            Enquire
          </button>
        </div>
      </div>
    </main>
  );
}



