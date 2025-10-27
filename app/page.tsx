"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Shield,
  Star,
  Anchor,
  Award,
  Users,
  Compass,
  ChevronRight,
  MessageSquare,
  MapPin,
  Phone,
  Home,
  Ship,
  MessageCircle,
} from "lucide-react";
import ContactSection from "@/components/ContactSection";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const WHATSAPP_LINK =
  "https://wa.me/34692688348?text=Hi%20Nautiq%2C%20Date%3A%20_____%20Guests%3A%20_____%20Budget%3A%20%E2%82%AC_____";

/* ========================================================================
   Small helpers
   ======================================================================== */
type RawBoat = {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  images?: unknown;
  guests?: unknown;
  length?: unknown;
  priceFrom?: unknown;
  ratingAvg?: unknown;
  tagline?: string;
  tags?: unknown;
  detailedSpecs?: Record<string, unknown>;
  popular?: unknown;
};

type UiBoat = {
  id: string;
  name: string;
  image: string;
  guests: number;
  length?: number;
  priceFrom?: number;
  ratingAvg?: number;
  tagline?: string;
  tags: string[];
};

function firstValidImage(images: unknown): string | undefined {
  if (Array.isArray(images)) {
    const s = images.find(
      (u) => typeof u === "string" && (u.startsWith("http") || u.startsWith("/"))
    );
    return s as string | undefined;
  }
  if (typeof images === "string" && (images.startsWith("http") || images.startsWith("/"))) {
    return images;
  }
  return undefined;
}
function parsePriceToNumber(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const m = v.replace(/\s/g, "").match(/([\d.,]+)/);
    if (!m) return undefined;
    // Replace thousand separators and normalise decimal
    const normalised = m[1].replace(/\./g, "").replace(/,/g, ".");
    const n = Number(normalised);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}
function parseGuests(v: unknown, fallback?: unknown): number {
  const candidates = [v, fallback];
  for (const c of candidates) {
    if (typeof c === "number") return c;
    if (typeof c === "string") {
      const n = parseInt(c.replace(/[^\d]/g, ""), 10);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}
function parseLengthMeters(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const m = v.match(/([\d.,]+)/);
    if (!m) return undefined;
    const n = Number(m[1].replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}
function mulberry32(a: number) {
  // force uint32 seed
  let t = a >>> 0;
  return function () {
    t += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  if (!Array.isArray(arr)) return [];
  if (arr.length <= 1) return arr.slice();

  const rnd = mulberry32((Number.isFinite(seed) ? seed : 0) >>> 0);
  const out = arr.slice();

  for (let i = out.length - 1; i > 0; i--) {   // ⬅️ decrement, not increment
    const j = Math.floor(rnd() * (i + 1));
    const tmp = out[i];                        // classic swap avoids oddities
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/** Europe/Madrid 3-day rotation window seed */
function rotationSeedEvery3DaysMadrid(): number {
  const now = new Date();
  // Create a Date object representing current time in Europe/Madrid
  const madridNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  return Math.floor(madridNow.getTime() / threeDaysMs);
}

function FAQSchema() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How quickly can I book a boat charter in Ibiza?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nautiq provides 2-3 hand-picked yacht options within 10 minutes of your request."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need a license to rent a boat in Ibiza?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For boats under 13.7m, an ICC license is required. We offer skippered charters with our captain."
            }
          },
          {
            "@type": "Question",
            "name": "What's included in the yacht charter price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Prices include the boat and captain. Fuel, food, and water sports are optional add-ons."
            }
          },
          {
            "@type": "Question",
            "name": "Can I hire a yacht for Formentera trips?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! We organize day charters and multi-day voyages to Formentera with pristine beaches and hidden coves."
            }
          }
        ]
      }),
    }} />
  );
}

/* ========================================================================
   Page
   ======================================================================== */
