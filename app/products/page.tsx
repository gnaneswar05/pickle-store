"use client";

import ProductCard from "@/app/components/ProductCard";
import { useDeferredValue, useMemo, useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.description].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [deferredQuery, products]);

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_20px_60px_rgba(92,60,37,0.08)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
          Pantry Shelf
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[var(--brand-deep)]">
              All Products
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Browse every jar, from everyday essentials to louder seasonal
              batches. Use search to find your flavour quickly.
            </p>
          </div>
          <div className="w-full md:max-w-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mango, lemon, spicy..."
              className="w-full rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm text-stone-900 outline-none ring-0 placeholder:text-stone-400"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-16 text-center text-stone-600">
          Loading products...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
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
      ) : (
        <div className="rounded-[28px] border border-dashed border-[var(--line)] bg-white/65 py-16 text-center text-stone-600">
          No products matched your search.
        </div>
      )}
    </div>
  );
}
