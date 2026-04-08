import FallbackImage from "@/app/components/FallbackImage";
import { getSiteSettings } from "@/lib/utils/site-settings";
import connectDB from "@/lib/db";

export const metadata = {
  title: "About Us | Kanvi Pickles",
  description: "Learn more about who we are and our story.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await connectDB();
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--olive)]">
            Our Story
          </p>
          <h1 className="text-4xl font-bold leading-tight text-[var(--brand-deep)] md:text-5xl">
            {settings.aboutUsTitle || "Who We Are"}
          </h1>
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-stone-600">
            {settings.aboutUsContent || "We make small-batch pickles with real spice, real oil, and no factory feel."}
          </div>
        </div>
        
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[36px] border border-[var(--line)] shadow-[0_22px_60px_rgba(92,60,37,0.08)] lg:aspect-square">
          <FallbackImage
            src={settings.aboutUsImage || "/logo.jpeg"}
            alt="About Us Story"
            fill
            className="object-cover transition-transform duration-[2s] hover:scale-105"
            fallbackSrc="/logo.jpeg"
          />
        </div>
      </div>
    </div>
  );
}