export default function NautiqVisualPage() {
  const [openRequestSheet, setOpenRequestSheet] = useState(false);

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Nautiq Ibiza - Yacht Charter & Boat Rental",
            "description": "Hand-picked yacht charters and boat rentals in Ibiza and Formentera with local expertise since 2018.",
            "url": "https://nautiqibiza.com",
            "image": "https://nautiqibiza.com/Boats/Finally-boat-drone-014.jpg",
            "telephone": "+34692688348",
            "email": "info@nautiqibiza.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Marina Botafoch",
              "addressLocality": "Ibiza",
              "postalCode": "07800",
              "addressCountry": "ES",
            },
            "areaServed": [
              {"@type": "City", "name": "Ibiza"},
              {"@type": "City", "name": "Formentera"}
            ],
            "sameAs": [
              "https://www.instagram.com/nautiq_ibiza",
              "https://wa.me/34692688348"
            ],
            "priceRange": "€€€"
          }),
        }}
      />
      {/* ⬇️ ADD PADDING WRAPPER FOR MOBILE TAB BAR */}
      <div className="pb-[80px] md:pb-0">
      <HeroWithMedia />
      <TrustBar />
      <OneConversation />
      <WhatWeControl />
      <SubtleUrgency />
      <FleetWithImages />
      <BackupGuarantee />
      {/* <LocalTeam /> */}
      <Testimonials />
      <ContactSection />
      </div>
      <FAQSchema />
      {/* ⬇️ PASS SHEET STATE TO TAB BAR */}
      <MobileTabBar openRequestSheet={openRequestSheet} setOpenRequestSheet={setOpenRequestSheet} />
      {/* ⬇️ MOVED SHEET HERE WITH STATE FROM PARENT */}
      <MobileBottomSheet open={openRequestSheet} onClose={() => setOpenRequestSheet(false)} />
      <GlobalMobileStyles />
    </main>
  );
}

/* ========================================================================
   Global styles
   ======================================================================== */
function GlobalMobileStyles() {
  return (
    <style jsx global>{`
      :root {
        --safe-bottom: env(safe-area-inset-bottom);
        --safe-top: env(safe-area-inset-top);
      }
      @supports (padding: max(0px)) {
        body {
          padding-left: max(0px, env(safe-area-inset-left));
          padding-right: max(0px, env(safe-area-inset-right));
        }
      }
      html {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        overscroll-behavior-y: contain;
      }
      body {
        overflow-x: hidden;
        touch-action: pan-y;
        background: #fff;
      }
      * {
        -webkit-tap-highlight-color: rgba(32, 149, 174, 0.2);
      }
      button,
      a {
        -webkit-touch-callout: none;
        touch-action: manipulation;
      }
      .snap-x-mandatory {
        scroll-snap-type: x mandatory;
      }
      .snap-start {
        scroll-snap-align: start;
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulse-subtle {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(32, 149, 174, 0.35);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(32, 149, 174, 0);
        }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.5s ease-out forwards;
      }
      .animate-pulse-subtle {
        animation: pulse-subtle 2.4s infinite;
      }
    `}</style>
  );
}

/* ========================================================================
   Typewriter (hero)
   ======================================================================== */
function useTypewriter(phrases: string[], typing = 55, pause = 1200) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [dir, setDir] = useState<"type" | "delete">("type");

  useEffect(() => {
    const current = phrases[i] ?? "";
    if (dir === "type") {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typing);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDir("delete"), pause);
        return () => clearTimeout(t);
      }
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, text.length - 1)), typing * 0.5);
        return () => clearTimeout(t);
      } else {
        setDir("type");
        setI((p) => (p + 1) % phrases.length);
      }
    }
  }, [text, dir, i, phrases, typing, pause]);

  return text;
}

/* ========================================================================
   Hero
   ======================================================================== */
