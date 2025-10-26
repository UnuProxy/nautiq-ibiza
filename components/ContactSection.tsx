"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, AlertCircle } from "lucide-react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contact: "",
    date: "",
    guests: "",
    budget: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
      
      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          currency: 'EUR',
          value: parseInt(formData.budget) || 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try WhatsApp.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16 bg-gradient-to-b from-white to-[#F8FAFB]">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-light text-[#0B1120] mb-2">
            One conversation <span className="text-[#C9A55C]">starts here</span>
          </h2>
          <p className="text-base md:text-lg text-[#475569]">
            Share your dates, guests, and budget. We'll reply in ~10 minutes.
          </p>
        </div>
        
        {submitted ? (
          <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border border-[#E5E7EB] shadow-lg animate-fade-in-up">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-light mb-3 md:mb-4 text-[#0B1120]">Request received!</h3>
            <p className="text-[#475569] text-base md:text-lg mb-6">
              We'll reply with tailored boat options within 10 minutes.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 md:p-6 text-left">
              <p className="text-sm text-slate-600 mb-3">
                <strong className="text-slate-900">Your request summary:</strong>
              </p>
              <ul className="text-sm text-slate-700 space-y-2">
                <li>📅 Date: {new Date(formData.date).toLocaleDateString()}</li>
                <li>👥 Guests: {formData.guests}</li>
                <li>💰 Budget: €{formData.budget}/day</li>
                <li>📧 Contact: {formData.contact}</li>
              </ul>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              Check your email for confirmation. You can also{" "}
              <a
                href="https://wa.me/34692688348"
                className="text-[#2095AE] font-medium hover:underline"
              >
                message us on WhatsApp
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-lg">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                  <a
                    href="https://wa.me/34692688348"
                    className="text-red-600 text-sm underline hover:text-red-700 mt-1 inline-block"
                  >
                    Try WhatsApp instead →
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-slate-700 mb-2">
                  WhatsApp or email <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact"
                  type="text"
                  name="contact"
                  placeholder="+34 600 000 000 or your@email.com"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-[#2095AE] focus:ring-2 focus:ring-[#2095AE]/20 outline-none text-base md:text-lg transition"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 md:px-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-[#2095AE] focus:ring-2 focus:ring-[#2095AE]/20 outline-none transition"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-slate-700 mb-2">
                    Guests <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="guests"
                    type="number"
                    name="guests"
                    placeholder="6"
                    min={1}
                    max={12}
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-[#2095AE] focus:ring-2 focus:ring-[#2095AE]/20 outline-none transition"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                    Budget € <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="budget"
                    type="text"
                    name="budget"
                    placeholder="1000"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-[#2095AE] focus:ring-2 focus:ring-[#2095AE]/20 outline-none transition"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Special requests? (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="E.g., need skipper, water sports, celebrating birthday..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-[#2095AE] focus:ring-2 focus:ring-[#2095AE]/20 outline-none resize-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full px-6 md:px-8 py-4 md:py-5 bg-[#2095AE] text-white rounded-full text-lg md:text-xl font-semibold hover:bg-[#1a7d94] hover:shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send — we'll reply in within 10 minutes"
              )}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              By sending, you agree to our{" "}
              <Link href="/privacy" className="underline hover:text-[#2095AE]">
                privacy policy
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}