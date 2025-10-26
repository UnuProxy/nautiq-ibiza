import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import HeroHuman from "@/components/HeroHuman";
import Footer from "@/components/Footer";

const site = {
  name: "Nautiq Ibiza",
  url: "https://www.nautiqibiza.com",
  description:
    "Nautiq Ibiza is a locally-run yacht charter specialist in Ibiza & Formentera. Curated boats, vetted skippers, concierge add-ons, and honest local insight.",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} • Yacht Charter Ibiza & Formentera - Book in 10 Minutes`,
    template: `%s • ${site.name}`,
  },
  description: "Hand-picked yacht charters & boat rentals in Ibiza & Formentera. Get 2-3 options in 10 mins. Local expertise since 2018. Fully licensed. WhatsApp +34 692 688 348.",
  keywords: "yacht charter Ibiza, boat rental Ibiza, Formentera boat rental, yacht rental, boat charter with captain, luxury yacht Ibiza, day charter Ibiza",
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} • Yacht Charter Ibiza - Fast, Curated Bookings`,
    description: "Hand-picked yachts, trusted captains. Book on WhatsApp.",
    url: site.url,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — Ibiza & Formentera Yacht Charters`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} • Yacht Charter Ibiza - Fast, Curated Bookings`,
    description: "Hand-picked yachts, trusted captains. Book on WhatsApp.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">
          {children}
        </main>
        <Footer />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Nautiq Ibiza - Yacht Charter & Boat Rental",
              "description": "Hand-picked yacht charters and boat rentals in Ibiza and Formentera with local expertise since 2018.",
              "url": site.url,
              "image": site.url + "/opengraph-image.png",
              "telephone": "+34692688348",
              "email": "info@nautiqibiza.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Marina Botafoch",
                "addressLocality": "Ibiza",
                "postalCode": "07800",
                "addressRegion": "Balearic Islands",
                "addressCountry": "ES",
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Ibiza",
                },
                {
                  "@type": "City",
                  "name": "Formentera",
                },
              ],
              "sameAs": [
                "https://www.instagram.com/nautiq_ibiza",
                "https://www.facebook.com/nautiqibiza",
                "https://wa.me/34692688348",
              ],
              "priceRange": "$$",
              "ratingValue": "4.9",
              "reviewCount": "12",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["en", "es", "fr", "de"],
              },
            }),
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How quickly can I book a boat charter in Ibiza?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nautiq provides 2-3 hand-picked yacht options within 10 minutes of your request.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Do I need a license to rent a boat in Ibiza?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For boats under 13.7m, an ICC license is required. We offer skippered charters with our captain.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "What's included in the yacht charter price?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Prices include the boat and captain. Fuel, food, and water sports are optional add-ons.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Can I hire a yacht for Formentera trips?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! We organize day charters and multi-day voyages to Formentera with pristine beaches and hidden coves.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": site.name,
              "url": site.url,
              "logo": site.url + "/icon.svg",
              "description": site.description,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ibiza",
                "addressRegion": "Balearic Islands",
                "addressCountry": "ES",
              },
              "sameAs": [
                "https://www.instagram.com/nautiq_ibiza",
                "https://www.facebook.com/nautiqibiza",
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["en", "es", "fr", "de"],
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