function HeroWithMedia() {
  const slides = [
    { image: "/portada_mar_ibiza.jpg", alt: "Ibiza waters" },
    { image: "/Cala-Bassa.jpg", alt: "Cala Bassa from a yacht" },
    { image: "/Boats/DJI_0293.JPG", alt: "Golden sunset from deck" },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const typed = useTypewriter([
    "Luxury yacht charter Ibiza",
    "Skippered boats from €800/day",
    "Hand-picked options in 10 mins",
    "Day trips or week-long adventures",
    "Local captains, perfect reviews",
  ]);

  return (
    <section className="relative h-[82vh] md:h-[88vh] overflow-hidden" aria-label="Hero">
      <h1 className="sr-only">
        Yacht Charter Ibiza & Formentera - Hand-Picked Boats, Local Expert Captains, Fast WhatsApp Booking
      </h1>
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== current}
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/50" />
          <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_45%,#000_55%,transparent_100%)] bg-black/25" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pb-12 sm:pb-20 md:pb-28">
        <div className="w-full max-w-2xl px-4">
          <div className="mb-6">
            <p className="text-white/90 text-xs md:text-sm mb-2 text-center tracking-widest uppercase">
              One conversation. Perfect boat. Let's go.
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light text-white text-center leading-tight">
              {typed}
              <span className="animate-pulse">_</span>
            </h2>
          </div>

          <div className="flex gap-3 justify-center flex-col sm:flex-row">
            <a
              href={WHATSAPP_LINK}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-[#2095AE] text-white rounded-full font-semibold hover:bg-[#1a7d94] transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href="tel:+34692688348"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-all inline-flex items-center justify-center gap-2 backdrop-blur"
            >
              <Phone className="w-5 h-5" />
              Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
   Trust Bar
   ======================================================================== */
function TrustBar() {
  return <section className="py-3 bg-[#0B1120] border-y border-[#C9A55C]/20"></section>;
}

/* ========================================================================
   One Conversation
   ======================================================================== */
function OneConversation() {
  return (
    <section className="py-14 sm:py-20 bg-[#0B1120]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
              No skipping back-and-forth
            </h2>
            <p className="text-white/80 text-lg mb-6">
              One chat sorts it. Marketplaces leave you comparing, negotiating and hoping the boat
              matches the photos. With Nautiq, a single chat sorts the shortlist, the crew and the
              extras.
            </p>
            <div className="space-y-4">
              {[
                "Tell us your budget & dates",
                "We reply quickly with 2–3 options",
                "We match the right boat",
                "From our vetted fleet & partners",
                "We handle the details",
                "Crew, drinks, towels, restaurants, transfers",
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  {i % 2 === 0 ? (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C9A55C] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#0B1120]" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2095AE] flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <p className="text-white/90 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1a2635] to-[#0B1120] rounded-2xl p-6 sm:p-8 border border-[#C9A55C]/20">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <p className="text-white/70 text-sm mb-4">WhatsApp Chat (simulated)</p>
              <div className="space-y-4">
                <div className="bg-[#2095AE] text-white rounded-lg rounded-br-none p-3 ml-auto max-w-xs">
                  <p className="text-sm">Hi Nautiq! 5 guests, July 15–17, €2,000 budget?</p>
                </div>
                <div className="bg-white/20 text-white rounded-lg rounded-bl-none p-3 mr-auto max-w-xs">
                  <p className="text-sm font-semibold mb-2">Perfect! Here are 3 options:</p>
                  <p className="text-sm">1. Catamaran La Dolce (€1,950)</p>
                  <p className="text-sm">2. Motor Yacht Ibiza Star (€2,100)</p>
                  <p className="text-sm">3. Sailing Yacht Sunset (€1,800)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
   What We Control
   ======================================================================== */
function WhatWeControl() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-light text-[#0B1120] mb-12 text-center">
          Your holiday is too important to risk
        </h2>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: Shield,
              title: "Technical hiccup?",
              desc: "We activate our partner network to provide a swift alternative.",
            },
            {
              icon: Compass,
              title: "Weather changes?",
              desc: "We monitor forecasts and adjust routes or reschedule where possible.",
            },
            {
              icon: Users,
              title: "Restaurant fully booked?",
              desc: "We leverage long-standing local relationships for sensible solutions.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#F8FAFB] to-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] hover:shadow-lg transition-all"
            >
              <item.icon className="w-10 h-10 text-[#2095AE] mb-4" />
              <h3 className="text-xl font-semibold text-[#0B1120] mb-2">{item.title}</h3>
              <p className="text-[#475569]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
   Subtle Urgency
   ======================================================================== */
function SubtleUrgency() {
  return (
    <section className="py-8 sm:py-12 bg-[#F0F4F8]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <p className="text-center text-sm sm:text-base text-[#475569]">
          <span className="font-semibold text-[#0B1120]">Peak season tip:</span> Popular dates
          (July–Aug weekends) book 4–6 weeks ahead.{" "}
          <a href={WHATSAPP_LINK} className="text-[#2095AE] font-semibold hover:underline">
            Check your dates →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ========================================================================
   Fleet with Images (popular boats)
   ======================================================================== */
function FleetWithImages() {
  return (
    <section className="py-14 sm:py-20 bg-white" id="fleet">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Updated heading */}
        <h2 className="text-3xl sm:text-4xl font-light text-[#0B1120] mb-4">
          Discover our <span className="text-[#C9A55C]">featured yachts</span>
        </h2>
        <p className="text-[#475569] mb-8">
          A small preview from our full fleet — every vessel personally inspected for comfort,
          safety, and flawless presentation.
        </p>

        {/* Boats grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              name: "Fjord 53 XL",
              image: "/Boats/DJI_0904-HDR (8).jpg",
              guests: 12,
              length: 17,
              price: 3400,
              rating: 4.9,
            },
            {
              name: "DeAntonio 36",
              image: "/Boats/De Antonio 36 Just Paradise 9.jpg",
              guests: 8,
              length: 11,
              price: 1150,
              rating: 4.8,
            },
            {
              name: "Princess V53",
              image: "/Boats/1d.jpg",
              guests: 10,
              length: 15,
              price: 2100,
              rating: 4.9,
            },
          ].map((boat, i) => (
            <Link
              href="/fleet"
              key={i}
              className="group block bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-xl transition-all"
            >
              <div className="relative h-64 overflow-hidden bg-[#E5E7EB]">
                <Image
                  src={boat.image}
                  alt={boat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#0B1120] mb-2 group-hover:text-[#2095AE] transition-colors">
                  {boat.name}
                </h3>
                <div className="flex items-center gap-4 mb-4 text-sm text-[#475569]">
                  <span>👥 {boat.guests} guests</span>
                  <span>📏 {boat.length}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#0B1120]">
                      €{boat.price}
                    </p>
                    <p className="text-xs text-[#475569]">per day</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#C9A55C] text-[#C9A55C]" />
                    <span className="text-sm font-semibold text-[#0B1120]">
                      {boat.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2095AE] text-white rounded-full font-semibold hover:bg-[#1a7d94] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            View full fleet
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
   Backup Guarantee
   ======================================================================== */
function BackupGuarantee() {
  return (
    <section className="py-14 sm:py-20 bg-[#F0F4F8]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          
          {/* === IMAGE SIDE === */}
          <div className="order-2 md:order-1">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/Boats/Popa_1.2.jpg" 
                alt="Professional skipper welcoming guests aboard"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* === TEXT SIDE === */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl font-light text-[#0B1120] mb-6">
              Best boat, best skipper — you're actually cared for
            </h2>
            <p className="text-[#475569] mb-6 text-lg">
              Hand-picked yachts. Trusted skippers. One chat, everything arranged.
            </p>
            <ul className="space-y-3">
              {[
                "Personally vetted every single boat",
                "Skippers with 10+ years local experience",
                "Available for custom requests (water sports, catering, etc.)",
                "WhatsApp support throughout your booking",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-[#2095AE] flex-shrink-0 mt-0.5" />
                  <span className="text-[#0B1120]">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
   Local Team
   ======================================================================== */
/* function LocalTeam() {
  const team = [
    {
      name: "Captain Carlos",
      role: "Lead Captain · 15 years local",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      name: "Marina",
      role: "Guest Relations",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      name: "Eduardo",
      role: "Skipper · Navigator",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-light text-[#0B1120] mb-4">
          Meet the team at the <span className="text-[#C9A55C]">dock</span>
        </h2>
        <p className="text-[#475569] mb-12">
          Local expertise you can trust, every single day.
        </p>
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar snap-x-mandatory flex gap-4 md:hidden">
          {team.map((m, i) => (
            <article key={i} className="snap-start min-w-[85vw]">
              <div className="relative rounded-2xl overflow-hidden mb-4 shadow-lg h-80">
                <Image src={m.image} alt={`${m.name} — ${m.role}`} fill sizes="(max-width: 1024px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xl font-medium mb-1">{m.name}</p>
                  <p className="text-sm text-white/90">{m.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden md:grid sm:grid-cols-3 gap-6 sm:gap-8">
          {team.map((m, i) => (
            <article key={i} className="group">
              <div className="relative rounded-2xl overflow-hidden mb-4 shadow-lg h-80">
                <Image src={m.image} alt={`${m.name} — ${m.role}`} fill sizes="(max-width: 1024px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xl font-medium mb-1">{m.name}</p>
                  <p className="text-sm text-white/90">{m.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
} */

/* ========================================================================
   Testimonials
   ======================================================================== */
function Testimonials() {
  const testimonials = [
    {
      text:
        "Told them our budget (€1,200), got 3 options in 8 minutes. Picked the DeAntonio. Captain Carlos was brilliant.",
      author: "Sophie ",
      location: "London · August 2024",
      detail: "DeAntonio 36 · €1,150/day",
      avatar:
        "/photos/IMG_1568.jpeg",
    },
    {
      text:
        "Our boat had a minor engine issue. We were moved onto a better yacht in 30 minutes. Didn't miss a thing.",
      author: "Marco R.",
      location: "Milan · July 2024",
      detail: "Princess V50 · €1,350/day",
      avatar:
        "/photos/IMG_8851.jpeg",
    },
    {
      text:
        "They secured Beso Beach at peak season and arranged our villa pickup. More like concierge than rental.",
      author: "Emily & David",
      location: "New York · June 2024",
      detail: "Sunseeker Predator · €2,100/day",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    },
  ];
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <h2 className="text-2xl sm:text-4xl font-light text-[#0B1120] mb-4">
          What our guests <span className="text-[#C9A55C]">say</span>
        </h2>
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar snap-x-mandatory flex gap-4 md:hidden">
          {testimonials.map((t, i) => (
            <article key={i} className="snap-start min-w-[85vw] bg-gradient-to-br from-[#F8FAFB] to-white rounded-2xl p-5 border border-[#E5E7EB] shadow-md">
              <div className="flex gap-1 mb-3" aria-hidden>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#C9A55C] text-[#C9A55C]" />
                ))}
              </div>
              <p className="text-[#475569] mb-3 leading-relaxed">"{t.text}"</p>
              <p className="text-xs text-[#2095AE] font-medium mb-4">{t.detail}</p>
              <div className="flex items-center gap-3">
                <Image src={t.avatar} alt={t.author} width={44} height={44} className="rounded-full object-cover" />
                <div>
                  <div className="font-medium text-[#0B1120]">{t.author}</div>
                  <div className="text-sm text-[#475569]">{t.location}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <article key={i} className="bg-gradient-to-br from-[#F8FAFB] to-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] hover:shadow-lg transition-all">
              <div className="flex gap-1 mb-4" aria-hidden>
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#C9A55C] text-[#C9A55C]" />
                ))}
              </div>
              <p className="text-[#475569] mb-4 leading-relaxed">"{t.text}"</p>
              <p className="text-sm text-[#2095AE] font-medium mb-6">{t.detail}</p>
              <div className="flex items-center gap-3">
                <Image src={t.avatar} alt={t.author} width={48} height={48} className="rounded-full object-cover" />
                <div>
                  <div className="font-medium text-[#0B1120]">{t.author}</div>
                  <div className="text-sm text-[#475569]">{t.location}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================
   Mobile bits
   ======================================================================== */
function MobileBottomSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ date: "", guests: "", budget: "", contact: "" });

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button aria-label="Close enquiry" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white shadow-2xl border-t border-slate-200 pt-2 pb-[calc(12px+var(--safe-bottom))]">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-slate-300 mb-3" />
        <div className="px-4">
          {/* ⬇️ IMPROVED HEADER - More descriptive */}
          <h3 className="text-lg font-semibold text-[#0B1120] mb-1">Tell us your details</h3>
          <p className="text-xs text-slate-600 mb-4">We'll send 3 hand-picked options within 10 mins</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="px-3 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400" placeholder="Date" />
            <input type="number" name="guests" min={1} max={12} placeholder="Guests" value={formData.guests} onChange={handleChange} className="px-3 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400" />
            <input type="text" name="budget" placeholder="Budget €" value={formData.budget} onChange={handleChange} className="px-3 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400" />
          </div>
          <input type="text" name="contact" placeholder="Your WhatsApp or email" value={formData.contact} onChange={handleChange} className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm mb-4 placeholder-slate-400" />
          <div className="flex gap-2">
            <a href={WHATSAPP_LINK} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#2095AE] text-white rounded-xl text-base font-semibold hover:bg-[#1a7d94] transition-colors">
              <MessageCircle className="w-5 h-5" />
              Send
            </a>
            <button onClick={onClose} className="px-4 py-3 rounded-xl border border-slate-300 text-base font-medium hover:bg-slate-50 transition-colors">
              Close
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            By sending, you agree to our <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}


function MobileTabBar({ 
  openRequestSheet, 
  setOpenRequestSheet 
}: { 
  openRequestSheet: boolean; 
  setOpenRequestSheet: (open: boolean) => void;
}) {
  const TAB_HEIGHT = 64;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary navigation"
    >
      <div className="flex items-center justify-around px-2" style={{ height: TAB_HEIGHT }}>
        {/* ⬇️ HOME - LINK TO HOMEPAGE */}
        <TabLink href="/" icon={<Home className="w-5 h-5" />} label="Home" />
        
        {/* ⬇️ FLEET - LINK TO FLEET PAGE */}
        <TabLink href="/fleet" icon={<Ship className="w-5 h-5" />} label="Fleet" />
        
        {/* ⬇️ REQUEST - OPENS BOTTOM SHEET (NOT EXTERNAL LINK) */}
        <button
          onClick={() => setOpenRequestSheet(true)}
          className="w-1/4 inline-flex flex-col items-center justify-center gap-1 py-2 rounded-xl active:bg-slate-100 text-slate-700 hover:text-[#2095AE] transition-colors"
          aria-label="Send request"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px] leading-none font-medium">Request</span>
        </button>
        
        {/* ⬇️ CALL - DIRECT PHONE LINK */}
        <TabLink href="tel:+34692688348" icon={<Phone className="w-5 h-5" />} label="Call" />
      </div>
    </nav>
  );
}

function TabLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const classes = "w-1/4 inline-flex flex-col items-center justify-center gap-1 py-2 rounded-xl active:bg-slate-100 text-slate-700 hover:text-[#2095AE] transition-colors";

  return (
    <a href={href} className={classes}>
      {icon}
      <span className="text-[11px] leading-none font-medium">{label}</span>
    </a>
  );
}




