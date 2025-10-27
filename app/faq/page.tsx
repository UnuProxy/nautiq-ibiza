import { Metadata } from "next";
import FAQItem from "@/components/FAQItem";

export const metadata: Metadata = {
  title: "Yacht Charter FAQ - Ibiza Boat Rental Questions Answered",
  description: "Common questions about yacht charter in Ibiza. Learn about licensing, pricing, booking process, and more.",
  openGraph: {
    title: "Yacht Charter FAQ - Ibiza",
    description: "Answers to common yacht rental questions in Ibiza and Formentera",
    url: "https://nautiqibiza.com/faq",
    type: "website",
  },
};

const faqs = [
  {
    question: "How much does a yacht charter cost in Ibiza?",
    answer: "Starting from €800/day for skippered charters with smaller boats, up to €3,000+/day for luxury yachts. Prices include the boat and captain. Fuel, food, and water sports are optional add-ons."
  },
  {
    question: "Do I need a boating license for yacht rental in Ibiza?",
    answer: "Not for skippered charters—our captain handles everything. For bareboat charters (if available), you'll need an ICC (International Certificate of Competence) or equivalent boating license."
  },
  {
    question: "What's the best time to charter a yacht in Ibiza?",
    answer: "May to September offers great sailing conditions. Peak season (July-August) has warm water and perfect weather. Shoulder season (May-June, September) provides better deals and fewer crowds."
  },
  {
    question: "How quickly can I book a yacht charter?",
    answer: "Tell us your date, guest count, and budget via WhatsApp. We'll send 3 hand-picked options within 10 minutes. You can book immediately after."
  },
  {
    question: "What's included in the yacht charter price?",
    answer: "The charter price includes the boat, professional captain, and basic insurance. Optional add-ons: fuel, food and beverages, water sports equipment (jet skis, paddleboards), and dinghy."
  },
  {
    question: "Can I charter a yacht for just one day?",
    answer: "Yes! Day charters are our specialty. Minimum is typically 4-6 hours. We can arrange same-day bookings for day trips to Formentera or local exploration."
  },
  {
    question: "Where can I sail from in Ibiza?",
    answer: "Our boats depart from Marina Botafoch in Ibiza Town, and we also arrange pickups from San Antonio, Playa d'en Bossa, and Santa Eulalia. Formentera is accessible as a day trip."
  },
  {
    question: "What if the weather is bad?",
    answer: "We provide real-time weather monitoring. If conditions are unsafe, we'll reschedule for free on another date or offer you an alternative yacht suitable for the conditions."
  },
  {
    question: "Is yacht charter safe?",
    answer: "Absolutely. All our boats have professional captains, full insurance, and safety equipment including life jackets and emergency communication systems. We follow Spanish maritime regulations."
  },
  {
    question: "Can you accommodate large groups or parties?",
    answer: "Yes! We specialize in group charters from 4-12+ guests. We have DJ-friendly boats available and can coordinate extras like catering and water sports."
  },
  {
    question: "What's the difference between skippered and bareboat charter?",
    answer: "Skippered charter: Our captain handles navigation and operation—ideal for beginners. Bareboat: You operate the boat (requires license). We focus on skippered as it's more flexible and safer for most guests."
  },
  {
    question: "Can I hire a boat for Formentera day trips?",
    answer: "Yes! Formentera day trips are popular. We organize 5-8 hour charters visiting Playa de Migjorn, Illeta de Ponent, and Cala Saona. Perfect for snorkeling and beach exploration."
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white">
      {/* FAQ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }),
        }}
      />

      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-light text-[#0B1120] mb-3">
            Yacht Charter <span className="text-[#C9A55C]">FAQ</span>
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl">
            Find answers to common questions about booking, pricing, licensing, and sailing in Ibiza and Formentera.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-[#2095AE]/10 to-[#C9A55C]/10 rounded-2xl border border-[#2095AE]/20">
          <h2 className="text-2xl font-light text-[#0B1120] mb-3">Still have questions?</h2>
          <p className="text-[#475569] mb-6">Contact us via WhatsApp for personalized assistance. We'll get back to you within 10 minutes.</p>
          <a href="https://wa.me/34692688348?text=Hi%20Nautiq%2C%20I%20have%20a%20question%20about%20yacht%20charters" className="inline-block px-6 py-3 bg-[#2095AE] text-white rounded-lg font-medium hover:bg-[#1a7d94] transition-colors">
            Message us on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}