"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search, SlidersHorizontal, Star, Users, Ship, X, MessageCircle, 
  Waves, Loader2, ChevronDown, Heart, MapPin
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";



const WHATSAPP_LINK = "https://wa.me/34692688348?text=Hi%20Nautiq%2C%20I'm%20interested%20in%20boat:%20";

interface FirebaseBoat {
  id: string;
  name: string;
  description: string;
  images: string[];
  visible: boolean;
  detailedSpecs: {
    Guests?: string;
    Length?: string;
    Price?: string;
    Class?: string;
    "Cruising Area"?: string;
  };
}

interface Boat {
  id: string;
  name: string;
  image: string;
  guests: number;
  length: number;
  priceFrom: number;
  ratingAvg: number;
  ratingCount: number;
  type: string;
  location: string;
  popular: boolean;
  allImages: string[];
  description: string;
}

function transformBoat(firebaseBoat: FirebaseBoat): Boat {
  const guests = parseInt(firebaseBoat.detailedSpecs?.Guests || "0") || 0;
  const lengthMatch = firebaseBoat.detailedSpecs?.Length?.match(/\d+/);
  const length = lengthMatch ? parseInt(lengthMatch[0]) : 0;
  
  const priceString = firebaseBoat.detailedSpecs?.Price || "0";
  const priceMatch = priceString.replace(/[€,\s]/g, "").match(/\d+/);
  const priceFrom = priceMatch ? parseInt(priceMatch[0]) : 0;

  return {
    id: firebaseBoat.id,
    name: firebaseBoat.name,
    description: firebaseBoat.description || "",
    image: firebaseBoat.images[0] || "/placeholder-boat.jpg",
    allImages: firebaseBoat.images,
    guests,
    length,
    priceFrom,
    ratingAvg: 4.8,
    ratingCount: Math.floor(Math.random() * 100) + 20,
    type: firebaseBoat.detailedSpecs?.Class || "Motorboat",
    location: firebaseBoat.detailedSpecs?.["Cruising Area"] || "Balearics",
    popular: priceFrom >= 2000,
  };
}

