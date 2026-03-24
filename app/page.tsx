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
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
                Trending Right Now
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-deep)]">
                Fan-favourite jars
              </h2>
            </div>
            <Link
              href="/products"
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]"
            >
              View All
            </Link>
          </div>
          <HomeProductScroller products={trendingProducts} />
        </section>
      ) : null}

      {seasonalProducts.length > 0 ? (
        <section className="rounded-[34px] border border-[var(--line)] bg-[rgba(255,255,255,0.75)] p-6 md:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--olive)]">
              Seasonal Spotlight
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-deep)]">
              Limited runs worth catching early
            </h2>
          </div>
          <HomeProductScroller products={seasonalProducts} />
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,250,243,0.96),rgba(255,255,255,0.88))] p-7 shadow-[0_20px_56px_rgba(92,60,37,0.1)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
            Ordering Rhythm
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--brand-deep)]">
            Browse fast, add fast, track fast.
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              "Browse current jars and seasonal highlights",
              "Add to cart with quick feedback and a cleaner layout",
              "Track orders without digging through cluttered screens",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-[26px] border border-[var(--line)] bg-white/90 p-5"
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

        <div className="overflow-hidden rounded-[34px] border border-[var(--line)] bg-[linear-gradient(160deg,rgba(109,36,16,0.96),rgba(63,30,21,0.96))] p-7 text-white shadow-[0_24px_70px_rgba(92,60,37,0.18)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-100/85">
            Pantry Mood
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            A sharper, warmer storefront.
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-100/85">
            The updated homepage leans into layered gradients, brighter cards,
            and stronger banner storytelling so the brand feels more distinct on
            both desktop and mobile.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-deep)] shadow-sm hover:-translate-y-0.5"
          >
            See all products
          </Link>
        </div>
      </section>
    </div>
  );
}
