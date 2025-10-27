import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yacht Charter Blog - Ibiza Sailing Guides & Tips",
  description: "Expert guides on yacht chartering in Ibiza, boat rental tips, sailing destinations, and more.",
};

export default function BlogPage() {
  const blogPosts = [
    {
      slug: "ibiza-yacht-charter-guide-2025",
      title: "Complete Guide to Yacht Chartering in Ibiza (2025)",
      excerpt: "Everything you need to know about chartering a yacht in Ibiza, from boat types to best sailing spots.",
      date: "Oct 15, 2025",
      readTime: "12 min read",
      category: "Guide",
    },
    {
      slug: "how-to-book-yacht-ibiza",
      title: "How to Book Your First Yacht Charter in Ibiza",
      excerpt: "Step-by-step guide to booking a yacht charter through Nautiq. Learn our process and what to expect.",
      date: "Oct 10, 2025",
      readTime: "8 min read",
      category: "How-To",
    },
    {
      slug: "skippered-vs-bareboat",
      title: "Skippered vs Bareboat: Which Charter Type Is Right for You?",
      excerpt: "Understand the differences, pros, and cons of skippered and bareboat charters.",
      date: "Oct 5, 2025",
      readTime: "6 min read",
      category: "Comparison",
    },
  ];

  return (
    <main className="bg-white">
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-light text-[#0B1120] mb-3">
            Yacht Charter <span className="text-[#C9A55C]">Blog</span>
          </h1>
          <p className="text-lg text-[#475569]">
            Expert guides, tips, and insights for yacht chartering in Ibiza and Formentera.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group cursor-pointer">
                <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-[#2095AE]/20 to-[#C9A55C]/20 flex items-center justify-center">
                    <span className="text-slate-400">Image</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-[#2095AE]/10 text-[#2095AE] rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-[#475569] text-xs">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-medium text-[#0B1120] group-hover:text-[#2095AE] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[#475569]">{post.excerpt}</p>
                  <p className="text-xs text-[#9CA3AF]">{post.date}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}