export default function FleetPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "guests">("popular");
  
  const [filters, setFilters] = useState({
    guestMin: 0,
    guestMax: 20,
    priceMin: 0,
    priceMax: 5000,
    types: [] as string[],
    locations: [] as string[],
  });

  useEffect(() => {
    async function fetchBoats() {
      try {
        setLoading(true);
        const boatsQuery = query(collection(db, "boats"), where("visible", "==", true));
        const querySnapshot = await getDocs(boatsQuery);
        const fetchedBoats: Boat[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as FirebaseBoat;
          const boat = transformBoat({ ...data, id: doc.id });
          if (boat.guests > 0 && boat.priceFrom > 0) {
            fetchedBoats.push(boat);
          }
        });
        
        setBoats(fetchedBoats);
        setError(null);
      } catch (err) {
        console.error("Error fetching boats:", err);
        setError("Failed to load boats. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchBoats();
  }, []);

  const boatTypes = useMemo(() => Array.from(new Set(boats.map(b => b.type))).sort(), [boats]);
  const locations = useMemo(() => Array.from(new Set(boats.map(b => b.location))).sort(), [boats]);

  const toggleFilter = (category: "types" | "locations", value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const filteredAndSortedBoats = useMemo(() => {
    let result = boats.filter(boat => {
      const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           boat.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGuests = boat.guests >= filters.guestMin && boat.guests <= filters.guestMax;
      const matchesPrice = boat.priceFrom >= filters.priceMin && boat.priceFrom <= filters.priceMax;
      const matchesType = filters.types.length === 0 || filters.types.includes(boat.type);
      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(boat.location);
      return matchesSearch && matchesGuests && matchesPrice && matchesType && matchesLocation;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.priceFrom - b.priceFrom;
        case "price-high": return b.priceFrom - a.priceFrom;
        case "guests": return b.guests - a.guests;
        default: return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.priceFrom - a.priceFrom;
      }
    });
    return result;
  }, [boats, searchTerm, filters, sortBy]);

  const resetFilters = () => {
    setFilters({
      guestMin: 0,
      guestMax: 20,
      priceMin: 0,
      priceMax: 5000,
      types: [],
      locations: [],
    });
    setSearchTerm("");
  };

  const activeFilterCount = filters.types.length + filters.locations.length;

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="w-full px-6 py-3 max-w-[1920px] mx-auto">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search boats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#2095AE] focus:ring-2 focus:ring-[#2095AE]/20 outline-none"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#2095AE] text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:border-[#2095AE] outline-none bg-white text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="guests">Max Guests</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="border-t border-slate-200 bg-slate-50">
            <div className="w-full px-6 py-5 max-w-[1920px] mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Filter Results</h3>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-sm text-[#2095AE] hover:underline font-medium">
                    Clear all filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Guests</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0} max={20}
                      value={filters.guestMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, guestMin: +e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#2095AE] outline-none bg-white"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number" min={0} max={20}
                      value={filters.guestMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, guestMax: +e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#2095AE] outline-none bg-white"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Price (€/day)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={0} max={5000} step={50}
                      value={filters.priceMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMin: +e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#2095AE] outline-none bg-white"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number" min={0} max={5000} step={50}
                      value={filters.priceMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMax: +e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-[#2095AE] outline-none bg-white"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Boat Type */}
                {boatTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Boat Type</label>
                    <div className="space-y-2">
                      {boatTypes.slice(0, 3).map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.types.includes(type)}
                            onChange={() => toggleFilter("types", type)}
                            className="w-4 h-4 rounded border-slate-300 text-[#2095AE] focus:ring-[#2095AE]"
                          />
                          <span className="text-sm text-slate-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                {locations.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Location</label>
                    <div className="space-y-2">
                      {locations.map(loc => (
                        <label key={loc} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.locations.includes(loc)}
                            onChange={() => toggleFilter("locations", loc)}
                            className="w-4 h-4 rounded border-slate-300 text-[#2095AE] focus:ring-[#2095AE]"
                          />
                          <span className="text-sm text-slate-700">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-6 max-w-[1920px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#2095AE] animate-spin mb-3" />
            <p className="text-slate-600">Loading boats...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                {filteredAndSortedBoats.length} boats available
              </h2>
            </div>

            {filteredAndSortedBoats.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <Waves className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No boats match your search</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#2095AE] text-white rounded-lg font-medium hover:bg-[#1a7d94] transition text-sm"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedBoats.map((boat) => (
                  <BoatCard key={boat.id} boat={boat} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function BoatCard({ boat }: { boat: Boat }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = boat.allImages.length > 0 ? boat.allImages : [boat.image];

  return (
    <article className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all">
      {/* Make the whole card clickable */}
      <Link href={`/boats/${boat.id}`} className="absolute inset-0 z-[1]" aria-label={`View ${boat.name}`} />

      <div className="relative h-72 bg-slate-100">
        <Image
          src={images[currentImage]}
          alt={boat.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <button
          type="button"
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition z-[2]"
        >
          <Heart className="w-4 h-4 text-slate-600" />
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-[2]">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCurrentImage(idx); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImage ? "bg-white w-5" : "bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3.5 relative z-[2]">
        <div className="flex items-center gap-1 text-slate-600 mb-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{boat.location}</span>
        </div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base text-slate-900 leading-tight flex-1 line-clamp-1">
            {boat.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 fill-[#C9A55C] text-[#C9A55C]" />
            <span className="text-sm font-semibold text-slate-900">{boat.ratingAvg}</span>
            <span className="text-xs text-slate-500">({boat.ratingCount})</span>
          </div>
        </div>

        {boat.description && (
          <p className="text-xs text-slate-600 mb-2.5 line-clamp-2 leading-relaxed">{boat.description}</p>
        )}

        <div className="flex items-center gap-2.5 text-xs text-slate-600 mb-3 pb-2.5 border-b border-slate-100">
          <span>{boat.guests} guests</span>
          <span className="text-slate-300">·</span>
          <span>{boat.length}m</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">€{boat.priceFrom.toLocaleString()}</span>
              <span className="text-xs text-slate-500">/day</span>
            </div>
          </div>
          {/* keep quick enquire – stop click from navigating */}
          <a
            href={`${WHATSAPP_LINK}${boat.name}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2095AE] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d94] transition shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
