import ProductCard from "@/app/components/ProductCard";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
import Product from "@/lib/models/Product";
import Link from "next/link";

async function getHomeData() {
  try {
    await connectDB();

    const [banners, trendingProducts, seasonalProducts] = await Promise.all([
      Banner.find({ isActive: true }).sort({ order: 1 }),
      Product.find({ isActive: true, isTrending: true }).limit(4),
      Product.find({ isActive: true, isSeasonal: true }).limit(4),
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
  const heroBanner = banners[0];

  return (
    <div className="space-y-14">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(109,36,16,0.97),rgba(159,63,35,0.93),rgba(215,163,71,0.86))] px-7 py-10 text-white shadow-[0_26px_70px_rgba(92,60,37,0.18)] md:px-10 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">
            Homemade Pantry Collection
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
            Pickles with a louder spice profile and a softer homemade finish.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-amber-50/90">
            Kanvi brings together small-batch mango, lemon, and seasonal jars
            made for rice, curd, rotis, and midnight cravings.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-deep)] shadow-sm hover:-translate-y-0.5"
            >
              Explore Jars
            </Link>
            <Link
              href="/orders"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Track Orders
            </Link>
          </div>
          <div className="mt-10 grid gap-4 text-sm md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Fresh</p>
              <p className="mt-1 text-amber-50/80">Packed in compact batches</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Bold</p>
              <p className="mt-1 text-amber-50/80">Strong masala and oil notes</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Quick</p>
              <p className="mt-1 text-amber-50/80">Simple checkout and updates</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div
            className="relative min-h-[320px] overflow-hidden rounded-[34px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_20px_56px_rgba(92,60,37,0.1)]"
            style={
              heroBanner
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(45, 27, 18, 0.15), rgba(45, 27, 18, 0.48)), url('${heroBanner.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%)]" />
            <div className="relative flex h-full flex-col justify-end">
              <div className="inline-flex w-fit rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--olive)]">
                Featured Batch
              </div>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                {heroBanner?.title || "Kitchen-made favourites"}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/88">
                Sour, spicy, textured, and ready to change a simple plate into
                something memorable.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[28px] border border-[var(--line)] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
                Why it feels better
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--brand-deep)]">
                Less clutter, faster add-to-cart, and cleaner order tracking.
              </p>
            </div>
            <div className="rounded-[28px] border border-[var(--line)] bg-[rgba(101,112,79,0.12)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--olive)]">
                Best with
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--brand-deep)]">
                Curd rice, paratha, dal-chawal, and snack plates.
              </p>
            </div>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
              />
            ))}
          </div>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {seasonalProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
