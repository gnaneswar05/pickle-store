import HomeHeroCarousel from "@/app/components/HomeHeroCarousel";
import HomeProductScroller from "@/app/components/HomeProductScroller";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
import Product from "@/lib/models/Product";
import Link from "next/link";

async function getHomeData() {
  try {
    await connectDB();

    const [banners, trendingProducts, seasonalProducts] = await Promise.all([
      Banner.find({ isActive: true }).sort({ order: 1 }),
      Product.find({ isActive: true, isTrending: true }).limit(8),
      Product.find({ isActive: true, isSeasonal: true }).limit(8),
    ]);

    return {
      banners: banners.map((banner) => ({
        _id: banner._id.toString(),
        image: banner.image,
        title: banner.title,
      })),
      trendingProducts: trendingProducts.map((product) => ({
        _id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
      })),
      seasonalProducts: seasonalProducts.map((product) => ({
        _id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
      })),
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      banners: [],
      trendingProducts: [],
      seasonalProducts: [],
    };
  }
}

export default async function HomePage() {
  const { banners, trendingProducts, seasonalProducts } = await getHomeData();

  return (
    <div className="space-y-14">
      <HomeHeroCarousel banners={banners} />

      {trendingProducts.length > 0 ? (
        <section className="rounded-[36px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,249,243,0.88))] p-6 shadow-[0_22px_60px_rgba(92,60,37,0.08)] md:p-8">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
                Most Loved
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-deep)] md:text-4xl">
                Fan-favourite jars with a premium shelf feel
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                This row is styled like a curated collection instead of a plain
                list, so customers get a more premium browse experience.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-deep)] shadow-sm"
            >
              View all products
            </Link>
          </div>
          <HomeProductScroller products={trendingProducts} accent="warm" />
        </section>
      ) : null}

      {seasonalProducts.length > 0 ? (
        <section className="rounded-[36px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(248,251,244,0.82),rgba(255,255,255,0.92))] p-6 shadow-[0_22px_60px_rgba(92,60,37,0.08)] md:p-8">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--olive)]">
                Seasonal Spotlight
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-deep)] md:text-4xl">
                Limited runs worth catching before they disappear
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                A softer editorial section that feels distinct from the main
                best-seller shelf while still keeping the premium rhythm.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-deep)] shadow-sm"
            >
              Browse collection
            </Link>
          </div>
          <HomeProductScroller products={seasonalProducts} accent="olive" />
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[36px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,250,243,0.96),rgba(255,255,255,0.9))] p-7 shadow-[0_20px_56px_rgba(92,60,37,0.08)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
            Ordering Rhythm
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-deep)] md:text-4xl">
            Browse fast, add fast, track fast.
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              "Browse current jars and seasonal highlights",
              "Add to cart with quick feedback and premium card hierarchy",
              "Track orders without digging through cluttered screens",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-[28px] border border-[var(--line)] bg-white/92 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--olive)]">
                  Step 0{index + 1}
                </p>
                <p className="mt-3 text-base leading-7 text-stone-700">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-[var(--line)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(255,244,235,0.92))] p-7 shadow-[0_20px_56px_rgba(92,60,37,0.08)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--olive)]">
            Premium Notes
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-deep)] md:text-4xl">
            Cleaner spacing, calmer scrolling, stronger product focus.
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-stone-600">
            <p>
              The homepage now leans into editorial sections, softer product
              framing, and more deliberate motion so customers feel guided, not
              overloaded.
            </p>
            <p>
              That usually performs better for handmade food brands because the
              trust and mood matter as much as the product list.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
