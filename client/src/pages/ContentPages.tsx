import { Link } from "wouter";

function ContentPageShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow text-[#2f6b4f]">RefillLoop</p>
        <h1 className="mt-4 font-display text-5xl tracking-[-0.06em] text-[#173a2b] md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-[#28332d]/70">{intro}</p>
      </div>
      {children}
    </div>
  );
}

export function ArticlesPage() {
  return (
    <ContentPageShell title="Articles" intro="Helpful guidance for making your routine lighter, calmer, and easier to repeat.">
      <div className="grid gap-5 md:grid-cols-2">
        {[{ title: "How to build a refill routine that actually lasts", slug: "how-to-build-a-refill-routine-that-actually-lasts" }, { title: "What to keep in the sink caddy for an easier reset", slug: "what-to-keep-in-the-sink-caddy-for-an-easier-reset" }].map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
            <p className="eyebrow text-[#2f6b4f]">Guide</p>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.05em] text-[#173a2b]">{article.title}</h2>
            <p className="mt-3 text-sm text-[#28332d]/65">A practical approach to making day-to-day routines feel lighter and more consistent.</p>
          </Link>
        ))}
      </div>
    </ContentPageShell>
  );
}

export function ArticleDetailPage() {
  const slug = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";
  return (
    <ContentPageShell title={slug ? slug.replace(/-/g, " ") : "Article"} intro="A useful piece of guidance from the RefillLoop editorial library.">
      <article className="max-w-3xl rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6 md:p-8">
        <p className="text-sm leading-7 text-[#28332d]/70">The best refill routines are not perfectly optimized. They are simple enough to repeat and clear enough to maintain. Start with the products you already use most often, keep the container in a visible place, and let refill shipments arrive before the bottle is empty.</p>
        <p className="mt-5 text-sm leading-7 text-[#28332d]/70">This keeps the system practical. Fewer decisions, less packaging, and a product lineup that makes sense in your real life. That is the difference between a temporary “eco” habit and a repeatable home ritual.</p>
      </article>
    </ContentPageShell>
  );
}

export function BlogPage() {
  return (
    <ContentPageShell title="Blog" intro="Stories, research, and practical notes from the RefillLoop team.">
      <div className="grid gap-5 md:grid-cols-2">
        {[{ title: "What a lighter pantry actually looks like", slug: "what-a-lighter-pantry-actually-looks-like" }, { title: "Three refill swaps that made our kitchen easier", slug: "three-refill-swaps-that-made-our-kitchen-easier" }].map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(23,58,43,0.04)]">
            <p className="eyebrow text-[#2f6b4f]">Journal</p>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.05em] text-[#173a2b]">{post.title}</h2>
          </Link>
        ))}
      </div>
    </ContentPageShell>
  );
}

export function BlogDetailPage() {
  const slug = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";
  return (
    <ContentPageShell title={slug ? slug.replace(/-/g, " ") : "Blog post"} intro="A closer look at the habits, shelves, and decisions that make low-waste routines easier to keep.">
      <article className="max-w-3xl rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6 md:p-8">
        <p className="text-sm leading-7 text-[#28332d]/70">The most sustainable routines are not full of extra work. They are built around visual cues, fewer product categories, and a consistent refill rhythm. When the system is easy to see and easy to maintain, it becomes a normal part of the week rather than a chore.</p>
      </article>
    </ContentPageShell>
  );
}

export function CategoryPage() {
  return (
    <ContentPageShell title="Category" intro="Browse products in this collection and build a routine around what you use most often.">
      <div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6">
        <p className="text-sm leading-7 text-[#28332d]/70">This catalog landing page is ready to support curated product collections and category-specific editorial content.</p>
      </div>
    </ContentPageShell>
  );
}

export function AboutSustainabilityPage() { return <ContentPageShell title="About sustainability" intro="We believe the most responsible product is the one you keep using, refill, and return to again and again."><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6"><p className="text-sm leading-7 text-[#28332d]/70">Our goal is to create better household products that fit real routines: ingredients that make sense, containers designed to stay in use, and refills that are lighter to ship and easier to store.</p></div></ContentPageShell>; }
export function RefillGuidePage() { return <ContentPageShell title="Refill guide" intro="A practical checklist for setting up refills without overcomplicating your cupboard."><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6"><p className="text-sm leading-7 text-[#28332d]/70">Start with the essentials you reach for every week, then replace packaging, not routines. Keep the bottles in the places where you already work, and let your refill schedule match your actual pace.</p></div></ContentPageShell>; }
export function ShippingAndReturnsPage() { return <ContentPageShell title="Shipping and returns" intro="Clear delivery and return details for a simple repeat order experience."><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6"><p className="text-sm leading-7 text-[#28332d]/70">Most orders ship within two to five business days. Refill orders are packed to be compact, light, and easy to store. If you need to return a product, contact us and we will guide you through a straightforward process.</p></div></ContentPageShell>; }
export function FaqPage() { return <ContentPageShell title="FAQ" intro="Frequently asked questions about products, subscriptions, and sustainability."><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6"><p className="text-sm leading-7 text-[#28332d]/70">Are the products safe for household use? Yes. Are containers reusable? Yes. Can subscriptions be paused? Yes. These answers can be expanded into a rich FAQ experience as the site grows.</p></div></ContentPageShell>; }
export function PrivacyPage() { return <ContentPageShell title="Privacy" intro="We keep your data to the essentials and never share it unnecessarily."><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6"><p className="text-sm leading-7 text-[#28332d]/70">This policy is a placeholder for a proper legal statement, but the site is structured to support clear, user-friendly privacy information and consent messaging.</p></div></ContentPageShell>; }
export function TermsPage() { return <ContentPageShell title="Terms" intro="The rules for shopping, subscriptions, and using the RefillLoop service."><div className="rounded-[1.5rem] border border-[#173a2b]/10 bg-[#fffdf8] p-6"><p className="text-sm leading-7 text-[#28332d]/70">These terms govern the use of the storefront and the associated administrative tools. They can be expanded into a formal policy page as the business grows.</p></div></ContentPageShell>; }
