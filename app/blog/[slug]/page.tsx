import { Metadata } from "next";
import Link from "next/link";

const postData: Record<string, any> = {
  "ibiza-yacht-charter-guide-2025": {
    title: "Complete Guide to Yacht Chartering in Ibiza (2025) - Everything You Need to Know",
    date: "October 15, 2025",
    readTime: "15 min read",
    content: `<h2>Introduction: Why Charter a Yacht in Ibiza?</h2><p>Ibiza is more than just a party destination—it's one of the Mediterranean's premier sailing locations. With crystal-clear turquoise waters, dramatic hidden coves, consistent summer winds, and over 300 days of sunshine per year, it's the perfect place to charter a yacht and explore at your own pace.</p><p>Whether you're seeking adventure, relaxation, romance, or a fun getaway with friends, chartering a yacht in Ibiza offers an experience like no other.</p><h2>Types of Yachts</h2><h3>Luxury Motor Yachts</h3><p>Motor yachts are ideal for travelers prioritizing speed and comfort. €1,200-€3,000+ per day.</p><h3>Sailing Yachts</h3><p>For traditionalists seeking authentic Mediterranean experience. €800-€1,500 per day.</p><h3>Catamarans</h3><p>Superior stability and space. €1,500-€2,500 per day.</p><h2>Best Seasons</h2><p><strong>May-June:</strong> Perfect sailing, fewer crowds. <strong>July-August:</strong> Peak season, warmest water. <strong>September-October:</strong> Best season overall. <strong>November-April:</strong> Best prices.</p>`
  },

  "how-to-book-yacht-ibiza": {
    title: "How to Book Your First Yacht Charter in Ibiza",
    date: "October 10, 2025",
    readTime: "8 min read",
    content: `<h2>Your Complete Booking Guide</h2><p>Booking is straightforward when you follow these steps.</p><h2>Step 1: Choose Your Dates</h2><p>Decide when you want to charter. Peak season is expensive but guarantees perfect weather.</p><h2>Step 2: Select Boat Type</h2><p>Choose skippered or bareboat. First-timers choose skippered.</p><h2>Step 3: Budget</h2><p>Rates range from €800-€3,500+ depending on boat type.</p><h2>Step 4: Contact Us</h2><p>Reach out via WhatsApp with your preferences.</p><h2>Step 5: Get Quote</h2><p>We provide detailed transparent pricing.</p><h2>Step 6: Reserve</h2><p>30% deposit holds your dates.</p><h2>Step 7: Pre-Charter</h2><p>We confirm details 2-3 weeks before.</p><h2>Step 8: Meet Captain</h2><p>Arrive early for safety briefing.</p><h2>Step 9: Set Sail</h2><p>Your adventure begins!</p>`
  },

  "skippered-vs-bareboat": {
    title: "Skippered vs Bareboat: Which Is Right for You?",
    date: "October 5, 2025",
    readTime: "6 min read",
    content: `<h2>Skippered vs Bareboat</h2><h2>Skippered Charters</h2><p>Professional captain manages navigation and safety. You relax and enjoy.</p><h3>Includes:</h3><ul><li>Professional captain</li><li>Navigation and route planning</li><li>Local knowledge</li><li>Safety management</li></ul><h2>Bareboat Charters</h2><p>You navigate and make all decisions. Complete freedom and control.</p><h3>Includes:</h3><ul><li>Fully equipped yacht</li><li>Navigation charts and GPS</li><li>Insurance</li><li>You handle everything</li></ul><h2>Who Should Choose Skippered?</h2><p><strong>Families:</strong> Safe for all ages. <strong>First-timers:</strong> Learn safely. <strong>Couples:</strong> Romantic getaway. <strong>Groups:</strong> Mixed experience levels.</p><h2>Who Should Choose Bareboat?</h2><p><strong>Experienced sailors:</strong> ICC license required. <strong>Enthusiasts:</strong> Want full engagement. <strong>Budget:</strong> Lower rates.</p><h2>Our Recommendation</h2><p>We specialize in skippered charters because they offer safety, local expertise, flexibility, and stress-free vacations for most travelers.</p>`
  }
};

export async function generateStaticParams() {
  return Object.keys(postData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = postData[params.slug];
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The blog post doesn't exist.",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = postData[params.slug];

  if (!post) {
    return (
      <main className="bg-white">
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-light text-[#0B1120] mb-4">Post Not Found</h1>
          <p className="text-[#475569] mb-6">The blog post doesn't exist.</p>
          <Link href="/blog" className="text-[#2095AE] hover:text-[#C9A55C] transition-colors">
            ← Back to Blog
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="text-[#2095AE] hover:text-[#C9A55C] transition-colors mb-8 inline-block">
          ← Back to Blog
        </Link>

        <article>
          <h1 className="text-4xl sm:text-5xl font-light text-[#0B1120] mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#475569] mb-8 pb-8 border-b border-[#E2E8F0]">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <div className="prose prose-lg max-w-none text-[#0B1120]">
            <div
              className="space-y-6 text-[#475569] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
            <h3 className="text-2xl font-medium text-[#0B1120] mb-4">Ready to Charter?</h3>
            <p className="text-[#475569] mb-6">
              Start planning your perfect yacht charter experience in Ibiza today.
            </p>
            <Link
              href="https://wa.me/34692688348"
              target="_blank"
              className="inline-block px-6 py-3 bg-[#2095AE] text-white rounded-lg hover:bg-[#C9A55C] transition-colors font-medium"
            >
              Contact us on WhatsApp
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}