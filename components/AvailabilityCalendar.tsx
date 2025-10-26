"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Check, X } from "lucide-react";

interface AvailabilityCalendarProps {
  icalUrl?: string;
  boatName: string;
}

interface DateAvailability {
  date: string;      // ISO date: YYYY-MM-DD
  available: boolean;
}

export default function AvailabilityCalendar({ icalUrl, boatName }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<DateAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (icalUrl) {
      void fetchAvailability();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icalUrl, currentMonth]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          icalUrl,
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAvailability(data.availability || []);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0=Sun..6=Sat
    return { daysInMonth, startDayOfWeek };
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split("T")[0];
    const avail = availability.find((a) => a.date === dateStr);
    // default to available if we don't have a record for that day
    return avail?.available !== false;
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const { daysInMonth, startDayOfWeek } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isPastDate(date) && isDateAvailable(date)) {
      const dateStr = date.toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const message = `Hi Nautiq, I'm interested in chartering the ${boatName} on ${dateStr}. Is it available?`;
      const url = `https://wa.me/34692688348?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (!icalUrl) {
    const msg = `Hi Nautiq, I'd like to check availability for the ${boatName}`;
    const waHref = `https://wa.me/34692688348?text=${encodeURIComponent(msg)}`;

    return (
      <div className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-start gap-4">
          <CalendarIcon className="w-6 h-6 text-[#2095AE] flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Check Availability</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Contact us to check real-time availability for your preferred dates.
            </p>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2095AE] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d94] transition"
            >
              Check dates on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#2095AE]" />
          Availability Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            aria-label="Previous month"
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium px-3 min-w-[140px] text-center">{monthName}</span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            aria-label="Next month"
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#2095AE]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const past = isPastDate(date);
              const available = isDateAvailable(date);
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={past || !available}
                  className={[
                    "aspect-square rounded-lg text-sm font-medium transition-all relative",
                    isToday ? "ring-2 ring-[#2095AE]" : "",
                    past ? "text-slate-300 cursor-not-allowed" : "",
                    !past && available
                      ? "hover:bg-[#2095AE] hover:text-white cursor-pointer bg-emerald-50 text-emerald-900"
                      : "",
                    !past && !available ? "bg-red-50 text-red-400 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  {day}
                  {!past && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                      {available ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <X className="w-2.5 h-2.5 text-red-500" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-50 border border-emerald-200" />
                <span className="text-slate-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
                <span className="text-slate-600">Booked</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 leading-relaxed">
            Click an available date to enquire on WhatsApp. Calendar syncs in real time with our booking system.
          </p>
        </>
      )}
    </div>
  );
}
